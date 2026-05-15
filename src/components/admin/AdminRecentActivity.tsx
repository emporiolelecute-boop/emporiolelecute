import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, RefreshCw, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface AuditRow {
  id: string;
  created_at: string;
  source: string | null;
  status: string | null;
  actor_email: string | null;
  target_email: string | null;
  details: string | null;
}

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  success: "default",
  requested: "outline",
  rejected: "destructive",
  revoked: "destructive",
  error: "destructive",
  noop: "secondary",
};

export default function AdminRecentActivity() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("list_admin_audit_timeline", {
      _limit: 10,
      _offset: 0,
      _sort_key: "created_at",
      _sort_dir: "desc",
    });
    if (!error && data && typeof data === "object" && "rows" in data) {
      setRows(((data as unknown as { rows: AuditRow[] }).rows) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="w-4 h-4 text-primary" /> Atividade recente
          </CardTitle>
          <CardDescription>Últimas ações administrativas (auditoria)</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link to="/admin/auditoria">
              Ver tudo <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading && rows.length === 0 ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 rounded bg-muted animate-pulse" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Nenhuma atividade registrada ainda.</p>
        ) : (
          <ul className="space-y-2">
            {rows.map((r) => (
              <li
                key={r.id}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors text-sm"
              >
                <Badge variant={STATUS_VARIANT[r.status ?? ""] ?? "secondary"} className="shrink-0 capitalize">
                  {r.status ?? "—"}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="truncate">
                    <span className="text-muted-foreground">{r.source ?? "sistema"}:</span>{" "}
                    {r.actor_email && <span className="font-medium">{r.actor_email}</span>}
                    {r.actor_email && r.target_email && <span className="text-muted-foreground"> → </span>}
                    {r.target_email && <span className="font-medium">{r.target_email}</span>}
                  </p>
                  {r.details && (
                    <p className="text-xs text-muted-foreground truncate" title={r.details}>
                      {r.details}
                    </p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(r.created_at).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
