import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { BarChart3, Activity, Sparkles, Euro, Map, TrendingUp, Target, Eye, Lightbulb } from 'lucide-react';
import { StatsPreview } from './previews/StatsPreview';
import { GeoPreview } from './previews/GeoPreview';

interface StatsTab {
  id: string;
  icon: React.ElementType;
  label: string;
  title: string;
  description: string;
  insight: string;
  color: string;
}

const statsTabs: StatsTab[] = [
  {
    id: 'overview',
    icon: BarChart3,
    label: 'Vue d\'ensemble',
    title: 'Tout voir en un coup d\'œil',
    description: 'Occupation, revenus, tendances : les chiffres clés de votre activité, sans avoir à chercher.',
    insight: 'Comparez vos performances d\'un mois à l\'autre, repérez les anomalies instantanément.',
    color: 'text-primary',
  },
  {
    id: 'activity',
    icon: Activity,
    label: 'Activité',
    title: 'Le pouls de votre parc',
    description: 'Check-ins, check-outs, durées de séjour, répartition par canal. Tout ce qui bouge, en temps réel.',
    insight: 'Identifiez vos périodes creuses et vos pics pour mieux anticiper.',
    color: 'text-status-info',
  },
  {
    id: 'cleaning',
    icon: Sparkles,
    label: 'Ménage',
    title: 'La qualité, ça se mesure',
    description: 'Taux de repasse, temps d\'intervention, performance par agent. Vous savez enfin où ça coince.',
    insight: 'Un bien avec 15% de repasses cache souvent un problème récurrent.',
    color: 'text-status-success',
  },
  {
    id: 'finance',
    icon: Euro,
    label: 'Finance',
    title: 'Savoir si ça tourne bien',
    description: 'Revenus par bien, ADR, RevPAR, évolution mensuelle. Les indicateurs qui comptent vraiment.',
    insight: 'Votre T3 Bellecour rapporte 2x plus par nuit que la moyenne du parc.',
    color: 'text-nav-revenus',
  },
  {
    id: 'geo',
    icon: Map,
    label: 'Analyse géo',
    title: 'Voir où ça performe',
    description: 'Carte de votre parc, heatmap d\'occupation, filtres par ville et quartier. La géographie de vos revenus.',
    insight: 'La Presqu\'île concentre 60% de vos revenus avec seulement 3 biens.',
    color: 'text-status-warning',
  },
];

export function StatsShowcaseSection({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState('overview');
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const currentTab = statsTabs.find(t => t.id === activeTab) || statsTabs[0];

  return (
    <section ref={sectionRef} id="stats-showcase" className={cn("py-20 lg:py-28 bg-gradient-to-b from-background to-muted/30", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div 
          className={cn(
            "text-center mb-12 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nav-pilotage/10 text-nav-pilotage text-sm font-medium mb-4">
            <Target className="w-4 h-4" />
            L'avantage décisif
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            Des stats qui servent à décider
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Les stats ne servent pas à faire joli. Elles servent à comprendre, ajuster, performer.
          </p>
        </div>

        {/* Value proposition cards */}
        <div 
          className={cn(
            "grid md:grid-cols-3 gap-4 mb-12 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: '200ms' }}
        >
          {[
            { icon: Eye, title: 'Voir ce qui compte', text: 'Fini les tableaux Excel illisibles. L\'essentiel en un coup d\'œil.' },
            { icon: Lightbulb, title: 'Comprendre pourquoi', text: 'Pas juste des chiffres : des insights actionnables.' },
            { icon: TrendingUp, title: 'Décider mieux', text: 'Moins d\'intuition, plus de décisions éclairées.' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-start gap-4 p-5 bg-card rounded-xl border border-border/50">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Tabs */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Tabs sidebar */}
          <div 
            className={cn(
              "lg:col-span-4 transition-all duration-700",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            )}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="bg-card rounded-2xl border border-border/50 p-2 sticky top-24">
              {statsTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-300",
                      isActive 
                        ? "bg-primary/10 border border-primary/20" 
                        : "hover:bg-muted/50"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                      isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "font-medium transition-colors",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {tab.label}
                      </p>
                      {isActive && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {tab.title}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview + Description */}
          <div 
            className={cn(
              "lg:col-span-8 space-y-6 transition-all duration-700",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            )}
            style={{ transitionDelay: '400ms' }}
          >
            {/* Preview */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 rounded-3xl blur-xl opacity-50" />
              {activeTab === 'geo' ? (
                <GeoPreview className="relative" />
              ) : (
                <StatsPreview className="relative" />
              )}
            </div>

            {/* Description card */}
            <div className="bg-card rounded-xl border border-border/50 p-6">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {currentTab.title}
              </h3>
              <p className="text-muted-foreground mb-4">
                {currentTab.description}
              </p>
              
              {/* Insight */}
              <div className="flex items-start gap-3 p-4 bg-status-success/10 rounded-xl border border-status-success/20">
                <div className="w-8 h-8 rounded-lg bg-status-success/20 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-4 h-4 text-status-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-0.5">Exemple d'insight</p>
                  <p className="text-sm text-muted-foreground">{currentTab.insight}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom message */}
        <div 
          className={cn(
            "text-center mt-16 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: '600ms' }}
        >
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            <span className="text-foreground font-medium">"On ne prend pas les décisions à votre place.</span><br />
            On vous donne juste les bonnes infos, au bon moment."
          </p>
        </div>
      </div>
    </section>
  );
}
