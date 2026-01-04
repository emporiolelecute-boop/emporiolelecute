import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ScrapedProduct {
  name: string;
  price: number;
  originalPrice?: number;
  minQuantity: number;
  description: string;
  images: string[];
  elo7Link: string;
  slug: string;
}

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 50);
}

function extractProductData(markdown: string, html: string, url: string): ScrapedProduct | null {
  try {
    let name = '';
    let price = 0;
    let originalPrice: number | undefined;
    let minQuantity = 10;
    let description = '';
    let images: string[] = [];

    // Extract product name from markdown title or HTML
    const titleMatch = markdown.match(/^#\s+(.+?)(?:\s*\||\s*-|\n)/m);
    if (titleMatch) {
      name = titleMatch[1].trim().replace(/ - Elo7.*$/, '').replace(/\|.*$/, '').trim();
    }

    // Fallback: try from HTML title
    if (!name) {
      const htmlTitleMatch = html.match(/<title>([^<]+)<\/title>/i);
      if (htmlTitleMatch) {
        name = htmlTitleMatch[1].split('|')[0].split('-')[0].trim();
      }
    }

    // Try JSON-LD for structured data
    const jsonLdMatch = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
    if (jsonLdMatch) {
      for (const match of jsonLdMatch) {
        try {
          const jsonContent = match.replace(/<script[^>]*>|<\/script>/gi, '');
          const data = JSON.parse(jsonContent);
          if (data['@type'] === 'Product') {
            if (!name && data.name) name = data.name;
            if (data.offers?.price) price = parseFloat(data.offers.price);
            if (data.image) {
              const imgArray = Array.isArray(data.image) ? data.image : [data.image];
              images = imgArray.slice(0, 5);
            }
            break;
          }
        } catch (e) {
          // Continue
        }
      }
    }

    // Extract price from markdown - look for R$ pattern
    if (price === 0) {
      const priceMatches = markdown.match(/R\$\s*([\d.,]+)/g);
      if (priceMatches && priceMatches.length > 0) {
        const firstPrice = priceMatches[0].replace(/R\$\s*/, '').replace('.', '').replace(',', '.');
        price = parseFloat(firstPrice);
        
        if (priceMatches.length > 1) {
          const secondPrice = priceMatches[1].replace(/R\$\s*/, '').replace('.', '').replace(',', '.');
          const secondPriceNum = parseFloat(secondPrice);
          if (secondPriceNum > price) {
            originalPrice = secondPriceNum;
          }
        }
      }
    }

    // Extract minimum quantity
    const minQtyMatch = markdown.match(/(?:quantidade\s*mínima|pedido\s*mínimo|mín[.:]?\s*|m[íi]nimo\s*(?:de\s*)?)\s*:?\s*(\d+)/i);
    if (minQtyMatch) {
      minQuantity = parseInt(minQtyMatch[1], 10);
    }

    // Extract description
    const descMatch = markdown.match(/^#.+\n+([^#\n].{20,300})/m);
    if (descMatch) {
      description = descMatch[1].trim().substring(0, 300);
    }

    // Extract images from HTML
    if (images.length === 0) {
      const imgRegex = /https:\/\/img\.elo7\.com\.br\/product\/(?:685x685|zoom|original)\/([A-Z0-9]+)\/[^"'\s]+\.(?:jpg|jpeg|png|webp)/gi;
      let imgMatch;
      const seenCodes = new Set<string>();
      
      while ((imgMatch = imgRegex.exec(html)) !== null) {
        const code = imgMatch[1];
        if (!seenCodes.has(code) && images.length < 5) {
          seenCodes.add(code);
          images.push(imgMatch[0]);
        }
      }
    }

    // Try markdown images
    if (images.length === 0) {
      const mdImgMatches = markdown.matchAll(/!\[[^\]]*\]\(([^)]+elo7[^)]+)\)/g);
      for (const match of mdImgMatches) {
        if (images.length < 5) {
          images.push(match[1]);
        }
      }
    }

    // Any elo7 image URL
    if (images.length === 0) {
      const anyImgMatch = html.matchAll(/https:\/\/img\.elo7\.com\.br[^"'\s]+\.(?:jpg|jpeg|png|webp)/gi);
      for (const match of anyImgMatch) {
        if (images.length < 5 && !images.includes(match[0])) {
          images.push(match[0]);
        }
      }
    }

    if (!name || price === 0) {
      console.log(`Failed to extract essential data from ${url}: name="${name}", price=${price}`);
      return null;
    }

    return {
      name,
      price,
      originalPrice,
      minQuantity,
      description: description || `${name} - Produto artesanal personalizado do Empório LeleCute`,
      images,
      elo7Link: url,
      slug: createSlug(name),
    };
  } catch (error) {
    console.error(`Error parsing product from ${url}:`, error);
    return null;
  }
}

async function scrapeUrl(url: string, apiKey: string): Promise<ScrapedProduct | null> {
  try {
    console.log(`Scraping: ${url}`);
    
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        formats: ['markdown', 'html'],
        onlyMainContent: false,
        waitFor: 2000,
      }),
    });

    if (!response.ok) {
      console.error(`Firecrawl error for ${url}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    if (!data.success) {
      console.error(`Firecrawl failed for ${url}:`, data.error);
      return null;
    }

    const markdown = data.data?.markdown || '';
    const html = data.data?.html || '';

    return extractProductData(markdown, html, url);
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Firecrawl não configurado. Conecte o Firecrawl nas configurações do projeto.' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { urls } = await req.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'URLs são obrigatórias' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Starting scrape of ${urls.length} URLs with Firecrawl`);

    const products: ScrapedProduct[] = [];
    const errors: string[] = [];

    // Process URLs in batches of 3 to avoid rate limits
    const batchSize = 3;
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      
      console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(urls.length/batchSize)}`);
      
      const results = await Promise.all(
        batch.map(url => scrapeUrl(url, apiKey))
      );

      results.forEach((product, index) => {
        if (product) {
          products.push(product);
          console.log(`✓ Extracted: ${product.name} - R$${product.price}`);
        } else {
          errors.push(batch[index]);
          console.log(`✗ Failed: ${batch[index]}`);
        }
      });

      // Delay between batches to respect rate limits
      if (i + batchSize < urls.length) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }

    console.log(`Scrape complete: ${products.length} success, ${errors.length} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        scraped: products.length,
        failed: errors.length,
        products,
        errors,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Handler error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
