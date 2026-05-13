import { Truck, Percent, Headset, CreditCard, MessageCircle, type LucideIcon } from "lucide-react";

const items: { Icon: LucideIcon; title: string; subtitle: string; aria: string }[] = [
  { Icon: Truck, title: "Envio para", subtitle: "Todo o Brasil", aria: "Envio para todo o Brasil" },
  { Icon: Percent, title: "Descontos", subtitle: "3% PIX", aria: "Descontos de 3% no PIX" },
  { Icon: Headset, title: "Atendimento", subtitle: "Personalizado", aria: "Atendimento personalizado" },
  { Icon: CreditCard, title: "Pague com Cartão", subtitle: "Até 3x sem juros", aria: "Pague com cartão em até 3x sem juros" },
];

interface TrustBadgesProps {
  showWhatsApp?: boolean;
  className?: string;
}

const TrustBadges = ({ showWhatsApp = true, className = "" }: TrustBadgesProps) => {
  return (
    <aside
      aria-label="Informações de envio, pagamento e atendimento"
      className={`relative z-10 border-t border-border/50 bg-cream/40 py-6 md:py-8 ${className}`}
    >
      <div className="container mx-auto px-4">
        <ul
          role="list"
          className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6 md:gap-x-8 lg:gap-x-12 items-start"
        >
          {items.map(({ Icon, title, subtitle, aria }, i) => (
            <li
              key={title}
              aria-label={aria}
              className="flex items-center justify-center md:justify-start gap-3 text-foreground animate-fade-in"
              style={{ animationDelay: `${i * 90}ms`, animationFillMode: "backwards" }}
            >
              <Icon className="h-7 w-7 md:h-8 md:w-8 text-primary shrink-0" strokeWidth={1.5} aria-hidden="true" />
              <div className="leading-tight">
                <div className="text-sm md:text-base font-semibold">{title}</div>
                <div className="text-xs md:text-sm text-muted-foreground">{subtitle}</div>
              </div>
            </li>
          ))}
        </ul>

        {showWhatsApp && (
          <div className="mt-6 flex justify-center">
            <a
              href="https://wa.me/5541992214299?text=Ol%C3%A1!%20Gostaria%20de%20um%20atendimento%20personalizado%20do%20Emp%C3%B3rio%20LeleCute."
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar no WhatsApp para atendimento personalizado"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#25D366] text-white text-sm font-semibold shadow-md hover:scale-105 transition-transform"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Atendimento no WhatsApp
            </a>
          </div>
        )}
      </div>
    </aside>
  );
};

export default TrustBadges;
