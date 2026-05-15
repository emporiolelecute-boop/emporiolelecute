import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, Clock, History, RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RefreshConfig {
  enabled: boolean;
  interval_hours: number;
  last_run_at: string | null;
}

interface PostAttempt {
  id: string;
  post_id: string;
  attempted_at: string;
  status: string;
  source: string;
  error_message: string | null;
  meta_used: string | null;
}

export default function InstagramSchedulePanel() {
  const { toast } = useToast();
  const [cfg, setCfg] = useState<RefreshConfig>({ enabled: false, interval_hours: 24, last_run_at: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [attempts, setAttempts] = useState<(PostAttempt & { post_alt?: string | null })[]>([]);
  const [loadingHist, setLoadingHist] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("store_settings").select("value").eq("key", "instagram_refresh_config").maybeSingle();
    if (data?.value) setCfg(data.value as any);
    setLoading(false);
  };

  const loadHistory = async () => {
    setLoadingHist(true);
    const { data } = await supabase
      .from("instagram_post_attempts" as any)
      .select("id, post_id, attempted_at, status, source, error_message, meta_used")
      .order("attempted_at", { ascending: false })
      .limit(50);
    if (data) {
      const ids = Array.from(new Set((data as any[]).map((a) => a.post_id)));
      const { data: posts } = await supabase.from("instagram_posts").select("id, alt_text").in("id", ids);
      const map = new Map((posts || []).map((p: any) => [p.id, p.alt_text]));
      setAttempts((data as any[]).map((a) => ({ ...a, post_alt: map.get(a.post_id) })));
    }
    setLoadingHist(false);
  };

  useEffect(() => { load(); loadHistory(); }, []);

  const save = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("store_settings").upsert(
        { key: "instagram_refresh_config", value: cfg as any },
        { onConflict: "key" },
      );
      if (error) throw error;
      toast({ title: "Agendamento salvo", description: cfg.enabled ? `Bulk-refresh a cada ${cfg.interval_hours}h` : "Agendamento desativado" });
    } catch (e: any) {
      toast({ title: "Erro ao salvar", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Clock className="w-4 h-4" /> Bulk-refresh agendado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
            <>
              <div className="flex items-center gap-3">
                <Switch checked={cfg.enabled} onCheckedChange={(v) => setCfg({ ...cfg, enabled: v })} />
                <Label>Atualização automática ativada</Label>
              </div>
              <div className="grid grid-cols-2 gap-4 max-w-md">
                <div>
                  <Label>Intervalo (horas)</Label>
                  <Input
                    type="number" min={1} max={168}
                    value={cfg.interval_hours}
                    onChange={(e) => setCfg({ ...cfg, interval_hours: Math.max(1, Math.min(168, Number(e.target.value) || 24)) })}
                  />
                </div>
                <div>
                  <Label>Última execução</Label>
                  <p className="text-sm text-muted-foreground pt-2">
                    {cfg.last_run_at ? new Date(cfg.last_run_at).toLocaleString("pt-BR") : "—"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={save} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Salvar agendamento
                </Button>
                <Button variant="outline" onClick={loadHistory} disabled={loadingHist}>
                  {loadingHist ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCcw className="w-4 h-4 mr-2" />}
                  Recarregar histórico
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Verificação de cron horária. Se ativada, dispara o bulk-refresh respeitando o intervalo configurado.
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <History className="w-4 h-4" /> Histórico por post (últimas 50 tentativas)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingHist ? <Loader2 className="w-4 h-4 animate-spin" /> : !attempts.length ? (
            <p className="text-sm text-muted-foreground">Nenhuma tentativa registrada ainda.</p>
          ) : (
            <div className="overflow-auto max-h-96 border rounded-md">
              <table className="w-full text-xs">
                <thead className="bg-muted/50 sticky top-0">
                  <tr className="text-left">
                    <th className="p-2">Quando</th>
                    <th className="p-2">Post</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Origem</th>
                    <th className="p-2">Meta</th>
                    <th className="p-2">Erro</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((a) => (
                    <tr key={a.id} className="border-t">
                      <td className="p-2 whitespace-nowrap">{new Date(a.attempted_at).toLocaleString("pt-BR")}</td>
                      <td className="p-2 max-w-[200px] truncate" title={a.post_alt || a.post_id}>{a.post_alt || a.post_id.slice(0, 8)}</td>
                      <td className="p-2">
                        <Badge variant={a.status === "success" ? "secondary" : "destructive"} className={a.status === "success" ? "bg-emerald-100 text-emerald-700" : ""}>
                          {a.status}
                        </Badge>
                      </td>
                      <td className="p-2">{a.source}</td>
                      <td className="p-2"><code className="text-[10px]">{a.meta_used || "—"}</code></td>
                      <td className="p-2 text-destructive max-w-[260px] truncate" title={a.error_message || ""}>{a.error_message || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
