import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ShieldCheck, RefreshCw, Check } from 'lucide-react';

interface PendingRequest {
  id: string;
  email: string;
  full_name: string | null;
  access_requested_at: string | null;
}

const AdminAccessRequests = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    // Profiles with access_requested = true and no admin role
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
      }
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' });
    } finally {
      setActing(null);
    }
  };

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
            {loading ? 'Carregando...' : `${rows.length} solicitação(ões) aguardando.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!loading && rows.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              Nenhuma solicitação pendente. 🎉
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Solicitado em</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
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
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => approve(r.email, r.id)}
                          disabled={acting === r.id}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          {acting === r.id ? 'Aprovando...' : 'Aprovar Acesso'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAccessRequests;
