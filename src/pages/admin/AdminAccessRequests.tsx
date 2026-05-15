import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, ShieldCheck, RefreshCw, Check, Search, ArrowUp, ArrowDown, Eye, X } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';

interface PendingRequest {
  id: string;
  email: string;
  full_name: string | null;
  access_requested_at: string | null;
}

const PAGE_SIZE = 10;

const AdminAccessRequests = () => {
  const { toast } = useToast();
  const { refreshRole, roleRefreshing } = useAuth();
  const [rows, setRows] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<PendingRequest | null>(null);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loadingAttempts, setLoadingAttempts] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<PendingRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const load = async () => {
    setLoading(true);
    const { data: pending, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, access_requested_at')
      .eq('access_requested', true)
      .order('access_requested_at', { ascending: false });

    if (error) {
      toast({ title: 'Erro ao carregar', description: error.message, variant: 'destructive' });
      setLoading(false);
      return;
    }

    const ids = (pending ?? []).map((p) => p.id);
    let admins = new Set<string>();
    if (ids.length) {
      const { data: roles } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin')
        .in('user_id', ids);
      admins = new Set((roles ?? []).map((r) => r.user_id));
    }

    setRows((pending ?? []).filter((p) => !admins.has(p.id)));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openDetails = async (req: PendingRequest) => {
    setSelected(req);
    setLoadingAttempts(true);
    const { data } = await (supabase as any)
      .from('role_promotion_audit')
      .select('*')
      .eq('target_email', req.email)
      .order('created_at', { ascending: false })
      .limit(50);
    setAttempts(data || []);
    setLoadingAttempts(false);
  };

  const approve = async (email: string, id: string) => {
    setActing(id);
    try {
      const { data, error } = await supabase.rpc('promote_user_to_admin', { _email: email });
      if (error) throw error;
      const result = data as { success?: boolean; already?: boolean; error?: string } | null;
      if (result?.success === false) {
        toast({ title: 'Não foi possível aprovar', description: result.error || '—', variant: 'destructive' });
      } else {
        toast({
          title: result?.already ? 'Usuário já era admin' : 'Acesso aprovado',
          description: email,
        });
        setRows((prev) => prev.filter((r) => r.id !== id));
        if (selected?.id === id) setSelected(null);
        // Refresh the *current* admin's cached role so any policy change
        // propagates instantly without a page reload.
        void refreshRole();
      }
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' });
    } finally {
      setActing(null);
    }
  };

  const reject = async () => {
    if (!rejectTarget) return;
    const reason = rejectReason.trim();
    if (reason.length < 3) {
      toast({ title: 'Motivo obrigatório', description: 'Informe ao menos 3 caracteres.', variant: 'destructive' });
      return;
    }
    setActing(rejectTarget.id);
    try {
      const { error } = await (supabase as any).rpc('reject_admin_request', {
        _user_id: rejectTarget.id,
        _reason: reason,
      });
      if (error) throw error;
      toast({ title: 'Solicitação reprovada', description: rejectTarget.email });
      setRows((prev) => prev.filter((r) => r.id !== rejectTarget.id));
      if (selected?.id === rejectTarget.id) setSelected(null);
      setRejectTarget(null);
      setRejectReason('');
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' });
    } finally {
      setActing(null);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? rows.filter((r) => r.email.toLowerCase().includes(q) || (r.full_name || '').toLowerCase().includes(q))
      : rows;
    return [...list].sort((a, b) => {
      const da = a.access_requested_at ? new Date(a.access_requested_at).getTime() : 0;
      const db = b.access_requested_at ? new Date(b.access_requested_at).getTime() : 0;
      return sortDesc ? db - da : da - db;
    });
  }, [rows, query, sortDesc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [query, sortDesc]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link to="/admin/usuarios" className="inline-flex items-center hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-1" /> Usuários
            </Link>
          </div>
          <h1 className="text-2xl font-display flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" /> Solicitações Pendentes
          </h1>
          <p className="text-muted-foreground text-sm">Aprove usuários que pediram acesso administrativo.</p>
        </div>
        <Button variant="outline" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fila de aprovação</CardTitle>
          <CardDescription>
            {loading ? 'Carregando...' : `${filtered.length} de ${rows.length} solicitação(ões).`}
          </CardDescription>
          <div className="flex flex-col md:flex-row gap-3 pt-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por e-mail ou nome..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" onClick={() => setSortDesc((s) => !s)}>
              {sortDesc ? <ArrowDown className="h-4 w-4 mr-2" /> : <ArrowUp className="h-4 w-4 mr-2" />}
              Data {sortDesc ? 'mais recente' : 'mais antiga'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!loading && filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              Nenhuma solicitação encontrada.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Solicitado em</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageRows.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <div className="font-medium">{r.full_name || '—'}</div>
                        <div className="text-xs text-muted-foreground break-all">{r.email}</div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {r.access_requested_at
                          ? new Date(r.access_requested_at).toLocaleString('pt-BR')
                          : '—'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">Em análise</Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2 whitespace-nowrap">
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/admin/usuarios/solicitacoes/${r.id}`}>
                            <Eye className="w-4 h-4 mr-1" /> Detalhes
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => { setRejectTarget(r); setRejectReason(''); }}
                          disabled={acting === r.id}
                        >
                          <X className="w-4 h-4 mr-1" /> Reprovar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => approve(r.email, r.id)}
                          disabled={acting === r.id || roleRefreshing}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          {acting === r.id || roleRefreshing ? 'Aprovando...' : 'Aprovar'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 text-sm">
                  <span className="text-muted-foreground">Página {page} de {totalPages}</span>
                  <div className="space-x-2">
                    <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Anterior</Button>
                    <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Próxima</Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {selected && (
        <Card className="border-primary/50">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Detalhes da solicitação</CardTitle>
                <CardDescription className="space-y-1 pt-2">
                  <div><span className="text-muted-foreground">request_id:</span> <code className="text-xs">{selected.id}</code></div>
                  <div><span className="text-muted-foreground">E-mail:</span> {selected.email}</div>
                  <div><span className="text-muted-foreground">Nome:</span> {selected.full_name || '—'}</div>
                  <div><span className="text-muted-foreground">Solicitado em:</span> {selected.access_requested_at ? new Date(selected.access_requested_at).toLocaleString('pt-BR') : '—'}</div>
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>Fechar</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Histórico de tentativas</h4>
              {loadingAttempts ? (
                <p className="text-sm text-muted-foreground">Carregando histórico…</p>
              ) : attempts.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma tentativa anterior registrada.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Por</TableHead>
                        <TableHead>Mensagem</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attempts.map((a: any) => (
                        <TableRow key={a.id}>
                          <TableCell className="text-xs whitespace-nowrap">{new Date(a.created_at).toLocaleString('pt-BR')}</TableCell>
                          <TableCell><Badge variant={a.status === 'success' ? 'default' : a.status === 'error' ? 'destructive' : 'secondary'}>{a.status}</Badge></TableCell>
                          <TableCell className="text-xs">{a.promoted_by_email || '—'}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{a.message || '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="destructive" onClick={() => { setRejectTarget(selected); setRejectReason(''); }} disabled={acting === selected.id}>
                <X className="w-4 h-4 mr-1" /> Reprovar
              </Button>
              <Button onClick={() => approve(selected.email, selected.id)} disabled={acting === selected.id || roleRefreshing}>
                <Check className="w-4 h-4 mr-1" />
                {acting === selected.id || roleRefreshing ? 'Aprovando...' : 'Aprovar acesso administrativo'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={!!rejectTarget} onOpenChange={(o) => { if (!o) setRejectTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reprovar solicitação</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação registra a reprovação no histórico de auditoria. Informe um motivo claro — o usuário pode solicitar novamente após 24 h.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>{rejectTarget?.full_name || rejectTarget?.email}</strong>
              {rejectTarget?.full_name && <span className="block text-xs">{rejectTarget?.email}</span>}
            </p>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Motivo da reprovação (obrigatório, mín. 3 caracteres)"
              rows={4}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); reject(); }}
              disabled={acting === rejectTarget?.id || rejectReason.trim().length < 3}
            >
              Confirmar reprovação
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminAccessRequests;
