import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, RefreshCw, Search, Download, History } from 'lucide-react';

interface AuditRow {
  id: string;
  created_at: string;
  status: string;
  role: string;
  target_email: string;
  target_user_id: string | null;
  promoted_by_email: string | null;
  message: string | null;
}

const STATUS_OPTIONS = ['all', 'requested', 'success', 'rejected', 'revoked', 'noop', 'error'] as const;

function toCsv(rows: AuditRow[]): string {
  const header = ['created_at', 'status', 'role', 'target_email', 'target_user_id', 'promoted_by_email', 'message'];
  const escape = (v: any) => {
    if (v === null || v === undefined) return '';
    const s = String(v).replace(/"/g, '""');
    return /[",\n;]/.test(s) ? `"${s}"` : s;
  };
  const lines = [header.join(',')];
  for (const r of rows) {
    lines.push([
      r.created_at, r.status, r.role, r.target_email,
      r.target_user_id ?? '', r.promoted_by_email ?? '', r.message ?? '',
    ].map(escape).join(','));
  }
  return lines.join('\n');
}

const AdminAudit = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<typeof STATUS_OPTIONS[number]>('all');
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');

  const load = async () => {
    setLoading(true);
    let q = supabase.from('role_promotion_audit')
      .select('id, created_at, status, role, target_email, target_user_id, promoted_by_email, message')
      .order('created_at', { ascending: false })
      .limit(1000);
    if (from) q = q.gte('created_at', new Date(from).toISOString());
    if (to) q = q.lte('created_at', new Date(to + 'T23:59:59').toISOString());
    const { data, error } = await q;
    if (error) {
      toast({ title: 'Erro ao carregar auditoria', description: error.message, variant: 'destructive' });
      setLoading(false);
      return;
    }
    setRows(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [from, to]);

  const filtered = useMemo(() => {
    const qq = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (status !== 'all' && r.status !== status) return false;
      if (!qq) return true;
      return (
        r.target_email.toLowerCase().includes(qq) ||
        (r.promoted_by_email || '').toLowerCase().includes(qq) ||
        (r.message || '').toLowerCase().includes(qq)
      );
    });
  }, [rows, query, status]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    rows.forEach((r) => { map[r.status] = (map[r.status] || 0) + 1; });
    return map;
  }, [rows]);

  const exportCsv = () => {
    const csv = toCsv(filtered);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const badgeVariant = (s: string): 'default' | 'destructive' | 'secondary' | 'outline' => {
    if (s === 'success') return 'default';
    if (s === 'rejected' || s === 'error' || s === 'revoked') return 'destructive';
    if (s === 'requested') return 'secondary';
    return 'outline';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link to="/admin" className="inline-flex items-center hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-1" /> Painel
            </Link>
          </div>
          <h1 className="text-2xl font-display flex items-center gap-2">
            <History className="w-6 h-6 text-primary" /> Auditoria de Acesso
          </h1>
          <p className="text-muted-foreground text-sm">
            Histórico completo de promoções, solicitações, reprovações e revogações de acesso administrativo.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Atualizar
          </Button>
          <Button onClick={exportCsv} disabled={filtered.length === 0}>
            <Download className="w-4 h-4 mr-2" /> Exportar CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {(['requested', 'success', 'rejected', 'revoked', 'noop', 'error'] as const).map((s) => (
          <Card key={s}>
            <CardContent className="p-4">
              <div className="text-xs uppercase text-muted-foreground">{s}</div>
              <div className="text-2xl font-semibold">{counts[s] || 0}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Eventos</CardTitle>
          <CardDescription>
            {loading ? 'Carregando…' : `${filtered.length} de ${rows.length} eventos.`}
          </CardDescription>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-3">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por e-mail, mensagem…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={status} onValueChange={(v) => setStatus(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>{s === 'all' ? 'Todos os status' : s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="grid grid-cols-2 gap-2">
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Alvo</TableHead>
                  <TableHead>Por</TableHead>
                  <TableHead>Mensagem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-xs whitespace-nowrap">
                      {new Date(r.created_at).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell><Badge variant={badgeVariant(r.status)}>{r.status}</Badge></TableCell>
                    <TableCell className="text-xs">
                      <div>{r.target_email}</div>
                      {r.target_user_id && (
                        <code className="text-[10px] text-muted-foreground">{r.target_user_id.slice(0, 8)}…</code>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">{r.promoted_by_email || '—'}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-md">
                      {r.message || '—'}
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-sm">
                      Nenhum evento para os filtros selecionados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAudit;
