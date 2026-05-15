// Instagram Graph API sync — busca últimas mídias do feed e popula instagram_posts.
// Requer secrets: IG_ACCESS_TOKEN (long-lived) e IG_BUSINESS_ACCOUNT_ID.
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    // Auth: somente admins podem sincronizar
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anon = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const userClient = createClient(supabaseUrl, anon, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace('Bearer ', '');
    const { data: claims, error: claimsErr } = await userClient.auth.getClaims(token);
    if (claimsErr || !claims?.claims?.sub) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const admin = createClient(supabaseUrl, serviceKey);
    const { data: roleData } = await admin
      .from('user_roles')
      .select('role')
      .eq('user_id', claims.claims.sub)
      .eq('role', 'admin')
      .maybeSingle();
    if (!roleData) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const IG_TOKEN = Deno.env.get('IG_ACCESS_TOKEN');
    const IG_ID = Deno.env.get('IG_BUSINESS_ACCOUNT_ID');
    if (!IG_TOKEN || !IG_ID) {
      return new Response(JSON.stringify({
        error: 'Credenciais Instagram não configuradas',
        hint: 'Adicione os secrets IG_ACCESS_TOKEN e IG_BUSINESS_ACCOUNT_ID no painel.',
      }), { status: 412, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Buscar últimas 12 mídias
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
    const url = `https://graph.facebook.com/v21.0/${IG_ID}/media?fields=${fields}&limit=12&access_token=${IG_TOKEN}`;
    const igRes = await fetch(url);
    const igData = await igRes.json();
    if (!igRes.ok) {
      return new Response(JSON.stringify({ error: 'Instagram API', details: igData }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const posts = (igData.data || []).map((m: any, idx: number) => ({
      image_url: m.media_type === 'VIDEO' ? (m.thumbnail_url || m.media_url) : m.media_url,
      post_url: m.permalink,
      alt_text: (m.caption || 'Empório LeleCute - Instagram').slice(0, 200),
      position: idx,
      is_visible: true,
    }));

    // Substituir todos os posts (estratégia: limpar + reinserir; preserva os marcados manualmente seria complexo)
    await admin.from('instagram_posts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { error: insertErr } = await admin.from('instagram_posts').insert(posts);
    if (insertErr) throw insertErr;

    return new Response(JSON.stringify({ success: true, synced: posts.length }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
