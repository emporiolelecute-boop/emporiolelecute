// Verifica a flag store_settings.sitemap_dirty e, se positivo,
// chama submit-sitemap e limpa a flag. Roda via pg_cron a cada 15 min
// para fazer debounce de várias edições no admin.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, serviceKey)

    const { data: dirtyRow } = await supabase
      .from('store_settings').select('value, updated_at')
      .eq('key', 'sitemap_dirty').maybeSingle()

    const dirty = (dirtyRow?.value as { dirty?: boolean } | null)?.dirty === true
    let force = false
    if (req.method === 'POST') {
      try { const b = await req.json(); force = b?.force === true } catch { /* ignore */ }
    }

    if (!dirty && !force) {
      return new Response(JSON.stringify({ skipped: true, reason: 'sitemap not dirty' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Debounce: só reenvia se passaram pelo menos 5 min desde o último submit
    const { data: lastSub } = await supabase
      .from('store_settings').select('value')
      .eq('key', 'last_sitemap_submission').maybeSingle()
    const lastTs = (lastSub?.value as { submitted_at?: string } | null)?.submitted_at
    if (!force && lastTs) {
      const diffMin = (Date.now() - new Date(lastTs).getTime()) / 60000
      if (diffMin < 5) {
        return new Response(JSON.stringify({ skipped: true, reason: `last submit ${Math.round(diffMin)}min ago` }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    // Chama submit-sitemap
    const r = await fetch(`${supabaseUrl}/functions/v1/submit-sitemap`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ trigger: 'auto-resubmit' }),
    })
    const result = await r.json().catch(() => ({}))

    if (r.ok) {
      // Limpa a flag
      await supabase.from('store_settings').upsert({
        key: 'sitemap_dirty',
        value: { dirty: false, cleared_at: new Date().toISOString() },
        updated_at: new Date().toISOString(),
      }, { onConflict: 'key' })
    }

    return new Response(JSON.stringify({ resubmitted: r.ok, status: r.status, result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('seo-sitemap-auto-resubmit error', error)
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
