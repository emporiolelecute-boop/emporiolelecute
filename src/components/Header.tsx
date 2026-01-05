import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Heart, Instagram, Facebook, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import { useCart } from "@/contexts/CartContext";
import logo from "@/assets/logo.jpg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const navLinks = [
    { href: "/sobre", section: null, label: "Sobre" },
    { href: "/produtos", section: null, label: "Produtos" },
    { href: "/ocasioes", section: null, label: "Ocasiões" },
    { href: "/depoimentos", section: null, label: "Depoimentos" },
    { href: "/contato", section: null, label: "Contato" },
  ];


  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: { href: string; section: string | null }) => {
    e.preventDefault();
    setIsMenuOpen(false);
    navigate(link.href);
  };

  const socialLinks = [
    { href: "https://www.instagram.com/emporiolelecute", icon: Instagram, label: "Instagram" },
    { href: "https://www.facebook.com/emporiolelecute", icon: Facebook, label: "Facebook" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-soft">
      <nav className="container mx-auto px-4 py-3" aria-label="Navegação principal">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/"
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
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link)}
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

            {/* Cart Icon */}
            <Link 
              to="/carrinho" 
              className="relative p-2 text-foreground/80 hover:text-primary transition-colors"
              aria-label="Carrinho de compras"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

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
                    onClick={(e) => handleNavClick(e, link)}
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
                <Link 
                  to="/carrinho" 
                  className="relative p-2 text-foreground/80 hover:text-primary transition-colors ml-auto"
                  aria-label="Carrinho de compras"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )}
                </Link>
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