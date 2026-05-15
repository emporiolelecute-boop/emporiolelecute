import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw, Activity, Search } from "lucide-react";

interface StaleLog {
  id: string;
  occurred_at: string;
  route: string | null;
  message: string | null;
  stack: string | null;
  user_agent: string | null;
  reloaded: boolean;
}

const PAGE_SIZE = 25;

export default function AdminTelemetry() {
  const [rows, setRows] = useState<StaleLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [routeFilter, setRouteFilter] = useState("");
  const [uaFilter, setUaFilter] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);

  const load = async () => {
    setLoading(true);
    let q = (supabase as any)
      .from("stale_bundle_logs")
      .select("*")
      .order("occurred_at", { ascending: false })
      .limit(500);
    if (from) q = q.gte("occurred_at", new Date(from).toISOString());
    if (to) q = q.lte("occurred_at", new Date(`${to}T23:59:59`).toISOString());
    const { data } = await q;
    setRows(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [from, to]);

  const filtered = useMemo(() => {
    const r = routeFilter.trim().toLowerCase();
    const u = uaFilter.trim().toLowerCase();
    return rows.filter((row) => {
      if (r && !(row.route || "").toLowerCase().includes(r)) return false;
      if (u && !(row.user_agent || "").toLowerCase().includes(u)) return false;
      return true;
    });
  }, [rows, routeFilter, uaFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  useEffect(() => { setPage(1); }, [routeFilter, uaFilter, from, to]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <Link to="/admin" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-1">
            <ArrowLeft className="w-4 h-4 mr-1" /> Admin
          </Link>
          <h1 className="text-2xl font-display flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" /> Telemetria — Falhas de import dinâmico
          </h1>
          <p className="text-muted-foreground text-sm">
            Logs gravados pelo wrapper <code>lazyWithRetry</code> quando um chunk JS falha em carregar.
          </p>
        </div>
        <Button variant="outline" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Atualizar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>{loading ? "Carregando..." : `${filtered.length} de ${rows.length} eventos`}</CardDescription>
          <div className="grid md:grid-cols-4 gap-3 pt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rota (/admin/...)" value={routeFilter} onChange={(e) => setRouteFilter(e.target.value)} className="pl-9" />
            </div>
            <Input placeholder="User-agent contém..." value={uaFilter} onChange={(e) => setUaFilter(e.target.value)} />
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          {!loading && filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Nenhum evento no período/filtro.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Rota</TableHead>
                    <TableHead>Mensagem</TableHead>
                    <TableHead>Reload</TableHead>
                    <TableHead>UA</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageRows.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="text-xs whitespace-nowrap">
                        {new Date(r.occurred_at).toLocaleString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-xs font-mono">{r.route || "—"}</TableCell>
                      <TableCell className="text-xs max-w-[280px] truncate" title={r.message || ""}>
                        {r.message || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={r.reloaded ? "default" : "secondary"}>{r.reloaded ? "sim" : "não"}</Badge>
                      </TableCell>
                      <TableCell className="text-xs max-w-[280px] truncate" title={r.user_agent || ""}>
                        {r.user_agent || "—"}
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
    </div>
  );
}
