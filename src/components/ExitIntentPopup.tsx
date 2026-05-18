import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle, Gift, Package, Clock } from "lucide-react";
import { event as trackEvent } from "@/lib/analytics";

interface ExitIntentPopupProps {
  /** Mensagem pronta para o WhatsApp ao clicar no CTA. */
  whatsappUrl: string;
  productName: string;
  productSlug: string;
  minQuantity: number;
  productionDays: number;
  quantity: number;
  personalized: boolean;
  /** Chave usada para evitar reaparição na mesma sessão. */
  storageKey?: string;
  /** Atraso mínimo (ms) antes de armar o gatilho. */
  armDelayMs?: number;
}

const SESSION_FLAG = "__exit_intent_shown__";

export const ExitIntentPopup = ({
  whatsappUrl,
  productName,
  productSlug,
  minQuantity,
  productionDays,
  quantity,
  personalized,
  storageKey = SESSION_FLAG,
  armDelayMs = 8000,
}: ExitIntentPopupProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(storageKey) === "1") return;

    let armed = false;
    const armTimer = window.setTimeout(() => { armed = true; }, armDelayMs);

    const trigger = (reason: "mouse_out" | "scroll_up" | "visibility") => {
      if (!armed) return;
      if (sessionStorage.getItem(storageKey) === "1") return;
      sessionStorage.setItem(storageKey, "1");
      setOpen(true);
      trackEvent("exit_popup_open", {
        reason,
        product_slug: productSlug,
        quantity,
        personalized,
      });
    };

    const onMouseOut = (e: MouseEvent) => {
      if (e.relatedTarget) return;
      if (e.clientY <= 0) trigger("mouse_out");
    };

    let lastY = window.scrollY;
    let lastT = Date.now();
    const onScroll = () => {
      const now = Date.now();
      const dy = window.scrollY - lastY;
      const dt = now - lastT || 1;
      const speed = dy / dt;
      if (window.scrollY > 600 && speed < -1.4) trigger("scroll_up");
      lastY = window.scrollY;
      lastT = now;
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") trigger("visibility");
    };

    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearTimeout(armTimer);
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [storageKey, armDelayMs, productSlug, quantity, personalized]);

  const handleOpenChange = (next: boolean) => {
    if (!next && open) {
      trackEvent("exit_popup_close", { method: "dismiss", product_slug: productSlug });
    }
    setOpen(next);
  };

  const handleWhatsApp = () => {
    trackEvent("exit_popup_whatsapp_click", {
      product_slug: productSlug,
      quantity,
      personalized,
    });
    setOpen(false);
  };

  const handleDismiss = () => {
    trackEvent("exit_popup_close", { method: "continue", product_slug: productSlug });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="mx-auto mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Gift className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center font-display text-2xl">
            Espera! Posso te ajudar com {productName}?
          </DialogTitle>
          <DialogDescription className="text-center">
            Tire dúvidas e receba um orçamento rápido pelo WhatsApp — sem compromisso.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2 my-2">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
            <Package className="h-4 w-4 text-primary shrink-0" />
            <div className="leading-tight">
              <div className="text-[10px] uppercase text-muted-foreground">Mínimo</div>
              <div className="text-sm font-bold text-foreground">{minQuantity} un.</div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
            <Clock className="h-4 w-4 text-primary shrink-0" />
            <div className="leading-tight">
              <div className="text-[10px] uppercase text-muted-foreground">Prazo</div>
              <div className="text-sm font-bold text-foreground">{productionDays} dias</div>
            </div>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground mb-2">
          Vamos enviar seu pedido com{" "}
          <span className="font-semibold text-foreground">{quantity} unidade{quantity > 1 ? "s" : ""}</span>
          {personalized ? " e personalização" : ""}.
        </p>

        <div className="flex flex-col gap-2">
          <Button
            asChild
            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold"
            onClick={handleWhatsApp}
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4 mr-2" />
              Falar no WhatsApp agora
            </a>
          </Button>
          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={handleDismiss}
          >
            Continuar navegando
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
