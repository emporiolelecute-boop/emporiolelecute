import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { computeTelemetry } from "@/lib/seoTelemetry";
import {
  simulateAuthorityExpansion,
  simulateSemanticCollapse,
  simulateExecutionOverload,
  simulateCommercialExpansion,
  simulateAuthorityCompounding,
  simulateClusterDominance,
  buildSimulationVerdict,
} from "@/lib/strategicSimulationEngine";
import {
  forecastSemanticGrowth,
  forecastAuthorityDecay,
  forecastClusterMaturity,
  forecastExecutionPressure,
  forecastCommercialIntentGrowth,
  forecastSemanticResilience,
  buildForecastConfidence,
} from "@/lib/futureForecastEngine";
import { buildAllScenarios, type ScenarioName } from "@/lib/strategicScenarioBuilder";
import {
  buildStrategicTwin,
  calculateTwinHealth,
  detectTwinFragility,
  detectTwinOverload,
  simulateTwinStress,
  estimateTwinRecovery,
  calculateTwinLongevity,
} from "@/lib/strategicTwinEngine";

import StrategicSimulationScenarioCard from "@/components/admin/StrategicSimulationScenarioCard";
import StrategicForecastTimeline from "@/components/admin/StrategicForecastTimeline";
import FutureRiskPanel from "@/components/admin/FutureRiskPanel";
import TwinHealthGauge from "@/components/admin/TwinHealthGauge";
import ProjectionMatrix from "@/components/admin/ProjectionMatrix";
import SemanticFutureMap from "@/components/admin/SemanticFutureMap";
import StrategicConfidenceBadge from "@/components/admin/StrategicConfidenceBadge";
import ScenarioComparisonPanel from "@/components/admin/ScenarioComparisonPanel";

type SimType = "growth" | "collapse" | "recovery" | "commercial" | "twin_stress";

