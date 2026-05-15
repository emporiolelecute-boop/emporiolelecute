import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, ShieldCheck, Check, X, Mail, History, Send, Copy } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  access_requested: boolean;
  access_requested_at: string | null;
  created_at: string;
  updated_at: string;
}

interface AuditEntry {
  id: string;
  created_at: string;
  status: string;
  message: string | null;
  promoted_by_email: string | null;
}

interface NotificationEntry {
  id: string;
  created_at: string;
  status: string;
  admin_count: number;
  sent_count: number;
  error_message: string | null;
  details: any;
}

const AdminAccessRequestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const { toast } = useToast();
  const { refreshRole, roleRefreshing } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [notifications, setNotifications] = useState<NotificationEntry[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const COOLDOWN_SECONDS = 60;
  const cooldownKey = id ? `notify_resend_cooldown:${id}` : '';

  // Hydrate cooldown from localStorage
  useEffect(() => {
    if (!cooldownKey) return;
    const raw = localStorage.getItem(cooldownKey);
    if (!raw) return;
    const remaining = Math.max(0, Math.ceil((Number(raw) - Date.now()) / 1000));
    if (remaining > 0) setCooldown(remaining);
    else localStorage.removeItem(cooldownKey);
  }, [cooldownKey]);

  // Tick cooldown
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const copyToClipboard = async (text: string, label = 'Mensagem') => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: `${label} copiada` });
    } catch {
      toast({ title: 'Falha ao copiar', variant: 'destructive' });
    }
  };

  const resendNotification = async () => {
    if (!profile || cooldown > 0) return;
    setResending(true);
    try {
      const { data, error } = await supabase.functions.invoke('notify-admins-new-request', {
        body: {
          user_id: profile.id,
          email: profile.email,
          requested_at: profile.access_requested_at ?? new Date().toISOString(),
          source: 'manual_resend',
        },
      });
      if (error) throw error;
      const result = data as { ok?: boolean; sent?: number; admin_count?: number; errors?: string[] } | null;
      if (result?.ok === false) {
        toast({
          title: 'Notificação registrada com falhas',
          description: (result?.errors || []).join(' | ').slice(0, 200) || 'Veja o histórico abaixo.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Notificação reenviada',
          description: `${result?.sent ?? 0} de ${result?.admin_count ?? 0} admin(s) notificado(s).`,
        });
      }
      const until = Date.now() + COOLDOWN_SECONDS * 1000;
      if (cooldownKey) localStorage.setItem(cooldownKey, String(until));
      setCooldown(COOLDOWN_SECONDS);
      await load();
    } catch (e: any) {
      toast({ title: 'Erro ao reenviar', description: e.message, variant: 'destructive' });
    } finally {
      setResending(false);
    }
  };

  const load = async () => {
    if (!id) return;
    setLoading(true);
    const [{ data: p }, { data: roles }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', id).maybeSingle(),
      supabase.from('user_roles').select('role').eq('user_id', id).eq('role', 'admin'),
    ]);
    setProfile((p as Profile) || null);
    setIsAdmin(!!(roles && roles.length));

    if (p?.email) {
      const [{ data: a }, { data: n }] = await Promise.all([
        supabase
          .from('role_promotion_audit')
          .select('id, created_at, status, message, promoted_by_email')
          .eq('target_email', p.email)
          .order('created_at', { ascending: false })
          .limit(100),
        (supabase as any)
          .from('access_request_notifications')
          .select('*')
          .or(`requester_id.eq.${id},requester_email.eq.${p.email}`)
          .order('created_at', { ascending: false })
          .limit(50),
      ]);
      setAudit((a as AuditEntry[]) || []);
      setNotifications((n as NotificationEntry[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const approve = async () => {
    if (!profile) return;
    setActing(true);
    try {
      const { data, error } = await supabase.rpc('promote_user_to_admin', { _email: profile.email });
      if (error) throw error;
      const result = data as { success?: boolean; already?: boolean; error?: string } | null;
      if (result?.success === false) {
        toast({ title: 'Não foi possível aprovar', description: result.error || '—', variant: 'destructive' });
      } else {
        toast({ title: result?.already ? 'Já era admin' : 'Acesso aprovado', description: profile.email });
        void refreshRole();
        await load();
      }
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' });
    } finally {
      setActing(false);
    }
  };

  const reject = async () => {
    if (!profile) return;
    if (reason.trim().length < 3) {
      toast({ title: 'Motivo obrigatório', variant: 'destructive' });
      return;
    }
    setActing(true);
    try {
      const { error } = await (supabase as any).rpc('reject_admin_request', {
        _user_id: profile.id, _reason: reason.trim(),
      });
      if (error) throw error;
      toast({ title: 'Solicitação reprovada' });
      setRejecting(false);
      setReason('');
      await load();
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' });
    } finally {
      setActing(false);
    }
  };

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Carregando…</div>;
  if (!profile) return (
    <div className="p-6 space-y-3">
      <p className="text-sm text-muted-foreground">Solicitação não encontrada.</p>
      <Button variant="outline" onClick={() => nav('/admin/usuarios/solicitacoes')}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
      </Button>
    </div>
  );

  const notifBadge = (s: string): 'default' | 'destructive' | 'secondary' | 'outline' =>
    s === 'sent' ? 'default' : s === 'partial' ? 'secondary' : 'destructive';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link to="/admin/usuarios/solicitacoes" className="inline-flex items-center hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-1" /> Solicitações
            </Link>
          </div>
          <h1 className="text-2xl font-display flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" /> Detalhes da solicitação
          </h1>
        </div>
        <div className="flex gap-2 flex-wrap">
          {profile.access_requested && (
            <Button
              variant="outline"
              onClick={resendNotification}
              disabled={resending || cooldown > 0}
              title={cooldown > 0 ? `Aguarde ${cooldown}s para reenviar` : 'Reenviar e-mail aos admins'}
            >
              <Send className="w-4 h-4 mr-1" />
              {resending
                ? 'Enviando…'
                : cooldown > 0
                  ? `Reenviar (${cooldown}s)`
                  : 'Reenviar notificação'}
            </Button>
          )}
          {profile.access_requested && !isAdmin && (
            <>
              <Button variant="destructive" onClick={() => setRejecting(true)} disabled={acting}>
                <X className="w-4 h-4 mr-1" /> Reprovar
              </Button>
              <Button onClick={approve} disabled={acting || roleRefreshing}>
                <Check className="w-4 h-4 mr-1" />
                {acting || roleRefreshing ? 'Aprovando…' : 'Aprovar'}
              </Button>
            </>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Usuário</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <div><span className="text-muted-foreground">request_id:</span> <code className="text-xs">{profile.id}</code></div>
          <div><span className="text-muted-foreground">E-mail:</span> {profile.email}</div>
          <div><span className="text-muted-foreground">Nome:</span> {profile.full_name || '—'}</div>
          <div>
            <span className="text-muted-foreground">Status atual:</span>{' '}
            {isAdmin
              ? <Badge>Admin</Badge>
              : profile.access_requested
                ? <Badge variant="secondary">Em análise</Badge>
                : <Badge variant="outline">Sem solicitação</Badge>}
          </div>
          <div>
            <span className="text-muted-foreground">Solicitado em:</span>{' '}
            {profile.access_requested_at ? new Date(profile.access_requested_at).toLocaleString('pt-BR') : '—'}
          </div>
          <div>
            <span className="text-muted-foreground">Última atualização do perfil:</span>{' '}
            {new Date(profile.updated_at).toLocaleString('pt-BR')}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="w-5 h-5" /> Histórico de alterações
          </CardTitle>
          <CardDescription>{audit.length} evento(s) na auditoria.</CardDescription>
        </CardHeader>
        <CardContent>
          {audit.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">Nenhum evento registrado.</p>
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
                  {audit.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="text-xs whitespace-nowrap">
                        {new Date(a.created_at).toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell><Badge variant={a.status === 'success' ? 'default' : a.status === 'rejected' || a.status === 'error' ? 'destructive' : 'secondary'}>{a.status}</Badge></TableCell>
                      <TableCell className="text-xs">{a.promoted_by_email || '—'}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{a.message || '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="w-5 h-5" /> Tentativas de notificação por e-mail
          </CardTitle>
          <CardDescription>{notifications.length} envio(s) registrado(s).</CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              Nenhuma tentativa de notificação registrada para este usuário.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Admins</TableHead>
                    <TableHead>Enviados</TableHead>
                    <TableHead>Erro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((n) => (
                    <TableRow key={n.id}>
                      <TableCell className="text-xs whitespace-nowrap">
                        {new Date(n.created_at).toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell><Badge variant={notifBadge(n.status)}>{n.status}</Badge></TableCell>
                      <TableCell className="text-xs">{n.admin_count}</TableCell>
                      <TableCell className="text-xs">{n.sent_count}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-md break-words">
                        {n.error_message ? (
                          <div className="flex items-start gap-2">
                            <pre className="whitespace-pre-wrap break-words text-xs flex-1 m-0 font-mono">
                              {n.error_message}
                            </pre>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 shrink-0"
                              onClick={() => copyToClipboard(n.error_message!, 'Mensagem de erro')}
                              title="Copiar mensagem completa"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        ) : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={rejecting} onOpenChange={(o) => { if (!o) { setRejecting(false); setReason(''); } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reprovar solicitação</AlertDialogTitle>
            <AlertDialogDescription>
              Informe um motivo claro. O usuário poderá solicitar novamente após 24 h.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={4}
            placeholder="Motivo da reprovação (mín. 3 caracteres)" />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); reject(); }}
              disabled={acting || reason.trim().length < 3}
            >Confirmar reprovação</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminAccessRequestDetail;
