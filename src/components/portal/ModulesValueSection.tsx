import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Sparkles, Wrench, MessageCircle, Bell, BarChart3, 
  FileText, Clock, Users, Lightbulb, Package, ArrowRight, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ModuleDetail {
  id: string;
  icon: React.ElementType;
  title: string;
  valueStatement: string;
  solves: string[];
  automates: string[];
  measures: string[];
  useCase: string;
  color: string;
}

const modules: ModuleDetail[] = [
  {
    id: 'calendar',
    icon: Calendar,
    title: 'Calendrier & Planning',
    valueStatement: 'Une vue claire de toutes vos réservations, sur tous vos biens.',
    solves: [
      'Réservations manquées ou en double',
      'Vision floue des disponibilités',
      'Gestion prix/règles complexe',
    ],
    automates: [
      'Synchronisation multi-canaux temps réel',
      'Mise à jour des tarifs par période',
      'Blocages et disponibilités',
    ],
    measures: [
      'Taux d\'occupation par bien',
      'Revenus par période',
      'Durée moyenne des séjours',
    ],
    useCase: 'Une réservation Airbnb arrive → calendrier mis à jour → Booking bloqué automatiquement → équipe notifiée du prochain check-in.',
    color: 'from-primary/10 to-transparent',
  },
  {
    id: 'cleaning',
    icon: Sparkles,
    title: 'Ménage & Repasse',
    valueStatement: 'Chaque départ génère automatiquement les tâches nécessaires.',
    solves: [
      'Oublis de ménage avant arrivée',
      'Coordination équipes terrain difficile',
      'Aucune traçabilité des interventions',
    ],
    automates: [
      'Création tâches à chaque départ',
      'Affectation automatique aux agents',
      'Notifications push aux équipes',
    ],
    measures: [
      'Temps moyen par intervention',
      'Taux de problèmes signalés',
      'Performance par agent',
    ],
    useCase: 'Check-out à 11h → tâche ménage créée → agent notifié → photos validées → bien prêt pour l\'arrivée à 16h.',
    color: 'from-status-success/10 to-transparent',
  },
  {
    id: 'maintenance',
    icon: Wrench,
    title: 'Maintenance & Incidents',
    valueStatement: 'Suivez chaque intervention de la demande à la résolution.',
    solves: [
      'Problèmes non traités ou oubliés',
      'Historique perdu entre interventions',
      'Pas de vision du coût maintenance',
    ],
    automates: [
      'Création ticket depuis messagerie',
      'Assignation au technicien disponible',
      'Alertes délais dépassés',
    ],
    measures: [
      'Délai moyen de résolution',
      'Coût par intervention',
      'Tickets par bien',
    ],
    useCase: 'Voyageur signale fuite → ticket créé automatiquement → technicien notifié → intervention tracée → historique conservé.',
    color: 'from-status-warning/10 to-transparent',
  },
  {
    id: 'messaging',
    icon: MessageCircle,
    title: 'Messagerie Voyageurs',
    valueStatement: 'Tous les messages au même endroit, avec le contexte automatique.',
    solves: [
      'Messages dispersés entre plateformes',
      'Recherche d\'historique impossible',
      'Réponses incohérentes',
    ],
    automates: [
      'Centralisation tous canaux',
      'Affichage contexte réservation',
      'Réponses rapides pré-configurées',
    ],
    measures: [
      'Temps de réponse moyen',
      'Volume par période',
      'Satisfaction voyageur',
    ],
    useCase: 'Message Booking reçu → contexte résa affiché automatiquement → équipe répond avec template → action rapide possible.',
    color: 'from-status-info/10 to-transparent',
  },
  {
    id: 'automation',
    icon: Bell,
    title: 'Communication Intelligente',
    valueStatement: 'Envoyez les bonnes informations au bon moment, automatiquement.',
    solves: [
      'Messages manuels à chaque étape',
      'Oublis d\'envoi instructions',
      'Charge mentale équipe',
    ],
    automates: [
      'Règles d\'envoi par événement',
      'Templates personnalisables',
      'Séquences pré/post séjour',
    ],
    measures: [
      'Messages envoyés automatiquement',
      'Taux d\'ouverture',
      'Demandes évitées',
    ],
    useCase: 'J-1 arrivée → instructions envoyées auto → voyageur reçoit code accès → moins de questions pour votre équipe.',
    color: 'from-nav-experience/10 to-transparent',
  },
  {
    id: 'stats',
    icon: BarChart3,
    title: 'Statistiques & Pilotage',
    valueStatement: 'Des données utiles pour décider, pas des tableaux décoratifs.',
    solves: [
      'Aucune visibilité sur la performance',
      'Décisions à l\'intuition',
      'Reporting manuel chronophage',
    ],
    automates: [
      'Calcul KPIs en temps réel',
      'Alertes seuils dépassés',
      'Exports automatiques',
    ],
    measures: [
      'Occupation, revenus, ADR',
      'Performance ménage & qualité',
      'Analyse géographique',
    ],
    useCase: 'Dashboard temps réel → taux occupation en baisse → alerte automatique → action corrective immédiate.',
    color: 'from-nav-pilotage/10 to-transparent',
  },
  {
    id: 'billing',
    icon: FileText,
    title: 'Facturation',
    valueStatement: 'Générez vos factures en quelques clics, sans ressaisie.',
    solves: [
      'Création factures laborieuse',
      'Erreurs de montants',
      'Suivi paiements manuel',
    ],
    automates: [
      'Génération depuis réservation',
      'Calcul automatique commissions',
      'Envoi par email',
    ],
    measures: [
      'Chiffre d\'affaires facturé',
      'Délai moyen de paiement',
      'Impayés en cours',
    ],
    useCase: 'Séjour terminé → facture générée en 1 clic → montants pré-remplis → envoi direct au propriétaire.',
    color: 'from-nav-revenus/10 to-transparent',
  },
  {
    id: 'moyenne-duree',
    icon: Clock,
    title: 'Moyenne Durée',
    valueStatement: 'Gérez baux, quittances et appels de loyer simplement.',
    solves: [
      'Gestion locataires séparée',
      'Documents manuels à créer',
      'Suivi paiements compliqué',
    ],
    automates: [
      'Génération baux et avenants',
      'Quittances mensuelles auto',
      'Rappels échéances',
    ],
    measures: [
      'Loyers encaissés',
      'Retards de paiement',
      'Taux d\'occupation longue durée',
    ],
    useCase: 'Nouveau locataire → bail généré → quittances automatiques chaque mois → suivi paiements intégré.',
    color: 'from-status-pending/10 to-transparent',
  },
  {
    id: 'users',
    icon: Users,
    title: 'Gestion Utilisateurs',
    valueStatement: 'Chaque profil voit ce dont il a besoin, rien de plus.',
    solves: [
      'Accès trop larges ou trop restreints',
      'Confusion des responsabilités',
      'Pas de traçabilité actions',
    ],
    automates: [
      'Création comptes avec rôles',
      'Affectation biens par utilisateur',
      'Droits granulaires',
    ],
    measures: [
      'Actions par utilisateur',
      'Connexions récentes',
      'Modifications tracées',
    ],
    useCase: 'Nouvel agent terrain → compte créé avec rôle "Ménage" → voit uniquement ses tâches → actions tracées.',
    color: 'from-nav-organisation/10 to-transparent',
  },
  {
    id: 'insights',
    icon: Lightbulb,
    title: 'Insights & Alertes',
    valueStatement: 'Soyez alerté avant que les problèmes ne deviennent critiques.',
    solves: [
      'Problèmes détectés trop tard',
      'Pas de vision proactive',
      'Surveillance manuelle',
    ],
    automates: [
      'Règles d\'alerte personnalisées',
      'Notifications temps réel',
      'Suggestions d\'actions',
    ],
    measures: [
      'Alertes déclenchées',
      'Temps de réaction',
      'Problèmes évités',
    ],
    useCase: 'Taux occupation < 60% → alerte automatique → suggestion ajustement prix → action en 1 clic.',
    color: 'from-primary/10 to-transparent',
  },
  {
    id: 'inventory',
    icon: Package,
    title: 'Inventaire',
    valueStatement: 'Suivez le matériel et les consommables par logement.',
    solves: [
      'Stock inconnu par logement',
      'Réapprovisionnement au dernier moment',
      'Perte de matériel non détectée',
    ],
    automates: [
      'Suivi stock par bien',
      'Alertes seuil bas',
      'Historique mouvements',
    ],
    measures: [
      'Valeur inventaire',
      'Consommation par période',
      'Coût par bien',
    ],
    useCase: 'Stock draps < 2 → alerte créée → réapprovisionnement commandé → stock mis à jour.',
    color: 'from-muted-foreground/10 to-transparent',
  },
];