export default function AdminStrategicSimulation() {
  // SAFE MODE: telemetria observacional zerada — sem queries públicas.
  const telemetry = useMemo(() => computeTelemetry([]), []);

  const [name, setName] = useState("Simulação estratégica manual");
  const [notes, setNotes] = useState("");
  const [scenarioType, setScenarioType] = useState<ScenarioName>("lean");
  const [stressIntensity, setStressIntensity] = useState(50);
  const [saving, setSaving] = useState(false);

  const twin = useMemo(() => buildStrategicTwin(telemetry), [telemetry]);
  const twinHealth = useMemo(() => calculateTwinHealth(twin), [twin]);
  const fragility = useMemo(() => detectTwinFragility(twin), [twin]);
  const overload = useMemo(() => detectTwinOverload(twin), [twin]);
  const stress = useMemo(() => simulateTwinStress(twin, stressIntensity), [twin, stressIntensity]);
  const recovery = useMemo(() => estimateTwinRecovery(twin), [twin]);
  const longevity = useMemo(() => calculateTwinLongevity(twin), [twin]);

  const expansion = useMemo(() => simulateAuthorityExpansion(telemetry), [telemetry]);
  const collapse = useMemo(() => simulateSemanticCollapse(telemetry), [telemetry]);
  const overloadSim = useMemo(() => simulateExecutionOverload(telemetry), [telemetry]);
  const commercial = useMemo(() => simulateCommercialExpansion(telemetry), [telemetry]);
  const compounding = useMemo(() => simulateAuthorityCompounding(telemetry), [telemetry]);
  const dominance = useMemo(() => simulateClusterDominance(telemetry), [telemetry]);
  const verdict = useMemo(() => buildSimulationVerdict(telemetry), [telemetry]);

  const semanticGrowth = useMemo(() => forecastSemanticGrowth(telemetry), [telemetry]);
  const authorityDecay = useMemo(() => forecastAuthorityDecay(telemetry), [telemetry]);
  const clusterMaturity = useMemo(() => forecastClusterMaturity(telemetry), [telemetry]);
  const executionPressure = useMemo(() => forecastExecutionPressure(telemetry), [telemetry]);
  const commercialIntent = useMemo(() => forecastCommercialIntentGrowth(telemetry), [telemetry]);
  const semanticResilience = useMemo(() => forecastSemanticResilience(telemetry), [telemetry]);
  const confidence = useMemo(() => buildForecastConfidence(telemetry), [telemetry]);

  const scenarios = useMemo(() => buildAllScenarios(telemetry), [telemetry]);

  const runSimulation = async (simType: SimType) => {
    setSaving(true);
    try {
      const payload = {
        simulation_name: name || `Simulação ${simType}`,
        simulation_type: simType,
        scenario_type: scenarioType,
        entities: [],
        assumptions: {
          stressIntensity,
          horizonWeeks: 12,
          mode: "safe_observational",
        },
        projected_authority: expansion.projectedAuthority,
        projected_readiness: telemetry.averageReadiness,
        projected_semantic_coverage: expansion.semanticGrowth,
        projected_revenue_intent: commercial.intentLift,
        projected_cluster_growth: expansion.thematicExpansion,
        projected_risk: collapse.collapseScore,
        projected_operational_load: overloadSim.overloadScore,
        projected_execution_cost: overloadSim.debtExplosion,
        projected_roi: commercial.conversionPotential,
        projected_time_to_impact: recovery.recoveryWeeks,
        projected_decay_risk: collapse.decayPressure,
        projected_resilience: stress.surviving ? 70 : 30,
        projected_sustainability: longevity.longevityScore,
        confidence_score: confidence.score,
        execution_complexity: scenarioType === "aggressive_growth" ? "high" : "medium",
        simulation_result: {
          verdict: verdict.verdict,
          score: verdict.score,
          twinHealth,
          stress,
          recovery,
          longevity,
          fragility,
          overload,
          expansion,
          collapse,
          commercial,
          compounding,
          dominance,
        },
        notes: notes || null,
      };
      const { error } = await supabase.from("seo_strategy_simulations").insert([payload] as any);
      if (error) throw error;
      toast.success("Simulação estratégica registrada");
    } catch (e: any) {
      toast.error(`Falha ao salvar: ${e.message ?? e}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-end gap-4 md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Strategic Simulation</h1>
          <p className="text-sm text-muted-foreground">
            Motor de simulação estratégica, digital twin e forecast — SAFE MODE absoluto, sem impacto público.
          </p>
        </div>
        <StrategicConfidenceBadge confidence={confidence} />
      </div>

      {/* KPI grid */}
      <div className="grid gap-3 md:grid-cols-5">
        {[
          { label: "Future Authority", value: expansion.projectedAuthority },
          { label: "Sustainability", value: longevity.longevityScore },
          { label: "Semantic Future", value: expansion.semanticGrowth },
          { label: "Resilience", value: stress.surviving ? 70 : 30 },
          { label: "Compound Growth", value: compounding.longTermVelocity },
          { label: "Collapse Risk", value: collapse.collapseScore },
          { label: "Op. Future Pressure", value: overloadSim.overloadScore },
          { label: "Commercial Projection", value: commercial.conversionPotential },
          { label: "Forecast Confidence", value: confidence.score },
          { label: "Cluster Longevity", value: longevity.longevityWeeks },
        ].map((k) => (
          <Card key={k.label} className="p-3">
            <div className="text-xs text-muted-foreground">{k.label}</div>
            <div className="text-2xl font-semibold">{k.value}</div>
          </Card>
        ))}
      </div>

      {/* Manual action panel */}
      <Card className="p-4 space-y-3">
        <h2 className="font-medium">Executar Simulação Manual</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome da simulação" />
          <select
            className="border rounded-md px-3 py-2 bg-background text-sm"
            value={scenarioType}
            onChange={(e) => setScenarioType(e.target.value as ScenarioName)}
          >
            <option value="aggressive_growth">Aggressive Growth</option>
            <option value="lean">Lean</option>
            <option value="recovery">Recovery</option>
            <option value="authority_defense">Authority Defense</option>
            <option value="semantic_expansion">Semantic Expansion</option>
            <option value="commercial_acceleration">Commercial Acceleration</option>
            <option value="minimal_maintenance">Minimal Maintenance</option>
          </select>
          <Input
            type="number"
            min={0}
            max={100}
            value={stressIntensity}
            onChange={(e) => setStressIntensity(Number(e.target.value))}
            placeholder="Stress intensity (0-100)"
          />
        </div>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notas opcionais" />
        <div className="flex flex-wrap gap-2">
          <Button disabled={saving} onClick={() => runSimulation("growth")}>Run Growth</Button>
          <Button disabled={saving} variant="secondary" onClick={() => runSimulation("collapse")}>Run Collapse</Button>
          <Button disabled={saving} variant="secondary" onClick={() => runSimulation("recovery")}>Run Recovery</Button>
          <Button disabled={saving} variant="secondary" onClick={() => runSimulation("commercial")}>Run Commercial</Button>
          <Button disabled={saving} variant="outline" onClick={() => runSimulation("twin_stress")}>Run Twin Stress Test</Button>
        </div>
      </Card>

      <Tabs defaultValue="twin">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="twin">Strategic Twin</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="decay">Decay</TabsTrigger>
          <TabsTrigger value="resilience">Resilience</TabsTrigger>
          <TabsTrigger value="commercial">Commercial</TabsTrigger>
          <TabsTrigger value="pressure">Op. Pressure</TabsTrigger>
          <TabsTrigger value="compounding">Compounding</TabsTrigger>
          <TabsTrigger value="collapse">Collapse Risks</TabsTrigger>
          <TabsTrigger value="longevity">Cluster Longevity</TabsTrigger>
          <TabsTrigger value="outlook">Executive Outlook</TabsTrigger>
        </TabsList>

        <TabsContent value="twin" className="grid gap-4 md:grid-cols-3 pt-4">
          <TwinHealthGauge score={twinHealth} />
          <Card className="p-4">
            <h4 className="font-medium mb-2">Fragility Signals</h4>
            {fragility.length === 0 && <p className="text-sm text-muted-foreground">Sem sinais relevantes</p>}
            {fragility.map((s) => (
              <div key={s.signal} className="flex justify-between text-sm py-1">
                <span>{s.signal}</span><Badge variant="outline">{s.score}</Badge>
              </div>
            ))}
          </Card>
          <Card className="p-4">
            <h4 className="font-medium mb-2">Overload Signals</h4>
            {overload.length === 0 && <p className="text-sm text-muted-foreground">Sem sobrecarga</p>}
            {overload.map((s) => (
              <div key={s.signal} className="flex justify-between text-sm py-1">
                <span>{s.signal}</span><Badge variant="outline">{s.score}</Badge>
              </div>
            ))}
          </Card>
        </TabsContent>

        <TabsContent value="forecast" className="grid gap-4 md:grid-cols-2 pt-4">
          <StrategicForecastTimeline title="Crescimento Semântico" series={semanticGrowth} />
          <StrategicForecastTimeline title="Maturidade de Clusters" series={clusterMaturity} />
          <StrategicForecastTimeline title="Pressão de Execução" series={executionPressure} />
          <StrategicForecastTimeline title="Resiliência Semântica" series={semanticResilience} />
        </TabsContent>

        <TabsContent value="scenarios" className="pt-4 space-y-4">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {scenarios.map((s) => <StrategicSimulationScenarioCard key={s.name} scenario={s} />)}
          </div>
          <ScenarioComparisonPanel scenarios={scenarios} />
        </TabsContent>

        <TabsContent value="growth" className="pt-4 grid gap-4 md:grid-cols-2">
          <ProjectionMatrix
            title="Expansão de Autoridade"
            rows={[
              { label: "Autoridade", current: telemetry.averageAuthority, projected: expansion.projectedAuthority },
              { label: "Cobertura", current: telemetry.semantic_coverage_avg, projected: expansion.semanticGrowth },
              { label: "Conectividade", current: telemetry.semantic_connectivity_score, projected: expansion.connectivityGain },
              { label: "Expansão temática", current: telemetry.cluster_growth_score, projected: expansion.thematicExpansion },
            ]}
          />
          <SemanticFutureMap
            coverage={expansion.semanticGrowth}
            connectivity={expansion.connectivityGain}
            clusterGrowth={expansion.thematicExpansion}
            longevity={longevity.longevityScore}
          />
        </TabsContent>

        <TabsContent value="decay" className="pt-4 grid gap-4 md:grid-cols-2">
          <StrategicForecastTimeline title="Decay de Autoridade" series={authorityDecay} />
          <FutureRiskPanel
            decayPressure={collapse.decayPressure}
            executionPressure={overloadSim.overloadScore}
            fragmentation={collapse.fragmentation}
            clusterDependency={dominance.concentration}
            collapseScore={collapse.collapseScore}
          />
        </TabsContent>

        <TabsContent value="resilience" className="pt-4 grid gap-4 md:grid-cols-2">
          <Card className="p-4 space-y-2">
            <h4 className="font-medium">Stress Test</h4>
            <div className="text-sm">Intensidade: {stressIntensity}</div>
            <div className="text-sm">Score: <Badge>{stress.stressScore}</Badge></div>
            <div className="text-sm">Vetor mais fraco: {stress.weakestVector}</div>
            <div className="text-sm">Dano projetado: {stress.projectedDamage}</div>
            <div className="text-sm">Sobrevive: {stress.surviving ? "Sim" : "Não"}</div>
          </Card>
          <Card className="p-4 space-y-2">
            <h4 className="font-medium">Recovery</h4>
            <div className="text-sm">Semanas: {recovery.recoveryWeeks}</div>
            <div className="text-sm">Score: {recovery.recoveryScore}</div>
            <div className="text-sm">Gargalo: {recovery.bottleneck}</div>
          </Card>
        </TabsContent>

        <TabsContent value="commercial" className="pt-4 grid gap-4 md:grid-cols-2">
          <ProjectionMatrix
            title="Projeção Comercial"
            rows={[
              { label: "Intent", current: telemetry.business_intent_score, projected: commercial.intentLift },
              { label: "Conversão", current: telemetry.business_intent_score, projected: commercial.conversionPotential },
              { label: "Hubs", current: telemetry.authority_flow_score, projected: commercial.hubReinforcement },
              { label: "Momentum", current: telemetry.momentum_growth_score, projected: commercial.commercialMomentum },
            ]}
          />
          <StrategicForecastTimeline title="Crescimento de Intent" series={commercialIntent} />
        </TabsContent>

        <TabsContent value="pressure" className="pt-4 grid gap-4 md:grid-cols-2">
          <ProjectionMatrix
            title="Sobrecarga Operacional"
            rows={[
              { label: "Saturação", current: telemetry.saturation_score, projected: overloadSim.saturation },
              { label: "Gargalos", current: telemetry.bottleneck_score, projected: overloadSim.bottleneckPressure },
              { label: "Debt", current: telemetry.operational_debt_score, projected: overloadSim.debtExplosion },
              { label: "Manutenção", current: telemetry.maintenance_pressure_score, projected: overloadSim.maintenanceExplosion },
            ]}
          />
          <StrategicForecastTimeline title="Pressão de Execução Projetada" series={executionPressure} />
        </TabsContent>

        <TabsContent value="compounding" className="pt-4 grid gap-4 md:grid-cols-2">
          <Card className="p-4 space-y-2">
            <h4 className="font-medium">Authority Compounding</h4>
            <div className="text-sm">Autoridade composta: {compounding.compoundAuthority}</div>
            <div className="text-sm">Reforço semântico: {compounding.semanticReinforcement}</div>
            <div className="text-sm">Velocidade de longo prazo: {compounding.longTermVelocity}</div>
            <div className="text-sm">Fator: {compounding.compoundingFactor}x</div>
          </Card>
          <StrategicForecastTimeline title="Crescimento Semântico" series={semanticGrowth} />
        </TabsContent>

        <TabsContent value="collapse" className="pt-4 grid gap-4 md:grid-cols-2">
          <FutureRiskPanel
            decayPressure={collapse.decayPressure}
            executionPressure={overloadSim.overloadScore}
            fragmentation={collapse.fragmentation}
            clusterDependency={dominance.concentration}
            collapseScore={collapse.collapseScore}
          />
          <Card className="p-4 space-y-2">
            <h4 className="font-medium">Cluster Dominance</h4>
            <div className="text-sm">Concentração: {dominance.concentration}</div>
            <div className="text-sm">Risco de centralização: {dominance.centralizationRisk}</div>
            <div className="text-sm">Fragilidade sistêmica: {dominance.systemicFragility}</div>
            <div className="text-sm">Score: {dominance.dominanceScore}</div>
          </Card>
        </TabsContent>

        <TabsContent value="longevity" className="pt-4 grid gap-4 md:grid-cols-2">
          <Card className="p-4 space-y-2">
            <h4 className="font-medium">Cluster Longevity</h4>
            <div className="text-sm">Score: {longevity.longevityScore}</div>
            <div className="text-sm">Semanas projetadas: {longevity.longevityWeeks}</div>
            <div className="text-sm">Outlook: <Badge variant="outline">{longevity.outlook}</Badge></div>
          </Card>
          <SemanticFutureMap
            coverage={expansion.semanticGrowth}
            connectivity={expansion.connectivityGain}
            clusterGrowth={expansion.thematicExpansion}
            longevity={longevity.longevityScore}
          />
        </TabsContent>

        <TabsContent value="outlook" className="pt-4 space-y-4">
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Veredito Executivo</h4>
              <Badge>{verdict.verdict} · {verdict.score}</Badge>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h5 className="text-sm font-medium mb-1">Forças</h5>
                <ul className="text-sm list-disc pl-4 text-muted-foreground">
                  {verdict.strengths.length === 0 && <li>—</li>}
                  {verdict.strengths.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-medium mb-1">Bloqueadores</h5>
                <ul className="text-sm list-disc pl-4 text-muted-foreground">
                  {verdict.blockers.length === 0 && <li>—</li>}
                  {verdict.blockers.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-medium mb-1">Vetores de Crescimento</h5>
                <ul className="text-sm list-disc pl-4 text-muted-foreground">
                  {verdict.growthVectors.length === 0 && <li>—</li>}
                  {verdict.growthVectors.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-medium mb-1">Vetores de Decay</h5>
                <ul className="text-sm list-disc pl-4 text-muted-foreground">
                  {verdict.decayVectors.length === 0 && <li>—</li>}
                  {verdict.decayVectors.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-medium mb-1">Alertas Operacionais</h5>
                <ul className="text-sm list-disc pl-4 text-muted-foreground">
                  {verdict.operationalWarnings.length === 0 && <li>—</li>}
                  {verdict.operationalWarnings.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-medium mb-1">Riscos Semânticos</h5>
                <ul className="text-sm list-disc pl-4 text-muted-foreground">
                  {verdict.semanticRisks.length === 0 && <li>—</li>}
                  {verdict.semanticRisks.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
