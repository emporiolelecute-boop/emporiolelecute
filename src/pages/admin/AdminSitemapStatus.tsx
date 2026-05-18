// Painel: status da submissão automática do sitemap ao Google Search Console.
// Lê store_settings.last_sitemap_submission + sitemap_monitor_history.
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Activity, CheckCircle2, XCircle, RefreshCw, ExternalLink, Clock } from 'lucide-react';

interface Submission {
  submitted_at: string;
  property?: string;
  sitemap_url?: string;
  gsc_status: string;
  gsc_error?: string | null;
  last_downloaded?: string | null;
  is_pending?: boolean | null;
  submitted_web?: number;
  indexed_web?: number;
  submitted_images?: number;
  warnings?: string | number;
  errors?: string | number;
  trigger?: string;
}

const AdminSitemapStatus = () => {
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: last } = useQuery({
    queryKey: ['last_sitemap_submission'],
    queryFn: async () => {
      const { data } = await supabase
        .from('store_settings').select('value, updated_at')
        .eq('key', 'last_sitemap_submission').maybeSingle();
      return (data?.value as unknown as Submission | null);
    },
  });

  const { data: history = [] } = useQuery({
    queryKey: ['sitemap_monitor_history'],
    queryFn: async () => {
      const { data } = await supabase
        .from('store_settings').select('value')
        .eq('key', 'sitemap_monitor_history').maybeSingle();
      const arr = (data?.value as unknown as Submission[] | null) || [];
      return arr.slice(-30).reverse();
    },
  });

  const { data: dirty } = useQuery({
    queryKey: ['sitemap_dirty'],
    queryFn: async () => {
      const { data } = await supabase
        .from('store_settings').select('value, updated_at')
        .eq('key', 'sitemap_dirty').maybeSingle();
      return { dirty: (data?.value as any)?.dirty === true, updated_at: data?.updated_at };
    },
  });

  const resubmit = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('submit-sitemap', { body: { trigger: 'manual' } });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: 'Sitemap enviado ao Google Search Console' });
      qc.invalidateQueries({ queryKey: ['last_sitemap_submission'] });
      qc.invalidateQueries({ queryKey: ['sitemap_monitor_history'] });
      qc.invalidateQueries({ queryKey: ['sitemap_dirty'] });
    },
    onError: (e: any) => toast({ title: 'Falha ao enviar', description: e?.message || String(e), variant: 'destructive' }),
  });

  const ok = last?.gsc_status === 'success';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" /> Sitemap → Google Search Console
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Submissão automática (a cada 15min se houver mudanças, 12h forçado, semanal).
            Status registrado em <code>store_settings</code>.
          </p>
        </div>
        <Button onClick={() => resubmit.mutate()} disabled={resubmit.isPending}>
          <RefreshCw className={`w-4 h-4 mr-2 ${resubmit.isPending ? 'animate-spin' : ''}`} />
          Reenviar agora
        </Button>
      </div>

      {/* Status atual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Última submissão</span>
            {last && (
              ok
                ? <Badge className="bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3 mr-1" />Sucesso</Badge>
                : <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />{last.gsc_status}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {!last ? (
            <p className="text-muted-foreground">Nenhuma submissão registrada ainda. Clique em "Reenviar agora".</p>
          ) : (
            <>
              <Row label="Enviado em" value={new Date(last.submitted_at).toLocaleString('pt-BR')} />
              <Row label="Propriedade GSC" value={last.property || '—'} />
              <Row label="Sitemap URL" value={
                last.sitemap_url ? (
                  <a href={last.sitemap_url} target="_blank" rel="noopener" className="text-primary underline inline-flex items-center gap-1">
                    {last.sitemap_url} <ExternalLink className="w-3 h-3" />
                  </a>
                ) : '—'
              } />
              <Row label="URLs submetidas (web)" value={String(last.submitted_web ?? 0)} />
              <Row label="URLs indexadas (web)" value={String(last.indexed_web ?? 0)} />
              <Row label="Imagens submetidas" value={String(last.submitted_images ?? 0)} />
              <Row label="Avisos / Erros" value={`${last.warnings ?? 0} / ${last.errors ?? 0}`} />
              <Row label="Último download pelo Google" value={last.last_downloaded ? new Date(last.last_downloaded).toLocaleString('pt-BR') : '—'} />
              <Row label="Pendente no Google" value={last.is_pending ? 'Sim' : 'Não'} />
              {last.gsc_error && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-xs whitespace-pre-wrap break-words">
                  {last.gsc_error}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Flag dirty */}
      {dirty && (
        <Card>
          <CardContent className="p-4 flex items-center gap-3 text-sm">
            <Clock className="w-4 h-4 text-amber-600" />
            {dirty.dirty
              ? <span>Sitemap marcado como <strong>dirty</strong> — reenvio automático nos próximos 15 min.</span>
              : <span>Sitemap em dia (última limpeza: {dirty.updated_at ? new Date(dirty.updated_at).toLocaleString('pt-BR') : '—'}).</span>}
          </CardContent>
        </Card>
      )}

      {/* Histórico */}
      <Card>
        <CardHeader><CardTitle>Histórico (últimas {history.length})</CardTitle></CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sem histórico ainda.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2 pr-3">Quando</th>
                    <th className="py-2 pr-3">Status</th>
                    <th className="py-2 pr-3">Trigger</th>
                    <th className="py-2 pr-3 text-right">Submetidas</th>
                    <th className="py-2 pr-3 text-right">Indexadas</th>
                    <th className="py-2 pr-3 text-right">Erros</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2 pr-3">{new Date(h.submitted_at).toLocaleString('pt-BR')}</td>
                      <td className="py-2 pr-3">
                        {h.gsc_status === 'success'
                          ? <Badge className="bg-green-100 text-green-800">ok</Badge>
                          : <Badge className="bg-red-100 text-red-800">{h.gsc_status}</Badge>}
                      </td>
                      <td className="py-2 pr-3 text-muted-foreground">{h.trigger || '—'}</td>
                      <td className="py-2 pr-3 text-right">{h.submitted_web ?? 0}</td>
                      <td className="py-2 pr-3 text-right">{h.indexed_web ?? 0}</td>
                      <td className="py-2 pr-3 text-right">{h.errors ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between gap-4 py-1 border-b border-border/30 last:border-0">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-right">{value}</span>
  </div>
);

export default AdminSitemapStatus;
