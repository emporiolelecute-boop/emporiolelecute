// Mercado Pago Webhook — atualiza orders.payment_status / payment_id / paid_at
// Configure no MP: webhook URL apontando para esta função.
// Secrets necessários: MERCADOPAGO_ACCESS_TOKEN, MERCADOPAGO_WEBHOOK_SECRET (opcional)
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-signature, x-request-id',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

// Map MP status → orders.payment_status enum
function mapStatus(mp: string): 'pending' | 'approved' | 'refunded' | 'cancelled' {
  switch (mp) {
    case 'approved':
    case 'authorized':
      return 'approved';
    case 'refunded':
    case 'charged_back':
      return 'refunded';
    case 'cancelled':
    case 'rejected':
      return 'cancelled';
    default:
      return 'pending';
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const topic = url.searchParams.get('type') || url.searchParams.get('topic') || '';
    const queryId = url.searchParams.get('id') || url.searchParams.get('data.id') || '';

    let body: any = {};
    try { body = await req.json(); } catch { /* MP às vezes envia GET-style */ }

    console.log('[mp-webhook] received', { topic, queryId, body });

    const paymentId: string | undefined = body?.data?.id ?? queryId;
    const eventType: string = body?.type ?? topic;

    if (!paymentId || (eventType && !eventType.includes('payment'))) {
      // Ignora notificações que não sejam de pagamento
      return json({ ignored: true, reason: 'not_a_payment_event', topic: eventType });
    }

    const MP_TOKEN = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
    if (!MP_TOKEN) {
      console.error('[mp-webhook] missing MERCADOPAGO_ACCESS_TOKEN');
      return json({ error: 'MP token not configured' }, 500);
    }

    // Fetch full payment data from MP API
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${MP_TOKEN}` },
    });
    if (!mpRes.ok) {
      const text = await mpRes.text();
      console.error('[mp-webhook] failed to fetch payment', mpRes.status, text);
      return json({ error: 'Failed to fetch payment from MP', status: mpRes.status, detail: text }, 502);
    }
    const payment = await mpRes.json();
    console.log('[mp-webhook] payment data', {
      id: payment.id,
      status: payment.status,
      external_reference: payment.external_reference,
      payment_method_id: payment.payment_method_id,
    });

    const orderCode = String(payment.external_reference || '').trim().toUpperCase();
    if (!orderCode) {
      return json({ error: 'Payment has no external_reference (order_code)' }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const newStatus = mapStatus(payment.status);
    const update: Record<string, unknown> = {
      payment_status: newStatus,
      payment_id: String(payment.id),
      payment_method: payment.payment_method_id || payment.payment_type_id || null,
    };
    if (newStatus === 'approved') {
      update.paid_at = payment.date_approved || new Date().toISOString();
      update.status = 'confirmed';
    } else if (newStatus === 'cancelled') {
      update.status = 'cancelled';
    }

    const { data, error } = await supabase
      .from('orders')
      .update(update)
      .eq('order_code', orderCode)
      .select('id, order_code, payment_status')
      .maybeSingle();

    if (error) {
      console.error('[mp-webhook] db update error', error);
      return json({ error: error.message }, 500);
    }
    if (!data) {
      console.warn('[mp-webhook] order not found for code', orderCode);
      return json({ error: 'Order not found', order_code: orderCode }, 404);
    }

    return json({ success: true, order: data, mp_status: payment.status, applied: newStatus });
  } catch (err) {
    console.error('[mp-webhook] unexpected', err);
    return json({ error: String((err as any)?.message || err) }, 500);
  }
});
