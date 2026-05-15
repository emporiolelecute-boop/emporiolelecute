// Edge Function: notify-role-change
// Skeleton invoked by trigger trg_user_roles_notify whenever a user
// receives a new role (admin) in user_roles. Sends a notification email
// via Resend if the secret is set; otherwise just logs.

import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

interface Payload {
  user_id?: string;
  email?: string;
  role?: string;
  event?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = (await req.json().catch(() => ({}))) as Payload;
    const { email, role, event } = body;

    if (!email || !role) {
      return new Response(JSON.stringify({ error: 'Missing email or role' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const FROM = Deno.env.get('NOTIFY_FROM_EMAIL') ?? 'Empório LeleCute <noreply@emporiolelecute.com.br>';

    const subject = `Sua conta agora tem permissão: ${role}`;
    const html = `
      <div style="font-family: system-ui, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px;">
        <h2 style="color:#c2956b;">Acesso liberado</h2>
        <p>Olá,</p>
        <p>Sua conta <strong>${email}</strong> recebeu a permissão <strong>${role}</strong> no painel administrativo do Empório LeleCute.</p>
        <p>Você já pode acessar o painel:</p>
        <p><a href="https://emporiolelecute.com.br/admin" style="background:#c2956b;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;">Abrir painel</a></p>
        <p style="font-size:12px;color:#888;">Evento: ${event ?? 'role_granted'}</p>
      </div>
    `;

    if (!RESEND_API_KEY) {
      console.log('[notify-role-change] RESEND_API_KEY not set — skipping email send', { email, role });
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM, to: email, subject, html }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error('[notify-role-change] Resend error', data);
      return new Response(JSON.stringify({ ok: false, error: data }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true, id: data?.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('[notify-role-change] error', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
