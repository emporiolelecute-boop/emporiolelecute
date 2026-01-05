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
    console.log('Starting sitemap submission to Google...')
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Fetch SEO settings for canonical URL
    const { data: seoData } = await supabase
      .from('store_settings')
      .select('value')
      .eq('key', 'seo_config')
      .single()
    
    const seoConfig = seoData?.value as { canonical_url?: string } | null
    const siteUrl = seoConfig?.canonical_url || 'https://emporiolelecute.com.br'
    const sitemapUrl = `${siteUrl}/sitemap.xml`
    
    // Method 1: Ping Google with the sitemap URL (works without API key)
    const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
    
    console.log(`Pinging Google with sitemap: ${sitemapUrl}`)
    
    const pingResponse = await fetch(pingUrl)
    
    if (!pingResponse.ok) {
      console.error('Google ping failed:', pingResponse.status)
    } else {
      console.log('Google ping successful')
    }
    
    // Method 2: Ping Bing as well
    const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
    
    console.log(`Pinging Bing with sitemap: ${sitemapUrl}`)
    
    const bingPingResponse = await fetch(bingPingUrl)
    
    if (!bingPingResponse.ok) {
      console.error('Bing ping failed:', bingPingResponse.status)
    } else {
      console.log('Bing ping successful')
    }
    
    // Update last submission time
    await supabase
      .from('store_settings')
      .upsert({
        key: 'last_sitemap_submission',
        value: {
          submitted_at: new Date().toISOString(),
          google_status: pingResponse.ok ? 'success' : 'failed',
          bing_status: bingPingResponse.ok ? 'success' : 'failed',
          sitemap_url: sitemapUrl,
        },
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'key'
      })
    
    // Send notification email if configured
    const { data: notificationData } = await supabase
      .from('store_settings')
      .select('value')
      .eq('key', 'seo_config')
      .single()
    
    const notificationEmail = (notificationData?.value as { sitemap_notification_email?: string })?.sitemap_notification_email
    
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
                  <h2 style="color: #F87C6D;">Sitemap Submetido</h2>
                  <p>O sitemap foi submetido aos mecanismos de busca.</p>
                  <ul>
                    <li><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</li>
                    <li><strong>Google:</strong> ${pingResponse.ok ? '✅ Sucesso' : '❌ Falha'}</li>
                    <li><strong>Bing:</strong> ${bingPingResponse.ok ? '✅ Sucesso' : '❌ Falha'}</li>
                    <li><strong>Sitemap URL:</strong> <a href="${sitemapUrl}">${sitemapUrl}</a></li>
                  </ul>
                  <p style="color: #666; font-size: 12px;">
                    Nota: O ping é uma notificação aos buscadores. A indexação pode levar de algumas horas a alguns dias.
                  </p>
                </div>
              `,
            }),
          })
          console.log('Notification email sent')
        }
      } catch (emailError) {
        console.error('Error sending notification email:', emailError)
      }
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Sitemap submetido com sucesso',
        google: pingResponse.ok ? 'success' : 'failed',
        bing: bingPingResponse.ok ? 'success' : 'failed',
        sitemap_url: sitemapUrl,
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
