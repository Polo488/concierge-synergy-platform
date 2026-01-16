
import { useState, useMemo } from 'react';
import { 
  MessagingRule, 
  MessageTemplate, 
  UpsellOffer, 
  MessageLog,
  GuestExperienceSettings 
} from '@/types/guestExperience';

// Mock data for messaging rules
const mockRules: MessagingRule[] = [
  {
    id: '1',
    name: 'Bienvenue - Jour d\'arrivée',
    description: 'Message de bienvenue envoyé le jour de l\'arrivée à 9h',
    status: 'active',
    triggerType: 'time-based',
    timeTrigger: {
      relativeTo: 'checkin',
      dayOffset: 0,
      time: '09:00',
    },
    propertyScope: 'all',
    channels: ['airbnb', 'booking', 'email'],
    templateId: 't1',
    preventDuplicates: true,
    allowManualOverride: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    lastExecutedAt: new Date('2024-01-20'),
    executionCount: 145,
  },
  {
    id: '2',
    name: 'Instructions d\'arrivée',
    description: 'Envoi des codes d\'accès 2 jours avant l\'arrivée',
    status: 'active',
    triggerType: 'time-based',
    timeTrigger: {
      relativeTo: 'checkin',
      dayOffset: -2,
      time: '18:00',
    },
    propertyScope: 'all',
    channels: ['airbnb', 'booking', 'email', 'whatsapp'],
    templateId: 't2',
    preventDuplicates: true,
    allowManualOverride: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
    lastExecutedAt: new Date('2024-01-19'),
    executionCount: 132,
  },
  {
    id: '3',
    name: 'Rappel check-out',
    description: 'Rappel des consignes de départ la veille',
    status: 'active',
    triggerType: 'time-based',
    timeTrigger: {
      relativeTo: 'checkout',
      dayOffset: -1,
      time: '18:00',
    },
    propertyScope: 'all',
    channels: ['airbnb', 'booking'],
    templateId: 't3',
    preventDuplicates: true,
    allowManualOverride: false,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    lastExecutedAt: new Date('2024-01-18'),
    executionCount: 98,
  },
  {
    id: '4',
    name: 'Demande d\'avis',
    description: 'Demande d\'avis 2 jours après le départ',
    status: 'active',
    triggerType: 'time-based',
    timeTrigger: {
      relativeTo: 'checkout',
      dayOffset: 2,
      time: '10:00',
    },
    propertyScope: 'all',
    channels: ['email'],
    templateId: 't4',
    preventDuplicates: true,
    allowManualOverride: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    lastExecutedAt: new Date('2024-01-17'),
    executionCount: 87,
  },
  {
    id: '5',
    name: 'Confirmation de réservation',
    description: 'Message automatique après nouvelle réservation',
    status: 'active',
    triggerType: 'event-based',
    eventTrigger: {
      eventType: 'reservation_created',
      delayMinutes: 5,
    },
    propertyScope: 'all',
    channels: ['airbnb', 'booking', 'email'],
    templateId: 't5',
    preventDuplicates: true,
    allowManualOverride: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    lastExecutedAt: new Date('2024-01-20'),
    executionCount: 156,
  },
  {
    id: '6',
    name: 'Offre linge supplémentaire',
    description: 'Proposition de kit linge après réservation',
    status: 'inactive',
    triggerType: 'time-based',
    timeTrigger: {
      relativeTo: 'booking_date',
      dayOffset: 1,
      time: '10:00',
    },
    propertyScope: 'selected',
    selectedPropertyIds: ['prop1', 'prop2'],
    channels: ['email', 'whatsapp'],
    templateId: 't6',
    preventDuplicates: true,
    allowManualOverride: true,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
    executionCount: 45,
  },
];

