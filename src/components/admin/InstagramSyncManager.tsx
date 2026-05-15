import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Loader2, RefreshCw, ShieldCheck, AlertTriangle, CheckCircle2,
  Eye, Download, Clock, History, ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type ValidateResult = {
  valid: boolean;
  account?: { id: string; username: string; name?: string; media_count?: number; followers_count?: number; profile_picture_url?: string };
  permissions?: { granted: string[]; missing: string[]; required: string[] };
  resources?: { endpoint: string; purpose: string }[];
  title?: string;
  hint?: string;
};

type PreviewMedia = {
  id: string; caption: string; media_type: string; image_url: string; permalink: string; timestamp: string;
};

type HistoryRow = {
  id: string; ran_at: string; source: string; action: string; status: string;
  synced_count: number; selected_count: number | null; error_message: string | null; details: any;
};

export default function InstagramSyncManager({ onSynced }: { onSynced?: () => void }) {
  const [validating, setValidating] = useState(false);
  const [validation, setValidation] = useState<ValidateResult | null>(null);

  const [previewing, setPreviewing] = useState(false);
  const [media, setMedia] = useState<PreviewMedia[] | null>(null);
  const [previewError, setPreviewError] = useState<{ title: string; hint: string } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [syncing, setSyncing] = useState(false);

  const [config, setConfig] = useState<{ enabled: boolean; interval_hours: number }>({ enabled: false, interval_hours: 24 });
  const [savingConfig, setSavingConfig] = useState(false);

  const [history, setHistory] = useState<HistoryRow[]>([]);

  async function loadConfig() {
    const { data } = await supabase.from("store_settings").select("value").eq("key", "instagram_sync_config").maybeSingle();
    if (data?.value) setConfig({ enabled: !!(data.value as any).enabled, interval_hours: Number((data.value as any).interval_hours) || 24 });
  }
  async function loadHistory() {
    const { data } = await supabase.from("instagram_sync_history").select("*").order("ran_at", { ascending: false }).limit(20);
    setHistory((data as HistoryRow[]) || []);
  }
  useEffect(() => { loadConfig(); loadHistory(); }, []);

  async function handleValidate() {
    setValidating(true);
    setValidation(null);
    try {
      const { data, error } = await supabase.functions.invoke("instagram-sync", { body: { action: "validate" } });
      if (error) throw error;
      setValidation(data as ValidateResult);
      if ((data as any).valid) toast.success("Credenciais Instagram válidas");
      else toast.error((data as any).title || "ID inválido");
    } catch (e: any) {
      toast.error("Falha na validação", { description: e.message });
    } finally {
      setValidating(false);
      loadHistory();
    }
  }

  async function handlePreview() {
    setPreviewing(true);
    setMedia(null);
    setPreviewError(null);
    setSelected(new Set());
    try {
      const { data, error } = await supabase.functions.invoke("instagram-sync", { body: { action: "preview", limit: 24 } });
      if (error) throw error;
      const d = data as any;
      if (d.title && d.hint) {
        setPreviewError({ title: d.title, hint: d.hint });
        return;
      }
      setMedia(d.media || []);
      // pré-selecionar 6 primeiros
      setSelected(new Set((d.media || []).slice(0, 6).map((m: PreviewMedia) => m.id)));
    } catch (e: any) {
      toast.error("Falha ao buscar prévia", { description: e.message });
    } finally {
      setPreviewing(false);
    }
  }

  function toggleSelect(id: string) {
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  async function handleSync() {
    if (!media || selected.size === 0) {
      toast.error("Selecione pelo menos uma imagem");
      return;
    }
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke("instagram-sync", {
        body: { action: "sync", media_ids: Array.from(selected) },
      });
      if (error) throw error;
      const d = data as any;
      if (d.error) throw new Error(d.error + (d.hint ? ` — ${d.hint}` : ""));
      toast.success(`${d.synced} posts sincronizados`);
      onSynced?.();
      loadHistory();
    } catch (e: any) {
      toast.error("Falha na sincronização", { description: e.message });
    } finally {
      setSyncing(false);
    }
  }

  async function saveConfig() {
    setSavingConfig(true);
    try {
      const { error } = await supabase.from("store_settings")
        .upsert({ key: "instagram_sync_config", value: config as any }, { onConflict: "key" });
      if (error) throw error;
      toast.success("Agendamento atualizado");
    } catch (e: any) {
      toast.error("Erro ao salvar", { description: e.message });
    } finally {
      setSavingConfig(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* VALIDAÇÃO */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" /> 1. Validar credenciais Instagram
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Testa o <code>IG_BUSINESS_ACCOUNT_ID</code> e mostra quais endpoints da Graph API serão usados antes de sincronizar.
          </p>
          <Button onClick={handleValidate} disabled={validating} variant="outline">
            {validating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
            Testar conexão
          </Button>

          {validation?.valid && validation.account && (
            <Alert className="border-green-500/50">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <AlertTitle>Conta @{validation.account.username} conectada</AlertTitle>
              <AlertDescription className="space-y-2 mt-2">
                <div className="text-sm">
                  ID: <code>{validation.account.id}</code> · {validation.account.media_count ?? "?"} mídias · {validation.account.followers_count ?? "?"} seguidores
                </div>
                {validation.permissions && (
                  <div className="flex flex-wrap gap-1">
                    {validation.permissions.granted.map((p) => <Badge key={p} variant="secondary">{p}</Badge>)}
                    {validation.permissions.missing.map((p) => <Badge key={p} variant="destructive">faltando: {p}</Badge>)}
                  </div>
                )}
                {validation.resources && (
                  <div className="text-xs space-y-1 pt-2 border-t">
                    <p className="font-semibold">Recursos Graph API que serão acessados:</p>
                    {validation.resources.map((r, i) => (
                      <div key={i}><code className="text-xs">{r.endpoint}</code> — {r.purpose}</div>
                    ))}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {validation?.valid === false && (
            <Alert variant="destructive">
              <AlertTriangle className="w-4 h-4" />
              <AlertTitle>{validation.title}</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>{validation.hint}</p>
                <details className="text-xs">
                  <summary className="cursor-pointer">Como obter o ig_business_account.id correto</summary>
                  <ol className="list-decimal pl-5 mt-2 space-y-1">
                    <li>Acesse <a className="underline" href="https://developers.facebook.com/tools/explorer/" target="_blank" rel="noreferrer">Graph API Explorer</a></li>
                    <li>GET <code>/me/accounts</code> → copie o <strong>PAGE_ID</strong> da página vinculada</li>
                    <li>GET <code>/{`{PAGE_ID}`}?fields=instagram_business_account</code></li>
                    <li>Use o valor de <code>instagram_business_account.id</code> como <code>IG_BUSINESS_ACCOUNT_ID</code></li>
                  </ol>
                </details>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* PRÉVIA + SELEÇÃO */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" /> 2. Prévia e seleção
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Button onClick={handlePreview} disabled={previewing} variant="outline">
              {previewing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Eye className="w-4 h-4 mr-2" />}
              Buscar últimas do Instagram
            </Button>
            {media && (
              <>
                <span className="text-sm text-muted-foreground">{selected.size} de {media.length} selecionados</span>
                <Button size="sm" variant="ghost" onClick={() => setSelected(new Set(media.map(m => m.id)))}>Todos</Button>
                <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>Nenhum</Button>
                <Button onClick={handleSync} disabled={syncing || selected.size === 0} className="ml-auto">
                  {syncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                  Sincronizar selecionados ({selected.size})
                </Button>
              </>
            )}
          </div>

          {previewError && (
            <Alert variant="destructive">
              <AlertTriangle className="w-4 h-4" />
              <AlertTitle>{previewError.title}</AlertTitle>
              <AlertDescription>{previewError.hint}</AlertDescription>
            </Alert>
          )}

          {media && media.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {media.map((m) => {
                const isSel = selected.has(m.id);
                return (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => toggleSelect(m.id)}
                    className={`relative rounded-lg overflow-hidden border-2 transition ${isSel ? "border-primary ring-2 ring-primary/40" : "border-transparent opacity-70 hover:opacity-100"}`}
                  >
                    <img src={m.image_url} alt={m.caption.slice(0, 80)} className="w-full aspect-square object-cover" loading="lazy" />
                    {isSel && (
                      <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                    )}
                    <div className="absolute bottom-0 inset-x-0 bg-foreground/70 text-background text-[10px] p-1 text-left truncate">
                      {m.media_type === "VIDEO" ? "🎬 " : ""}{new Date(m.timestamp).toLocaleDateString("pt-BR")}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AGENDAMENTO */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" /> 3. Sincronização agendada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Quando ativada, sincroniza automaticamente as últimas 12 mídias do feed no intervalo definido. O cron roda de hora em hora e respeita o intervalo + rate limit (último sync com sucesso).
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Switch checked={config.enabled} onCheckedChange={(v) => setConfig({ ...config, enabled: v })} />
              <Label>Ativar agendamento</Label>
            </div>
            <div className="flex items-center gap-2">
              <Label>Intervalo (horas)</Label>
              <Input
                type="number" min={1} max={168}
                value={config.interval_hours}
                onChange={(e) => setConfig({ ...config, interval_hours: Number(e.target.value) || 24 })}
                className="w-24"
              />
            </div>
            <Button onClick={saveConfig} disabled={savingConfig} size="sm">
              {savingConfig ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Salvar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* HISTÓRICO */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" /> Histórico de sincronizações
            <Button size="sm" variant="ghost" onClick={loadHistory} className="ml-auto">
              <RefreshCw className="w-3 h-3" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma execução registrada ainda.</p>
          ) : (
            <ScrollArea className="h-72">
              <div className="space-y-2">
                {history.map((h) => (
                  <div key={h.id} className="flex items-start gap-3 text-sm border-b pb-2">
                    <Badge variant={h.status === "success" ? "default" : h.status === "error" ? "destructive" : "secondary"}>
                      {h.status}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="font-mono text-xs">{new Date(h.ran_at).toLocaleString("pt-BR")}</span>
                        <Badge variant="outline" className="text-xs">{h.action}</Badge>
                        <Badge variant="outline" className="text-xs">{h.source}</Badge>
                        {h.synced_count > 0 && <span className="text-xs">{h.synced_count} sincronizados</span>}
                      </div>
                      {h.error_message && <p className="text-xs text-destructive mt-1">{h.error_message}</p>}
                      {h.details?.hint && <p className="text-xs text-muted-foreground mt-1">{h.details.hint}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
