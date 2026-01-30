import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, FileCheck, ArrowRight, Server, Key, History, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const securityPillars = [
  {
    icon: Server,
    title: "Hébergement sécurisé",
    description: "Infrastructure cloud européenne avec chiffrement AES-256 au repos et TLS 1.3 en transit.",
    details: [
      "Datacenter européen (conformité RGPD)",
      "Sauvegardes quotidiennes automatiques",
      "Haute disponibilité 99.9%",
    ],
  },
  {
    icon: Key,
    title: "Gestion des accès",
    description: "Contrôle granulaire des permissions par utilisateur et par rôle.",
    details: [
      "Authentification sécurisée",
      "Rôles personnalisables",
      "Accès par bien / par équipe",
    ],
  },
  {
    icon: History,
    title: "Traçabilité complète",
    description: "Chaque action est enregistrée et consultable.",
    details: [
      "Logs d'actions horodatés",
      "Historique des modifications",
      "Audit trail complet",
    ],
  },
  {
    icon: Globe,
    title: "Conformité RGPD",
    description: "Vos données sont traitées dans le respect de la réglementation européenne.",
    details: [
      "Données hébergées en Europe",
      "Droit à l'effacement respecté",
      "Pas de revente de données",
    ],
  },
];

const trustIndicators = [
  { label: "Chiffrement", value: "AES-256" },
  { label: "Disponibilité", value: "99.9%" },
  { label: "Sauvegardes", value: "Quotidiennes" },
  { label: "Localisation", value: "Europe" },
];

export function EnhancedSecuritySection({ className }: { className?: string }) {
  return (
    <section className={cn("py-20 lg:py-28 bg-muted/30", className)}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-status-success/10 text-status-success text-sm font-medium mb-4">
            Sécurité & Fiabilité
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Vos données, notre priorité
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Noé est construit pour le long terme. Infrastructure robuste, sécurité de niveau professionnel.
          </p>
        </div>

        {/* Trust Indicators Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {trustIndicators.map((indicator, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl border border-border/50 p-6 text-center"
            >
              <p className="text-2xl font-bold text-primary mb-1">{indicator.value}</p>
              <p className="text-sm text-muted-foreground">{indicator.label}</p>
            </div>
          ))}
        </div>

        {/* Security Pillars */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {securityPillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-2xl border border-border/50 p-8 hover:shadow-elevated transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-status-success/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-status-success" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{pillar.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{pillar.description}</p>
                    <ul className="space-y-2">
                      {pillar.details.map((detail, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                          <svg className="w-4 h-4 text-status-success" viewBox="0 0 16 16" fill="none">
                            <path d="M2 8L6 12L14 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual Shield */}
        <div className="relative bg-card rounded-3xl border border-border/50 p-8 lg:p-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-status-success/10 to-transparent rounded-full blur-3xl" />
          
          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Un outil pensé pour durer
              </h3>
              <p className="text-muted-foreground mb-6">
                Noé n'est pas un prototype. C'est une plateforme construite avec les standards 
                de sécurité et de fiabilité des outils professionnels. Votre activité mérite 
                un outil sur lequel vous pouvez compter.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Pas d'expérimentation sur vos données",
                  "Mises à jour sans interruption",
                  "Support réactif et compétent",
                  "Documentation complète",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                    <Shield className="w-5 h-5 text-status-success" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">
                  Demander le dossier sécurité
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="flex justify-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 bg-gradient-to-br from-status-success/20 to-status-success/5 rounded-full animate-pulse" />
                <div className="absolute inset-4 bg-gradient-to-br from-status-success/30 to-status-success/10 rounded-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="w-20 h-20 text-status-success" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
