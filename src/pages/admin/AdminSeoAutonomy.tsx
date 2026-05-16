import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  calculateSemanticStability,
  detectVolatileClusters,
  detectAuthorityInstability,
  calculateClusterDependency,
  calculateSemanticBalance,
  calculateEntropyScore,
  detectOverCentralization,
  type StabilityEntity,
} from "@/lib/semanticStability";
import { buildSaturationBuckets, type SaturationEntity } from "@/lib/saturationEngine";
import { buildCommercialRiskMap, type CommercialEntity } from "@/lib/commercialRisk";
import {
  forecastDecay,
  estimateRecoveryDifficulty,
  estimateGrowthCeiling,
  forecastClusterCollapse,
} from "@/lib/authorityForecast";
import { recordStrategicSnapshot } from "@/lib/strategicMemory";
import { SemanticStabilityBadge } from "@/components/admin/SemanticStabilityBadge";
import { CommercialRiskBadge } from "@/components/admin/CommercialRiskBadge";
import { ClusterDependencyPanel } from "@/components/admin/ClusterDependencyPanel";
import { MomentumTimeline } from "@/components/admin/MomentumTimeline";
import { SemanticEntropyCard } from "@/components/admin/SemanticEntropyCard";
import { SaturationMatrix } from "@/components/admin/SaturationMatrix";
import { RecoveryForecastCard } from "@/components/admin/RecoveryForecastCard";
import { useProducts } from "@/hooks/useProducts";

/**
 * Fase 13.1 — SEO Autonomy Layer.
 * Camada estratégica somente leitura (orientativa, sem alterar SEO público).
 */
