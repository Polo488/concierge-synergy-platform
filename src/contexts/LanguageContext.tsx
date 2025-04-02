
import React, { createContext, useContext, useState, ReactNode } from 'react';

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
    // Common actions
    'close': 'Fermer',
    'save': 'Enregistrer',
    'cancel': 'Annuler',
    'delete': 'Supprimer',
    'edit': 'Modifier',
    'add': 'Ajouter',
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
  },
  en: {
    // Header
    'search': 'Search...',
    // Common actions
    'close': 'Close',
    'save': 'Save',
    'cancel': 'Cancel',
    'delete': 'Delete',
    'edit': 'Edit',
    'add': 'Add',
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
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'fr',
  setLanguage: () => {},
  t: (key: string) => key
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
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
