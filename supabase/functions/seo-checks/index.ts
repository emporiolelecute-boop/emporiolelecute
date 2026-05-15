import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { createClient } from 'npm:@supabase/supabase-js@2'

const ORIGIN = 'https://emporiolelecute.com.br'

interface Check { name: string; ok: boolean; detail: string; severity: 'info'|'warn'|'error' }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const checks: Check[] = []
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
  const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE)

  // 1. Sitemap reachable + XML + only canonical domain URLs
  try {
    const r = await fetch(`${ORIGIN}/sitemap.xml`)
    const txt = await r.text()
    const ok = r.ok && txt.includes('<urlset')
    checks.push({ name: 'sitemap_reachable', ok, severity: ok ? 'info' : 'error',
      detail: ok ? `HTTP ${r.status}, ${txt.length} bytes` : `HTTP ${r.status}` })

    const urls = [...txt.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])
    const offDomain = urls.filter(u => !u.startsWith(ORIGIN))
    const supabaseLeak = urls.filter(u => /supabase|lovable\.app/.test(u))
    checks.push({ name: 'sitemap_canonical_domain', ok: offDomain.length === 0,
      severity: offDomain.length === 0 ? 'info' : 'error',
      detail: `${urls.length} URLs total, ${offDomain.length} fora do domínio` })
    checks.push({ name: 'sitemap_no_internal_leaks', ok: supabaseLeak.length === 0,
      severity: supabaseLeak.length === 0 ? 'info' : 'error',
      detail: supabaseLeak.length ? `Encontrado: ${supabaseLeak.slice(0,3).join(', ')}` : 'Nenhum link Supabase/Lovable' })
  } catch (e) {
    checks.push({ name: 'sitemap_reachable', ok: false, severity: 'error', detail: String(e) })
  }

  // 2. robots.txt reachable + sitemap directive
  try {
    const r = await fetch(`${ORIGIN}/robots.txt`)
    const txt = await r.text()
    const ok = r.ok
    checks.push({ name: 'robots_reachable', ok, severity: ok ? 'info' : 'error',
      detail: `HTTP ${r.status}` })
    const hasSitemap = /Sitemap:\s*https?:\/\//i.test(txt)
    checks.push({ name: 'robots_has_sitemap', ok: hasSitemap, severity: hasSitemap ? 'info' : 'warn',
      detail: hasSitemap ? 'Diretiva Sitemap: presente' : 'Falta diretiva Sitemap:' })
  } catch (e) {
    checks.push({ name: 'robots_reachable', ok: false, severity: 'error', detail: String(e) })
  }

  // 3. Canonical da home aponta para domínio canônico
  try {
    const r = await fetch(`${ORIGIN}/`)
    const html = await r.text()
    const m = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
    const canonical = m?.[1] ?? ''
    const ok = canonical.startsWith(ORIGIN)
    checks.push({ name: 'home_canonical', ok, severity: ok ? 'info' : 'error',
      detail: canonical || 'Não encontrado' })
  } catch (e) {
    checks.push({ name: 'home_canonical', ok: false, severity: 'error', detail: String(e) })
  }

  // 4. Redirects ativos no banco — checar se from_path é válido
  try {
    const { data } = await supabase.from('redirects').select('from_path,to_path,is_active').eq('is_active', true)
    const cycles = (data ?? []).filter(r => r.from_path === r.to_path)
    checks.push({ name: 'redirects_no_self_loops', ok: cycles.length === 0,
      severity: cycles.length === 0 ? 'info' : 'error',
      detail: `${data?.length ?? 0} redirects ativos, ${cycles.length} self-loops` })
  } catch (e) {
    checks.push({ name: 'redirects_no_self_loops', ok: false, severity: 'warn', detail: String(e) })
  }

  // 5. Último submit GSC
  try {
    const { data } = await supabase.from('store_settings').select('value').eq('key', 'last_sitemap_submission').maybeSingle()
    const v = data?.value as { submitted_at?: string; status?: string } | null
    const ok = v?.status === 'success'
    checks.push({ name: 'gsc_last_submission', ok: !!ok, severity: ok ? 'info' : 'warn',
      detail: v ? `${v.status} @ ${v.submitted_at}` : 'Nenhum envio registrado' })
  } catch (e) {
    checks.push({ name: 'gsc_last_submission', ok: false, severity: 'warn', detail: String(e) })
  }

  const summary = {
    total: checks.length,
    passed: checks.filter(c => c.ok).length,
    errors: checks.filter(c => !c.ok && c.severity === 'error').length,
    warnings: checks.filter(c => !c.ok && c.severity === 'warn').length,
  }
  return new Response(JSON.stringify({ summary, checks, ran_at: new Date().toISOString() }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
