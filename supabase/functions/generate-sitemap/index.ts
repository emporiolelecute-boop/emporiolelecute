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
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
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
    
    // Fetch all occasions
    const { data: occasions, error: occasionsError } = await supabase
      .from('occasions')
      .select('slug, name')
    
    if (occasionsError) {
      console.error('Error fetching occasions:', occasionsError)
    }
    
    // Fetch all categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('slug, name')
    
    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError)
    }
    
    const today = new Date().toISOString().split('T')[0]
    
    // Generate sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Homepage -->
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Products Catalog -->
  <url>
    <loc>${SITE_URL}/produtos</loc>
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
    <loc>${SITE_URL}/produtos/${product.slug}</loc>
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
    
    // Add occasions pages
    if (occasions && occasions.length > 0) {
      for (const occasion of occasions) {
        sitemap += `  <url>
    <loc>${SITE_URL}/ocasioes/${occasion.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`
      }
    }
    
    // Add static pages
    sitemap += `
  <!-- Static Pages -->
  <url>
    <loc>${SITE_URL}/envio</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${SITE_URL}/sobre</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <url>
    <loc>${SITE_URL}/contato</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <url>
    <loc>${SITE_URL}/depoimentos</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <url>
    <loc>${SITE_URL}/carrinho</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  
  <!-- Section Anchors -->
  <url>
    <loc>${SITE_URL}/#sobre</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  
  <url>
    <loc>${SITE_URL}/#faq</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  
  <url>
    <loc>${SITE_URL}/#orcamento</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
</urlset>`
    
    console.log('Sitemap generated successfully')
    console.log(`Total URLs: ${(products?.length || 0) + (occasions?.length || 0) + 10}`)
    
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
