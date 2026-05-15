// Monitora status de indexação no Google Search Console (URL Inspection API).
// Lê URLs do sitemap, inspeciona em lote, salva snapshot em seo_url_status
// e dispara e-mail quando aparecem URLs novas com problema.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GSC_GATEWAY = 'https://connector-gateway.lovable.dev/google_search_console'

interface InspectionResult {
  url: string
  coverageState?: string
  indexingState?: string
  verdict?: string
  lastCrawlTime?: string
  pageFetchState?: string
  robotsTxtState?: string
  googleCanonical?: string
  userCanonical?: string
  referringUrls?: string[]
  raw?: unknown
  error?: string
}

const ISSUE_VERDICTS = new Set(['FAIL', 'NEUTRAL', 'PARTIAL'])

function isIssue(r: InspectionResult): boolean {
  if (r.error) return true
  if (r.verdict && ISSUE_VERDICTS.has(r.verdict.toUpperCase())) return true
  const cov = (r.coverageState ?? '').toLowerCase()
  if (cov.includes('error') || cov.includes('excluded') || cov.includes('not found')) return true
  return false
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
    const GSC_KEY = Deno.env.get('GOOGLE_SEARCH_CONSOLE_API_KEY')
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured')
    if (!GSC_KEY) throw new Error('GOOGLE_SEARCH_CONSOLE_API_KEY not configured')

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: seoData } = await supabase
      .from('store_settings').select('value').eq('key', 'seo_config').maybeSingle()
    const seoConfig = (seoData?.value ?? {}) as { canonical_url?: string; gsc_property?: string; sitemap_notification_email?: string }
    const siteUrl = seoConfig.canonical_url || 'https://emporiolelecute.com.br'
    const property = seoConfig.gsc_property || `sc-domain:${siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}`

    // Body: { limit?, urls? }
    let urls: string[] = []
    let limit = 50
    if (req.method === 'POST') {
      try {
        const b = await req.json()
        if (Array.isArray(b?.urls)) urls = b.urls
        if (typeof b?.limit === 'number') limit = Math.min(Math.max(1, b.limit), 200)
      } catch { /* ignore */ }
    }

    if (urls.length === 0) {
      // Lê URLs do sitemap público
      const sitemapRes = await fetch(`${siteUrl}/sitemap.xml`, { headers: { 'User-Agent': 'EmporioLeleCute-IndexMonitor' } })
      const xml = await sitemapRes.text()
      urls = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map(m => m[1])
    }

    // Prioriza URLs que ainda não foram checadas hoje, depois mais antigas
    const { data: recentRows } = await supabase
      .from('seo_url_status')
      .select('url, checked_at')
      .gte('checked_at', new Date(Date.now() - 22 * 3600 * 1000).toISOString())
    const checkedToday = new Set((recentRows ?? []).map(r => r.url))
    const toInspect = urls.filter(u => !checkedToday.has(u)).slice(0, limit)

    const results: InspectionResult[] = []
    const headers = {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      'X-Connection-Api-Key': GSC_KEY,
      'Content-Type': 'application/json',
    }

    // GSC: chamadas seriais para respeitar quota
    for (const url of toInspect) {
      try {
        const r = await fetch(`${GSC_GATEWAY}/v1/urlInspection/index:inspect`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ inspectionUrl: url, siteUrl: property }),
        })
        const data = await r.json()
        if (!r.ok) {
          results.push({ url, error: `HTTP ${r.status}: ${JSON.stringify(data).slice(0, 300)}` })
        } else {
          const idx = data?.inspectionResult?.indexStatusResult ?? {}
          results.push({
            url,
            coverageState: idx.coverageState,
            indexingState: idx.indexingState,
            verdict: idx.verdict,
            lastCrawlTime: idx.lastCrawlTime,
            pageFetchState: idx.pageFetchState,
            robotsTxtState: idx.robotsTxtState,
            googleCanonical: idx.googleCanonical,
            userCanonical: idx.userCanonical,
            referringUrls: idx.referringUrls,
            raw: data?.inspectionResult,
          })
        }
      } catch (e) {
        results.push({ url, error: e instanceof Error ? e.message : 'unknown' })
      }
    }

    // Persistência
    const newIssues: InspectionResult[] = []
    for (const r of results) {
      const issue = isIssue(r)
      // Verifica se já houve alerta para essa URL com mesma cobertura nos últimos 7 dias
      let alreadyAlerted = false
      if (issue) {
        const { data: prev } = await supabase
          .from('seo_url_status')
          .select('id, alerted, coverage_state')
          .eq('url', r.url)
          .gte('checked_at', new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString())
          .order('checked_at', { ascending: false })
          .limit(1)
        if (prev && prev[0]?.alerted && prev[0].coverage_state === r.coverageState) {
          alreadyAlerted = true
        }
      }

      const { error: insErr } = await supabase.from('seo_url_status').insert({
        url: r.url,
        coverage_state: r.coverageState ?? null,
        indexing_state: r.indexingState ?? null,
        verdict: r.verdict ?? null,
        last_crawl_time: r.lastCrawlTime ?? null,
        page_fetch_state: r.pageFetchState ?? null,
        robots_txt_state: r.robotsTxtState ?? null,
        google_canonical: r.googleCanonical ?? null,
        user_canonical: r.userCanonical ?? null,
        referring_urls: r.referringUrls ?? null,
        raw: r.raw ?? (r.error ? { error: r.error } : null),
        has_issue: issue,
        alerted: issue && !alreadyAlerted,
      })
      if (insErr) console.error('insert seo_url_status', insErr)
      if (issue && !alreadyAlerted) newIssues.push(r)
    }

    // Alerta por e-mail se houver novos problemas
    const notificationEmail = seoConfig.sitemap_notification_email || 'emporiolelecute@gmail.com'
    if (newIssues.length > 0) {
      const resendKey = Deno.env.get('RESEND_API_KEY')
      if (resendKey) {
        try {
          const list = newIssues.slice(0, 25).map(r =>
            `<li><strong>${r.coverageState ?? r.error ?? 'erro'}</strong> — <a href="${r.url}">${r.url}</a></li>`
          ).join('')
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
            body: JSON.stringify({
              from: 'Empório LeleCute <noreply@emporiolelecute.com.br>',
              to: [notificationEmail],
              subject: `[SEO] ${newIssues.length} URL(s) com problema de indexação no Google`,
              html: `<div style="font-family:sans-serif;max-width:640px;margin:0 auto">
                <h2 style="color:#F87C6D">Alertas de indexação — Google Search Console</h2>
                <p>Foram detectadas <strong>${newIssues.length}</strong> URL(s) com novos problemas de indexação:</p>
                <ul>${list}</ul>
                <p>Acesse o painel admin para detalhes e ações de correção.</p>
              </div>`,
            }),
          })
        } catch (e) { console.error('alert email error', e) }
      }
    }

    return new Response(JSON.stringify({
      checked: toInspect.length,
      total_in_sitemap: urls.length,
      issues: results.filter(isIssue).length,
      new_alerts: newIssues.length,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('seo-indexation-monitor error', error)
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
