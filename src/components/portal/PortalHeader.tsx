import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import logoNoe from '@/assets/logo-noe.png';

const navLinks = [
  { name: 'Produit', path: '/produit' },
  { name: 'Tarifs', path: '#pricing' },
  { name: 'Sécurité', path: '/securite' },
  { name: 'Contact', path: '/contact' },
];

export function PortalHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? 'bg-background/80 backdrop-blur-2xl border-b border-border/20'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <img src={logoNoe} alt="Noé" className="h-6 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-3.5 py-2 text-[13px] font-medium rounded-lg transition-all duration-200',
                  location.pathname === link.path
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-[13px] h-9 rounded-lg text-muted-foreground" asChild>
              <Link to="/login">Connexion</Link>
            </Button>
            <Button size="sm" className="text-[13px] h-9 rounded-lg px-5" asChild>
              <Link to="/contact">Démo</Link>
            </Button>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent/40 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-2xl border-b border-border/20">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                  location.pathname === link.path
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 mt-2 border-t border-border/20 flex items-center gap-2">
              <Button variant="ghost" size="sm" className="flex-1" asChild>
                <Link to="/login">Connexion</Link>
              </Button>
              <Button size="sm" className="flex-1" asChild>
                <Link to="/contact">Démo</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
