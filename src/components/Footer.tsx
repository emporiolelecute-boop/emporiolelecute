import { Heart, Instagram, Facebook, MapPin, Phone, Mail, ExternalLink, Package } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpg";

const Footer = () => {
  return (
    <footer id="contato" className="bg-foreground text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <img src={logo} alt="Logo Empório LeleCute" className="h-16 w-auto mb-4 rounded-lg bg-white p-2" />
            <p className="text-primary-foreground/80 text-sm leading-relaxed mb-4">
              Ateliê criativo de lembrancinhas artesanais personalizadas. Sabonetes, velas e presentes feitos com amor.
            </p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/emporiolelecute" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary-foreground/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com/emporiolelecute" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary-foreground/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-display text-xl mb-4">Links Úteis</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li><Link to="/rastrear" className="hover:text-primary transition-colors flex items-center gap-2"><Package className="h-3 w-3" /> Rastrear Pedido</Link></li>
              <li><a href="https://www.elo7.com.br/emporiolelecute" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">Loja no Elo7 <ExternalLink className="h-3 w-3" /></a></li>
              <li><a href="https://emporiolelecute.com.br/loja/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">Loja Virtual <ExternalLink className="h-3 w-3" /></a></li>
              <li><a href="https://br.pinterest.com/emporiolelecute" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">Pinterest <ExternalLink className="h-3 w-3" /></a></li>
            </ul>
          </div>

          {/* Ocasiões */}
          <div>
            <h3 className="font-display text-xl mb-4">Ocasiões</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>• Maternidade & Chá de Bebê</li>
              <li>• Batizado & Primeira Comunhão</li>
              <li>• Casamento & Bodas</li>
              <li>• Aniversário & Festas</li>
              <li>• Eventos Corporativos</li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-display text-xl mb-4">Contato</h3>
            <ul className="space-y-4 text-sm text-primary-foreground/80">
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <a href="https://wa.me/5541992214299" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">(41) 99221-4299</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>São José dos Pinhais, PR<br/>Enviamos para todo o Brasil</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Empório LeleCute. Todos os direitos reservados.</p>
          <p className="mt-2 flex items-center justify-center gap-1">Feito com <Heart className="h-4 w-4 text-primary fill-primary" /> em São José dos Pinhais, PR</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;