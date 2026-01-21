
import { ModuleTutorial } from '@/types/tutorial';

export const tutorialDefinitions: Record<string, ModuleTutorial> = {
  dashboard: {
    moduleId: 'dashboard',
    moduleName: 'Tableau de bord',
    steps: [
      {
        id: 'dashboard-welcome',
        targetSelector: '[data-tutorial="dashboard-header"]',
        title: 'Bienvenue sur le tableau de bord',
        description: 'Cet espace centralise toutes les informations importantes de votre activité en temps réel.',
        position: 'bottom'
      },
      {
        id: 'dashboard-kpi',
        targetSelector: '[data-tutorial="dashboard-kpi"]',
        title: 'Indicateurs clés',
        description: 'Suivez vos métriques principales : réservations, revenus, taux d\'occupation.',
        position: 'bottom'
      },
      {
        id: 'dashboard-activity',
        targetSelector: '[data-tutorial="dashboard-activity"]',
        title: 'Activité du jour',
        description: 'Visualisez les arrivées, départs et tâches planifiées pour aujourd\'hui.',
        position: 'top'
      }
    ]
  },
  calendar: {
    moduleId: 'calendar',
    moduleName: 'Calendrier',
    steps: [
      {
        id: 'calendar-overview',
        targetSelector: '[data-tutorial="calendar-grid"]',
        title: 'Vue calendrier',
        description: 'Visualisez toutes vos réservations par propriété sur une timeline interactive.',
        position: 'bottom'
      },
      {
        id: 'calendar-toolbar',
        targetSelector: '[data-tutorial="calendar-toolbar"]',
        title: 'Barre d\'outils',
        description: 'Naviguez entre les dates, filtrez par propriété et changez de vue.',
        position: 'bottom'
      },
      {
        id: 'calendar-booking',
        targetSelector: '[data-tutorial="calendar-booking"]',
        title: 'Réservations',
        description: 'Cliquez sur une réservation pour voir les détails ou la modifier.',
        position: 'right'
      },
      {
        id: 'calendar-add',
        targetSelector: '[data-tutorial="calendar-add"]',
        title: 'Ajouter une réservation',
        description: 'Créez de nouvelles réservations en sélectionnant une période sur le calendrier.',
        position: 'left'
      }
    ]
  },
  cleaning: {
    moduleId: 'cleaning',
    moduleName: 'Ménage',
    steps: [
      {
        id: 'cleaning-overview',
        targetSelector: '[data-tutorial="cleaning-header"]',
        title: 'Gestion du ménage',
        description: 'Planifiez et suivez toutes les tâches de ménage de vos propriétés.',
        position: 'bottom'
      },
      {
        id: 'cleaning-tabs',
        targetSelector: '[data-tutorial="cleaning-tabs"]',
        title: 'Onglets de navigation',
        description: 'Passez entre les tâches du jour, de demain, terminées et les problèmes signalés.',
        position: 'bottom'
      },
      {
        id: 'cleaning-task',
        targetSelector: '[data-tutorial="cleaning-task"]',
        title: 'Carte de tâche',
        description: 'Chaque carte affiche les détails du ménage : propriété, horaire, agent assigné.',
        position: 'right'
      },
      {
        id: 'cleaning-actions',
        targetSelector: '[data-tutorial="cleaning-actions"]',
        title: 'Actions rapides',
        description: 'Assignez des agents, démarrez ou terminez les ménages en un clic.',
        position: 'left'
      }
    ]
  },
  maintenance: {
    moduleId: 'maintenance',
    moduleName: 'Maintenance',
    steps: [
      {
        id: 'maintenance-overview',
        targetSelector: '[data-tutorial="maintenance-header"]',
        title: 'Suivi de la maintenance',
        description: 'Gérez toutes les interventions techniques de vos propriétés.',
        position: 'bottom'
      },
      {
        id: 'maintenance-filters',
        targetSelector: '[data-tutorial="maintenance-filters"]',
        title: 'Filtres et recherche',
        description: 'Filtrez par statut, priorité ou propriété pour trouver rapidement une tâche.',
        position: 'bottom'
      },
      {
        id: 'maintenance-new',
        targetSelector: '[data-tutorial="maintenance-new"]',
        title: 'Nouvelle intervention',
        description: 'Créez une nouvelle demande de maintenance avec tous les détails nécessaires.',
        position: 'left'
      },
      {
        id: 'maintenance-card',
        targetSelector: '[data-tutorial="maintenance-card"]',
        title: 'Détails d\'intervention',
        description: 'Suivez l\'avancement, assignez des techniciens et ajoutez des notes.',
        position: 'right'
      }
    ]
  },
  properties: {
    moduleId: 'properties',
    moduleName: 'Propriétés',
    steps: [
      {
        id: 'properties-list',
        targetSelector: '[data-tutorial="properties-list"]',
        title: 'Liste des propriétés',
        description: 'Consultez toutes vos propriétés avec leurs informations clés.',
        position: 'bottom'
      },
      {
        id: 'properties-search',
        targetSelector: '[data-tutorial="properties-search"]',
        title: 'Recherche et filtres',
        description: 'Trouvez rapidement une propriété par nom, adresse ou caractéristiques.',
        position: 'bottom'
      },
      {
        id: 'properties-card',
        targetSelector: '[data-tutorial="properties-card"]',
        title: 'Fiche propriété',
        description: 'Cliquez pour accéder aux détails : équipements, photos, plateformes connectées.',
        position: 'right'
      }
    ]
  },
  messaging: {
    moduleId: 'messaging',
    moduleName: 'Messagerie',
    steps: [
      {
        id: 'messaging-list',
        targetSelector: '[data-tutorial="messaging-list"]',
        title: 'Conversations',
        description: 'Toutes vos conversations clients centralisées, triées par date.',
        position: 'right'
      },
      {
        id: 'messaging-thread',
        targetSelector: '[data-tutorial="messaging-thread"]',
        title: 'Fil de discussion',
        description: 'Consultez et répondez aux messages. Les réponses sont synchronisées avec les plateformes.',
        position: 'left'
      },
      {
        id: 'messaging-context',
        targetSelector: '[data-tutorial="messaging-context"]',
        title: 'Panneau contextuel',
        description: 'Accédez aux infos de réservation et actions rapides liées à la conversation.',
        position: 'left'
      }
    ]
  },
  inventory: {
    moduleId: 'inventory',
    moduleName: 'Inventaire',
    steps: [
      {
        id: 'inventory-overview',
        targetSelector: '[data-tutorial="inventory-header"]',
        title: 'Gestion de l\'inventaire',
        description: 'Suivez le stock de tous vos consommables et équipements.',
        position: 'bottom'
      },
      {
        id: 'inventory-items',
        targetSelector: '[data-tutorial="inventory-items"]',
        title: 'Articles en stock',
        description: 'Visualisez les quantités, seuils d\'alerte et historique de consommation.',
        position: 'right'
      }
    ]
  },
  billing: {
    moduleId: 'billing',
    moduleName: 'Facturation',
    steps: [
      {
        id: 'billing-overview',
        targetSelector: '[data-tutorial="billing-header"]',
        title: 'Facturation & revenus',
        description: 'Gérez vos factures, paiements et suivez vos revenus.',
        position: 'bottom'
      },
      {
        id: 'billing-import',
        targetSelector: '[data-tutorial="billing-import"]',
        title: 'Import de données',
        description: 'Importez vos données depuis les plateformes de réservation.',
        position: 'bottom'
      }
    ]
  },
  upsell: {
    moduleId: 'upsell',
    moduleName: 'Upsell',
    steps: [
      {
        id: 'upsell-services',
        targetSelector: '[data-tutorial="upsell-services"]',
        title: 'Services additionnels',
        description: 'Gérez vos offres de services complémentaires pour vos voyageurs.',
        position: 'bottom'
      },
      {
        id: 'upsell-sales',
        targetSelector: '[data-tutorial="upsell-sales"]',
        title: 'Suivi des ventes',
        description: 'Suivez les ventes réalisées et analysez les performances.',
        position: 'right'
      }
    ]
  },
  quality: {
    moduleId: 'quality',
    moduleName: 'Qualité & Stats',
    steps: [
      {
        id: 'quality-kpi',
        targetSelector: '[data-tutorial="quality-kpi"]',
        title: 'Indicateurs qualité',
        description: 'Suivez les métriques de qualité : notes moyennes, taux de repasse.',
        position: 'bottom'
      },
      {
        id: 'quality-charts',
        targetSelector: '[data-tutorial="quality-charts"]',
        title: 'Graphiques d\'analyse',
        description: 'Visualisez les tendances et comparez les performances dans le temps.',
        position: 'bottom'
      },
      {
        id: 'quality-ranking',
        targetSelector: '[data-tutorial="quality-ranking"]',
        title: 'Classements',
        description: 'Consultez le classement des agents et propriétés par performance.',
        position: 'top'
      }
    ]
  },
  'moyenne-duree': {
    moduleId: 'moyenne-duree',
    moduleName: 'Moyenne durée',
    steps: [
      {
        id: 'md-bookings',
        targetSelector: '[data-tutorial="md-bookings"]',
        title: 'Réservations moyenne durée',
        description: 'Gérez vos locations de 1 à 12 mois avec suivi des baux.',
        position: 'bottom'
      },
      {
        id: 'md-documents',
        targetSelector: '[data-tutorial="md-documents"]',
        title: 'Documents',
        description: 'Générez appels de loyer, quittances et contrats de bail.',
        position: 'right'
      }
    ]
  },
  insights: {
    moduleId: 'insights',
    moduleName: 'Insights & Alertes',
    steps: [
      {
        id: 'insights-rules',
        targetSelector: '[data-tutorial="insights-rules"]',
        title: 'Règles d\'alertes',
        description: 'Configurez des alertes automatiques selon vos critères métier.',
        position: 'bottom'
      },
      {
        id: 'insights-notifications',
        targetSelector: '[data-tutorial="insights-notifications"]',
        title: 'Notifications',
        description: 'Recevez des alertes en temps réel sur les événements importants.',
        position: 'right'
      }
    ]
  }
};
