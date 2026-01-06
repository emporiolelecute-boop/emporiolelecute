import { Heart, Instagram, Facebook, MapPin, Phone, ExternalLink, Package } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpg";
import { useFooterConfig, defaultFooterConfig } from "@/hooks/useStoreSettings";

const Footer = () => {
  const { data: footerConfig } = useFooterConfig();
  const config = footerConfig || defaultFooterConfig;

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Package': return <Package className="h-3 w-3" />;
      case 'Heart': return <Heart className="h-3 w-3" />;
      case 'ExternalLink': return <ExternalLink className="h-3 w-3" />;
      default: return null;
    }
  };

  const isExternal = (url: string) => url.startsWith('http');

  return (
    <footer id="contato" className="bg-foreground text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <img src={logo} alt="Logo Empório LeleCute" className="h-16 w-auto mb-4 rounded-lg bg-white p-2" />
            <p className="text-primary-foreground/80 text-sm leading-relaxed mb-4">
              {config.brand_description}
            </p>
            <div className="flex gap-3">
              {config.social_links.instagram && (
                <a href={config.social_links.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary-foreground/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {config.social_links.facebook && (
                <a href={config.social_links.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-primary-foreground/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-display text-xl mb-4">Links Úteis</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              {config.useful_links.map((link, index) => (
                <li key={index}>
                  {isExternal(link.url) ? (
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">
                      {getIcon(link.icon)} {link.label} {isExternal(link.url) && <ExternalLink className="h-3 w-3" />}
                    </a>
                  ) : (
                    <Link to={link.url} className="hover:text-primary transition-colors flex items-center gap-2">
                      {getIcon(link.icon)} {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Ocasiões */}
          <div>
            <h3 className="font-display text-xl mb-4">Ocasiões</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              {config.occasions.map((occasion, index) => (
                <li key={index}>
                  <Link to={occasion.url} className="hover:text-primary transition-colors">• {occasion.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-display text-xl mb-4">Contato</h3>
            <ul className="space-y-4 text-sm text-primary-foreground/80">
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <a href={`https://wa.me/55${config.contacts.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">{config.contacts.phone}</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="whitespace-pre-line">{config.contacts.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/60">
          <p>{config.footer_text.replace('{year}', new Date().getFullYear().toString())}</p>
          <p className="mt-2 flex items-center justify-center gap-1">
            {config.made_with_love.includes('❤️') ? (
              config.made_with_love
            ) : (
              <>Feito com <Heart className="h-4 w-4 text-primary fill-primary" /> {config.made_with_love.replace('Feito com', '').trim()}</>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;