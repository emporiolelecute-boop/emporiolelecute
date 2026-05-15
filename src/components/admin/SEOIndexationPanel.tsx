import { useEffect, useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw, AlertTriangle, CheckCircle2, ExternalLink, Send, ListChecks } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

type StatusRow = {
  id: string;
  url: string;
  coverage_state: string | null;
  indexing_state: string | null;
  verdict: string | null;
  last_crawl_time: string | null;
  has_issue: boolean;
  alerted: boolean;
  checked_at: string;
};

const RICH_RESULTS = (url: string) =>
  `https://search.google.com/test/rich-results?url=${encodeURIComponent(url)}`;

export default function SEOIndexationPanel() {
  const [rows, setRows] = useState<StatusRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [resubmitting, setResubmitting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'issues'>('all');

  const load = useCallback(async () => {
    setLoading(true);
    // Pega o snapshot mais recente por URL
    const { data, error } = await supabase
      .from('seo_url_status' as never)
      .select('id, url, coverage_state, indexing_state, verdict, last_crawl_time, has_issue, alerted, checked_at')
      .order('checked_at', { ascending: false })
      .limit(500) as unknown as { data: StatusRow[] | null; error: unknown };
    if (error) {
      toast.error('Falha ao carregar status de indexação');
      setLoading(false);
      return;
    }
    // Reduz por URL mais recente
    const map = new Map<string, StatusRow>();
    for (const r of data ?? []) if (!map.has(r.url)) map.set(r.url, r);
    setRows(Array.from(map.values()));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const runMonitor = async () => {
    setRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke('seo-indexation-monitor', { body: { limit: 50 } });
      if (error) throw error;
      toast.success(`Verificação concluída: ${(data as { checked: number })?.checked ?? 0} URLs checadas, ${(data as { new_alerts: number })?.new_alerts ?? 0} novos alertas`);
      await load();
    } catch (e) {
      toast.error('Erro ao executar monitoramento: ' + (e instanceof Error ? e.message : 'desconhecido'));
    } finally { setRunning(false); }
  };

  const forceResubmit = async () => {
    setResubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('seo-sitemap-auto-resubmit', { body: { force: true } });
      if (error) throw error;
      toast.success('Sitemap reenviado ao Google: ' + JSON.stringify(data));
    } catch (e) {
      toast.error('Erro: ' + (e instanceof Error ? e.message : 'desconhecido'));
    } finally { setResubmitting(false); }
  };

  const filtered = filter === 'issues' ? rows.filter(r => r.has_issue) : rows;
  const issues = rows.filter(r => r.has_issue).length;
  const indexed = rows.filter(r => !r.has_issue && r.coverage_state).length;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <ListChecks className="w-4 h-4" />
              Status de indexação por URL
              <Badge variant="default" className="bg-green-600 ml-2">{indexed} ok</Badge>
              {issues > 0 && <Badge variant="destructive">{issues} com problema</Badge>}
            </CardTitle>
            <CardDescription>
              Snapshot do Google Search Console (URL Inspection). Job diário às 06:00. Alertas por e-mail quando aparecem novas URLs com problema.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={load} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Recarregar
            </Button>
            <Button size="sm" variant="outline" onClick={forceResubmit} disabled={resubmitting}>
              <Send className={`w-4 h-4 mr-2 ${resubmitting ? 'animate-pulse' : ''}`} /> Reenviar sitemap
            </Button>
            <Button size="sm" onClick={runMonitor} disabled={running}>
              <RefreshCw className={`w-4 h-4 mr-2 ${running ? 'animate-spin' : ''}`} /> Verificar agora
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-3">
            <Button size="sm" variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>
              Todas ({rows.length})
            </Button>
            <Button size="sm" variant={filter === 'issues' ? 'default' : 'outline'} onClick={() => setFilter('issues')}>
              <AlertTriangle className="w-3 h-3 mr-1" /> Com problemas ({issues})
            </Button>
          </div>
          <div className="rounded border max-h-[600px] overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Cobertura</TableHead>
                  <TableHead>Verdict</TableHead>
                  <TableHead>Último rastreio</TableHead>
                  <TableHead>Checado</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    {loading ? 'Carregando…' : 'Nenhum dado ainda. Clique em "Verificar agora" para rodar a primeira inspeção.'}
                  </TableCell></TableRow>
                ) : filtered.map(r => (
                  <TableRow key={r.id}>
                    <TableCell>
                      {r.has_issue
                        ? <AlertTriangle className="w-4 h-4 text-destructive" />
                        : <CheckCircle2 className="w-4 h-4 text-green-600" />}
                    </TableCell>
                    <TableCell className="font-mono text-xs max-w-md truncate" title={r.url}>
                      {r.url.replace(/^https?:\/\/[^/]+/, '')}
                    </TableCell>
                    <TableCell><Badge variant={r.has_issue ? 'destructive' : 'secondary'}>{r.coverage_state ?? '—'}</Badge></TableCell>
                    <TableCell>{r.verdict ?? '—'}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {r.last_crawl_time ? format(new Date(r.last_crawl_time), 'dd/MM HH:mm') : '—'}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {format(new Date(r.checked_at), 'dd/MM HH:mm')}
                    </TableCell>
                    <TableCell className="text-right">
                      <a href={RICH_RESULTS(r.url)} target="_blank" rel="noreferrer"
                         className="inline-flex items-center text-xs text-primary hover:underline">
                        Rich Results <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
