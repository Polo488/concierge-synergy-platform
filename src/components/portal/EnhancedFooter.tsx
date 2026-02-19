import { Link } from 'react-router-dom';
import logoNoe from '@/assets/logo-noe.png';

export function EnhancedFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img src={logoNoe} alt="Noé" className="h-7 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Channel Manager pour les professionnels de la location courte durée.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-muted-foreground mb-4">
              Produit
            </p>
            <ul className="space-y-2.5">
              {[
                { name: 'Distribution', path: '/produit' },
                { name: 'Opérations', path: '/modules' },
                { name: 'Tarifs', path: '/tarifs' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-muted-foreground mb-4">
              Entreprise
            </p>
            <ul className="space-y-2.5">
              {[
                { name: 'Sécurité', path: '/securite' },
                { name: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-muted-foreground mb-4">
              Légal
            </p>
            <ul className="space-y-2.5">
              {[
                { name: 'Mentions légales', path: '/mentions-legales' },
                { name: 'Confidentialité', path: '/confidentialite' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Noé
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/contact"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Demander une démo
            </Link>
            <Link
              to="/login"
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Connexion
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
