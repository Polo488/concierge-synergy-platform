import { Link } from 'react-router-dom';
import {
  Calendar,
  Sparkles,
  Wrench,
  BarChart3,
  Clock,
  Receipt,
  MessageCircle,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModuleCard } from '@/components/portal/ModuleCard';

export default function PortalModules() {
  const modules = [
    {
      icon: Calendar,
      title: 'Calendrier et planning',
      subtitle: 'Tout voir, tout comprendre, sans surcharger vos équipes.',
      benefits: [
        'Vue multi-propriétés claire et intuitive',
        'Synchronisation automatique avec les plateformes',
        'Gestion des prix et disponibilités',
      ],
      details:
        'Le calendrier de Noé est pensé pour le quotidien. Vos équipes voient exactement ce qu\'elles doivent savoir, sans information superflue. Les réservations se synchronisent en temps réel avec toutes vos plateformes.',
    },
    {
      icon: Sparkles,
      title: 'Ménage',
      subtitle: 'Chaque intervention est tracée. Chaque problème est visible.',
      benefits: [
        'Planning automatique basé sur les réservations',
        'Attribution intelligente aux agents',
        'Suivi qualité avec photos et rapports',
      ],
      details:
        'Fini les oublis et les doubles interventions. Le module ménage génère automatiquement les tâches en fonction de vos réservations et les assigne à vos équipes terrain.',
    },
    {
      icon: Wrench,
      title: 'Maintenance',
      subtitle: 'Anticipez les problèmes. Réagissez vite.',
      benefits: [
        'Signalement et suivi des interventions',
        'Historique complet par logement',
        'Alertes et rappels automatiques',
      ],
      details:
        'Centralisez tous les problèmes techniques et suivez leur résolution. L\'historique complet de chaque logement vous aide à prendre les bonnes décisions d\'investissement.',
    },
    {
      icon: BarChart3,
      title: 'Statistiques',
      subtitle: 'Des chiffres qui servent à décider, pas à décorer.',
      benefits: [
        'Taux d\'occupation et revenus par logement',
        'Performance des équipes',
        'Rapports exportables',
      ],
      details:
        'Des indicateurs clairs et actionnables. Comparez vos logements, identifiez les axes d\'amélioration et suivez votre progression mois après mois.',
    },
    {
      icon: Clock,
      title: 'Moyenne durée',
      subtitle: 'Gérez vos locations longue durée sereinement.',
      benefits: [
        'Gestion des baux et documents',
        'Suivi des paiements',
        'Appels de loyer automatisés',
      ],
      details:
        'Pour les conciergeries qui gèrent aussi des locations moyennes ou longues durées. Baux, quittances, appels de loyer : tout est centralisé.',
    },
    {
      icon: Receipt,
      title: 'Facturation',
      subtitle: 'Simplifiez vos factures propriétaires.',
      benefits: [
        'Génération automatique des factures',
        'Import des données Smily et autres',
        'Suivi des paiements',
      ],
      details:
        'Gagnez des heures chaque mois sur la facturation. Les données de réservation alimentent automatiquement vos factures propriétaires.',
    },
    {
      icon: MessageCircle,
      title: 'Messagerie',
      subtitle: 'Tous vos échanges voyageurs au même endroit.',
      benefits: [
        'Centralisation des messages',
        'Contexte réservation toujours visible',
        'Création de tâches depuis les messages',
      ],
      details:
        'Plus besoin de jongler entre les plateformes. Tous les messages arrivent dans Noé avec le contexte de la réservation.',
    },
    {
      icon: MessageSquare,
      title: 'Communication voyageur',
      subtitle: 'Automatisez vos messages sans perdre le contact humain.',
      benefits: [
        'Templates personnalisables',
        'Envoi automatique selon les règles',
        'Messages multilingues',
      ],
      details:
        'Configurez vos messages de bienvenue, instructions d\'arrivée et rappels. Noé les envoie au bon moment, sur le bon canal.',
    },
  ];

  return (
    <div>
      {/* Header */}
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-tight tracking-tight mb-6">
              Des modules qui résolvent vos vrais problèmes
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Chaque module de Noé répond à un défi concret du quotidien. Pas de fonctionnalités gadgets. Juste ce dont vous avez besoin pour travailler sereinement.
            </p>
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-6">
            {modules.map((module, index) => (
              <ModuleCard
                key={index}
                icon={module.icon}
                title={module.title}
                subtitle={module.subtitle}
                benefits={module.benefits}
                details={module.details}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4">
            Envie de voir Noé en action ?
          </h2>
          <p className="text-muted-foreground mb-8">
            Réservez une démo personnalisée et découvrez comment Noé peut s'adapter à votre organisation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/contact">Demander une démo</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/tarifs">Voir les tarifs</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
