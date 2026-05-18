import { useEffect, useRef } from "react";
import { MessageCircle, Package, Clock, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackFunnelEvent } from "@/lib/analytics";
import { normalizePersonalization, normalizeQuantity } from "@/lib/whatsappTemplate";

interface QuickQuoteSummaryProps {
  minQuantity: number;
  productionDays: number;
  quantity: number;
  personalization?: string;
  onWhatsApp: () => void;
  productSlug?: string;
  enabled?: boolean;
  title?: string;
  minLabel?: string;
  prazoLabel?: string;
  shippingLabel?: string;
  shippingValue?: string;
  ctaLabel?: string;
}

export const QuickQuoteSummary = ({
  minQuantity,
  productionDays,
  quantity,
  personalization,
  onWhatsApp,
  productSlug,
  enabled = true,
  title = "Resumo rápido do pedido",
  minLabel = "Mínimo",
  prazoLabel = "Prazo",
  shippingLabel = "Envio",
  shippingValue = "Brasil",
  ctaLabel = "Pedir orçamento no WhatsApp",
}: QuickQuoteSummaryProps) => {
  const viewedRef = useRef(false);
  useEffect(() => {
    if (!enabled || viewedRef.current) return;
    viewedRef.current = true;
    trackFunnelEvent("pdp_quick_summary_view", { product_slug: productSlug });
  }, [enabled, productSlug]);

  if (!enabled) return null;

  const safeQty = normalizeQuantity(quantity);
  const hasPerson = Boolean(normalizePersonalization(personalization));

  return (
    <section
      aria-label={title}
      className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-6"
    >
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="flex flex-col items-center text-center gap-1">
          <Package className="h-4 w-4 text-primary" />
          <span className="text-[11px] text-muted-foreground leading-tight">{minLabel}</span>
          <span className="text-sm font-bold text-foreground leading-tight">{minQuantity} un.</span>
        </div>
        <div className="flex flex-col items-center text-center gap-1">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-[11px] text-muted-foreground leading-tight">{prazoLabel}</span>
          <span className="text-sm font-bold text-foreground leading-tight">{productionDays} dias</span>
        </div>
        <div className="flex flex-col items-center text-center gap-1">
          <Truck className="h-4 w-4 text-primary" />
          <span className="text-[11px] text-muted-foreground leading-tight">{shippingLabel}</span>
          <span className="text-sm font-bold text-foreground leading-tight">{shippingValue}</span>
        </div>
      </div>

      <div className="text-xs text-muted-foreground mb-3 text-center">
        Você está pedindo{" "}
        <span className="font-semibold text-foreground">
          {safeQty} unidade{safeQty > 1 ? "s" : ""}
        </span>
        {hasPerson ? " com personalização" : ""}.
      </div>

      <Button
        type="button"
        onClick={onWhatsApp}
        className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-lg"
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        {ctaLabel}
      </Button>
    </section>
  );
};
