import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

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

interface ScrapeResult {
  success: boolean;
  scraped: number;
  failed: number;
  products: ScrapedProduct[];
  errors: string[];
}

const AdminImport = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [urls, setUrls] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScrapeResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const parseUrls = (text: string): string[] => {
    return text
      .split(/[\n\r]+/)
      .map(line => line.trim())
      .filter(line => line.startsWith('http'))
      .map(url => url.split('#')[0]) // Remove fragments
      .filter((url, index, self) => self.indexOf(url) === index); // Remove duplicates
  };

  const handleScrape = async () => {
    const urlList = parseUrls(urls);
    
    if (urlList.length === 0) {
      toast({
        title: "Nenhuma URL válida",
        description: "Cole URLs do Elo7 para importar produtos",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke<ScrapeResult>('scrape-elo7', {
        body: { urls: urlList, saveToDb: false },
      });

      if (error) throw error;

      setResult(data);
      toast({
        title: "Scraping concluído",
        description: `${data?.scraped || 0} produtos extraídos, ${data?.failed || 0} falharam`,
      });
    } catch (error) {
      console.error('Scrape error:', error);
      toast({
        title: "Erro ao importar",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToDb = async () => {
    if (!result?.products?.length) return;

    setIsSaving(true);

    try {
      const productsToInsert = result.products.map(p => ({
        name: p.name,
        slug: p.slug + '-' + Date.now().toString(36).slice(-4),
        price: p.price,
        original_price: p.originalPrice || null,
        min_quantity: p.minQuantity,
        description: p.description,
        images: p.images,
        elo7_link: p.elo7Link,
        is_active: true,
        rating: 5.0,
        pix_discount: 3,
        production_days: 7,
      }));

      const { error } = await supabase
        .from('products')
        .insert(productsToInsert);

      if (error) throw error;

      toast({
        title: "Produtos salvos!",
        description: `${productsToInsert.length} produtos adicionados ao banco de dados`,
      });

      // Refresh products list
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      // Clear results
      setResult(null);
      setUrls("");
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Erro ao salvar",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const urlCount = parseUrls(urls).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Importar Produtos do Elo7
        </h1>
        <p className="text-muted-foreground">
          Cole as URLs dos produtos do Elo7 para importar automaticamente
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>URLs dos Produtos</CardTitle>
          <CardDescription>
            Cole uma URL por linha. URLs duplicadas serão ignoradas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="https://www.elo7.com.br/produto-exemplo/dp/ABC123
https://www.elo7.com.br/outro-produto/dp/DEF456"
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {urlCount} URL{urlCount !== 1 ? 's' : ''} válida{urlCount !== 1 ? 's' : ''}
            </span>
            <Button 
              onClick={handleScrape} 
              disabled={isLoading || urlCount === 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Extrair Dados
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Resultado da Importação
              <span className="text-sm font-normal text-muted-foreground">
                ({result.scraped} extraídos, {result.failed} falharam)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.products.length > 0 && (
              <>
                <div className="grid gap-4">
                  {result.products.map((product, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          R$ {product.price.toFixed(2).replace('.', ',')} • 
                          Mín: {product.minQuantity} un
                        </p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={handleSaveToDb} 
                  disabled={isSaving}
                  className="w-full"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Salvar {result.products.length} Produtos no Banco
                    </>
                  )}
                </Button>
              </>
            )}

            {result.errors.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-destructive mb-2">
                  URLs com erro ({result.errors.length})
                </h4>
                <div className="space-y-2">
                  {result.errors.map((url, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <XCircle className="w-4 h-4 text-destructive shrink-0" />
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="truncate hover:underline flex items-center gap-1"
                      >
                        {url}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminImport;
