import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle, Gift } from "lucide-react";

interface ExitIntentPopupProps {
  /** Mensagem pronta para o WhatsApp ao clicar no CTA. */
  whatsappUrl: string;
  /** Chave usada para evitar reaparição na mesma sessão. */
  storageKey?: string;
  /** Atraso mínimo (ms) antes de armar o gatilho. */
  armDelayMs?: number;
}

const SESSION_FLAG = "__exit_intent_shown__";

export const ExitIntentPopup = ({
  whatsappUrl,
  storageKey = SESSION_FLAG,
  armDelayMs = 8000,
}: ExitIntentPopupProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(storageKey) === "1") return;

    let armed = false;
    const armTimer = window.setTimeout(() => { armed = true; }, armDelayMs);

    const trigger = () => {
      if (!armed) return;
      if (sessionStorage.getItem(storageKey) === "1") return;
      sessionStorage.setItem(storageKey, "1");
      setOpen(true);
    };

    // Desktop: cursor sai pelo topo
    const onMouseOut = (e: MouseEvent) => {
      if (e.relatedTarget) return;
      if (e.clientY <= 0) trigger();
    };

    // Mobile: scroll rápido para cima OU mudança de visibilidade
    let lastY = window.scrollY;
    let lastT = Date.now();
    const onScroll = () => {
      const now = Date.now();
      const dy = window.scrollY - lastY;
      const dt = now - lastT || 1;
      const speed = dy / dt; // px/ms (negativo = subindo)
      if (window.scrollY > 600 && speed < -1.4) trigger();
      lastY = window.scrollY;
      lastT = now;
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") trigger();
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
  }, [storageKey, armDelayMs]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="mx-auto mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Gift className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center font-display text-2xl">
            Espera! Posso te ajudar?
          </DialogTitle>
          <DialogDescription className="text-center">
            Tire dúvidas e receba um orçamento rápido pelo WhatsApp — sem compromisso.
            Atendimento humano em poucos minutos.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 mt-2">
          <Button
            asChild
            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold"
            onClick={() => setOpen(false)}
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4 mr-2" />
              Falar no WhatsApp agora
            </a>
          </Button>
          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={() => setOpen(false)}
          >
            Continuar navegando
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
