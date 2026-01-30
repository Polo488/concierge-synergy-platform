import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, MessageCircle, BarChart3, CheckCircle2, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const demoOutcomes = [
  {
    icon: CheckCircle2,
    title: "Audit express de vos process",
    description: "On analyse ensemble comment vous travaillez aujourd'hui.",
  },
  {
    icon: BarChart3,
    title: "Projection sur vos besoins",
    description: "On identifie ce qui peut être amélioré avec Noé.",
  },
  {
    icon: FileText,
    title: "Plan de déploiement",
    description: "On définit les étapes pour une mise en place réussie.",
  },
];

export function EnhancedContactSection({ className }: { className?: string }) {
  return (
    <section className={cn("py-20 lg:py-28", className)}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Form */}
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Contact
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
              Parlons de votre conciergerie
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              30 minutes pour comprendre vos enjeux et voir si Noé peut vous aider.
            </p>

            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Prénom & Nom
                  </label>
                  <input
                    type="text"
                    placeholder="Marie Dupont"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email professionnel
                  </label>
                  <input
                    type="email"
                    placeholder="marie@conciergerie.com"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nom de la société
                  </label>
                  <input
                    type="text"
                    placeholder="Conciergerie Côte d'Azur"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nombre de logements
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  >
                    <option value="">Sélectionner</option>
                    <option value="1-10">1 - 10</option>
                    <option value="10-30">10 - 30</option>
                    <option value="30-50">30 - 50</option>
                    <option value="50-100">50 - 100</option>
                    <option value="100-200">100 - 200</option>
                    <option value="200+">200+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Comment pouvons-nous vous aider ?
                </label>
                <textarea
                  rows={4}
                  placeholder="Décrivez brièvement votre situation actuelle et vos besoins..."
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                />
              </div>

              <Button size="lg" className="w-full sm:w-auto">
                Demander une démo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <p className="text-xs text-muted-foreground">
                En soumettant ce formulaire, vous acceptez d'être contacté par notre équipe. 
                Vos données sont traitées conformément à notre politique de confidentialité.
              </p>
            </form>
          </div>

          {/* Right: Demo Outcomes */}
          <div className="lg:pt-16">
            <div className="bg-card rounded-3xl border border-border/50 p-8">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Ce que vous obtiendrez en démo
              </h3>

              <div className="space-y-6 mb-8">
                {demoOutcomes.map((outcome, index) => {
                  const Icon = outcome.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground mb-1">{outcome.title}</h4>
                        <p className="text-sm text-muted-foreground">{outcome.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-6 border-t border-border/50">
                <p className="text-sm text-muted-foreground mb-4">
                  La démo dure environ 30 minutes. Vous pouvez inviter vos associés ou collaborateurs.
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-status-success/20 border-2 border-card flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-status-success" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-status-info/20 border-2 border-card flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-status-info" />
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    +150 conciergeries accompagnées
                  </span>
                </div>
              </div>
            </div>

            {/* Trust badge */}
            <div className="mt-6 p-4 bg-muted/50 rounded-2xl border border-border/30 text-center">
              <p className="text-sm text-muted-foreground">
                <span className="text-status-success">✓</span> Sans engagement 
                <span className="mx-2">•</span> 
                <span className="text-status-success">✓</span> Réponse sous 24h
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
