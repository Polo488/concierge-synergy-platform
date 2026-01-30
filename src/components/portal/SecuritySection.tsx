import { Shield, Lock, Server, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Lock,
    title: 'Vos données vous appartiennent',
    description: 'Chiffrement de bout en bout, accès restreint, et possibilité d\'export à tout moment.',
  },
  {
    icon: Shield,
    title: 'Des accès maîtrisés',
    description: 'Gestion fine des permissions, authentification sécurisée, traçabilité des actions.',
  },
  {
    icon: Server,
    title: 'Infrastructure professionnelle',
    description: 'Hébergement européen, sauvegardes automatiques, disponibilité garantie.',
  },
  {
    icon: Clock,
    title: 'Pensé pour durer',
    description: 'Architecture robuste, évolutions régulières, support réactif.',
  },
];

export function SecuritySection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <p className="text-sm font-medium text-primary mb-3 tracking-wide uppercase">Sécurité & Fiabilité</p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground leading-tight tracking-tight mb-6">
              Un outil conçu pour le professionnel
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Noé est construit pour gérer des opérations critiques au quotidien. Pas d'expérimentation, pas de compromis sur la fiabilité.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-3xl blur-2xl opacity-50" />
            <div className="relative bg-card rounded-2xl border border-border/50 p-8 shadow-lg">
              {/* Security badges */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                  <Shield size={32} className="text-primary" />
                </div>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-2">Infrastructure sécurisée</h3>
                <p className="text-sm text-muted-foreground">Hébergé en Europe, conforme RGPD</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-muted/50">
                  <div className="text-2xl font-bold text-foreground mb-1">99.9%</div>
                  <div className="text-xs text-muted-foreground">Disponibilité</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted/50">
                  <div className="text-2xl font-bold text-foreground mb-1">256-bit</div>
                  <div className="text-xs text-muted-foreground">Chiffrement</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted/50">
                  <div className="text-2xl font-bold text-foreground mb-1">24h</div>
                  <div className="text-xs text-muted-foreground">Sauvegardes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
