
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'en';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Dashboard
    'dashboard.title': 'Tableau de bord',
    'dashboard.subtitle': 'Bienvenue sur votre plateforme de gestion de conciergerie',
    'dashboard.total.properties': 'Total Logements',
    'dashboard.ongoing.interventions': 'Interventions en cours',
    'dashboard.scheduled.cleanings': 'Ménages planifiés',
    'dashboard.stock.alerts': 'Alertes stock',
    'dashboard.overview': 'Vue d\'ensemble (revenus € )',
    'dashboard.view.all': 'Voir tout',
    'dashboard.details': 'Détails',
    'dashboard.property.occupancy': 'Occupation des logements',
    'dashboard.occupied': 'Occupés',
    'dashboard.vacant': 'Libres',
    'dashboard.maintenance': 'Maintenance',
    'dashboard.recent.interventions': 'Interventions récentes',
    'dashboard.in.progress': 'En cours',
    'dashboard.inventory': 'Entrepôt',
    'dashboard.stock.status': 'État du stock',
    'dashboard.cleaning': 'Ménage',
    'dashboard.today.schedule': 'Planification aujourd\'hui',

    // Inventory
    'inventory.title': 'Entrepôt',
    'inventory.subtitle': 'Gestion des stocks: consommables, linge et matériel',
    'inventory.total.items': 'Total articles',
    'inventory.stock.alerts': 'Alertes stock',
    'inventory.consumables': 'Consommables',
    'inventory.linen': 'Linge',
    'inventory.stock.management': 'Gestion des stocks',
    'inventory.filter': 'Filtrer',
    'inventory.add': 'Ajouter',
    'inventory.search': 'Rechercher un article...',
    'inventory.maintenance': 'Maintenance',
    'inventory.units': 'unités',
    'inventory.min': 'Min',
    'inventory.low.stock': 'Stock bas',
    'inventory.ok': 'OK',
    'inventory.manage': 'Gérer',

    // BookingSync
    'booking.config.title': 'Configuration de SMILY (BookingSync)',
    'booking.config.description': 'Les identifiants d\'API BookingSync sont pré-remplis. Vous pouvez les utiliser directement ou les modifier selon vos besoins.',
    'booking.client.id': 'ID Client',
    'booking.client.secret': 'Secret Client',
    'booking.redirect.uri': 'URI de Redirection',
    'booking.cancel': 'Annuler',
    'booking.configure': 'Configurer',
    'booking.configuring': 'Configuration en cours...',
    
    // Switch language
    'switch.to.english': 'English',
    'switch.to.french': 'Français'
  },
  en: {
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'Welcome to your property management platform',
    'dashboard.total.properties': 'Total Properties',
    'dashboard.ongoing.interventions': 'Ongoing Interventions',
    'dashboard.scheduled.cleanings': 'Scheduled Cleanings',
    'dashboard.stock.alerts': 'Stock Alerts',
    'dashboard.overview': 'Overview (revenue €)',
    'dashboard.view.all': 'View all',
    'dashboard.details': 'Details',
    'dashboard.property.occupancy': 'Property Occupancy',
    'dashboard.occupied': 'Occupied',
    'dashboard.vacant': 'Vacant',
    'dashboard.maintenance': 'Maintenance',
    'dashboard.recent.interventions': 'Recent Interventions',
    'dashboard.in.progress': 'In progress',
    'dashboard.inventory': 'Inventory',
    'dashboard.stock.status': 'Stock Status',
    'dashboard.cleaning': 'Cleaning',
    'dashboard.today.schedule': 'Today\'s Schedule',

    // Inventory
    'inventory.title': 'Inventory',
    'inventory.subtitle': 'Stock management: consumables, linen and equipment',
    'inventory.total.items': 'Total Items',
    'inventory.stock.alerts': 'Stock Alerts',
    'inventory.consumables': 'Consumables',
    'inventory.linen': 'Linen',
    'inventory.stock.management': 'Stock Management',
    'inventory.filter': 'Filter',
    'inventory.add': 'Add',
    'inventory.search': 'Search an item...',
    'inventory.maintenance': 'Maintenance',
    'inventory.units': 'units',
    'inventory.min': 'Min',
    'inventory.low.stock': 'Low Stock',
    'inventory.ok': 'OK',
    'inventory.manage': 'Manage',

    // BookingSync
    'booking.config.title': 'SMILY Configuration (BookingSync)',
    'booking.config.description': 'BookingSync API credentials are pre-filled. You can use them directly or modify them as needed.',
    'booking.client.id': 'Client ID',
    'booking.client.secret': 'Client Secret',
    'booking.redirect.uri': 'Redirect URI',
    'booking.cancel': 'Cancel',
    'booking.configure': 'Configure',
    'booking.configuring': 'Configuring...',
    
    // Switch language
    'switch.to.english': 'English',
    'switch.to.french': 'Français'
  }
};

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
