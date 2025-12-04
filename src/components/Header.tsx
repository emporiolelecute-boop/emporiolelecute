import { useState } from "react";
import { Menu, X, Heart, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import logo from "@/assets/logo.jpg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "#inicio", label: "Início" },
    { href: "#sobre", label: "Sobre" },
    { href: "#produtos", label: "Produtos" },
    { href: "#ocasioes", label: "Ocasiões" },
    { href: "#depoimentos", label: "Depoimentos" },
    { href: "#contato", label: "Contato" },
  ];

  const socialLinks = [
    { href: "https://www.instagram.com/emporiolelecute", icon: Instagram, label: "Instagram" },
    { href: "https://www.facebook.com/emporiolelecute", icon: Facebook, label: "Facebook" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-soft">
      <nav className="container mx-auto px-4 py-3" aria-label="Navegação principal">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a 
            href="#inicio" 
            className="flex items-center gap-2 group"
            aria-label="Empório LeleCute - Página inicial"
          >
            <img 
              src={logo} 
              alt="Logo Empório LeleCute - Ateliê Criativo de Lembrancinhas Artesanais" 
              className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              width="48"
              height="48"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Search Bar */}
            <div className="border-l border-border pl-6">
              <SearchBar />
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  aria-label={link.label}
                >
                  <link.icon className="h-5 w-5" />
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <a
              href="https://wa.me/5541992214299?text=Olá! Vim pelo site e gostaria de saber mais sobre as lembrancinhas personalizadas."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="default" size="sm" className="bg-primary hover:bg-primary-dark text-primary-foreground rounded-full px-6 shadow-soft transition-all duration-300 hover:shadow-medium hover:-translate-y-0.5">
                <Heart className="h-4 w-4 mr-2" />
                Fazer Orçamento
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-medium animate-fade-in">
            <ul className="flex flex-col py-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="block px-6 py-3 text-foreground/80 hover:text-primary hover:bg-primary-light/50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="px-6 pt-4 flex items-center gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={link.label}
                  >
                    <link.icon className="h-5 w-5" />
                  </a>
                ))}
              </li>
              <li className="px-6 pt-4">
                <a
                  href="https://wa.me/5541992214299?text=Olá! Vim pelo site e gostaria de saber mais sobre as lembrancinhas personalizadas."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button variant="default" className="w-full bg-primary hover:bg-primary-dark text-primary-foreground rounded-full">
                    <Heart className="h-4 w-4 mr-2" />
                    Fazer Orçamento
                  </Button>
                </a>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;