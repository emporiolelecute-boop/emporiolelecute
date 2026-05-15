// Instagram Graph API — actions: validate | preview | sync | scheduled
// Secrets: IG_ACCESS_TOKEN, IG_BUSINESS_ACCOUNT_ID
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const GRAPH = 'https://graph.facebook.com/v21.0';

function friendlyError(igErr: any): { title: string; hint: string } {
  const msg = igErr?.error?.message || igErr?.message || JSON.stringify(igErr);
  const code = igErr?.error?.code;
  if (/does not exist|Object with ID/i.test(msg) && /media/i.test(msg)) {
    return {
      title: 'IG_BUSINESS_ACCOUNT_ID inválido',
      hint:
        'O ID configurado não é um Instagram Business Account ID. Para obter o correto: 1) GET /me/accounts → pegue o PAGE_ID; 2) GET /{PAGE_ID}?fields=instagram_business_account → use o id retornado em instagram_business_account.id.',
    };
  }
  if (code === 190 || /access token/i.test(msg)) {
    return { title: 'Token expirado/ inválido', hint: 'Gere um novo long-lived token e atualize o secret IG_ACCESS_TOKEN.' };
  }
  if (code === 4 || code === 17 || code === 32 || /rate/i.test(msg)) {
    return { title: 'Rate limit atingido', hint: 'Aguarde alguns minutos antes de sincronizar novamente.' };
  }
  if (/permission|scope/i.test(msg)) {
    return { title: 'Permissões insuficientes', hint: 'O token precisa dos escopos: instagram_basic, pages_show_list, pages_read_engagement.' };
  }
  return { title: 'Erro Instagram API', hint: msg };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const anon = Deno.env.get('SUPABASE_ANON_KEY')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const admin = createClient(supabaseUrl, serviceKey);

  let body: any = {};
  try { body = await req.json(); } catch { /* ignore */ }
  const action: string = body.action || 'sync';
  const isScheduled = action === 'scheduled';

  let userId: string | null = null;

  // Auth — exceto para chamada agendada (usa service role + secret interno)
  if (!isScheduled) {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return json({ error: 'Unauthorized' }, 401);
    const userClient = createClient(supabaseUrl, anon, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: claims, error: claimsErr } = await userClient.auth.getClaims(authHeader.replace('Bearer ', ''));
    if (claimsErr || !claims?.claims?.sub) return json({ error: 'Unauthorized' }, 401);
    userId = claims.claims.sub;
    const { data: roleData } = await admin
      .from('user_roles').select('role')
      .eq('user_id', userId).eq('role', 'admin').maybeSingle();
    if (!roleData) return json({ error: 'Forbidden' }, 403);
  } else {
    // chamada interna do cron — header secreto deve bater com service role OU com o token armazenado
    const internal = req.headers.get('x-internal-key');
    let internalOk = internal === serviceKey;
    if (!internalOk && internal) {
      const { data: keyRow } = await admin
        .from('store_settings').select('value').eq('key', 'instagram_sync_internal_key').maybeSingle();
      const stored = (keyRow?.value as any)?.key;
      internalOk = !!stored && internal === stored;
    }
    if (!internalOk) return json({ error: 'Forbidden' }, 403);
  }

  const IG_TOKEN = Deno.env.get('IG_ACCESS_TOKEN');
  const IG_ID = Deno.env.get('IG_BUSINESS_ACCOUNT_ID');
  if (!IG_TOKEN || !IG_ID) {
    return json({
      error: 'Credenciais Instagram não configuradas',
      hint: 'Adicione os secrets IG_ACCESS_TOKEN e IG_BUSINESS_ACCOUNT_ID.',
    }, 412);
  }

  const logHistory = (entry: Record<string, any>) =>
    admin.from('instagram_sync_history').insert({ triggered_by: userId, ...entry }).then(() => {});

  try {
    // ============== VALIDATE ==============
    if (action === 'validate') {
      console.log('[instagram-sync] validate START', { ig_id_prefix: IG_ID.slice(0, 6), ig_id_length: IG_ID.length });

      // 1) Probe genérico para descobrir o TIPO do ID configurado.
      const probeUrl = `${GRAPH}/${IG_ID}?fields=id,name,username,instagram_business_account,category&access_token=${IG_TOKEN}`;
      const probeRes = await fetch(probeUrl);
      const probeData = await probeRes.json();
      console.log('[instagram-sync] probe response', { ok: probeRes.ok, status: probeRes.status, data: probeData });

      let detectedType: 'ig_business_account' | 'facebook_page' | 'unknown' = 'unknown';
      let suggested_ig_business_account_id: string | null = null;
      if (probeRes.ok) {
        if (probeData.username || probeData.media_count !== undefined) {
          detectedType = 'ig_business_account';
        } else if (probeData.instagram_business_account?.id) {
          detectedType = 'facebook_page';
          suggested_ig_business_account_id = probeData.instagram_business_account.id;
        } else if (probeData.category || probeData.name) {
          detectedType = 'facebook_page';
        }
      }

      // 2) Tenta buscar perfil do IG Business Account com fields completos
      const fields = 'id,username,name,profile_picture_url,media_count,followers_count';
      const r = await fetch(`${GRAPH}/${IG_ID}?fields=${fields}&access_token=${IG_TOKEN}`);
      const data = await r.json();
      console.log('[instagram-sync] ig_account response', { ok: r.ok, status: r.status, data });
      if (!r.ok) {
        const fe = friendlyError(data);
        // Sugestão extra se identificamos uma Page
        if (detectedType === 'facebook_page') {
          fe.title = 'IG_BUSINESS_ACCOUNT_ID é de uma Facebook Page, não de uma Instagram Business Account';
          fe.hint = suggested_ig_business_account_id
            ? `Substitua o secret IG_BUSINESS_ACCOUNT_ID pelo ID da conta IG vinculada: ${suggested_ig_business_account_id}`
            : 'A Page configurada não possui Instagram Business Account vinculado. Conecte uma conta IG Profissional à Page no Meta Business Suite.';
        }
        await logHistory({
          action: 'validate', source: 'manual', status: 'error',
          error_message: fe.title,
          details: { hint: fe.hint, detected_type: detectedType, suggested_ig_business_account_id, probe: probeData, raw: data },
        });
        return json({ valid: false, ...fe, detected_type: detectedType, suggested_ig_business_account_id, probe: probeData, raw: data }, 200);
      }
      // Verifica permissões do token
      const permRes = await fetch(`${GRAPH}/me/permissions?access_token=${IG_TOKEN}`);
      const permData = await permRes.json();
      const granted = (permData.data || []).filter((p: any) => p.status === 'granted').map((p: any) => p.permission);
      const required = ['instagram_basic', 'pages_show_list', 'pages_read_engagement'];
      const missing = required.filter((p) => !granted.includes(p));

      // Resources que serão acessados
      const resources = [
        { endpoint: `GET /${IG_ID}?fields=username,media_count`, purpose: 'Validar conta IG Business' },
        { endpoint: `GET /${IG_ID}/media`, purpose: 'Listar últimas mídias do feed' },
        { endpoint: `GET /me/permissions`, purpose: 'Conferir escopos do token' },
      ];

      await logHistory({ action: 'validate', source: 'manual', status: 'success', details: { account: data, missing } });
      return json({
        valid: true,
        account: data,
        permissions: { granted, missing, required },
        resources,
      });
    }

    // ============== PREVIEW ==============
    if (action === 'preview') {
      const limit = Math.min(Number(body.limit) || 24, 50);
      const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
      const r = await fetch(`${GRAPH}/${IG_ID}/media?fields=${fields}&limit=${limit}&access_token=${IG_TOKEN}`);
      const data = await r.json();
      if (!r.ok) {
        const fe = friendlyError(data);
        await logHistory({ action: 'preview', source: 'manual', status: 'error', error_message: fe.title, details: { hint: fe.hint } });
        return json({ ...fe, raw: data }, 200);
      }
      const media = (data.data || []).map((m: any) => ({
        id: m.id,
        caption: m.caption || '',
        media_type: m.media_type,
        image_url: m.media_type === 'VIDEO' ? (m.thumbnail_url || m.media_url) : m.media_url,
        permalink: m.permalink,
        timestamp: m.timestamp,
      }));
      return json({ media, count: media.length });
    }

    // ============== SYNC (manual ou scheduled) ==============
    // Para scheduled: ler config do store_settings e respeitar intervalo
    if (isScheduled) {
      const { data: cfg } = await admin
        .from('store_settings').select('value').eq('key', 'instagram_sync_config').maybeSingle();
      const v = (cfg?.value || {}) as any;
      if (!v.enabled) {
        return json({ skipped: true, reason: 'disabled' });
      }
      const intervalHours = Number(v.interval_hours) || 24;
      const { data: last } = await admin
        .from('instagram_sync_history')
        .select('ran_at').eq('action', 'sync').eq('status', 'success')
        .order('ran_at', { ascending: false }).limit(1).maybeSingle();
      if (last?.ran_at) {
        const ageHours = (Date.now() - new Date(last.ran_at).getTime()) / 3600000;
        if (ageHours < intervalHours) {
          return json({ skipped: true, reason: 'interval_not_reached', age_hours: ageHours });
        }
      }
    } else {
      // Manual: cooldown de 1 minuto
      const { data: lastRun } = await admin
        .from('instagram_sync_history')
        .select('ran_at').eq('action', 'sync').eq('status', 'success')
        .order('ran_at', { ascending: false }).limit(1).maybeSingle();
      if (lastRun?.ran_at) {
        const ageMin = (Date.now() - new Date(lastRun.ran_at).getTime()) / 60000;
        if (ageMin < 1) {
          await logHistory({ action: 'sync', source: 'manual', status: 'skipped', error_message: 'Rate limit cooldown', details: { age_minutes: ageMin } });
          return json({ error: 'Aguarde antes de sincronizar novamente', hint: `Última sync há ${ageMin.toFixed(1)} min.` }, 429);
        }
      }
    }

    // Busca mídias (todas, ou filtra pelas selecionadas)
    const selectedIds: string[] | undefined = body.media_ids;
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
    const limit = selectedIds?.length ? Math.min(50, selectedIds.length * 2 + 12) : 12;
    const mediaUrl = `${GRAPH}/${IG_ID}/media?fields=${fields}&limit=${limit}&access_token=${IG_TOKEN}`;
    console.log('[instagram-sync] fetching media', { ig_id_prefix: IG_ID.slice(0, 6), limit });
    const r = await fetch(mediaUrl);
    const data = await r.json();
    console.log('[instagram-sync] media response', { ok: r.ok, status: r.status, count: data?.data?.length, error: data?.error });
    if (!r.ok) {
      const fe = friendlyError(data);
      await logHistory({ action: 'sync', source: isScheduled ? 'scheduled' : 'manual', status: 'error', error_message: fe.title, details: { hint: fe.hint, raw: data, http_status: r.status } });
      return json({ ...fe, raw: data }, 502);
    }

    let items: any[] = data.data || [];
    if (selectedIds?.length) items = items.filter((m: any) => selectedIds.includes(m.id));

    const posts = items.map((m: any, idx: number) => ({
      image_url: m.media_type === 'VIDEO' ? (m.thumbnail_url || m.media_url) : m.media_url,
      post_url: m.permalink,
      alt_text: (m.caption || 'Empório LeleCute - Instagram').slice(0, 200),
      position: idx,
      is_visible: true,
    }));

    if (!posts.length) {
      await logHistory({ action: 'sync', source: isScheduled ? 'scheduled' : 'manual', status: 'skipped', error_message: 'Nenhuma mídia selecionada/encontrada' });
      return json({ error: 'Nenhuma mídia para sincronizar' }, 400);
    }

    await admin.from('instagram_posts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { error: insertErr } = await admin.from('instagram_posts').insert(posts);
    if (insertErr) throw insertErr;

    await logHistory({
      action: 'sync',
      source: isScheduled ? 'scheduled' : 'manual',
      status: 'success',
      synced_count: posts.length,
      selected_count: selectedIds?.length,
    });

    return json({ success: true, synced: posts.length });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    await logHistory({ action, source: isScheduled ? 'scheduled' : 'manual', status: 'error', error_message: msg });
    return json({ error: msg }, 500);
  }
});
