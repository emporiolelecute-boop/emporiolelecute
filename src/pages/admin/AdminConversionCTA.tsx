import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, MessageCircle, Save, RotateCcw } from "lucide-react";
import {
  useConversionCtaConfig,
  useSaveConversionCtaConfig,
  DEFAULT_CONVERSION_CTA,
  type ConversionCtaConfig,
} from "@/hooks/useConversionCtaConfig";
import { renderWhatsAppMessage } from "@/lib/whatsappTemplate";

const PREVIEW_VARS = {
  productName: "Sabonete artesanal lavanda",
  productSlug: "sabonete-lavanda",
  link: "https://emporiolelecute.com.br/produtos/sabonete-lavanda",
  quantity: 30,
  personalization: "Nome: Maria · Cor da fita: rosa",
  price: "R$ 12,90",
  imageUrl: "https://emporiolelecute.com.br/img/sabonete.jpg",
  category: "Sabonetes",
  occasion: "Casamento",
  segment: "Lembrancinhas",
};

export default function AdminConversionCTA() {
  const { data, isLoading } = useConversionCtaConfig();
  const saveMut = useSaveConversionCtaConfig();
  const [draft, setDraft] = useState<ConversionCtaConfig | null>(null);

  useEffect(() => {
    if (data && !draft) setDraft(data);
  }, [data, draft]);

  if (isLoading || !draft) {
    return (
      <div className="p-8 flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Carregando configurações…
      </div>
    );
  }

  const update = <K extends keyof ConversionCtaConfig>(key: K, patch: Partial<ConversionCtaConfig[K]>) =>
    setDraft((d) => (d ? { ...d, [key]: { ...d[key], ...patch } } : d));

  const handleSave = async () => {
    if (!draft) return;
    try {
      await saveMut.mutateAsync(draft);
      toast.success("Configurações salvas com sucesso.");
    } catch (e: any) {
      toast.error(e?.message || "Erro ao salvar configurações.");
    }
  };

  const handleReset = () => {
    setDraft(DEFAULT_CONVERSION_CTA);
    toast.message("Valores padrão restaurados (clique em salvar para aplicar).");
  };

  const previewMessage = renderWhatsAppMessage(draft.whatsappTemplate.template, PREVIEW_VARS);

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-primary" /> CTA & Conversão (PDP)
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Controle 100% dos elementos de conversão da página de produto: CTA sticky no mobile,
            resumo rápido, popup de saída, template do WhatsApp e toast de confirmação.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-1" /> Padrões
          </Button>
          <Button onClick={handleSave} disabled={saveMut.isPending}>
            {saveMut.isPending ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
            Salvar
          </Button>
        </div>
      </header>

      {/* Sticky CTA */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Sticky CTA (mobile)</CardTitle>
              <CardDescription>Botão fixo no rodapé que aparece após o usuário rolar a página.</CardDescription>
            </div>
            <Switch
              checked={draft.sticky.enabled}
              onCheckedChange={(v) => update("sticky", { enabled: v })}
            />
          </div>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Texto do botão</Label>
            <Input
              value={draft.sticky.buttonLabel}
              onChange={(e) => update("sticky", { buttonLabel: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label>Gatilho de scroll (fração da viewport)</Label>
            <Input
              type="number"
              step="0.05"
              min={0.1}
              max={1}
              value={draft.sticky.scrollViewportRatio}
              onChange={(e) => update("sticky", { scrollViewportRatio: Number(e.target.value) })}
            />
            <p className="text-xs text-muted-foreground">0.7 = aparece após rolar ~70% da altura da tela.</p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Resumo rápido (Quick Summary)</CardTitle>
              <CardDescription>Bloco com mínimo, prazo e envio + botão WhatsApp já com quantidade/personalização.</CardDescription>
            </div>
            <Switch
              checked={draft.quickSummary.enabled}
              onCheckedChange={(v) => update("quickSummary", { enabled: v })}
            />
          </div>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <Field label="Título" value={draft.quickSummary.title} onChange={(v) => update("quickSummary", { title: v })} />
          <Field label="CTA" value={draft.quickSummary.ctaLabel} onChange={(v) => update("quickSummary", { ctaLabel: v })} />
          <Field label="Label mínimo" value={draft.quickSummary.minLabel} onChange={(v) => update("quickSummary", { minLabel: v })} />
          <Field label="Label prazo" value={draft.quickSummary.prazoLabel} onChange={(v) => update("quickSummary", { prazoLabel: v })} />
          <Field label="Label envio" value={draft.quickSummary.shippingLabel} onChange={(v) => update("quickSummary", { shippingLabel: v })} />
          <Field label="Valor envio" value={draft.quickSummary.shippingValue} onChange={(v) => update("quickSummary", { shippingValue: v })} />
        </CardContent>
      </Card>

      {/* Exit Popup */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Exit Intent Popup</CardTitle>
              <CardDescription>Popup ao detectar intenção de saída (mouse no topo / scroll-up rápido / aba oculta).</CardDescription>
            </div>
            <Switch
              checked={draft.exitPopup.enabled}
              onCheckedChange={(v) => update("exitPopup", { enabled: v })}
            />
          </div>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <Field label="Título" value={draft.exitPopup.title} onChange={(v) => update("exitPopup", { title: v })} />
          <Field label="CTA" value={draft.exitPopup.ctaLabel} onChange={(v) => update("exitPopup", { ctaLabel: v })} />
          <div className="sm:col-span-2 space-y-1">
            <Label>Descrição</Label>
            <Textarea
              rows={3}
              value={draft.exitPopup.description}
              onChange={(e) => update("exitPopup", { description: e.target.value })}
            />
          </div>
          <Field label="Botão recusar" value={draft.exitPopup.dismissLabel} onChange={(v) => update("exitPopup", { dismissLabel: v })} />
          <div className="grid grid-cols-3 gap-2 sm:col-span-2">
            <div className="space-y-1">
              <Label>Máx/sessão</Label>
              <Input
                type="number" min={1} max={5}
                value={draft.exitPopup.maxPerSession}
                onChange={(e) => update("exitPopup", { maxPerSession: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label>Cooldown (min)</Label>
              <Input
                type="number" min={1} max={720}
                value={draft.exitPopup.cooldownMinutes}
                onChange={(e) => update("exitPopup", { cooldownMinutes: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label>Arm delay (ms)</Label>
              <Input
                type="number" min={0} max={60000} step={500}
                value={draft.exitPopup.armDelayMs}
                onChange={(e) => update("exitPopup", { armDelayMs: Number(e.target.value) })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Template */}
      <Card>
        <CardHeader>
          <CardTitle>Template da mensagem WhatsApp</CardTitle>
          <CardDescription>
            Use as variáveis: <code>{"{produto} {qtd} {preco} {link} {categoria} {ocasiao} {contexto} {personalizacao_linha} {imagem_linha}"}</code>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            rows={10}
            className="font-mono text-xs"
            value={draft.whatsappTemplate.template}
            onChange={(e) => update("whatsappTemplate", { template: e.target.value })}
          />
          <Separator />
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Pré-visualização (dados de exemplo)</Label>
            <pre className="rounded-md border bg-muted/40 p-3 text-xs whitespace-pre-wrap break-words">
{previewMessage}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Toast */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Toast de confirmação</CardTitle>
              <CardDescription>Aparece após o clique no WhatsApp para confirmar a ação.</CardDescription>
            </div>
            <Switch
              checked={draft.toast.enabled}
              onCheckedChange={(v) => update("toast", { enabled: v })}
            />
          </div>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-1">
            <Label>Mensagem</Label>
            <Input value={draft.toast.message} onChange={(e) => update("toast", { message: e.target.value })} />
          </div>
          <div className="space-y-1">
            <Label>Duração (ms)</Label>
            <Input
              type="number" min={1000} max={15000} step={500}
              value={draft.toast.durationMs}
              onChange={(e) => update("toast", { durationMs: Number(e.target.value) })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
