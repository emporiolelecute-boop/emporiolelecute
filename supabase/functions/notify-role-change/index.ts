// Edge Function: notify-role-change
// Triggered by trg_user_roles_notify whenever a user receives a new role.
// Emits structured JSON logs (request_id + ts) and best-effort sends e-mail via Resend.

import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

interface Payload {
  user_id?: string;
  email?: string;
  role?: string;
  event?: string;
}

const log = (
  level: 'info' | 'warn' | 'error',
  request_id: string,
  msg: string,
  extra: Record<string, unknown> = {},
) => {
  const entry = {
    ts: new Date().toISOString(),
    level,
    request_id,
    fn: 'notify-role-change',
    msg,
    ...extra,
  };
  const line = JSON.stringify(entry);
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const request_id =
    req.headers.get('x-request-id') ?? crypto.randomUUID();
  const started = performance.now();

  try {
    const body = (await req.json().catch(() => ({}))) as Payload;
    const { email, role, event, user_id } = body;
    log('info', request_id, 'invoked', { event, role, user_id, email });

    if (!email || !role) {
      log('warn', request_id, 'missing_fields', { email: !!email, role: !!role });
      return new Response(JSON.stringify({ error: 'Missing email or role', request_id }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'x-request-id': request_id },
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
        <p><a href="https://emporiolelecute.com.br/admin" style="background:#c2956b;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;">Abrir painel</a></p>
        <p style="font-size:12px;color:#888;">Evento: ${event ?? 'role_granted'} · ref: ${request_id}</p>
      </div>
    `;

    if (!RESEND_API_KEY) {
      log('warn', request_id, 'resend_key_missing_skipping_send');
      return new Response(JSON.stringify({ ok: true, skipped: true, request_id }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'x-request-id': request_id },
      });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Request-Id': request_id,
      },
      body: JSON.stringify({ from: FROM, to: email, subject, html }),
    });

    const data = await res.json().catch(() => ({}));
    const elapsed_ms = Math.round(performance.now() - started);

    if (!res.ok) {
      log('error', request_id, 'resend_error', { status: res.status, data, elapsed_ms });
      return new Response(JSON.stringify({ ok: false, error: data, request_id }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'x-request-id': request_id },
      });
    }

    log('info', request_id, 'email_sent', { resend_id: (data as any)?.id, elapsed_ms });

    return new Response(JSON.stringify({ ok: true, id: (data as any)?.id, request_id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'x-request-id': request_id },
    });
  } catch (e) {
    log('error', request_id, 'unhandled', { error: String(e) });
    return new Response(JSON.stringify({ error: String(e), request_id }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'x-request-id': request_id },
    });
  }
});
