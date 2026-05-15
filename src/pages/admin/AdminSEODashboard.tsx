import { useEffect, useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { RefreshCw, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, ExternalLink, Download, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { format } from 'date-fns';

type CheckRun = { id: string; ran_at: string; source: string; total: number; passed: number; errors: number; warnings: number; checks: Array<{ name: string; ok: boolean; detail: string; severity: string }>; alert_sent: boolean };

function downloadCSV(filename: string, rows: Array<Record<string, unknown>>) {
  if (!rows.length) { toast.error('Nada para exportar'); return; }
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [headers.join(','), ...rows.map(r => headers.map(h => escape(r[h])).join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

type Snapshot = {
  id: string;
  source: string;
  captured_at: string;
  organic_keywords: number | null;
  organic_traffic: number | null;
  authority_score: number | null;
  backlinks_total: number | null;
  referring_domains: number | null;
  top_keywords: Array<Record<string, string>>;
};

type GscRow = { keys: string[]; clicks: number; impressions: number; ctr: number; position: number };
type GscData = {
  totals: { clicks: number; impressions: number; avg_position: number; row_count: number };
  rows: GscRow[];
  period: { start: string; end: string; days: number };
};

type Check = { name: string; ok: boolean; detail: string; severity: 'info'|'warn'|'error' };

const fmtNum = (n: number | null | undefined) => n == null ? '—' : n.toLocaleString('pt-BR');
const fmtPos = (n: number | null | undefined) => n == null ? '—' : n.toFixed(1);

export default function AdminSEODashboard() {
  const [snaps, setSnaps] = useState<Snapshot[]>([]);
  const [history, setHistory] = useState<Array<{ ran_at: string; status: string; entries: number | null }>>([]);
  const [lastSubmission, setLastSubmission] = useState<{ submitted_at?: string; status?: string; details?: unknown } | null>(null);
  const [gsc, setGsc] = useState<GscData | null>(null);
  const [checks, setChecks] = useState<{ summary: { total: number; passed: number; errors: number; warnings: number }; checks: Check[]; ran_at: string } | null>(null);
  const [loadingSemrush, setLoadingSemrush] = useState(false);
  const [loadingGsc, setLoadingGsc] = useState(false);
  const [loadingChecks, setLoadingChecks] = useState(false);
  const [runs, setRuns] = useState<CheckRun[]>([]);
  const [alertCfg, setAlertCfg] = useState<{ email: string; webhook_url: string; enabled: boolean }>({ email: '', webhook_url: '', enabled: true });
  const [savingCfg, setSavingCfg] = useState(false);

  const loadSnapshots = useCallback(async () => {
    const { data } = await supabase.from('seo_snapshots')
      .select('*').eq('source', 'semrush').order('captured_at', { ascending: false }).limit(20);
    setSnaps((data ?? []) as Snapshot[]);
  }, []);

  const loadHistory = useCallback(async () => {
    // Tenta carregar histórico do sitemap se a tabela existir
    try {
      const { data } = await supabase.from('sitemap_monitor_history' as never).select('*').order('ran_at', { ascending: false }).limit(15) as unknown as { data: Array<{ ran_at: string; status: string; entries: number | null }> | null };
      setHistory(data ?? []);
    } catch { setHistory([]); }
    const { data: settings } = await supabase.from('store_settings').select('value').eq('key', 'last_sitemap_submission').maybeSingle();
    setLastSubmission((settings?.value as { submitted_at?: string; status?: string; details?: unknown } | null) ?? null);
  }, []);

  useEffect(() => { loadSnapshots(); loadHistory(); }, [loadSnapshots, loadHistory]);

  const runSemrush = async () => {
    setLoadingSemrush(true);
    try {
      const { error } = await supabase.functions.invoke('seo-semrush-snapshot');
      if (error) throw error;
      toast.success('Snapshot Semrush capturado');
      await loadSnapshots();
    } catch (e) {
      toast.error('Falha no snapshot Semrush', { description: String(e instanceof Error ? e.message : e) });
    } finally { setLoadingSemrush(false); }
  };

  const loadGsc = async (days = 28, dim: 'query'|'page' = 'query') => {
    setLoadingGsc(true);
    try {
      const { data, error } = await supabase.functions.invoke('seo-gsc-analytics', { body: { days, dim } });
      if (error) throw error;
      setGsc(data as GscData);
    } catch (e) {
      toast.error('Falha ao carregar GSC', { description: String(e instanceof Error ? e.message : e) });
    } finally { setLoadingGsc(false); }
  };

  const runChecks = async () => {
    setLoadingChecks(true);
    try {
      const { data, error } = await supabase.functions.invoke('seo-checks');
      if (error) throw error;
      setChecks(data as never);
    } catch (e) {
      toast.error('Falha nos checks', { description: String(e instanceof Error ? e.message : e) });
    } finally { setLoadingChecks(false); }
  };

  const loadRuns = useCallback(async () => {
    const { data } = await supabase.from('seo_check_runs').select('*').order('ran_at', { ascending: false }).limit(30);
    setRuns((data ?? []) as CheckRun[]);
  }, []);

  const loadAlertCfg = useCallback(async () => {
    const { data } = await supabase.from('store_settings').select('value').eq('key', 'seo_alerts_config').maybeSingle();
    if (data?.value) setAlertCfg({ email: '', webhook_url: '', enabled: true, ...(data.value as object) });
  }, []);

  const saveAlertCfg = async () => {
    setSavingCfg(true);
    try {
      const { data: existing } = await supabase.from('store_settings').select('id').eq('key', 'seo_alerts_config').maybeSingle();
      if (existing) await supabase.from('store_settings').update({ value: alertCfg }).eq('id', existing.id);
      else await supabase.from('store_settings').insert({ key: 'seo_alerts_config', value: alertCfg });
      toast.success('Configuração salva');
    } catch (e) { toast.error(String(e instanceof Error ? e.message : e)); }
    finally { setSavingCfg(false); }
  };

  useEffect(() => { loadGsc(28, 'query'); runChecks(); loadRuns(); loadAlertCfg(); }, [loadRuns, loadAlertCfg]);

  // Diff between two most recent runs
  const lastRun = runs[0];
  const prevRun = runs[1];
  const diff = lastRun && prevRun ? lastRun.checks.map(c => {
    const old = prevRun.checks.find(x => x.name === c.name);
    if (!old) return { name: c.name, change: 'novo', from: '—', to: c.detail, ok: c.ok };
    if (old.ok === c.ok && old.detail === c.detail) return null;
    return { name: c.name, change: old.ok && !c.ok ? 'regrediu' : (!old.ok && c.ok ? 'corrigido' : 'alterado'), from: old.detail, to: c.detail, ok: c.ok };
  }).filter(Boolean) as Array<{ name: string; change: string; from: string; to: string; ok: boolean }> : [];

  const exportSemrushCsv = () => downloadCSV('seo-semrush-snapshots.csv', snaps.map(s => ({
    captured_at: s.captured_at, authority: s.authority_score, backlinks: s.backlinks_total,
    referring_domains: s.referring_domains, keywords: s.organic_keywords, traffic: s.organic_traffic,
  })));
  const exportGscCsv = () => downloadCSV('seo-gsc.csv', (gsc?.rows ?? []).map(r => ({
    query: r.keys[0], clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position,
  })));
  const exportRunsCsv = () => downloadCSV('seo-check-runs.csv', runs.map(r => ({
    ran_at: r.ran_at, source: r.source, total: r.total, passed: r.passed, errors: r.errors, warnings: r.warnings, alert_sent: r.alert_sent,
  })));
  const exportPdf = () => window.print();

  const trendData = [...snaps].reverse().map(s => ({
    date: format(new Date(s.captured_at), 'dd/MM'),
    backlinks: s.backlinks_total ?? 0,
    keywords: s.organic_keywords ?? 0,
    traffic: s.organic_traffic ?? 0,
    refDomains: s.referring_domains ?? 0,
    authority: s.authority_score ?? 0,
  }));

  const last = snaps[0];
  const prev = snaps[1];
  const delta = (cur?: number | null, old?: number | null) => {
    if (cur == null || old == null || old === 0) return null;
    return ((cur - old) / old) * 100;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard SEO</h1>
        <p className="text-sm text-muted-foreground">Monitoramento agregado: Google Search Console, Semrush e checks de saúde técnica.</p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Visão geral</TabsTrigger>
          <TabsTrigger value="gsc">Google Search Console</TabsTrigger>
          <TabsTrigger value="semrush">Semrush (Backlinks/Keywords)</TabsTrigger>
          <TabsTrigger value="checks">Checks pré-deploy</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Último envio do sitemap</CardTitle></CardHeader>
              <CardContent>
                {lastSubmission ? (
                  <>
                    <Badge variant={lastSubmission.status === 'success' ? 'default' : 'destructive'}>
                      {lastSubmission.status ?? 'desconhecido'}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-2">{lastSubmission.submitted_at ? format(new Date(lastSubmission.submitted_at), "dd/MM/yyyy HH:mm") : '—'}</p>
                  </>
                ) : <p className="text-sm text-muted-foreground">Nenhum envio registrado.</p>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Cliques (últimos 28d)</CardTitle></CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{fmtNum(gsc?.totals.clicks)}</p>
                <p className="text-xs text-muted-foreground mt-1">{fmtNum(gsc?.totals.impressions)} impressões</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Posição média / Backlinks</CardTitle></CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{fmtPos(gsc?.totals.avg_position)}</p>
                <p className="text-xs text-muted-foreground mt-1">{fmtNum(last?.backlinks_total)} backlinks · {fmtNum(last?.referring_domains)} domínios</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Histórico do sitemap</CardTitle></CardHeader>
            <CardContent>
              {history.length ? (
                <Table>
                  <TableHeader><TableRow><TableHead>Data</TableHead><TableHead>Status</TableHead><TableHead>Entradas</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {history.map((h, i) => (
                      <TableRow key={i}>
                        <TableCell>{format(new Date(h.ran_at), 'dd/MM/yyyy HH:mm')}</TableCell>
                        <TableCell><Badge variant={h.status === 'success' ? 'default' : 'destructive'}>{h.status}</Badge></TableCell>
                        <TableCell>{h.entries ?? '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : <p className="text-sm text-muted-foreground">Sem histórico de execuções automáticas.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        {/* GSC */}
        <TabsContent value="gsc" className="space-y-4">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => loadGsc(7, 'query')} disabled={loadingGsc}>7 dias</Button>
            <Button size="sm" variant="outline" onClick={() => loadGsc(28, 'query')} disabled={loadingGsc}>28 dias</Button>
            <Button size="sm" variant="outline" onClick={() => loadGsc(90, 'query')} disabled={loadingGsc}>90 dias</Button>
            <Button size="sm" onClick={() => loadGsc(28, 'query')} disabled={loadingGsc}>
              <RefreshCw className={`h-4 w-4 mr-1 ${loadingGsc ? 'animate-spin' : ''}`} />Atualizar
            </Button>
          </div>
          {loadingGsc ? <Skeleton className="h-72" /> : gsc ? (
            <Card>
              <CardHeader>
                <CardTitle>Top palavras-chave</CardTitle>
                <CardDescription>{gsc.period.start} → {gsc.period.end} · {gsc.totals.row_count} consultas</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Consulta</TableHead><TableHead>Cliques</TableHead><TableHead>Impressões</TableHead><TableHead>CTR</TableHead><TableHead>Posição</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {gsc.rows.slice(0, 30).map((r, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{r.keys[0]}</TableCell>
                        <TableCell>{r.clicks}</TableCell>
                        <TableCell>{r.impressions}</TableCell>
                        <TableCell>{(r.ctr * 100).toFixed(1)}%</TableCell>
                        <TableCell>{r.position.toFixed(1)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : <p className="text-sm text-muted-foreground">Nenhum dado disponível.</p>}
        </TabsContent>

        {/* SEMRUSH */}
        <TabsContent value="semrush" className="space-y-4">
          <div className="flex items-center gap-2">
            <Button onClick={runSemrush} disabled={loadingSemrush}>
              <RefreshCw className={`h-4 w-4 mr-1 ${loadingSemrush ? 'animate-spin' : ''}`} />
              Capturar snapshot agora
            </Button>
            <p className="text-xs text-muted-foreground">Cron semanal automático: domingos às 03:00 UTC.</p>
          </div>

          {last && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: 'Backlinks', cur: last.backlinks_total, old: prev?.backlinks_total },
                { label: 'Domínios ref.', cur: last.referring_domains, old: prev?.referring_domains },
                { label: 'Autoridade', cur: last.authority_score, old: prev?.authority_score },
                { label: 'Keywords', cur: last.organic_keywords, old: prev?.organic_keywords },
                { label: 'Tráfego est.', cur: last.organic_traffic, old: prev?.organic_traffic },
              ].map(m => {
                const d = delta(m.cur, m.old);
                return (
                  <Card key={m.label}>
                    <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">{m.label}</CardTitle></CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{fmtNum(m.cur)}</p>
                      {d !== null && (
                        <p className={`text-xs flex items-center gap-1 ${d >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                          {d >= 0 ? <TrendingUp className="h-3 w-3"/> : <TrendingDown className="h-3 w-3"/>}
                          {d.toFixed(1)}% vs anterior
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {trendData.length >= 2 && (
            <Card>
              <CardHeader><CardTitle>Tendências</CardTitle></CardHeader>
              <CardContent style={{ height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="backlinks" stroke="hsl(var(--primary))" />
                    <Line type="monotone" dataKey="refDomains" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="keywords" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {last?.top_keywords?.length ? (
            <Card>
              <CardHeader><CardTitle>Top keywords (snapshot mais recente)</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Termo</TableHead><TableHead>Pos</TableHead><TableHead>Vol</TableHead><TableHead>Tráfego%</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {last.top_keywords.map((k, i) => (
                      <TableRow key={i}>
                        <TableCell>{k.Ph}</TableCell>
                        <TableCell>{k.Po}</TableCell>
                        <TableCell>{k.Nq}</TableCell>
                        <TableCell>{k.Tr}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>

        {/* CHECKS */}
        <TabsContent value="checks" className="space-y-4">
          <div className="flex items-center gap-2">
            <Button onClick={runChecks} disabled={loadingChecks}>
              <RefreshCw className={`h-4 w-4 mr-1 ${loadingChecks ? 'animate-spin' : ''}`}/>Rodar checks
            </Button>
            <a href="/sitemap-check" target="_blank" rel="noreferrer">
              <Button variant="outline" size="sm"><ExternalLink className="h-4 w-4 mr-1"/>Verificação pública</Button>
            </a>
            {checks && (
              <span className="text-xs text-muted-foreground ml-2">
                {checks.summary.passed}/{checks.summary.total} ok · {checks.summary.errors} erros · {checks.summary.warnings} avisos
              </span>
            )}
          </div>
          {checks ? (
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader><TableRow><TableHead>Check</TableHead><TableHead>Status</TableHead><TableHead>Detalhe</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {checks.checks.map((c, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-mono text-xs">{c.name}</TableCell>
                        <TableCell>
                          {c.ok
                            ? <Badge variant="default" className="gap-1"><CheckCircle2 className="h-3 w-3"/>OK</Badge>
                            : <Badge variant={c.severity === 'error' ? 'destructive' : 'secondary'} className="gap-1"><AlertTriangle className="h-3 w-3"/>{c.severity}</Badge>}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{c.detail}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : <Skeleton className="h-72" />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
