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
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationNext, PaginationPrevious, PaginationEllipsis,
} from '@/components/ui/pagination';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft, RefreshCw, Search, Download, History, FileText, ArrowUp, ArrowDown,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
type SortKey = 'created_at' | 'status' | 'target_email' | 'promoted_by_email';
type SortDir = 'asc' | 'desc';

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
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const load = async () => {
    setLoading(true);
    let q = supabase.from('role_promotion_audit')
      .select('id, created_at, status, role, target_email, target_user_id, promoted_by_email, message')
      .order('created_at', { ascending: false })
      .limit(2000);
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
  useEffect(() => { setPage(1); }, [query, status, sortKey, sortDir, pageSize, from, to]);

  const filtered = useMemo(() => {
    const qq = query.trim().toLowerCase();
    const out = rows.filter((r) => {
      if (status !== 'all' && r.status !== status) return false;
      if (!qq) return true;
      return (
        r.target_email.toLowerCase().includes(qq) ||
        (r.promoted_by_email || '').toLowerCase().includes(qq) ||
        (r.message || '').toLowerCase().includes(qq)
      );
    });
    const dir = sortDir === 'asc' ? 1 : -1;
    out.sort((a, b) => {
      const av = (a[sortKey] ?? '') as string;
      const bv = (b[sortKey] ?? '') as string;
      if (sortKey === 'created_at') {
        return (new Date(av).getTime() - new Date(bv).getTime()) * dir;
      }
      return av.localeCompare(bv, 'pt-BR') * dir;
    });
    return out;
  }, [rows, query, status, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = useMemo(
    () => filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filtered, currentPage, pageSize],
  );

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

  const exportPdf = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const today = new Date().toLocaleString('pt-BR');
    doc.setFontSize(14);
    doc.text('Auditoria de Acesso Administrativo', 40, 40);
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(
      `Gerado em ${today} • ${filtered.length} evento(s)` +
      (status !== 'all' ? ` • status=${status}` : '') +
      (from ? ` • de ${from}` : '') + (to ? ` até ${to}` : ''),
      40, 56,
    );
    doc.setTextColor(0);

    autoTable(doc, {
      startY: 72,
      head: [['Data', 'Status', 'Alvo', 'Por', 'Mensagem']],
      body: filtered.map((r) => [
        new Date(r.created_at).toLocaleString('pt-BR'),
        r.status,
        r.target_email,
        r.promoted_by_email || '—',
        r.message || '—',
      ]),
      styles: { fontSize: 8, cellPadding: 4, overflow: 'linebreak' },
      headStyles: { fillColor: [232, 93, 58] },
      columnStyles: {
        0: { cellWidth: 100 },
        1: { cellWidth: 60 },
        2: { cellWidth: 170 },
        3: { cellWidth: 170 },
        4: { cellWidth: 'auto' },
      },
      didDrawPage: (data) => {
        const pageCount = (doc as any).internal.getNumberOfPages();
        const pageNum = (doc as any).internal.getCurrentPageInfo().pageNumber;
        doc.setFontSize(8);
        doc.setTextColor(120);
        doc.text(
          `Página ${pageNum} de ${pageCount}`,
          doc.internal.pageSize.getWidth() - 80,
          doc.internal.pageSize.getHeight() - 20,
        );
      },
    });

    doc.save(`auditoria-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const badgeVariant = (s: string): 'default' | 'destructive' | 'secondary' | 'outline' => {
    if (s === 'success') return 'default';
    if (s === 'rejected' || s === 'error' || s === 'revoked') return 'destructive';
    if (s === 'requested') return 'secondary';
    return 'outline';
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir(key === 'created_at' ? 'desc' : 'asc'); }
  };

  const SortHeader = ({ k, label }: { k: SortKey; label: string }) => (
    <button
      onClick={() => toggleSort(k)}
      className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
      type="button"
    >
      {label}
      {sortKey === k && (sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
    </button>
  );

  // Compact pagination range
  const pageNumbers = useMemo(() => {
    const out: (number | 'ellipsis')[] = [];
    const add = (n: number | 'ellipsis') => out.push(n);
    const last = totalPages;
    const c = currentPage;
    const window = 1;
    add(1);
    if (c - window > 2) add('ellipsis');
    for (let i = Math.max(2, c - window); i <= Math.min(last - 1, c + window); i++) add(i);
    if (c + window < last - 1) add('ellipsis');
    if (last > 1) add(last);
    return out;
  }, [currentPage, totalPages]);

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
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Atualizar
          </Button>
          <Button variant="outline" onClick={exportCsv} disabled={filtered.length === 0}>
            <Download className="w-4 h-4 mr-2" /> CSV
          </Button>
          <Button onClick={exportPdf} disabled={filtered.length === 0}>
            <FileText className="w-4 h-4 mr-2" /> PDF
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
            {loading
              ? 'Carregando…'
              : `${filtered.length} de ${rows.length} eventos · página ${currentPage} de ${totalPages}`}
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
                  <TableHead><SortHeader k="created_at" label="Data" /></TableHead>
                  <TableHead><SortHeader k="status" label="Status" /></TableHead>
                  <TableHead><SortHeader k="target_email" label="Alvo" /></TableHead>
                  <TableHead><SortHeader k="promoted_by_email" label="Por" /></TableHead>
                  <TableHead>Mensagem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.map((r) => (
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
                {!loading && pageRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-sm">
                      Nenhum evento para os filtros selecionados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between gap-3 flex-wrap pt-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Por página</span>
              <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
                <SelectTrigger className="h-8 w-[80px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((n) => (
                    <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {totalPages > 1 && (
              <Pagination className="mx-0 w-auto justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {pageNumbers.map((n, i) =>
                    n === 'ellipsis' ? (
                      <PaginationItem key={`e-${i}`}><PaginationEllipsis /></PaginationItem>
                    ) : (
                      <PaginationItem key={n}>
                        <PaginationLink
                          href="#"
                          isActive={n === currentPage}
                          onClick={(e) => { e.preventDefault(); setPage(n); }}
                        >
                          {n}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)); }}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAudit;
