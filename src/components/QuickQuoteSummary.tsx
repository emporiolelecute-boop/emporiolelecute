import { MessageCircle, Package, Clock, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickQuoteSummaryProps {
  minQuantity: number;
  productionDays: number;
  quantity: number;
  personalization?: string;
  onWhatsApp: () => void;
}

/**
 * Resumo rápido na ProductPage (mínimo, prazo, envio)
 * com CTA de WhatsApp já carregando quantidade + personalização selecionadas.
 */
export const QuickQuoteSummary = ({
  minQuantity,
  productionDays,
  quantity,
  personalization,
  onWhatsApp,
}: QuickQuoteSummaryProps) => {
  return (
    <section
      aria-label="Resumo rápido do pedido"
      className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-6"
    >
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="flex flex-col items-center text-center gap-1">
          <Package className="h-4 w-4 text-primary" />
          <span className="text-[11px] text-muted-foreground leading-tight">Mínimo</span>
          <span className="text-sm font-bold text-foreground leading-tight">{minQuantity} un.</span>
        </div>
        <div className="flex flex-col items-center text-center gap-1">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-[11px] text-muted-foreground leading-tight">Prazo</span>
          <span className="text-sm font-bold text-foreground leading-tight">{productionDays} dias</span>
        </div>
        <div className="flex flex-col items-center text-center gap-1">
          <Truck className="h-4 w-4 text-primary" />
          <span className="text-[11px] text-muted-foreground leading-tight">Envio</span>
          <span className="text-sm font-bold text-foreground leading-tight">Brasil</span>
        </div>
      </div>

      <div className="text-xs text-muted-foreground mb-3 text-center">
        Você está pedindo{" "}
        <span className="font-semibold text-foreground">{quantity} unidade{quantity > 1 ? "s" : ""}</span>
        {personalization?.trim() ? " com personalização" : ""}.
      </div>

      <Button
        type="button"
        onClick={onWhatsApp}
        className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-lg"
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        Pedir orçamento no WhatsApp
      </Button>
    </section>
  );
};