// Mock templates
const mockTemplates: MessageTemplate[] = [
  {
    id: 't1',
    name: 'Message de bienvenue',
    category: 'before_checkin',
    subject: 'Bienvenue ! Votre séjour commence aujourd\'hui',
    content: `Bonjour {{guest_first_name}},

Nous sommes ravis de vous accueillir aujourd'hui à {{property_name}} !

Votre check-in est prévu pour {{checkin_time}}. Voici vos informations d'accès :
- Code d'entrée : {{access_code}}
- WiFi : {{wifi_name}} / {{wifi_password}}

N'hésitez pas à nous contacter si vous avez des questions.

Bon séjour !
{{host_name}}`,
    variables: ['guest_first_name', 'property_name', 'checkin_time', 'access_code', 'wifi_name', 'wifi_password', 'host_name'],
    language: 'fr',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    isActive: true,
  },
  {
    id: 't2',
    name: 'Instructions d\'arrivée',
    category: 'before_checkin',
    subject: 'Vos instructions d\'arrivée pour {{property_name}}',
    content: `Bonjour {{guest_first_name}},

Votre séjour approche ! Voici toutes les informations pour votre arrivée le {{checkin_date}}.

📍 Adresse : {{property_address}}

🔑 Code d'accès : {{access_code}}

📶 WiFi
- Réseau : {{wifi_name}}
- Mot de passe : {{wifi_password}}

À très bientôt !`,
    variables: ['guest_first_name', 'property_name', 'checkin_date', 'property_address', 'access_code', 'wifi_name', 'wifi_password'],
    language: 'fr',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    isActive: true,
  },
  {
    id: 't3',
    name: 'Rappel check-out',
    category: 'during_stay',
    subject: 'Rappel : votre départ demain',
    content: `Bonjour {{guest_first_name}},

Nous espérons que vous avez passé un excellent séjour à {{property_name}} !

Pour rappel, le check-out est prévu demain avant {{checkout_time}}.

Consignes de départ :
- Merci de laisser les clés sur la table
- Veuillez sortir les poubelles
- N'oubliez pas vos affaires

Merci et à bientôt !`,
    variables: ['guest_first_name', 'property_name', 'checkout_time'],
    language: 'fr',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    isActive: true,
  },
  {
    id: 't4',
    name: 'Demande d\'avis',
    category: 'review_request',
    subject: 'Comment s\'est passé votre séjour ?',
    content: `Bonjour {{guest_first_name}},

Merci d'avoir séjourné à {{property_name}} !

Nous espérons que tout était parfait. Votre avis compte beaucoup pour nous et les futurs voyageurs.

Pourriez-vous prendre quelques minutes pour partager votre expérience ?

Merci beaucoup !
{{host_name}}`,
    variables: ['guest_first_name', 'property_name', 'host_name'],
    language: 'fr',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    isActive: true,
  },
  {
    id: 't5',
    name: 'Confirmation de réservation',
    category: 'before_booking',
    subject: 'Votre réservation est confirmée !',
    content: `Bonjour {{guest_first_name}},

Votre réservation à {{property_name}} est confirmée !

📅 Arrivée : {{checkin_date}}
📅 Départ : {{checkout_date}}
🌙 {{nights_count}} nuit(s)

Nous vous enverrons les informations d'accès quelques jours avant votre arrivée.

À bientôt !`,
    variables: ['guest_first_name', 'property_name', 'checkin_date', 'checkout_date', 'nights_count'],
    language: 'fr',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    isActive: true,
  },
  {
    id: 't6',
    name: 'Offre linge supplémentaire',
    category: 'upsell',
    subject: 'Kit linge premium disponible',
    content: `Bonjour {{guest_first_name}},

Pour votre séjour à {{property_name}}, nous proposons un kit linge premium :
- Draps de qualité supérieure
- Serviettes moelleuses
- Peignoirs

Répondez OUI pour ajouter cette option à votre réservation.

Cordialement`,
    variables: ['guest_first_name', 'property_name'],
    language: 'fr',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    isActive: true,
  },
];

