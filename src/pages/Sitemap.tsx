import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Sitemap = () => {
  const [sitemap, setSitemap] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('generate-sitemap');
        
        if (error) throw error;
        
        if (typeof data === 'string') {
          setSitemap(data);
        } else {
          throw new Error('Invalid sitemap response');
        }
      } catch (err) {
        console.error('Error fetching sitemap:', err);
        setError('Não foi possível carregar o sitemap');
      } finally {
        setLoading(false);
      }
    };

    fetchSitemap();
  }, []);

  useEffect(() => {
    // Set content type for XML when rendering
    if (sitemap) {
      document.title = 'Sitemap XML';
    }
  }, [sitemap]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Gerando sitemap...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap overflow-x-auto">
        {sitemap}
      </pre>
    </div>
  );
};

export default Sitemap;