export default function AdminSeoAutonomy() {
  const { data: products = [] } = useProducts();
  const [saving, setSaving] = useState(false);

  const stabilityItems: StabilityEntity[] = useMemo(
    () =>
      products.map((p: any) => ({
        id: p.id,
        cluster: p.category?.slug ?? p.category_id ?? "default",
        authority_score: 40 + Math.min(40, (p.reviews_count ?? 0) * 5),
        readiness_score: p.is_active ? 70 : 30,
        internal_links_count: (p.tags?.length ?? 0) + (p.occasions?.length ?? 0),
        topical_coverage: 50,
        authority_trend: 0,
      })),
    [products]
  );

  const saturationClusters = useMemo(() => {
    const map: Record<string, SaturationEntity[]> = {};
    for (const p of products as any[]) {
      const k = p.category?.slug ?? "default";
      (map[k] ||= []).push({
        id: p.id,
        cluster: k,
        internal_links_count: (p.tags?.length ?? 0) + (p.occasions?.length ?? 0),
        editorial_size: (p.editorial_content?.length ?? 0) + (p.long_description?.length ?? 0),
        similarity_score: 0.4,
      });
    }
    return map;
  }, [products]);

  const commercialItems: CommercialEntity[] = useMemo(
    () =>
      products.map((p: any) => ({
        id: p.id,
        cluster: p.category?.slug ?? "default",
        authority_score: 50,
        business_intent_score: 60,
        conversion_potential: 50,
        reviews_count: p.reviews_count ?? 0,
        editorial_size: p.editorial_content?.length ?? 0,
        has_cta: !!p.is_active,
        revenue_estimate: Number(p.price ?? 0),
      })),
    [products]
  );

  const stability = useMemo(() => calculateSemanticStability(stabilityItems), [stabilityItems]);
  const dependency = useMemo(() => calculateClusterDependency(stabilityItems), [stabilityItems]);
  const balance = useMemo(() => calculateSemanticBalance(stabilityItems), [stabilityItems]);
  const entropy = useMemo(() => calculateEntropyScore(stabilityItems), [stabilityItems]);
  const volatility = useMemo(() => detectAuthorityInstability(stabilityItems), [stabilityItems]);
  const volatileClusters = useMemo(() => detectVolatileClusters(stabilityItems), [stabilityItems]);
  const overcentralized = useMemo(() => detectOverCentralization(stabilityItems), [stabilityItems]);
  const saturation = useMemo(() => buildSaturationBuckets(saturationClusters), [saturationClusters]);
  const commercial = useMemo(() => buildCommercialRiskMap(commercialItems), [commercialItems]);

  const aggregate = useMemo(() => {
    const i = {
      currentAuthority: 50,
      currentReadiness: 60,
      currentMaturity: 55,
      currentCoverage: 60,
      growthTrend: 0.1,
      semanticConnectivity: 40,
      reviewVelocity: 2,
      editorialExpansionRate: 0.2,
      executionsLast30d: 1,
    };
    return {
      decay: forecastDecay(i),
      difficulty: estimateRecoveryDifficulty(i),
      ceiling: estimateGrowthCeiling(i),
      collapsePct: forecastClusterCollapse([i]),
    };
  }, []);

  async function handleSnapshotGlobal() {
    setSaving(true);
    try {
      const { error } = await recordStrategicSnapshot({
        entity_type: "global",
        entity_id: "00000000-0000-0000-0000-000000000000",
        authority_score: 50,
        readiness_score: 60,
        semantic_coverage: 60,
        business_intent_score: 60,
        conversion_potential: 50,
        editorial_depth: 50,
        internal_link_strength: 45,
        review_strength: 40,
        decay_score: aggregate.decay.decayPer30d,
        strategic_value: stability.score,
        execution_priority: 100 - stability.score,
        notes: `Snapshot manual via SEO Autonomy (Fase 13.1).`,
      });
      if (error) throw error;
      toast({ title: "Snapshot registrado" });
    } catch (e: any) {
      toast({ title: "Falha ao registrar snapshot", description: e?.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">SEO Autonomy Layer</h1>
          <p className="text-sm text-muted-foreground">
            Camada estratégica analítica (Fase 13.1). Safe mode absoluto — somente leitura.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <SemanticStabilityBadge result={stability} />
          <CommercialRiskBadge exposure={commercial.exposure_score} diversity={commercial.diversity_score} />
          <Button size="sm" variant="outline" onClick={handleSnapshotGlobal} disabled={saving}>
            {saving ? "Registrando..." : "Registrar snapshot global"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardHeader><CardTitle className="text-sm">Estabilidade</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{stability.score}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Entropia</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{entropy}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Volatilidade</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{volatility}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Diversidade comercial</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{commercial.diversity_score}</CardContent></Card>
      </div>

      <Tabs defaultValue="stability">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="stability">Estabilidade</TabsTrigger>
          <TabsTrigger value="saturation">Saturação</TabsTrigger>
          <TabsTrigger value="dependency">Dependência</TabsTrigger>
          <TabsTrigger value="commercial">Risco Comercial</TabsTrigger>
          <TabsTrigger value="momentum">Momentum</TabsTrigger>
          <TabsTrigger value="memory">Memória</TabsTrigger>
          <TabsTrigger value="volatility">Volatilidade</TabsTrigger>
          <TabsTrigger value="entropy">Entropia</TabsTrigger>
          <TabsTrigger value="recovery">Recuperação</TabsTrigger>
          <TabsTrigger value="centralization">Centralização</TabsTrigger>
          <TabsTrigger value="weak">Clusters Frágeis</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="stability">
          <Card>
            <CardHeader><CardTitle>Estabilidade semântica</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>Score: <span className="font-mono">{stability.score}</span> · risco {stability.risk}</p>
              {stability.reasons.length > 0 && <ul className="list-disc pl-5">{stability.reasons.map((r,i)=><li key={i}>{r}</li>)}</ul>}
              {stability.recommendations.length > 0 && (
                <div><p className="font-medium mt-2">Recomendações</p><ul className="list-disc pl-5">{stability.recommendations.map((r,i)=><li key={i}>{r}</li>)}</ul></div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saturation">
          <SaturationMatrix rows={saturation} />
        </TabsContent>

        <TabsContent value="dependency">
          <ClusterDependencyPanel items={dependency} />
        </TabsContent>

        <TabsContent value="commercial">
          <Card>
            <CardHeader><CardTitle>Mapa de risco comercial</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>Exposição: <span className="font-mono">{commercial.exposure_score}%</span></p>
              <p>Diversidade: <span className="font-mono">{commercial.diversity_score}%</span></p>
              <p>Intent mismatch: <span className="font-mono">{commercial.intent_mismatch_count}</span></p>
              <p>Clusters frágeis: <span className="font-mono">{commercial.weak_clusters.length}</span></p>
              {commercial.reasons.length > 0 && <ul className="list-disc pl-5">{commercial.reasons.map((r,i)=><li key={i}>{r}</li>)}</ul>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="momentum">
          <MomentumTimeline points={[]} />
        </TabsContent>

        <TabsContent value="memory">
          <Card>
            <CardHeader><CardTitle>Memória estratégica</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Use o botão "Registrar snapshot global" no topo para criar pontos de memória.
              Snapshots são manuais e nunca executados automaticamente.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volatility">
          <Card>
            <CardHeader><CardTitle>Clusters voláteis</CardTitle></CardHeader>
            <CardContent className="text-sm">
              {volatileClusters.length === 0 ? (
                <p className="text-muted-foreground">Nenhum cluster volátil detectado.</p>
              ) : (
                <ul className="space-y-1">
                  {volatileClusters.map((c) => (
                    <li key={c.cluster} className="flex justify-between border-b py-1">
                      <span>{c.cluster}</span>
                      <span className="font-mono">{c.volatility}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entropy">
          <SemanticEntropyCard entropy={entropy} balance={balance} />
        </TabsContent>

        <TabsContent value="recovery">
          <RecoveryForecastCard
            forecast={{
              scenario: aggregate.decay.scenario,
              difficulty: aggregate.difficulty,
              estimated_days: Math.round(aggregate.difficulty * 1.5),
              notes: `Teto estimado de autoridade: ${aggregate.ceiling}. Colapso projetado: ${aggregate.collapsePct}%.`,
            }}
          />
        </TabsContent>

        <TabsContent value="centralization">
          <Card>
            <CardHeader><CardTitle>Centralização</CardTitle></CardHeader>
            <CardContent className="text-sm">
              <p>Sobrecentralização detectada: <span className="font-mono">{overcentralized ? "sim" : "não"}</span></p>
              <p className="text-muted-foreground text-xs mt-1">
                Alerta quando algum cluster concentra mais de 65% da autoridade.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weak">
          <Card>
            <CardHeader><CardTitle>Clusters comerciais frágeis</CardTitle></CardHeader>
            <CardContent className="text-sm">
              {commercial.weak_clusters.length === 0 ? (
                <p className="text-muted-foreground">Nenhum cluster frágil detectado.</p>
              ) : (
                <ul className="list-disc pl-5">{commercial.weak_clusters.map((c) => <li key={c}>{c}</li>)}</ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader><CardTitle>Timeline estratégica</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Esta visualização agrega snapshots registrados manualmente. Registre snapshots para começar a ver evolução temporal.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
