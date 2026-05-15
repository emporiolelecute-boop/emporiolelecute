import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle2, AlertTriangle, ExternalLink, ListTree } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SITE = (import.meta.env.VITE_SITE_URL as string) || 'https://emporiolelecute.com.br';

export default function RobotsAndSitemapPanel() {
  const [loading, setLoading] = useState(false);
  const [publicTxt, setPublicTxt] = useState<string>('');
  const [edgeTxt, setEdgeTxt] = useState<string>('');
  const [xRobotsSource, setXRobotsSource] = useState<string>('—');
  const [sitemapLoading, setSitemapLoading] = useState(false);
  const [sitemapUrls, setSitemapUrls] = useState<string[]>([]);
  const [filter, setFilter] = useState('');

  const matches = publicTxt && edgeTxt && publicTxt.trim() === edgeTxt.trim();

  const loadRobots = async () => {
    setLoading(true);
    try {
      const [pubRes, edgeRes] = await Promise.all([
        fetch(`${SITE}/robots.txt`, { cache: 'no-store' }),
        fetch(`https://xfqffqxqiuqauefrrcxn.functions.supabase.co/robots-txt`, { cache: 'no-store' }),
      ]);
      const pub = await pubRes.text();
      const edge = await edgeRes.text();
      setPublicTxt(pub);
      setEdgeTxt(edge);
      setXRobotsSource(pubRes.headers.get('x-robots-source') || '— (não definido)');
    } catch (e: any) {
      toast.error('Falha ao carregar robots.txt: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSitemap = async () => {
    setSitemapLoading(true);
    try {
      const res = await fetch(`${SITE}/sitemap.xml`, { cache: 'no-store' });
      const xml = await res.text();
      const urls = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map(m => m[1]);
      setSitemapUrls(urls);
    } catch (e: any) {
      toast.error('Falha ao carregar sitemap: ' + e.message);
    } finally {
      setSitemapLoading(false);
    }
  };

  useEffect(() => { loadRobots(); loadSitemap(); }, []);

  const filtered = filter
    ? sitemapUrls.filter(u => u.toLowerCase().includes(filter.toLowerCase()))
    : sitemapUrls;

  const landings = sitemapUrls.filter(u => u.includes('/lembrancinhas-'));

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              robots.txt — Status visual
              {matches ? (
                <Badge variant="default" className="bg-green-600"><CheckCircle2 className="w-3 h-3 mr-1" /> Em sincronia</Badge>
              ) : publicTxt ? (
                <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" /> Diff detectado</Badge>
              ) : (
                <Badge variant="secondary">Carregando…</Badge>
              )}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="font-mono">x-robots-source</span>: <span className="font-semibold">{xRobotsSource}</span>
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={loadRobots} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Revalidar diff
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-semibold mb-1 flex items-center gap-1">
                Público (<a className="underline" href={`${SITE}/robots.txt`} target="_blank" rel="noreferrer">/robots.txt <ExternalLink className="inline w-3 h-3" /></a>)
              </p>
              <pre className="text-xs bg-muted p-3 rounded max-h-64 overflow-auto whitespace-pre-wrap">{publicTxt || '—'}</pre>
            </div>
            <div>
              <p className="text-xs font-semibold mb-1">Edge function (origem)</p>
              <pre className="text-xs bg-muted p-3 rounded max-h-64 overflow-auto whitespace-pre-wrap">{edgeTxt || '—'}</pre>
            </div>
          </div>
          {!matches && publicTxt && edgeTxt && (
            <p className="text-xs text-amber-600 mt-3">
              ⚠️ O <code>/robots.txt</code> público está desatualizado. Republique o site (ou redeploy do Worker do Cloudflare) para sincronizar.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <ListTree className="w-4 h-4" />
              URLs do sitemap ({sitemapUrls.length})
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Landings detectadas: <strong>{landings.length}</strong> (esperado ≥ 6 /lembrancinhas-*)
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={loadSitemap} disabled={sitemapLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${sitemapLoading ? 'animate-spin' : ''}`} />
            Recarregar
          </Button>
        </CardHeader>
        <CardContent>
          <input
            type="search"
            placeholder="Filtrar URLs (ex: lembrancinhas, produto, blog)…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full text-sm border rounded px-3 py-2 mb-3 bg-background"
          />
          <div className="max-h-96 overflow-auto border rounded">
            {filtered.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">Nenhuma URL.</p>
            ) : (
              <ul className="divide-y text-xs">
                {filtered.map((u) => (
                  <li key={u} className="px-3 py-1.5 flex items-center justify-between hover:bg-muted/50">
                    <span className="font-mono truncate flex-1">{u.replace(SITE, '')}</span>
                    <a href={u} target="_blank" rel="noreferrer" className="ml-2 text-primary"><ExternalLink className="w-3 h-3" /></a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
