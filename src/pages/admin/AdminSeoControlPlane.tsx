import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Activity, AlertTriangle, CheckCircle2, RefreshCw, ShieldAlert, Bot,
  Database, FileSearch, Layers,
} from "lucide-react";
import { useSeoControlPlane, type ControlPlaneFinding } from "@/hooks/useSeoControlPlane";

const sevColor: Record<string, string> = {
  critical: "destructive",
  warning: "secondary",
  ok: "default",
};

const impactLabel: Record<string, string> = {
  indexation: "Indexação",
  social_preview: "Preview social",
  data_integrity: "Integridade",
};

function FindingsList({ findings }: { findings: ControlPlaneFinding[] }) {
  if (!findings.length) {
    return (
      <div className="text-sm text-muted-foreground flex items-center gap-2 py-4">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        Nenhum problema detectado.
      </div>
    );
  }
  const groups = findings.reduce<Record<string, ControlPlaneFinding[]>>((acc, f) => {
    (acc[f.category] ||= []).push(f);
    return acc;
  }, {});
  return (
    <Accordion type="multiple" className="w-full">
      {Object.entries(groups).map(([cat, items]) => (
        <AccordionItem key={cat} value={cat}>
          <AccordionTrigger className="text-sm">
            <span className="capitalize">{cat.replace(/_/g, " ")}</span>
            <Badge variant="outline" className="ml-2">{items.length}</Badge>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {items.map((f, i) => (
                <div key={f.id + i} className="rounded-md border p-3 text-sm space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={sevColor[f.severity] as any}>{f.severity}</Badge>
                    <Badge variant="outline">{impactLabel[f.impact] || f.impact}</Badge>
                    {f.url && (
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{f.url}</code>
                    )}
                  </div>
                  <div>{f.message}</div>
                  {f.evidence && (
                    <div className="text-xs text-muted-foreground font-mono truncate">
                      {f.evidence}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default function AdminSeoControlPlane() {
  const { runs, loading, running, error, runNow } = useSeoControlPlane();
  const [tab, setTab] = useState("latest");
  const latest = runs[0];

  const status = useMemo(() => {
    if (!latest) return { variant: "outline", label: "Sem dados", icon: Activity };
    if (latest.errors > 0) return { variant: "destructive", label: "Crítico", icon: ShieldAlert };
    if (latest.warnings > 0) return { variant: "secondary", label: "Atenção", icon: AlertTriangle };
    return { variant: "default", label: "Saudável", icon: CheckCircle2 };
  }, [latest]);

  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      <Helmet><title>SEO Control Plane — Admin</title></Helmet>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">SEO Control Plane</h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Monitor contínuo de drift entre DB, sitemap e prerender + simulação de bots
            (Googlebot, Facebook, Twitter, LinkedIn). Detecta regressões antes da indexação.
          </p>
        </div>
        <Button onClick={() => runNow().catch(() => {})} disabled={running}>
          <RefreshCw className={`mr-2 h-4 w-4 ${running ? "animate-spin" : ""}`} />
          {running ? "Rodando…" : "Run now"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2">
            <StatusIcon className="h-4 w-4" /> Status
          </CardTitle></CardHeader>
          <CardContent>
            <Badge variant={status.variant as any} className="text-base">{status.label}</Badge>
            {latest && (
              <div className="text-xs text-muted-foreground mt-2">
                Última: {new Date(latest.ran_at).toLocaleString("pt-BR")}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2">
            <Database className="h-4 w-4" /> DB indexável
          </CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{latest?.checks?.db_count ?? "—"}</div>
            <div className="text-xs text-muted-foreground">URLs candidatas</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2">
            <FileSearch className="h-4 w-4" /> Sitemap
          </CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{latest?.checks?.sitemap_count ?? "—"}</div>
            <div className="text-xs text-muted-foreground">URLs publicadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2">
            <Bot className="h-4 w-4" /> Bot sim
          </CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {latest?.checks?.bot_simulation_count ?? "—"}
            </div>
            <div className="text-xs text-muted-foreground">
              Cache hit: {latest?.checks?.cache
                ? `${latest.checks.cache.hits}/${latest.checks.cache.total}`
                : "—"}
            </div>
          </CardContent>
        </Card>
      </div>

      {latest && (
        <div className="grid grid-cols-3 gap-4">
          <Card><CardContent className="pt-6">
            <div className="text-xs text-muted-foreground">Críticos</div>
            <div className="text-2xl font-semibold text-destructive">{latest.errors}</div>
          </CardContent></Card>
          <Card><CardContent className="pt-6">
            <div className="text-xs text-muted-foreground">Warnings</div>
            <div className="text-2xl font-semibold">{latest.warnings}</div>
          </CardContent></Card>
          <Card><CardContent className="pt-6">
            <div className="text-xs text-muted-foreground">OK</div>
            <div className="text-2xl font-semibold text-green-600">{latest.passed}</div>
          </CardContent></Card>
        </div>
      )}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="latest">Findings atuais</TabsTrigger>
          <TabsTrigger value="history">Histórico (10 últimas)</TabsTrigger>
          <TabsTrigger value="cache">Cache prerender</TabsTrigger>
        </TabsList>

        <TabsContent value="latest" className="mt-4">
          <Card><CardContent className="pt-6">
            {loading ? <Skeleton className="h-40 w-full" /> :
              latest ? <FindingsList findings={latest.checks?.findings || []} /> :
              <div className="text-sm text-muted-foreground">
                Nenhuma execução ainda. Clique em "Run now".
              </div>}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4 space-y-3">
          {loading ? <Skeleton className="h-40 w-full" /> : runs.map((r) => (
            <Card key={r.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="text-sm">
                    {new Date(r.ran_at).toLocaleString("pt-BR")}
                  </div>
                  <div className="flex gap-2 items-center">
                    <Badge variant="destructive">{r.errors} crit</Badge>
                    <Badge variant="secondary">{r.warnings} warn</Badge>
                    <Badge variant="outline">{r.passed} ok</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="cache" className="mt-4">
          <Card><CardContent className="pt-6 space-y-2">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span className="font-medium">Cache-Control headers do prerender</span>
            </div>
            {latest?.checks?.cache?.samples?.length ? (
              <ul className="text-sm font-mono space-y-1">
                {latest.checks.cache.samples.map((s, i) => (
                  <li key={i} className="text-muted-foreground">{s}</li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-muted-foreground">Sem dados ainda.</div>
            )}
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
