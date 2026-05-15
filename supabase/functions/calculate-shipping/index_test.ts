// Tests for calculate-shipping edge function
// Run via supabase--test_edge_functions tool.
import { assertEquals, assert } from "https://deno.land/std@0.224.0/assert/mod.ts";

const FN_URL = `${Deno.env.get("VITE_SUPABASE_URL") ?? "http://localhost:54321"}/functions/v1/calculate-shipping`;
const ANON = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY") ?? "";

const post = async (body: unknown) => {
  const res = await fetch(FN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${ANON}`, apikey: ANON },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
};

Deno.test("rejects invalid CEP", async () => {
  const r = await post({ cep_destino: "abc", items: [{ name: "x", quantity: 1 }] });
  assertEquals(r.status, 400);
});

Deno.test("local delivery when destination matches origin (skipped if origin not set)", async () => {
  const origin = Deno.env.get("LELECUTE_ORIGIN_CEP");
  if (!origin) {
    console.log("[skip] LELECUTE_ORIGIN_CEP not configured");
    return;
  }
  const r = await post({
    cep_destino: origin,
    items: [{ name: "Sabonete", quantity: 5, weight_kg: 0.05 }],
  });
  assertEquals(r.status, 200);
  assertEquals(r.json.local_delivery, true);
  assert(Array.isArray(r.json.options));
  assertEquals(r.json.options[0].price, 0);
});

Deno.test("falls back to estimate when MELHOR_ENVIO_TOKEN is missing", async () => {
  // We can't unset env from here; this test only meaningful when token is absent.
  if (Deno.env.get("MELHOR_ENVIO_TOKEN")) {
    console.log("[skip] MELHOR_ENVIO_TOKEN is set");
    return;
  }
  const r = await post({
    cep_destino: "01310-100",
    items: [{ name: "Caderno", quantity: 2, weight_kg: 0.4 }],
  });
  assertEquals(r.status, 200);
  assert(r.json.estimated === true || r.json.local_delivery, "expected estimated fallback");
  assert(r.json.options?.length >= 1);
});

Deno.test("calls Melhor Envio when token is present", async () => {
  if (!Deno.env.get("MELHOR_ENVIO_TOKEN")) {
    console.log("[skip] MELHOR_ENVIO_TOKEN not set");
    return;
  }
  const r = await post({
    cep_destino: "01310-100",
    items: [{ name: "Caderno", quantity: 1, weight_kg: 0.3, width: 20, height: 5, length: 28, unit_price: 50 }],
  });
  assertEquals(r.status, 200);
  assert(Array.isArray(r.json.options));
});
