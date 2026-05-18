import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Bot, Play, FlaskConical, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { useSeoAutopilot, type AutopilotAction } from "@/hooks/useSeoAutopilot";

const classColor: Record<string, string> = {
  infrastructure: "default",
  needs_code_fix: "destructive",
  needs_content: "secondary",
  needs_data: "secondary",
};

function ActionRow({ a }: { a: AutopilotAction }) {
  const Icon = a.ok === true ? CheckCircle2 : a.ok === false ? XCircle : Bot;
  const iconColor = a.ok === true ? "text-green-600" : a.ok === false ? "text-destructive" : "text-muted-foreground";
  return (
    <div className="rounded-md border p-3 text-sm space-y-1">
      <div className="flex items-center gap-2 flex-wrap">
        <Icon className={`h-4 w-4 ${iconColor}`} />
        <Badge variant="outline" className="font-mono text-[10px]">{a.kind}</Badge>
        {a.classification && (
          <Badge variant={classColor[a.classification] as any}>{a.classification}</Badge>
        )}
        {a.duration_ms != null && a.duration_ms > 0 && (
          <span className="text-xs text-muted-foreground">{a.duration_ms}ms</span>
        )}
      </div>
      <div>{a.reason}</div>
      {a.remediation && (
        <div className="text-xs text-muted-foreground italic">→ {a.remediation}</div>
      )}
      {a.detail && (
        <div className="text-xs font-mono text-muted-foreground truncate">{a.detail}</div>
      )}
    </div>
  );
}

export default function AutopilotPanel() {
  const { runs, loading, busy, error, lastResponse, plan, execute } = useSeoAutopilot();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const latest = runs[0];
  const showResp = lastResponse || latest?.checks;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <h2 className="text-lg font-semibold">SEO Autopilot</h2>
          <Badge variant="outline" className="text-xs">corretivo automático</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => plan().catch(() => {})} disabled={busy}>
            <FlaskConical className="mr-2 h-4 w-4" /> Planejar (dry-run)
          </Button>
          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogTrigger asChild>
              <Button disabled={busy}>
                <Play className="mr-2 h-4 w-4" /> Executar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Executar Autopilot?</AlertDialogTitle>
                <AlertDialogDescription>
                  Vai regenerar o sitemap (se houver drift) e re-submeter aos buscadores.
                  Ações de "template_repair" e "log_issue" são apenas diagnóstico (sem efeito).
                  Validação pós-fix re-roda o Control Plane.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => execute().catch(() => {})}>
                  Executar agora
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showResp?.validation && !showResp.validation.skipped && (
        <Alert variant={showResp.validation.regression ? "destructive" : "default"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {showResp.validation.regression
              ? `Regressão detectada: errors ${showResp.validation.before?.errors} → ${showResp.validation.after?.errors}`
              : showResp.validation.improved
                ? `Melhoria: errors ${showResp.validation.before?.errors} → ${showResp.validation.after?.errors}, warnings ${showResp.validation.before?.warnings} → ${showResp.validation.after?.warnings}`
                : "Validação pós-fix: sem regressão."}
          </AlertDescription>
        </Alert>
      )}

      {showResp && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2 flex-wrap text-sm">
              <Badge>{showResp.mode}</Badge>
              <span className="text-muted-foreground">
                {showResp.plan?.length || 0} ações planejadas ·
                {" "}{showResp.executed?.length || 0} executadas ·
                {" "}{showResp.failed?.length || 0} falhas ·
                {" "}{showResp.skipped?.length || 0} ignoradas
              </span>
            </div>
            {!!showResp.plan?.length && (
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Plano / Execução</div>
                {(showResp.executed?.length ? showResp.executed : showResp.plan).map((a: AutopilotAction, i: number) => (
                  <ActionRow key={i} a={a} />
                ))}
              </div>
            )}
            {!!showResp.failed?.length && (
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-wide text-destructive">Falhas</div>
                {showResp.failed.map((a: AutopilotAction, i: number) => <ActionRow key={i} a={a} />)}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">Histórico Autopilot</div>
        {loading ? <div className="text-sm text-muted-foreground">Carregando…</div> :
          runs.length === 0 ? <div className="text-sm text-muted-foreground">Nenhuma run ainda.</div> :
          runs.map((r) => (
            <Card key={r.id}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between gap-2 flex-wrap text-sm">
                  <div>{new Date(r.ran_at).toLocaleString("pt-BR")}</div>
                  <div className="flex gap-2 items-center">
                    <Badge variant="outline">{r.checks?.mode || "?"}</Badge>
                    <Badge>{r.passed} ok</Badge>
                    {r.errors > 0 && <Badge variant="destructive">{r.errors} fail</Badge>}
                    {r.warnings > 0 && <Badge variant="secondary">{r.warnings} skip</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
