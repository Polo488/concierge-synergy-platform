import { Link } from 'react-router-dom';
import { Shield, Lock, Server, Clock, Globe, Database, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const securityFeatures = [
  {
    icon: Lock,
    title: 'Chiffrement de bout en bout',
    description: 'Toutes vos données sont chiffrées en transit et au repos. Protocoles TLS 1.3 et AES-256.',
  },
  {
    icon: Shield,
    title: 'Accès sécurisés',
    description: 'Authentification forte, gestion fine des permissions, traçabilité complète des actions.',
  },
  {
    icon: Database,
    title: 'Sauvegardes automatiques',
    description: 'Sauvegardes quotidiennes avec rétention de 30 jours. Restauration possible à tout moment.',
  },
  {
    icon: Globe,
    title: 'Hébergement européen',
    description: 'Serveurs hébergés en Europe, conformité RGPD native, données localisées.',
  },
  {
    icon: Server,
    title: 'Haute disponibilité',
    description: 'Infrastructure redondante, monitoring 24/7, SLA de 99.9% de disponibilité.',
  },
  {
    icon: Clock,
    title: 'Support réactif',
    description: 'Équipe support basée en France, temps de réponse garanti, accompagnement dédié.',
  },
];

const stats = [
  { label: 'Disponibilité', value: '99.9%' },
  { label: 'Chiffrement', value: 'AES-256' },
  { label: 'Sauvegardes', value: 'Quotidiennes' },
  { label: 'Localisation', value: 'Europe' },
];

export default function PortalSecurite() {
  return (
    <div>
      {/* Header */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3 pointer-events-none" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">Sécurité</p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-tight tracking-tight mb-6">
                Vos données sont en sécurité
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Noé est conçu pour gérer des opérations critiques au quotidien. La sécurité et la fiabilité ne sont pas des options.
              </p>
            </div>

            {/* Stats Card */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-3xl blur-2xl opacity-50" />
              <div className="relative bg-card rounded-2xl border border-border/50 p-8 shadow-lg">
                <div className="flex items-center justify-center mb-8">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Shield size={40} className="text-primary" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat) => (
                    <div key={stat.label} className="text-center p-4 rounded-xl bg-muted/50">
                      <div className="text-xl font-bold text-foreground mb-1">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-primary mb-3 tracking-wide uppercase">Nos engagements</p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
              Une infrastructure professionnelle
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Chaque aspect de Noé est pensé pour la sécurité et la fiabilité.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-card rounded-2xl border border-border/50 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* RGPD Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-medium text-primary mb-3 tracking-wide uppercase">Conformité</p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-6">
                Conformité RGPD native
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Noé est conçu dès le départ pour respecter le Règlement Général sur la Protection des Données. Vos données personnelles et celles de vos voyageurs sont traitées avec le plus grand soin.
              </p>
              <ul className="space-y-4">
                {[
                  'Données hébergées exclusivement en Europe',
                  'Droit à l\'effacement respecté',
                  'Portabilité des données garantie',
                  'Transparence sur les traitements',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[hsl(152,50%,45%)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="hsl(152,50%,45%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card rounded-2xl border border-border/50 p-8 shadow-lg">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[hsl(152,50%,45%)]/10 mb-6">
                  <Globe size={32} className="text-[hsl(152,50%,45%)]" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Hébergement européen</h3>
                <p className="text-muted-foreground mb-6">
                  Toutes vos données sont stockées sur des serveurs situés en Europe, conformément aux exigences du RGPD.
                </p>
                <div className="flex items-center justify-center gap-4 pt-6 border-t border-border/50">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">FR</div>
                    <div className="text-xs text-muted-foreground mt-1">France</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">EU</div>
                    <div className="text-xs text-muted-foreground mt-1">Europe</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4">
            Des questions sur la sécurité ?
          </h2>
          <p className="text-muted-foreground mb-8">
            Notre équipe est à votre disposition pour répondre à toutes vos questions.
          </p>
          <Button size="lg" asChild>
            <Link to="/contact">
              Nous contacter
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
