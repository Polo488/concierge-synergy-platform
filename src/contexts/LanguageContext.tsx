
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'fr' | 'en';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Header
    'search': 'Rechercher...',
    // Sidebar
    'sidebar.dashboard': 'Tableau de bord',
    'sidebar.inventory': 'Inventaire',
    'sidebar.maintenance': 'Maintenance',
    'sidebar.cleaning': 'Ménage',
    'sidebar.calendar': 'Calendrier',
    'sidebar.properties': 'Propriétés',
    'sidebar.averageDuration': 'Moyenne durée',
    'sidebar.upsell': 'Upsell',
    'sidebar.billing': 'Facturation',
    'sidebar.insights': 'Insights & Alertes',
    'sidebar.qualityStats': 'Qualité & Stats',
    // Common actions
    'close': 'Fermer',
    'save': 'Enregistrer',
    'cancel': 'Annuler',
    'delete': 'Supprimer',
    'edit': 'Modifier',
    'add': 'Ajouter',
    // Cleaning module
    'cleaning.page.title': 'Ménage - Gestion',
    'cleaning.planning.title': 'Planning des ménages',
    'cleaning.agent.title': 'Mes tâches de ménage',
    'cleaning.agent.description': 'Tâches qui vous sont assignées',
    'cleaning.tabs.today': 'Aujourd\'hui',
    'cleaning.tabs.tomorrow': 'Demain',
    'cleaning.tabs.completed': 'Terminés',
    'cleaning.tabs.issues': 'Problèmes',
    'cleaning.search.placeholder': 'Rechercher un logement ou agent...',
    'cleaning.empty.today': 'Aucun ménage prévu aujourd\'hui',
    'cleaning.empty.tomorrow': 'Aucun ménage prévu demain',
    'cleaning.empty.completed': 'Aucun ménage terminé',
    // Calendar
    'calendar': 'Calendrier',
    'calendar.description': 'Suivez les réservations et la disponibilité de vos propriétés.',
    'calendar.add.booking': 'Ajouter une réservation',
    'calendar.filters': 'Filtres',
    'calendar.property': 'Propriété',
    'calendar.all.properties': 'Toutes les propriétés',
    'calendar.search': 'Recherche',
    'calendar.search.placeholder': 'Rechercher un client...',
    'calendar.availability': 'Disponibilité',
    'calendar.select.date': 'Sélectionner une date',
    'calendar.check.availability': 'Vérifier la disponibilité',
    'calendar.toggle.view': 'Basculer vers la vue',
    'calendar.view.month': 'Mois',
    'calendar.view.properties': 'Propriétés',
    'calendar.previous': 'Précédent',
    'calendar.next': 'Suivant',
    'calendar.book': 'Réserver',
    'calendar.details': 'Détails',
    'calendar.no.bookings': 'Aucune réservation pour cette propriété.',
    'calendar.today': 'Aujourd\'hui',
    // Availability dialog
    'availability.title': 'Logements disponibles',
    'availability.description': 'Voici les logements disponibles pour la période sélectionnée',
    'availability.period': 'Période sélectionnée:',
    'availability.nights': 'nuits',
    'availability.available': 'Disponible',
    'availability.no.properties': 'Aucun logement disponible pour cette période',
    'availability.select.date.range': 'Veuillez sélectionner une plage de dates complète',
    // Property details
    'property.capacity': 'Capacité:',
    'property.price': 'Prix par nuit:',
    'property.persons': 'personnes',
    // Calendar status
    'status.confirmed': 'Confirmé',
    'status.pending': 'En attente',
    'status.completed': 'Terminé',
    // Booking details
    'booking.details': 'Détails de la réservation',
    'booking.client': 'Client:',
    'booking.arrival': 'Arrivée:',
    'booking.departure': 'Départ:',
    'booking.duration': 'Durée:',
    'booking.nights': 'nuits',
  },
  en: {
    // Header
    'search': 'Search...',
    // Sidebar
    'sidebar.dashboard': 'Dashboard',
    'sidebar.inventory': 'Inventory',
    'sidebar.maintenance': 'Maintenance',
    'sidebar.cleaning': 'Cleaning',
    'sidebar.calendar': 'Calendar',
    'sidebar.properties': 'Properties',
    'sidebar.averageDuration': 'Medium Term',
    'sidebar.upsell': 'Upsell',
    'sidebar.billing': 'Billing',
    'sidebar.insights': 'Insights & Alerts',
    'sidebar.qualityStats': 'Quality & Stats',
    // Common actions
    'close': 'Close',
    'save': 'Save',
    'cancel': 'Cancel',
    'delete': 'Delete',
    'edit': 'Edit',
    'add': 'Add',
    // Cleaning module
    'cleaning.page.title': 'Cleaning - Management',
    'cleaning.planning.title': 'Cleaning Schedule',
    'cleaning.agent.title': 'My Cleaning Tasks',
    'cleaning.agent.description': 'Tasks assigned to you',
    'cleaning.tabs.today': 'Today',
    'cleaning.tabs.tomorrow': 'Tomorrow',
    'cleaning.tabs.completed': 'Completed',
    'cleaning.tabs.issues': 'Issues',
    'cleaning.search.placeholder': 'Search property or agent...',
    'cleaning.empty.today': 'No cleaning scheduled for today',
    'cleaning.empty.tomorrow': 'No cleaning scheduled for tomorrow',
    'cleaning.empty.completed': 'No completed cleanings',
    // Calendar
    'calendar': 'Calendar',
    'calendar.description': 'Track bookings and availability of your properties.',
    'calendar.add.booking': 'Add a booking',
    'calendar.filters': 'Filters',
    'calendar.property': 'Property',
    'calendar.all.properties': 'All properties',
    'calendar.search': 'Search',
    'calendar.search.placeholder': 'Search for a client...',
    'calendar.availability': 'Availability',
    'calendar.select.date': 'Select a date',
    'calendar.check.availability': 'Check availability',
    'calendar.toggle.view': 'Toggle view to',
    'calendar.view.month': 'Month',
    'calendar.view.properties': 'Properties',
    'calendar.previous': 'Previous',
    'calendar.next': 'Next',
    'calendar.book': 'Book',
    'calendar.details': 'Details',
    'calendar.no.bookings': 'No bookings for this property.',
    'calendar.today': 'Today',
    // Availability dialog
    'availability.title': 'Available Accommodations',
    'availability.description': 'Here are the available accommodations for the selected period',
    'availability.period': 'Selected period:',
    'availability.nights': 'nights',
    'availability.available': 'Available',
    'availability.no.properties': 'No accommodation available for this period',
    'availability.select.date.range': 'Please select a complete date range',
    // Property details
    'property.capacity': 'Capacity:',
    'property.price': 'Price per night:',
    'property.persons': 'people',
    // Calendar status
    'status.confirmed': 'Confirmed',
    'status.pending': 'Pending',
    'status.completed': 'Completed',
    // Booking details
    'booking.details': 'Booking Details',
    'booking.client': 'Client:',
    'booking.arrival': 'Arrival:',
    'booking.departure': 'Departure:',
    'booking.duration': 'Duration:',
    'booking.nights': 'nights',
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'fr',
  setLanguage: () => {},
  t: (key: string) => key
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Get stored language preference or default to French
    const storedLanguage = localStorage.getItem('language');
    return (storedLanguage as Language) || 'fr';
  });

  // Save language preference when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
