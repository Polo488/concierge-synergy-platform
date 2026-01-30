import { Link } from 'react-router-dom';
import logoNoe from '@/assets/logo-noe.jpg';

const footerLinks = {
  product: [
    { name: 'Produit', path: '/produit' },
    { name: 'Modules', path: '/modules' },
    { name: 'Tarifs', path: '/tarifs' },
  ],
  useCases: [
    { name: 'Conciergerie 10-50 lots', path: '/modules' },
    { name: 'Conciergerie 50-300 lots', path: '/modules' },
    { name: 'Property Manager', path: '/modules' },
  ],
  company: [
    { name: 'Sécurité', path: '/securite' },
    { name: 'Contact', path: '/contact' },
  ],
  legal: [
    { name: 'Mentions légales', path: '/mentions-legales' },
    { name: 'Confidentialité', path: '/confidentialite' },
  ],
};

export function EnhancedFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img src={logoNoe} alt="Noé" className="h-8 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Le Channel Manager + PMS pensé pour les conciergeries et property managers.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Produit</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
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

          {/* Use Cases */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Cas d'usage</h4>
            <ul className="space-y-3">
              {footerLinks.useCases.map((link, i) => (
                <li key={i}>
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

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Entreprise</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
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

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Légal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
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

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Noé. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/contact"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Demander une démo
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Connexion
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
