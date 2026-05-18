import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const KEY = "conversion_cta_config";

export interface StickyCtaConfig {
  enabled: boolean;
  buttonLabel: string;
  /** Threshold proporcional à viewport (0–1). Fallback se IntersectionObserver não disparar. */
  scrollViewportRatio: number;
}

export interface QuickSummaryConfig {
  enabled: boolean;
  title: string;
  minLabel: string;
  prazoLabel: string;
  shippingLabel: string;
  shippingValue: string;
  ctaLabel: string;
}

export interface ExitPopupConfig {
  enabled: boolean;
  title: string;
  description: string;
  ctaLabel: string;
  dismissLabel: string;
  /** Máximo de exibições por sessão. */
  maxPerSession: number;
  /** Tempo mínimo (min) entre exibições. */
  cooldownMinutes: number;
  /** Atraso (ms) antes de armar o gatilho. */
  armDelayMs: number;
}

export interface WhatsAppTemplateConfig {
  /**
   * Template com placeholders: {produto} {qtd} {personalizacao} {preco} {link} {categoria} {ocasiao} {imagem}
   * Personalização e contexto são opcionais — linhas vazias são removidas.
   */
  template: string;
}

export interface ToastConfig {
  enabled: boolean;
  message: string;
  durationMs: number;
}

export interface ConversionCtaConfig {
  sticky: StickyCtaConfig;
  quickSummary: QuickSummaryConfig;
  exitPopup: ExitPopupConfig;
  whatsappTemplate: WhatsAppTemplateConfig;
  toast: ToastConfig;
}

export const DEFAULT_CONVERSION_CTA: ConversionCtaConfig = {
  sticky: {
    enabled: true,
    buttonLabel: "WhatsApp",
    scrollViewportRatio: 0.7,
  },
  quickSummary: {
    enabled: true,
    title: "Resumo rápido do pedido",
    minLabel: "Mínimo",
    prazoLabel: "Prazo",
    shippingLabel: "Envio",
    shippingValue: "Brasil",
    ctaLabel: "Pedir orçamento no WhatsApp",
  },
  exitPopup: {
    enabled: true,
    title: "Espera! Posso te ajudar?",
    description:
      "Antes de sair, fale com a gente no WhatsApp — respondemos rapidinho com valor, prazo e personalização.",
    ctaLabel: "Falar no WhatsApp",
    dismissLabel: "Continuar navegando",
    maxPerSession: 1,
    cooldownMinutes: 30,
    armDelayMs: 8000,
  },
  whatsappTemplate: {
    template:
      "Olá! Tenho interesse no produto *{produto}*.{contexto}\n\n📝 *Detalhes:*\n- Quantidade: {qtd} unidades\n{personalizacao_linha}- Link: {link}{imagem_linha}\n\nPoderia me ajudar com o valor do frete e prazos?",
  },
  toast: {
    enabled: true,
    message: "Abrindo o WhatsApp… se não abrir automaticamente, verifique o popup do navegador.",
    durationMs: 4000,
  },
};

function mergeConfig(raw: any): ConversionCtaConfig {
  const r = (raw || {}) as Partial<ConversionCtaConfig>;
  return {
    sticky: { ...DEFAULT_CONVERSION_CTA.sticky, ...(r.sticky || {}) },
    quickSummary: { ...DEFAULT_CONVERSION_CTA.quickSummary, ...(r.quickSummary || {}) },
    exitPopup: { ...DEFAULT_CONVERSION_CTA.exitPopup, ...(r.exitPopup || {}) },
    whatsappTemplate: { ...DEFAULT_CONVERSION_CTA.whatsappTemplate, ...(r.whatsappTemplate || {}) },
    toast: { ...DEFAULT_CONVERSION_CTA.toast, ...(r.toast || {}) },
  };
}

export const useConversionCtaConfig = () =>
  useQuery({
    queryKey: ["store_settings", KEY],
    staleTime: 60_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("store_settings")
        .select("value")
        .eq("key", KEY)
        .maybeSingle();
      if (error) throw error;
      return mergeConfig(data?.value);
    },
  });

export const useSaveConversionCtaConfig = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (cfg: ConversionCtaConfig) => {
      // sanity clamps
      const safe: ConversionCtaConfig = {
        ...cfg,
        sticky: {
          ...cfg.sticky,
          buttonLabel: (cfg.sticky.buttonLabel || "").slice(0, 40),
          scrollViewportRatio: Math.min(1, Math.max(0.1, Number(cfg.sticky.scrollViewportRatio) || 0.7)),
        },
        exitPopup: {
          ...cfg.exitPopup,
          maxPerSession: Math.max(1, Math.min(5, Math.floor(Number(cfg.exitPopup.maxPerSession) || 1))),
          cooldownMinutes: Math.max(1, Math.min(720, Math.floor(Number(cfg.exitPopup.cooldownMinutes) || 30))),
          armDelayMs: Math.max(0, Math.min(60_000, Math.floor(Number(cfg.exitPopup.armDelayMs) || 8000))),
        },
        whatsappTemplate: {
          template: (cfg.whatsappTemplate.template || "").slice(0, 2000),
        },
        toast: {
          ...cfg.toast,
          message: (cfg.toast.message || "").slice(0, 200),
          durationMs: Math.max(1000, Math.min(15_000, Math.floor(Number(cfg.toast.durationMs) || 4000))),
        },
      };
      const { data: existing } = await supabase
        .from("store_settings")
        .select("id")
        .eq("key", KEY)
        .maybeSingle();
      if (existing) {
        const { error } = await supabase
          .from("store_settings")
          .update({ value: safe as any })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("store_settings")
          .insert({ key: KEY, value: safe as any });
        if (error) throw error;
      }
      return safe;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["store_settings", KEY] }),
  });
};
