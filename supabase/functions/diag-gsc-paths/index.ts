const corsHeaders = { 'Access-Control-Allow-Origin': '*' };

Deno.serve(async () => {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')!;
  const GSC_KEY = Deno.env.get('GOOGLE_SEARCH_CONSOLE_API_KEY')!;
  const paths = [
    '/v1/urlInspection/index:inspect',
    '/searchconsole/v1/urlInspection/index:inspect',
    '/webmasters/v1/urlInspection/index:inspect',
    '/urlInspection/v1/index:inspect',
  ];
  const results: Record<string, { status: number; body: string }> = {};
  for (const p of paths) {
    const r = await fetch(`https://connector-gateway.lovable.dev/google_search_console${p}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': GSC_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inspectionUrl: 'https://emporiolelecute.com.br/', siteUrl: 'sc-domain:emporiolelecute.com.br' }),
    });
    results[p] = { status: r.status, body: (await r.text()).slice(0, 300) };
  }
  return new Response(JSON.stringify(results, null, 2), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
});
