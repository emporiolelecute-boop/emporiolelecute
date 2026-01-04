import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProductData {
  name: string;
  price: number;
  originalPrice?: number;
  minQuantity: number;
  description: string;
  images: string[];
  elo7Link: string;
  slug: string;
}

function extractProductId(url: string): string {
  const match = url.match(/\/dp\/([A-Z0-9]+)/);
  return match ? match[1] : '';
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function scrapeElo7Product(url: string): Promise<ProductData | null> {
  try {
    console.log('Scraping:', url);
    
    // Clean URL (remove fragments)
    const cleanUrl = url.split('#')[0];
    
    const response = await fetch(cleanUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch:', response.status);
      return null;
    }

    const html = await response.text();
    
    // Extract product name from title tag
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    let name = titleMatch ? titleMatch[1].split('|')[0].trim() : '';
    name = name.replace(/ - Elo7.*$/, '').trim();
    
    // Extract price - look for JSON-LD or meta tags
    let price = 0;
    let originalPrice: number | undefined;
    
    // Try JSON-LD first
    const jsonLdMatch = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
    if (jsonLdMatch) {
      for (const match of jsonLdMatch) {
        try {
          const jsonContent = match.replace(/<script[^>]*>|<\/script>/gi, '');
          const data = JSON.parse(jsonContent);
          if (data['@type'] === 'Product' && data.offers) {
            price = parseFloat(data.offers.price) || 0;
            break;
          }
        } catch (e) {
          // Continue to next match
        }
      }
    }
    
    // Fallback: look for price in HTML
    if (price === 0) {
      const priceMatch = html.match(/R\$\s*([\d.,]+)/);
      if (priceMatch) {
        price = parseFloat(priceMatch[1].replace('.', '').replace(',', '.')) || 0;
      }
    }
    
    // Extract minimum quantity
    let minQuantity = 10;
    const minQtyMatch = html.match(/[Pp]edido\s+m[íi]nimo\s+(?:de\s+)?(\d+)/);
    if (minQtyMatch) {
      minQuantity = parseInt(minQtyMatch[1]) || 10;
    }
    
    // Extract images - look for high quality versions
    const images: string[] = [];
    const imgRegex = /https:\/\/img\.elo7\.com\.br\/product\/(?:685x685|zoom)\/([A-Z0-9]+)\/[^"'\s]+\.jpg/gi;
    let imgMatch;
    const seenCodes = new Set<string>();
    
    while ((imgMatch = imgRegex.exec(html)) !== null) {
      const code = imgMatch[1];
      if (!seenCodes.has(code)) {
        seenCodes.add(code);
        // Use 685x685 version for consistency
        const imgUrl = `https://img.elo7.com.br/product/685x685/${code}/${generateSlug(name)}.jpg`;
        images.push(imgMatch[0]);
        if (images.length >= 5) break;
      }
    }
    
    // Extract description
    let description = '';
    const descMatch = html.match(/class="product-description[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    if (descMatch) {
      description = descMatch[1]
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 500);
    }
    
    if (!name || price === 0) {
      console.error('Could not extract required data from:', url);
      return null;
    }
    
    return {
      name,
      price,
      originalPrice,
      minQuantity,
      description,
      images: images.length > 0 ? images : [`https://img.elo7.com.br/product/685x685/${extractProductId(url)}/product.jpg`],
      elo7Link: cleanUrl,
      slug: generateSlug(name),
    };
  } catch (error) {
    console.error('Error scraping:', url, error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { urls, saveToDb } = await req.json();
    
    if (!urls || !Array.isArray(urls)) {
      return new Response(
        JSON.stringify({ error: 'URLs array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${urls.length} URLs`);
    
    const results: ProductData[] = [];
    const errors: string[] = [];
    
    // Process URLs in batches of 3 to avoid rate limiting
    for (let i = 0; i < urls.length; i += 3) {
      const batch = urls.slice(i, i + 3);
      const batchPromises = batch.map((url: string) => scrapeElo7Product(url));
      const batchResults = await Promise.all(batchPromises);
      
      for (let j = 0; j < batchResults.length; j++) {
        if (batchResults[j]) {
          results.push(batchResults[j]!);
        } else {
          errors.push(batch[j]);
        }
      }
      
      // Small delay between batches
      if (i + 3 < urls.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Save to database if requested
    if (saveToDb && results.length > 0) {
      const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
      const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      
      if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        
        const productsToInsert = results.map(p => ({
          name: p.name,
          slug: p.slug + '-' + Date.now().toString(36).slice(-4), // Add unique suffix
          price: p.price,
          original_price: p.originalPrice,
          min_quantity: p.minQuantity,
          description: p.description,
          images: p.images,
          elo7_link: p.elo7Link,
          is_active: true,
          rating: 5.0,
          pix_discount: 3,
          production_days: 7,
        }));
        
        const { data, error } = await supabase
          .from('products')
          .upsert(productsToInsert, { onConflict: 'slug' })
          .select();
        
        if (error) {
          console.error('Database error:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to save products', details: error }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        console.log(`Saved ${data?.length || 0} products to database`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        scraped: results.length,
        failed: errors.length,
        products: results,
        errors,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
