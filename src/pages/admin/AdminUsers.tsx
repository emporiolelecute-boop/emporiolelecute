import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ShieldCheck, History, AlertCircle, CheckCircle2, Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AuditRow {
  id: string;
  promoted_by_email: string | null;
  target_email: string;
  role: string;
  status: string;
  message: string | null;
  created_at: string;
}

const AdminUsers = () => {
  const qc = useQueryClient();
  const [email, setEmail] = useState("");

  const { data: audit = [], isLoading } = useQuery({
    queryKey: ["role_promotion_audit"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("role_promotion_audit")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return (data || []) as AuditRow[];
    },
  });

  const promote = useMutation({
    mutationFn: async (target: string) => {
      const { data, error } = await (supabase as any).rpc("promote_user_to_admin", { _email: target });
      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success(data.already ? "Usuário já era admin." : "Usuário promovido a admin.");
        setEmail("");
      } else {
        toast.error(data?.error || "Falha ao promover.");
      }
      qc.invalidateQueries({ queryKey: ["role_promotion_audit"] });
    },
    onError: (e: any) => {
      toast.error(e.message || "Erro ao promover");
      qc.invalidateQueries({ queryKey: ["role_promotion_audit"] });
    },
  });

  const handlePromote = (e: React.FormEvent) => {
    e.preventDefault();
    const v = email.trim();
    if (!v || !v.includes("@")) {
      toast.error("Informe um e-mail válido");
      return;
    }
    if (!confirm(`Confirmar promoção de ${v} a administrador?`)) return;
    promote.mutate(v);
  };

  const exportCSV = () => {
    if (!audit.length) {
      toast.info("Nada para exportar.");
      return;
    }
    const header = ["Data/hora", "E-mail promovido", "Promovido por", "Papel", "Status", "Mensagem"];
    const escape = (v: any) => {
      const s = v === null || v === undefined ? "" : String(v);
      return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = audit.map((r) => [
      format(new Date(r.created_at), "dd/MM/yyyy HH:mm:ss", { locale: ptBR }),
      r.target_email,
      r.promoted_by_email || "",
      r.role,
      r.status,
      r.message || "",
    ]);
    const csv = [header, ...rows].map((row) => row.map(escape).join(",")).join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `promocoes-admin-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success("CSV exportado.");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display text-foreground flex items-center gap-2">
          <ShieldCheck className="h-7 w-7" /> Usuários e permissões
        </h1>
        <p className="text-muted-foreground">
          Promova um e-mail existente ao papel de administrador. O usuário precisa ter feito login pelo menos uma vez.
        </p>
      </div>

      <Card className="p-5 space-y-4">
        <h2 className="font-medium">Promover usuário a admin</h2>
        <form onSubmit={handlePromote} className="flex flex-col md:flex-row gap-3 items-end">
          <div className="flex-1 space-y-1 w-full">
            <Label htmlFor="promoteEmail">E-mail do usuário</Label>
            <Input
              id="promoteEmail"
              type="email"
              placeholder="usuario@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={promote.isPending || !email}>
            <ShieldCheck className="h-4 w-4 mr-2" />
            {promote.isPending ? "Promovendo..." : "Confirmar permissão"}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground">
          Dica: peça para o usuário acessar <code>/admin/login</code> e entrar com Google ou e-mail/senha primeiro. Depois informe o e-mail aqui.
        </p>
      </Card>

      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="font-medium flex items-center gap-2">
            <History className="h-4 w-4" /> Histórico de promoções ({audit.length})
          </h2>
          <Button size="sm" variant="outline" onClick={exportCSV} disabled={!audit.length}>
            <Download className="h-4 w-4 mr-2" /> Exportar CSV
          </Button>
        </div>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : audit.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma promoção registrada ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-muted-foreground border-b">
                <tr>
                  <th className="py-2 pr-3">Data/hora</th>
                  <th className="py-2 pr-3">E-mail promovido</th>
                  <th className="py-2 pr-3">Promovido por</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {audit.map((r) => (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="py-2 pr-3 whitespace-nowrap text-muted-foreground">
                      {format(new Date(r.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </td>
                    <td className="py-2 pr-3 break-all">{r.target_email}</td>
                    <td className="py-2 pr-3 break-all text-muted-foreground">{r.promoted_by_email || "—"}</td>
                    <td className="py-2 pr-3">
                      {r.status === "success" && (
                        <span className="inline-flex items-center gap-1 text-emerald-600 text-xs">
                          <CheckCircle2 className="h-3 w-3" /> sucesso
                        </span>
                      )}
                      {r.status === "noop" && (
                        <span className="text-xs text-muted-foreground">já era admin</span>
                      )}
                      {r.status === "error" && (
                        <span className="inline-flex items-center gap-1 text-destructive text-xs">
                          <AlertCircle className="h-3 w-3" /> erro
                        </span>
                      )}
                    </td>
                    <td className="py-2 pr-3 text-xs text-muted-foreground">{r.message || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminUsers;
