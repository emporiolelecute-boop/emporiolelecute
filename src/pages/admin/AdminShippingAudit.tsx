import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, RefreshCw, Truck, Search, Copy, ExternalLink } from "lucide-react";

interface LogRow {
  id: string;
  order_id: string;
  order_code: string;
  email_type: string;
  new_status: string | null;
  recipient_email: string | null;
  tracking_code: string | null;
  tracking_carrier: string | null;
  tracking_url: string | null;
  status: string;
  error_message: string | null;
  triggered_by_email: string | null;
  created_at: string;
}

type StatusFilter = "all" | "sent" | "failed";
type TypeFilter = "all" | "status_update" | "resend_status";

export default function AdminShippingAudit() {
  const { toast } = useToast();
  const [rows, setRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [selected, setSelected] = useState<LogRow | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await (supabase as any)
      .from("tracking_email_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    setRows(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (typeFilter !== "all" && r.email_type !== typeFilter) return false;
      if (!s) return true;
      return (
        r.order_code.toLowerCase().includes(s) ||
        (r.tracking_code || "").toLowerCase().includes(s) ||
        (r.recipient_email || "").toLowerCase().includes(s) ||
        (r.triggered_by_email || "").toLowerCase().includes(s) ||
        (r.error_message || "").toLowerCase().includes(s)
      );
    });
  }, [rows, q, statusFilter, typeFilter]);

  const sentCount = filtered.filter((r) => r.status === "sent").length;
  const failedCount = filtered.filter((r) => r.status === "failed").length;

  const copy = async (text: string, label = "Texto") => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: `${label} copiado` });
    } catch {
      toast({ title: "Não foi possível copiar", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <Link to="/admin/pedidos" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-1">
            <ArrowLeft className="w-4 h-4 mr-1" /> Pedidos
          </Link>
          <h1 className="text-2xl font-display flex items-center gap-2">
            <Truck className="w-6 h-6 text-primary" /> Auditoria de Envios
          </h1>
          <p className="text-muted-foreground text-sm">
            Histórico de e-mails de status enviados aos clientes (incluindo reenvios manuais).
          </p>
        </div>
        <Button variant="outline" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Atualizar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Eventos</CardTitle>
          <CardDescription>
            {loading
              ? "Carregando..."
              : `${filtered.length} eventos · ${sentCount} enviados · ${failedCount} falhas`}
          </CardDescription>
          <div className="grid gap-3 pt-3 md:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Buscar por código, rastreio, e-mail, admin ou mensagem de erro..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos resultados</SelectItem>
                <SelectItem value="sent">Apenas sucesso</SelectItem>
                <SelectItem value="failed">Apenas falhas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TypeFilter)}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos tipos</SelectItem>
                <SelectItem value="status_update">Mudança de status</SelectItem>
                <SelectItem value="resend_status">Reenvio manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {!loading && filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Sem eventos para os filtros.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rastreio</TableHead>
                    <TableHead>Resultado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow
                      key={r.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelected(r)}
                    >
                      <TableCell className="text-xs whitespace-nowrap">
                        {new Date(r.created_at).toLocaleString("pt-BR")}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{r.order_code}</TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="outline">
                          {r.email_type === "resend_status" ? "Reenvio" : "Status"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {r.new_status ? <Badge variant="secondary">{r.new_status}</Badge> : "—"}
                      </TableCell>
                      <TableCell className="text-xs">
                        {r.tracking_code ? (
                          <div className="font-mono">{r.tracking_code}</div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={r.status === "sent" ? "default" : "destructive"}>{r.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setSelected(r); }}>
                          Ver detalhes
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

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" /> Evento de e-mail
                </SheetTitle>
                <SheetDescription>
                  {new Date(selected.created_at).toLocaleString("pt-BR")}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-5 text-sm">
                <DetailRow label="Pedido">
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{selected.order_code}</span>
                    <Button size="icon" variant="ghost" className="h-7 w-7"
                      onClick={() => copy(selected.order_code, "Código")}>
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                    <Link to={`/admin/pedidos?q=${encodeURIComponent(selected.order_code)}`}>
                      <Button size="sm" variant="outline" className="h-7">
                        <ExternalLink className="w-3.5 h-3.5 mr-1" /> Abrir pedido
                      </Button>
                    </Link>
                  </div>
                </DetailRow>

                <DetailRow label="Tipo">
                  <Badge variant="outline">
                    {selected.email_type === "resend_status" ? "Reenvio manual" : "Mudança de status"}
                  </Badge>
                </DetailRow>

                <DetailRow label="Resultado">
                  <Badge variant={selected.status === "sent" ? "default" : "destructive"}>
                    {selected.status}
                  </Badge>
                </DetailRow>

                <DetailRow label="Status enviado">
                  {selected.new_status || "—"}
                </DetailRow>

                <DetailRow label="Destinatário">
                  {selected.recipient_email ? (
                    <div className="flex items-center gap-2">
                      <span>{selected.recipient_email}</span>
                      <Button size="icon" variant="ghost" className="h-7 w-7"
                        onClick={() => copy(selected.recipient_email!, "E-mail")}>
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ) : "—"}
                </DetailRow>

                <DetailRow label="Disparado por">
                  {selected.triggered_by_email || "—"}
                </DetailRow>

                {selected.tracking_code && (
                  <DetailRow label="Rastreio">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{selected.tracking_code}</span>
                        <Button size="icon" variant="ghost" className="h-7 w-7"
                          onClick={() => copy(selected.tracking_code!, "Código de rastreio")}>
                          <Copy className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      {selected.tracking_carrier && (
                        <div className="text-muted-foreground">{selected.tracking_carrier}</div>
                      )}
                      {selected.tracking_url && (
                        <a href={selected.tracking_url} target="_blank" rel="noreferrer"
                          className="inline-flex items-center text-primary text-xs hover:underline">
                          <ExternalLink className="w-3 h-3 mr-1" /> Abrir rastreio
                        </a>
                      )}
                    </div>
                  </DetailRow>
                )}

                {selected.error_message && (
                  <DetailRow label="Erro">
                    <div className="space-y-2">
                      <pre className="text-xs bg-destructive/10 text-destructive border border-destructive/20 rounded-md p-3 whitespace-pre-wrap break-words max-h-64 overflow-auto">
{selected.error_message}
                      </pre>
                      <Button size="sm" variant="outline"
                        onClick={() => copy(selected.error_message!, "Erro")}>
                        <Copy className="w-3.5 h-3.5 mr-1" /> Copiar mensagem
                      </Button>
                    </div>
                  </DetailRow>
                )}

                <DetailRow label="ID do log">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs">{selected.id}</span>
                    <Button size="icon" variant="ghost" className="h-7 w-7"
                      onClick={() => copy(selected.id, "ID")}>
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </DetailRow>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3 items-start">
      <div className="text-xs uppercase tracking-wide text-muted-foreground pt-1">{label}</div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