// Mock upsell offers
const mockUpsells: UpsellOffer[] = [
  {
    id: 'u1',
    name: 'Kit linge premium',
    description: 'Draps haut de gamme, serviettes moelleuses et peignoirs',
    price: 25,
    currency: 'EUR',
    trigger: 'after_booking',
    linkedRuleId: '6',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    conversionCount: 23,
    viewCount: 156,
  },
  {
    id: 'u2',
    name: 'Petit-déjeuner livré',
    description: 'Croissants, pain frais, jus d\'orange et café livré à 8h',
    price: 15,
    currency: 'EUR',
    trigger: 'before_arrival',
    isActive: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    conversionCount: 18,
    viewCount: 89,
  },
  {
    id: 'u3',
    name: 'Late check-out',
    description: 'Départ jusqu\'à 14h au lieu de 11h',
    price: 30,
    currency: 'EUR',
    trigger: 'during_stay',
    isActive: true,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    conversionCount: 34,
    viewCount: 112,
  },
  {
    id: 'u4',
    name: 'Bouquet de fleurs',
    description: 'Bouquet frais livré à l\'appartement',
    price: 35,
    currency: 'EUR',
    trigger: 'before_arrival',
    isActive: false,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    conversionCount: 5,
    viewCount: 45,
  },
];

// Mock message logs
const mockLogs: MessageLog[] = [
  {
    id: 'l1',
    ruleId: '1',
    ruleName: 'Bienvenue - Jour d\'arrivée',
    propertyId: 'prop1',
    propertyName: 'Studio Bellecour',
    guestName: 'Marie Dupont',
    guestEmail: 'marie.dupont@email.com',
    channel: 'airbnb',
    subject: 'Bienvenue ! Votre séjour commence aujourd\'hui',
    content: 'Bonjour Marie, Nous sommes ravis de vous accueillir...',
    status: 'sent',
    sentAt: new Date('2024-01-20T09:00:00'),
    createdAt: new Date('2024-01-20T09:00:00'),
  },
  {
    id: 'l2',
    ruleId: '2',
    ruleName: 'Instructions d\'arrivée',
    propertyId: 'prop2',
    propertyName: 'Appartement Confluence',
    guestName: 'Pierre Martin',
    guestEmail: 'pierre.martin@email.com',
    channel: 'email',
    subject: 'Vos instructions d\'arrivée',
    content: 'Bonjour Pierre, Votre séjour approche...',
    status: 'sent',
    sentAt: new Date('2024-01-19T18:00:00'),
    createdAt: new Date('2024-01-19T18:00:00'),
  },
  {
    id: 'l3',
    ruleId: '5',
    ruleName: 'Confirmation de réservation',
    propertyId: 'prop1',
    propertyName: 'Studio Bellecour',
    guestName: 'Jean Lefevre',
    channel: 'booking',
    subject: 'Votre réservation est confirmée',
    content: 'Bonjour Jean, Votre réservation est confirmée...',
    status: 'failed',
    errorMessage: 'Erreur de connexion à l\'API Booking',
    createdAt: new Date('2024-01-18T14:30:00'),
  },
  {
    id: 'l4',
    ruleId: '4',
    ruleName: 'Demande d\'avis',
    propertyId: 'prop3',
    propertyName: 'Loft Part-Dieu',
    guestName: 'Sophie Bernard',
    guestEmail: 'sophie.b@email.com',
    channel: 'email',
    subject: 'Comment s\'est passé votre séjour ?',
    content: 'Bonjour Sophie, Merci d\'avoir séjourné...',
    status: 'skipped',
    skippedReason: 'Guest déjà laissé un avis',
    createdAt: new Date('2024-01-17T10:00:00'),
  },
  {
    id: 'l5',
    ruleId: '1',
    ruleName: 'Bienvenue - Jour d\'arrivée',
    propertyId: 'prop2',
    propertyName: 'Appartement Confluence',
    guestName: 'Thomas Dubois',
    channel: 'whatsapp',
    subject: 'Bienvenue',
    content: 'Bonjour Thomas, Nous sommes ravis...',
    status: 'sent',
    sentAt: new Date('2024-01-16T09:00:00'),
    createdAt: new Date('2024-01-16T09:00:00'),
  },
];

