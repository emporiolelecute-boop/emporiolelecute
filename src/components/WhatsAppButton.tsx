import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/5541992214299?text=Olá! Vim pelo site e gostaria de saber mais sobre as lembrancinhas personalizadas."
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Contato via WhatsApp"
    >
      <div className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
        <MessageCircle className="h-8 w-8 text-white" />
      </div>
      <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-bold animate-pulse">1</span>
    </a>
  );
};

export default WhatsAppButton;