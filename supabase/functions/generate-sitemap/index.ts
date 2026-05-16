import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SITE_URL = 'https://emporiolelecute.com.br'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting sitemap generation...')
    
    // Parse request body for notification settings
    let sendNotification = false
    let notificationEmail = ''
    
    try {
      const body = await req.json()
      sendNotification = body?.sendNotification || false
      notificationEmail = body?.notificationEmail || ''
    } catch {
      // No body or invalid JSON, continue without notification
    }
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Fetch SEO settings
    const { data: seoData } = await supabase
      .from('store_settings')
      .select('value')
      .eq('key', 'seo_config')
      .single()
    
    const seoConfig = seoData?.value as { canonical_url?: string } | null
    const siteUrl = seoConfig?.canonical_url || SITE_URL
    
    // Fetch all active products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('slug, name, images, updated_at')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
    
    if (productsError) {
      console.error('Error fetching products:', productsError)
      throw new Error(`Failed to fetch products: ${productsError.message}`)
    }
    
    console.log(`Found ${products?.length || 0} active products`)
    
    // Fetch all occasions (apenas indexáveis)
    const { data: occasions, error: occasionsError } = await supabase
      .from('occasions')
      .select('slug, name, is_indexed')
      .eq('is_indexed', true)
    
    if (occasionsError) {
      console.error('Error fetching occasions:', occasionsError)
    }
    
    // Fetch all categories (apenas indexáveis)
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('slug, name, is_indexed')
      .eq('is_indexed', true)
    
    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError)
    }

    // Fetch all segments (apenas indexáveis)
    const { data: segments, error: segmentsError } = await supabase
      .from('segments')
      .select('slug, name, is_indexed')
      .eq('is_indexed', true)

    if (segmentsError) {
      console.error('Error fetching segments:', segmentsError)
    }
    
    const today = new Date().toISOString().split('T')[0]
    
    // Generate sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Homepage -->
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Products Catalog -->
  <url>
    <loc>${siteUrl}/produtos</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>
  
  <!-- Individual Product Pages -->
`
    
    // Add products
    if (products && products.length > 0) {
      for (const product of products) {
        const lastmod = product.updated_at 
          ? new Date(product.updated_at).toISOString().split('T')[0]
          : today
        
        sitemap += `  <url>
    <loc>${siteUrl}/produtos/${product.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>`
        
        // Add image if available
        if (product.images && product.images.length > 0) {
          const imageUrl = product.images[0]
          const escapedName = escapeXml(product.name)
          sitemap += `
    <image:image>
      <image:loc>${escapeXml(imageUrl)}</image:loc>
      <image:title>${escapedName}</image:title>
    </image:image>`
        }
        
        sitemap += `
  </url>
`
      }
    }
    
    // Occasions — canonical /ocasiao/:slug (Fase 3.1)
    if (occasions && occasions.length > 0) {
      for (const occasion of occasions) {
        sitemap += `  <url>
    <loc>${siteUrl}/ocasiao/${occasion.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`
      }
    }

    // Categories — canonical /categoria/:slug (Fase 3.1)
    if (categories && categories.length > 0) {
      for (const category of categories) {
        sitemap += `  <url>
    <loc>${siteUrl}/categoria/${category.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`
      }
    }

    // Segments — canonical /segmento/:slug (Fase 3.1)
    if (segments && segments.length > 0) {
      for (const segment of segments) {
        sitemap += `  <url>
    <loc>${siteUrl}/segmento/${segment.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`
      }
    }
    
    // Fetch dynamic pages
    const { data: dynamicPages } = await supabase
      .from('pages')
      .select('slug, updated_at')
      .eq('status', 'published')
    
    // Add dynamic pages
    if (dynamicPages && dynamicPages.length > 0) {
      sitemap += `\n  <!-- Dynamic Pages -->\n`
      for (const page of dynamicPages) {
        const lastmod = page.updated_at 
          ? new Date(page.updated_at).toISOString().split('T')[0]
          : today
        sitemap += `  <url>
    <loc>${siteUrl}/${page.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`
      }
    }
    
    // SEO Landing Pages — DB-driven (occasion_landings, only published)
    const { data: occasionLandings } = await supabase
      .from('occasion_landings')
      .select('route_slug, updated_at')
      .eq('is_published', true)
      .order('position', { ascending: true })

    sitemap += `\n  <!-- SEO Landing Pages (CMS) -->\n`
    if (occasionLandings && occasionLandings.length > 0) {
      for (const landing of occasionLandings) {
        const lastmod = landing.updated_at
          ? new Date(landing.updated_at).toISOString().split('T')[0]
          : today
        sitemap += `  <url>
    <loc>${siteUrl}/lembrancinhas-${landing.route_slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`
      }
    }

    // Add static pages (removed anchor URLs which Google doesn't index)
    sitemap += `
  <!-- Static Pages -->
  <url>
    <loc>${siteUrl}/loja</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>${siteUrl}/envio</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${siteUrl}/sobre</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <url>
    <loc>${siteUrl}/contato</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>${siteUrl}/depoimentos</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>${siteUrl}/rastrear</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  
  <url>
    <loc>${siteUrl}/ocasioes</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${siteUrl}/orcamento</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>${siteUrl}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
${[
  'como-fazer-sabonete-artesanal-para-lembrancinhas',
  'lembrancinhas-maternidade-ideias-criativas',
  'cha-de-bebe-e-cha-revelacao-lembrancinhas',
  'lembrancinhas-batizado-aniversario-formatura',
].map((s) => `  <url>
    <loc>${siteUrl}/blog/${s}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}

</urlset>`
    
    const totalUrls = (products?.length || 0) + (occasions?.length || 0) + (categories?.length || 0) + (dynamicPages?.length || 0) + 9
    console.log('Sitemap generated successfully')
    console.log(`Total URLs: ${totalUrls}`)
    
    // Update last sitemap generation time
    await supabase
      .from('store_settings')
      .upsert({
        key: 'last_sitemap_update',
        value: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'key'
      })
    
    // Send email notification if configured
    if (sendNotification && notificationEmail) {
      try {
        const resendKey = Deno.env.get('RESEND_API_KEY')
        if (resendKey) {
          const emailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${resendKey}`,
            },
            body: JSON.stringify({
              from: 'Empório LeleCute <noreply@emporiolelecute.com.br>',
              to: [notificationEmail],
              subject: 'Sitemap Atualizado - Empório LeleCute',
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #F87C6D;">Sitemap Atualizado</h2>
                  <p>O sitemap do site foi atualizado com sucesso.</p>
                  <ul>
                    <li><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</li>
                    <li><strong>Total de URLs:</strong> ${totalUrls}</li>
                    <li><strong>Produtos:</strong> ${products?.length || 0}</li>
                    <li><strong>Ocasiões:</strong> ${occasions?.length || 0}</li>
                    <li><strong>Categorias:</strong> ${categories?.length || 0}</li>
                  </ul>
                  <p>
                    <a href="${siteUrl}/sitemap.xml" style="color: #F87C6D;">
                      Ver Sitemap
                    </a>
                  </p>
                </div>
              `,
            }),
          })
          
          if (!emailResponse.ok) {
            console.error('Failed to send notification email:', await emailResponse.text())
          } else {
            console.log('Notification email sent successfully')
          }
        }
      } catch (emailError) {
        console.error('Error sending notification email:', emailError)
      }
    }
    
    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
      },
    })
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error generating sitemap:', error)
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