export function useGuestExperience() {
  const [rules, setRules] = useState<MessagingRule[]>(mockRules);
  const [templates, setTemplates] = useState<MessageTemplate[]>(mockTemplates);
  const [upsells, setUpsells] = useState<UpsellOffer[]>(mockUpsells);
  const [logs] = useState<MessageLog[]>(mockLogs);
  const [settings, setSettings] = useState<GuestExperienceSettings>({
    defaultLanguage: 'fr',
    enableAutoMessages: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    defaultSenderName: 'Gestion BNB Lyon',
    enableReadReceipts: true,
    retryFailedMessages: true,
    maxRetries: 3,
  });

  // Stats
  const stats = useMemo(() => {
    const activeRules = rules.filter(r => r.status === 'active').length;
    const totalSent = logs.filter(l => l.status === 'sent').length;
    const totalFailed = logs.filter(l => l.status === 'failed').length;
    const totalSkipped = logs.filter(l => l.status === 'skipped').length;
    const activeUpsells = upsells.filter(u => u.isActive).length;
    const upsellRevenue = upsells.reduce((acc, u) => acc + (u.conversionCount * (u.price || 0)), 0);
    
    return {
      activeRules,
      totalRules: rules.length,
      totalSent,
      totalFailed,
      totalSkipped,
      activeTemplates: templates.filter(t => t.isActive).length,
      activeUpsells,
      upsellRevenue,
    };
  }, [rules, templates, upsells, logs]);

  // Rule operations
  const createRule = (rule: Omit<MessagingRule, 'id' | 'createdAt' | 'updatedAt' | 'executionCount'>) => {
    const newRule: MessagingRule = {
      ...rule,
      id: `rule-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      executionCount: 0,
    };
    setRules(prev => [...prev, newRule]);
    return newRule;
  };

  const updateRule = (id: string, updates: Partial<MessagingRule>) => {
    setRules(prev => prev.map(r => 
      r.id === id ? { ...r, ...updates, updatedAt: new Date() } : r
    ));
  };

  const deleteRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
  };

  const toggleRuleStatus = (id: string) => {
    setRules(prev => prev.map(r => 
      r.id === id ? { ...r, status: r.status === 'active' ? 'inactive' : 'active', updatedAt: new Date() } : r
    ));
  };

  const duplicateRule = (id: string) => {
    const rule = rules.find(r => r.id === id);
    if (rule) {
      const newRule: MessagingRule = {
        ...rule,
        id: `rule-${Date.now()}`,
        name: `${rule.name} (copie)`,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
        executionCount: 0,
        lastExecutedAt: undefined,
      };
      setRules(prev => [...prev, newRule]);
      return newRule;
    }
    return null;
  };

  // Template operations
  const createTemplate = (template: Omit<MessageTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTemplate: MessageTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTemplates(prev => [...prev, newTemplate]);
    return newTemplate;
  };

  const updateTemplate = (id: string, updates: Partial<MessageTemplate>) => {
    setTemplates(prev => prev.map(t => 
      t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
    ));
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  // Upsell operations
  const createUpsell = (upsell: Omit<UpsellOffer, 'id' | 'createdAt' | 'updatedAt' | 'conversionCount' | 'viewCount'>) => {
    const newUpsell: UpsellOffer = {
      ...upsell,
      id: `upsell-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      conversionCount: 0,
      viewCount: 0,
    };
    setUpsells(prev => [...prev, newUpsell]);
    return newUpsell;
  };

  const updateUpsell = (id: string, updates: Partial<UpsellOffer>) => {
    setUpsells(prev => prev.map(u => 
      u.id === id ? { ...u, ...updates, updatedAt: new Date() } : u
    ));
  };

  const deleteUpsell = (id: string) => {
    setUpsells(prev => prev.filter(u => u.id !== id));
  };

  const toggleUpsellStatus = (id: string) => {
    setUpsells(prev => prev.map(u => 
      u.id === id ? { ...u, isActive: !u.isActive, updatedAt: new Date() } : u
    ));
  };

  return {
    // Data
    rules,
    templates,
    upsells,
    logs,
    settings,
    stats,
    // Rule operations
    createRule,
    updateRule,
    deleteRule,
    toggleRuleStatus,
    duplicateRule,
    // Template operations
    createTemplate,
    updateTemplate,
    deleteTemplate,
    // Upsell operations
    createUpsell,
    updateUpsell,
    deleteUpsell,
    toggleUpsellStatus,
    // Settings
    updateSettings: setSettings,
  };
}
