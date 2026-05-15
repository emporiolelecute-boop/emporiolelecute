import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Truck, Search } from "lucide-react";

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

export default function AdminShippingAudit() {
  const [rows, setRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    const { data } = await (supabase as any)
      .from("tracking_email_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(300);
    setRows(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(
      (r) =>
        r.order_code.toLowerCase().includes(s) ||
        (r.tracking_code || "").toLowerCase().includes(s) ||
        (r.recipient_email || "").toLowerCase().includes(s) ||
        (r.triggered_by_email || "").toLowerCase().includes(s),
    );
  }, [rows, q]);

  const shippedCount = filtered.filter((r) => r.new_status === "shipped").length;

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
            Histórico de mudanças de status com código de rastreio e e-mails enviados aos clientes.
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
              : `${filtered.length} eventos · ${shippedCount} marcados como Enviado`}
          </CardDescription>
          <div className="relative pt-3">
            <Search className="absolute left-3 top-1/2 translate-y-1 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Buscar por código do pedido, rastreio, e-mail ou admin..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
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
                    <TableHead>Status</TableHead>
                    <TableHead>Rastreio</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Por</TableHead>
                    <TableHead>Resultado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="text-xs whitespace-nowrap">
                        {new Date(r.created_at).toLocaleString("pt-BR")}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{r.order_code}</TableCell>
                      <TableCell>
                        {r.new_status ? <Badge variant="secondary">{r.new_status}</Badge> : "—"}
                      </TableCell>
                      <TableCell className="text-xs">
                        {r.tracking_code ? (
                          <div>
                            <div className="font-mono">{r.tracking_code}</div>
                            {r.tracking_carrier && <div className="text-muted-foreground">{r.tracking_carrier}</div>}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs">{r.recipient_email || "—"}</TableCell>
                      <TableCell className="text-xs">{r.triggered_by_email || "—"}</TableCell>
                      <TableCell>
                        <Badge variant={r.status === "sent" ? "default" : "destructive"}>{r.status}</Badge>
                        {r.error_message && (
                          <div className="text-xs text-destructive mt-1 max-w-[200px] truncate" title={r.error_message}>
                            {r.error_message}
                          </div>
                        )}
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
}