export function ModulesValueSection({ className }: { className?: string }) {
  const [activeModuleId, setActiveModuleId] = useState(modules[0].id);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Sticky scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      
      for (const module of modules) {
        const element = sectionRefs.current[module.id];
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          const elementTop = window.scrollY + top;
          const elementBottom = window.scrollY + bottom;
          
          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setActiveModuleId(module.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToModule = (moduleId: string) => {
    const element = sectionRefs.current[moduleId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className={cn("py-20 lg:py-28", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Modules
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Chaque module, une valeur concrète
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explorez en détail ce que chaque fonctionnalité apporte à votre quotidien.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sticky Navigation */}
          <div className="lg:col-span-3">
            <nav className="lg:sticky lg:top-24 space-y-1">
              {modules.map((module) => {
                const Icon = module.icon;
                const isActive = activeModuleId === module.id;
                return (
                  <button
                    key={module.id}
                    onClick={() => scrollToModule(module.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium truncate">{module.title}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Module Details */}
          <div className="lg:col-span-9 space-y-16">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <div
                  key={module.id}
                  ref={(el) => { sectionRefs.current[module.id] = el; }}
                  id={module.id}
                  className="scroll-mt-24"
                >
                  <div className={cn(
                    "bg-card rounded-3xl border border-border/50 overflow-hidden",
                    activeModuleId === module.id && "ring-2 ring-primary/20"
                  )}>
                    {/* Header gradient */}
                    <div className={cn(
                      "h-2 bg-gradient-to-r",
                      module.color.replace('to-transparent', 'to-muted')
                    )} />

                    <div className="p-8">
                      {/* Title */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <Icon className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-semibold text-foreground">{module.title}</h3>
                          <p className="text-muted-foreground">{module.valueStatement}</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        {/* Left: Screenshot placeholder */}
                        <div className={cn(
                          "aspect-video bg-gradient-to-br rounded-2xl border border-border/30 flex items-center justify-center",
                          module.color
                        )}>
                          <div className="text-center">
                            <Icon className="w-12 h-12 text-primary/40 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Capture {module.title}</p>
                          </div>
                        </div>

                        {/* Right: Details */}
                        <div className="space-y-6">
                          {/* What you solve */}
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-status-error/10 flex items-center justify-center text-status-error text-xs">✗</span>
                              Ce que vous résolvez
                            </h4>
                            <ul className="space-y-2">
                              {module.solves.map((item, i) => (
                                <li key={i} className="text-sm text-muted-foreground pl-8">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* What you automate */}
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-status-success/10 flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-status-success" />
                              </span>
                              Ce que vous automatisez
                            </h4>
                            <ul className="space-y-2">
                              {module.automates.map((item, i) => (
                                <li key={i} className="text-sm text-foreground pl-8">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* What you measure */}
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-nav-pilotage/10 flex items-center justify-center">
                                <BarChart3 className="w-4 h-4 text-nav-pilotage" />
                              </span>
                              Ce que vous mesurez
                            </h4>
                            <ul className="space-y-2">
                              {module.measures.map((item, i) => (
                                <li key={i} className="text-sm text-foreground pl-8">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Use case */}
                      <div className="mt-8 p-4 bg-muted/50 rounded-xl border border-border/30">
                        <p className="text-sm text-muted-foreground mb-1">Cas d'usage</p>
                        <p className="text-sm text-foreground">{module.useCase}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Button size="lg" asChild>
            <Link to="/contact">
              Voir ces modules en action
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
