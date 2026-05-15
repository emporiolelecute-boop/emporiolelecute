// Edge function: extract Instagram post thumbnail from a public URL.
// Strategy: fetch the page HTML and parse og:image / og:title meta tags.
// No OAuth, no Graph API, no token.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SHORTCODE_RE = /instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/i;

function extractMeta(html: string, prop: string): string | null {
  const re = new RegExp(
    `<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']+)["']`,
    "i",
  );
  const m = html.match(re);
  if (m) return m[1];
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${prop}["']`,
    "i",
  );
  const m2 = html.match(re2);
  return m2 ? m2[1] : null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return new Response(JSON.stringify({ error: "URL obrigatória" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sm = url.match(SHORTCODE_RE);
    const shortcode = sm ? sm[1] : null;
    const permalink = shortcode ? `https://www.instagram.com/p/${shortcode}/` : url;

    let image_url: string | null = null;
    let title: string | null = null;

    try {
      const res = await fetch(permalink, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; LeleCuteBot/1.0; +https://emporiolelecute.com.br)",
          "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
        },
        redirect: "follow",
      });
      if (res.ok) {
        const html = await res.text();
        image_url = extractMeta(html, "og:image") || extractMeta(html, "twitter:image");
        title =
          extractMeta(html, "og:title") ||
          extractMeta(html, "twitter:title") ||
          extractMeta(html, "description");
      }
    } catch (_) {
      // network issues — fall through to fallback
    }

    return new Response(
      JSON.stringify({
        ok: !!image_url,
        image_url,
        title,
        permalink,
        shortcode,
        timestamp: new Date().toISOString(),
        message: image_url
          ? "Thumbnail extraída com sucesso"
          : "Não foi possível extrair automaticamente. Faça upload manual da imagem.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: String(e instanceof Error ? e.message : e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
