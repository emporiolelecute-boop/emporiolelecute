import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting sitemap submission to Google and Bing...')
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Fetch SEO settings for canonical URL
    const { data: seoData } = await supabase
      .from('store_settings')
      .select('value')
      .eq('key', 'seo_config')
      .single()
    
    const seoConfig = seoData?.value as { canonical_url?: string, sitemap_notification_email?: string } | null
    const siteUrl = seoConfig?.canonical_url || 'https://emporiolelecute.com.br'
    const sitemapUrl = `${siteUrl}/sitemap.xml`
    
    // Submit to Google using IndexNow-style ping
    const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
    
    console.log(`Pinging Google with sitemap: ${sitemapUrl}`)
    
    let googleStatus = 'pending'
    try {
      const googleResponse = await fetch(googlePingUrl)
      googleStatus = googleResponse.ok ? 'success' : `failed (${googleResponse.status})`
      console.log(`Google ping result: ${googleStatus}`)
    } catch (err) {
      console.error('Google ping error:', err)
      googleStatus = 'error'
    }
    
    // Submit to Bing
    const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
    
    console.log(`Pinging Bing with sitemap: ${sitemapUrl}`)
    
    let bingStatus = 'pending'
    try {
      const bingResponse = await fetch(bingPingUrl)
      bingStatus = bingResponse.ok ? 'success' : `failed (${bingResponse.status})`
      console.log(`Bing ping result: ${bingStatus}`)
    } catch (err) {
      console.error('Bing ping error:', err)
      bingStatus = 'error'
    }
    
    // Also ping Yandex
    const yandexPingUrl = `https://webmaster.yandex.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
    
    let yandexStatus = 'pending'
    try {
      const yandexResponse = await fetch(yandexPingUrl)
      yandexStatus = yandexResponse.ok ? 'success' : `failed (${yandexResponse.status})`
      console.log(`Yandex ping result: ${yandexStatus}`)
    } catch (err) {
      console.error('Yandex ping error:', err)
      yandexStatus = 'error'
    }
    
    // Update last submission time in store_settings
    const submissionResult = {
      submitted_at: new Date().toISOString(),
      google_status: googleStatus,
      bing_status: bingStatus,
      yandex_status: yandexStatus,
      sitemap_url: sitemapUrl,
    }
    
    await supabase
      .from('store_settings')
      .upsert({
        key: 'last_sitemap_submission',
        value: submissionResult,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'key'
      })
    
    console.log('Sitemap submission completed successfully')
    
    // Send notification email if configured
    const notificationEmail = seoConfig?.sitemap_notification_email
    
    if (notificationEmail) {
      try {
        const resendKey = Deno.env.get('RESEND_API_KEY')
        if (resendKey) {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${resendKey}`,
            },
            body: JSON.stringify({
              from: 'Empório LeleCute <noreply@emporiolelecute.com.br>',
              to: [notificationEmail],
              subject: 'Sitemap Submetido aos Buscadores - Empório LeleCute',
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #F87C6D;">Sitemap Submetido Automaticamente</h2>
                  <p>O sitemap foi submetido aos mecanismos de busca.</p>
                  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr>
                      <td style="padding: 10px; border: 1px solid #ddd;"><strong>Data/Hora:</strong></td>
                      <td style="padding: 10px; border: 1px solid #ddd;">${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px; border: 1px solid #ddd;"><strong>Google:</strong></td>
                      <td style="padding: 10px; border: 1px solid #ddd;">${googleStatus === 'success' ? '✅ Sucesso' : '❌ ' + googleStatus}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px; border: 1px solid #ddd;"><strong>Bing:</strong></td>
                      <td style="padding: 10px; border: 1px solid #ddd;">${bingStatus === 'success' ? '✅ Sucesso' : '❌ ' + bingStatus}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px; border: 1px solid #ddd;"><strong>Yandex:</strong></td>
                      <td style="padding: 10px; border: 1px solid #ddd;">${yandexStatus === 'success' ? '✅ Sucesso' : '❌ ' + yandexStatus}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px; border: 1px solid #ddd;"><strong>Sitemap URL:</strong></td>
                      <td style="padding: 10px; border: 1px solid #ddd;"><a href="${sitemapUrl}">${sitemapUrl}</a></td>
                    </tr>
                  </table>
                  <p style="color: #666; font-size: 12px;">
                    Nota: Este é um ping automático para notificar os buscadores sobre atualizações. A indexação real pode levar de algumas horas a alguns dias.
                  </p>
                </div>
              `,
            }),
          })
          console.log('Notification email sent successfully')
        }
      } catch (emailError) {
        console.error('Error sending notification email:', emailError)
      }
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Sitemap submetido com sucesso aos buscadores',
        results: submissionResult,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error submitting sitemap:', error)
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
