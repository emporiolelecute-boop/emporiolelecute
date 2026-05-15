// Edge Function: calculate-shipping
// Esboço da estrutura para cálculo de frete via Melhor Envio.
// Recebe os itens do carrinho, soma pesos e consulta a API do ME.
// Trata o caso onde o CEP de destino é o mesmo do Empório LeleCute (entrega local).

import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3.23.8';

const ORIGIN_CEP = (Deno.env.get('LELECUTE_ORIGIN_CEP') ?? '').replace(/\D/g, '');
const DEFAULT_WEIGHT_KG = 0.150;
const ME_API = Deno.env.get('MELHOR_ENVIO_API_URL') ?? 'https://www.melhorenvio.com.br/api/v2/me/shipment/calculate';
const ME_TOKEN = Deno.env.get('MELHOR_ENVIO_TOKEN') ?? '';

const ItemSchema = z.object({
  product_id: z.string().uuid().optional(),
  name: z.string().min(1).max(200),
  quantity: z.number().int().positive().max(500),
  weight_kg: z.number().nonnegative().max(30).optional(),
  // dimensões opcionais (cm)
  width: z.number().positive().max(200).optional(),
  height: z.number().positive().max(200).optional(),
  length: z.number().positive().max(200).optional(),
  unit_price: z.number().nonnegative().optional(),
});

const BodySchema = z.object({
  cep_destino: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
  items: z.array(ItemSchema).min(1).max(100),
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const startedAt = Date.now();
  try {
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      console.warn('[calculate-shipping] validation failed', parsed.error.flatten());
      return json({ error: parsed.error.flatten().fieldErrors }, 400);
    }
    const { cep_destino, items } = parsed.data;
    const destino = cep_destino.replace(/\D/g, '');

    const totalWeight = items.reduce(
      (acc, it) => acc + (it.weight_kg ?? DEFAULT_WEIGHT_KG) * it.quantity,
      0,
    );
    const subtotal = items.reduce(
      (acc, it) => acc + (it.unit_price ?? 0) * it.quantity,
      0,
    );

    console.log('[calculate-shipping] request', {
      origin_cep_set: !!ORIGIN_CEP,
      destino_prefix: destino.slice(0, 3),
      item_count: items.length,
      total_weight_kg: round(totalWeight),
      me_token_set: !!ME_TOKEN,
    });

    // Caso 1: CEP de origem == destino → entrega local / retirada
    if (ORIGIN_CEP && destino === ORIGIN_CEP) {
      console.log('[calculate-shipping] local_delivery match');
      return json({
        local_delivery: true,
        origin_cep: ORIGIN_CEP,
        total_weight_kg: round(totalWeight),
        options: [
          { service: 'Retirada / Entrega local', price: 0, days: '1-2', company: 'Empório LeleCute' },
        ],
        elapsed_ms: Date.now() - startedAt,
      });
    }

    // Caso 2: cotação real no Melhor Envio
    if (!ME_TOKEN || !ORIGIN_CEP) {
      console.log('[calculate-shipping] estimated_fallback', { reason: !ME_TOKEN ? 'no_token' : 'no_origin' });
      return json({
        estimated: true,
        total_weight_kg: round(totalWeight),
        options: [
          { service: 'PAC (estimado)', price: estimate(totalWeight, 1.0), days: '5-9', company: 'Correios' },
          { service: 'SEDEX (estimado)', price: estimate(totalWeight, 1.8), days: '2-4', company: 'Correios' },
        ],
        elapsed_ms: Date.now() - startedAt,
      });
    }

    const mePayload = {
      from: { postal_code: ORIGIN_CEP },
      to: { postal_code: destino },
      products: items.map((it, i) => ({
        id: String(it.product_id ?? i),
        width: it.width ?? 11,
        height: it.height ?? 6,
        length: it.length ?? 16,
        weight: (it.weight_kg ?? DEFAULT_WEIGHT_KG),
        insurance_value: it.unit_price ?? 0,
        quantity: it.quantity,
      })),
      options: { receipt: false, own_hand: false, insurance_value: subtotal },
    };

    console.log('[calculate-shipping] calling Melhor Envio', { products: mePayload.products.length });
    const meRes = await fetch(ME_API, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ME_TOKEN}`,
        'User-Agent': 'EmporioLeleCute (contato@emporiolelecute.com.br)',
      },
      body: JSON.stringify(mePayload),
    });

    if (!meRes.ok) {
      const text = await meRes.text();
      console.error('[calculate-shipping] ME error', meRes.status, text.slice(0, 500));
      return json({ error: 'Falha na consulta Melhor Envio', status: meRes.status, detail: text }, 502);
    }

    const data = await meRes.json();
    const options = (Array.isArray(data) ? data : [])
      .filter((o: any) => !o.error && o.price)
      .map((o: any) => ({
        service: o.name,
        company: o.company?.name,
        price: Number(o.price),
        days: `${o.delivery_range?.min ?? '?'}-${o.delivery_range?.max ?? '?'}`,
      }));

    console.log('[calculate-shipping] ME ok', { options_returned: options.length, elapsed_ms: Date.now() - startedAt });
    return json({
      total_weight_kg: round(totalWeight),
      options,
      elapsed_ms: Date.now() - startedAt,
    });
  } catch (err) {
    console.error('[calculate-shipping] unexpected', err);
    return json({ error: 'Erro interno', message: String(err) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
function round(n: number) { return Math.round(n * 1000) / 1000; }
function estimate(weightKg: number, factor: number) {
  return Math.max(12, Math.round((15 + weightKg * 18) * factor * 100) / 100);
}
