import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useThemeHubs } from "@/hooks/useThemeHubs";
import { useProducts } from "@/hooks/useProducts";
import { useOccasionLandings } from "@/hooks/useOccasionLandings";
import { useDbBlogPosts } from "@/hooks/useDbBlogPosts";
import {
  buildDecisionEngine,
  calculateSeoStrategyScore,
  type DecisionInput,
} from "@/lib/seoDecisionEngine";
import { buildExecutionQueues } from "@/lib/executionPrioritizer";
import {
  detectClusterFragility,
  detectAuthorityConcentrationRisk,
  predictFutureRegression,
} from "@/lib/regressionEngine";
import { calculateBusinessIntent, detectUnderMonetizedClusters } from "@/lib/businessIntent";
import { averageSemanticROI } from "@/lib/semanticROI";
import { projectAuthorityGrowth } from "@/lib/authorityForecast";
import { buildContentValueMap } from "@/lib/contentValueMap";
import {
  AlertTriangle, Sparkles, Zap, Rocket, TrendingUp, Coins,
  ListChecks, ShieldAlert, Target, DollarSign,
} from "lucide-react";

export default function AdminSeoWarRoom() {
  const { data: hubs = [] } = useThemeHubs();
  const { data: products = [] } = useProducts();
  const { data: landings = [] } = useOccasionLandings();
  const { data: posts = [] } = useDbBlogPosts();

  const decisionInputs = useMemo<DecisionInput[]>(() => {
    const list: DecisionInput[] = [];
    products.slice(0, 80).forEach((p: any) => list.push({
      entityType: "product", entityId: p.id, entitySlug: p.slug, entityName: p.name,
      authority: 50, readiness: 60, coverage: 50, maturity: 50,
      reviews: 0, links: 2, faqs: 0, editorialSize: (p.long_description?.length || p.description?.length || 0),
      productCount: 1, ctaStrength: 60,
    }));
    hubs.forEach((h: any) => list.push({
      entityType: "theme", entityId: h.id, entitySlug: h.slug, entityName: h.title,
      authority: h.authority_score ?? 50, readiness: h.readiness_score ?? 50,
      coverage: h.topical_coverage ?? 50, maturity: h.maturity_score ?? 50,
      links: h.internal_links_count ?? 0, isHub: true,
      editorialSize: (h.editorial_content?.length || 0),
    }));
    landings.forEach((l: any) => list.push({
      entityType: "landing", entityId: l.id, entitySlug: l.route_slug, entityName: l.h1,
      authority: 55, readiness: 65, coverage: 60, isSegment: true,
      editorialSize: (l.seo_copy?.length || 0), productCount: 6, ctaStrength: 70,
    }));
    posts.forEach((b: any) => list.push({
      entityType: "blog", entityId: b.id, entitySlug: b.slug, entityName: b.title,
      authority: b.authority_contribution ?? 40, readiness: 60, coverage: b.topical_score ?? 50,
      editorialSize: (b.content?.length || 0), isBlog: true,
    }));
    return list;
  }, [products, hubs, landings, posts]);

  const decisions = useMemo(() => buildDecisionEngine(decisionInputs), [decisionInputs]);
  const queues = useMemo(() => buildExecutionQueues(decisions), [decisions]);

  const intents = useMemo(
    () => decisionInputs.map((i) => calculateBusinessIntent({
      entityType: i.entityType, entityId: i.entityId, entitySlug: i.entitySlug,
      productCount: i.productCount, reviewsCount: i.reviews, editorialSize: i.editorialSize,
      ctaStrength: i.ctaStrength, authorityScore: i.authority,
      isHub: i.isHub, isSegment: i.isSegment, isBlog: i.isBlog,
    })),
    [decisionInputs],
  );

  const underMonetized = useMemo(
    () => detectUnderMonetizedClusters(decisionInputs.map((i) => ({
      entityType: i.entityType, entityId: i.entityId, entitySlug: i.entitySlug,
      productCount: i.productCount, reviewsCount: i.reviews, editorialSize: i.editorialSize,
      ctaStrength: i.ctaStrength, authorityScore: i.authority,
      isHub: i.isHub, isSegment: i.isSegment, isBlog: i.isBlog,
    }))),
    [decisionInputs],
  );

  const fragility = useMemo(() => detectClusterFragility(
    hubs.map((h: any) => ({
      clusterId: h.id, clusterName: h.title,
      memberCount: (h.related_products?.length || 0) + (h.related_categories?.length || 0) + 1,
      averageAuthority: h.authority_score ?? 50,
      totalLinks: h.internal_links_count ?? 0,
      thinContentCount: 0, orphanCount: 0,
    })),
  ), [hubs]);

  const concentration = useMemo(() => detectAuthorityConcentrationRisk(
    decisionInputs.map((i) => ({
      entityId: i.entityId, entityName: i.entityName,
      authority: i.authority ?? 0, inboundLinks: i.links ?? 0,
    })),
  ), [decisionInputs]);

  const futureRegression = useMemo(() => predictFutureRegression(
    decisionInputs.map((i) => ({
      entityType: i.entityType, entityId: i.entityId, entitySlug: i.entitySlug, entityName: i.entityName,
      authorityScore: i.authority, internalLinks: i.links,
      thinContentRisk: (i.editorialSize ?? 0) < 300, orphanRisk: (i.links ?? 0) === 0,
    })),
  ), [decisionInputs]);

  const forecastInput = useMemo(() => {
    const avg = (k: keyof DecisionInput) =>
      decisionInputs.length ? decisionInputs.reduce((a, i) => a + ((i as any)[k] ?? 0), 0) / decisionInputs.length : 0;
    return projectAuthorityGrowth({
      currentAuthority: Math.round(avg("authority")),
      currentReadiness: Math.round(avg("readiness")),
      currentMaturity: Math.round(avg("maturity")),
      currentCoverage: Math.round(avg("coverage")),
      growthTrend: 0.1, semanticConnectivity: 60,
      reviewVelocity: 2, editorialExpansionRate: 0.2,
      executionsLast30d: 4,
    });
  }, [decisionInputs]);

  const valueMap = useMemo(() => buildContentValueMap(
    decisionInputs.map((i) => ({
      entityType: i.entityType, entityId: i.entityId,
      entitySlug: i.entitySlug, entityName: i.entityName,
      authority: i.authority, links: i.links, coverage: i.coverage,
      editorialSize: i.editorialSize, reviews: i.reviews, faqs: i.faqs,
    })),
  ), [decisionInputs]);

  const semanticROIAvg = useMemo(() => averageSemanticROI(decisionInputs.map((i) => ({
    entityType: i.entityType, entityId: i.entityId,
    authority: i.authority, readiness: i.readiness, coverage: i.coverage,
    links: i.links, faqs: i.faqs, reviews: i.reviews,
    editorialSize: i.editorialSize, orphan: (i.links ?? 0) === 0,
  }))), [decisionInputs]);

  const strategy = useMemo(() => calculateSeoStrategyScore({
    authorityAvg: Math.round(decisionInputs.reduce((a, i) => a + (i.authority ?? 0), 0) / Math.max(1, decisionInputs.length)),
    businessIntentAvg: Math.round(intents.reduce((a, i) => a + i.commercialPriority, 0) / Math.max(1, intents.length)),
    semanticROIAvg,
    maturityAvg: Math.round(decisionInputs.reduce((a, i) => a + (i.maturity ?? 0), 0) / Math.max(1, decisionInputs.length)),
    decayScore: 20, regressionRisk: 25,
    orphanRecoveryRate: 60, internalLinkQuality: 55,
    editorialQualityAvg: 60,
  }), [decisionInputs, intents, semanticROIAvg]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Rocket className="h-6 w-6 text-primary" />
          SEO War Room
        </h1>
        <p className="text-muted-foreground text-sm">
          Decision engine, ROI semântico, prioridades e forecast — apenas analítico, sem mudanças automáticas.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi icon={Target} label="Strategy Score" value={strategy.score} suffix={` · ${strategy.band}`} />
        <Kpi icon={DollarSign} label="ROI Semântico Médio" value={semanticROIAvg} />
        <Kpi icon={TrendingUp} label="Authority 90d" value={forecastInput[1]?.authority ?? 0} />
        <Kpi icon={ShieldAlert} label="Risco de Concentração" value={concentration.topShare} suffix={` (${concentration.risk})`} />
      </div>

      <Tabs defaultValue="risks" className="w-full">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="risks"><AlertTriangle className="h-4 w-4 mr-1" />Riscos</TabsTrigger>
          <TabsTrigger value="opps"><Sparkles className="h-4 w-4 mr-1" />Oportunidades</TabsTrigger>
          <TabsTrigger value="quick"><Zap className="h-4 w-4 mr-1" />Quick Wins</TabsTrigger>
          <TabsTrigger value="strategic"><Rocket className="h-4 w-4 mr-1" />Estratégicas</TabsTrigger>
          <TabsTrigger value="forecast"><TrendingUp className="h-4 w-4 mr-1" />Forecast</TabsTrigger>
          <TabsTrigger value="roi"><DollarSign className="h-4 w-4 mr-1" />ROI Semântico</TabsTrigger>
          <TabsTrigger value="queue"><ListChecks className="h-4 w-4 mr-1" />Execução</TabsTrigger>
          <TabsTrigger value="fragile"><ShieldAlert className="h-4 w-4 mr-1" />Clusters Frágeis</TabsTrigger>
          <TabsTrigger value="commercial"><Coins className="h-4 w-4 mr-1" />Comercial</TabsTrigger>
          <TabsTrigger value="undermon"><Target className="h-4 w-4 mr-1" />Subaproveitados</TabsTrigger>
        </TabsList>

        <TabsContent value="risks">
          <ListCard title="Regressões Previstas" items={futureRegression.slice(0, 12).map((r) => ({
            primary: r.entityName || r.entitySlug || r.entityId,
            secondary: `${r.predictedRegression}% risco em ${r.horizonDays}d`,
            meta: r.reasons.join(", "),
          }))} />
        </TabsContent>

        <TabsContent value="opps">
          <ListCard title="Maiores Oportunidades" items={decisions.slice(0, 12).map((d) => ({
            primary: d.entityName || d.entitySlug || d.entityId,
            secondary: `Oportunidade ${d.opportunityScore} · ROI ${d.estimatedROI}`,
            meta: d.recommendations[0],
          }))} />
        </TabsContent>

        <TabsContent value="quick">
          <ListCard title="Quick Wins" items={queues.quickWins.map((q) => ({
            primary: q.entityName || q.entitySlug || q.entityId,
            secondary: `ROI ${q.estimatedROI} · esforço ${q.effort}`,
            meta: q.reason,
          }))} />
        </TabsContent>

        <TabsContent value="strategic">
          <ListCard title="Expansões Estratégicas" items={queues.strategicWins.map((q) => ({
            primary: q.entityName || q.entitySlug || q.entityId,
            secondary: `ROI ${q.estimatedROI} · oportunidade ${q.opportunityScore}`,
            meta: q.reason,
          }))} />
        </TabsContent>

        <TabsContent value="forecast">
          <Card>
            <CardHeader><CardTitle>Authority Forecast</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {forecastInput.map((f) => (
                <div key={f.horizonDays} className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">{f.horizonDays} dias · confiança {f.confidence}%</p>
                  <p className="text-2xl font-semibold">{f.authority}</p>
                  <p className="text-xs text-muted-foreground">readiness {f.readiness} · maturity {f.maturity} · coverage {f.coverage}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roi">
          <ListCard title="Top Conteúdo por Valor" items={valueMap.slice(0, 15).map((v) => ({
            primary: v.entityName || v.entitySlug || v.entityId,
            secondary: `${v.valueScore} · ${v.band}`,
            meta: v.reasons.join(", "),
          }))} />
        </TabsContent>

        <TabsContent value="queue">
          <ListCard title="Recuperações Recomendadas" items={queues.recoveryActions.map((q) => ({
            primary: q.entityName || q.entitySlug || q.entityId,
            secondary: `Oportunidade ${q.opportunityScore} · esforço ${q.effort}`,
            meta: q.reason,
          }))} />
        </TabsContent>

        <TabsContent value="fragile">
          <ListCard title="Clusters Frágeis" items={fragility.slice(0, 12).map((c) => ({
            primary: c.clusterName || c.clusterId,
            secondary: `${c.fragilityScore} · ${c.band}`,
            meta: c.reasons.join(", "),
          }))} />
        </TabsContent>

        <TabsContent value="commercial">
          <ListCard title="Maior Prioridade Comercial" items={
            intents.sort((a, b) => b.commercialPriority - a.commercialPriority).slice(0, 12).map((i) => ({
              primary: decisionInputs.find((d) => d.entityId === i.entityId)?.entityName || i.entityId,
              secondary: `${i.intent} · prioridade ${i.commercialPriority}`,
              meta: i.signals.join(", "),
            }))
          } />
        </TabsContent>

        <TabsContent value="undermon">
          <ListCard title="Clusters Subaproveitados" items={underMonetized.slice(0, 12).map((u) => ({
            primary: decisionInputs.find((d) => d.entityId === u.entityId)?.entityName || u.entityId,
            secondary: `${u.intent} · ${u.commercialPriority}`,
            meta: u.signals.join(", "),
          }))} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, suffix }: { icon: any; label: string; value: number | string; suffix?: string }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <Icon className="h-5 w-5 text-primary" />
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xl font-semibold">{value}{suffix}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ListCard({ title, items }: { title: string; items: { primary: string; secondary?: string; meta?: string }[] }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem dados suficientes.</p>
        ) : (
          <ul className="divide-y">
            {items.map((it, idx) => (
              <li key={idx} className="py-2 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium truncate">{it.primary}</p>
                  {it.meta && <p className="text-xs text-muted-foreground truncate">{it.meta}</p>}
                </div>
                {it.secondary && <Badge variant="secondary" className="shrink-0">{it.secondary}</Badge>}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
