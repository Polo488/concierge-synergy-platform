
import { useState, useCallback } from 'react';
import { WelcomeGuideTemplate, WelcomeGuideSession, WelcomeGuideAnalytics } from '@/types/welcomeGuide';

const MOCK_TEMPLATES: WelcomeGuideTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Template Lyon Centre',
    propertyId: 'prop-1',
    propertyName: 'Apt Bellecour – T2 Premium',
    steps: [
      { id: 's1', order: 1, type: 'building_arrival', title: 'Arrivée au bâtiment', description: 'Rendez-vous au 12 Place Bellecour, Lyon 2e. Le bâtiment est à droite de la pharmacie.', imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', validationLabel: 'Oui, je suis devant le bâtiment', isOptional: false, isActive: true },
      { id: 's2', order: 2, type: 'key_access', title: 'Récupération des clés', description: 'La boîte à clés se trouve à gauche de la porte d\'entrée. Code : 4589#', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800', validationLabel: 'J\'ai récupéré les clés', isOptional: false, isActive: true, helpText: 'Tournez le cadran vers la droite, puis entrez le code.' },
      { id: 's3', order: 3, type: 'apartment_access', title: 'Accès au logement', description: '3ème étage, porte gauche. Utilisez la grande clé pour la porte du bas, la petite pour l\'appartement.', imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', validationLabel: 'Je suis entré dans le logement', isOptional: false, isActive: true },
      { id: 's4', order: 4, type: 'welcome', title: 'Bienvenue chez vous !', description: '', validationLabel: 'C\'est noté, merci !', isOptional: false, isActive: true },
      { id: 's5', order: 5, type: 'upsell', title: 'Services additionnels', description: 'Profitez de nos services pour un séjour encore plus agréable.', validationLabel: 'Continuer', isOptional: true, isActive: true },
    ],
    upsells: [
      { id: 'u1', name: 'Check-out tardif (14h)', description: 'Profitez de votre logement jusqu\'à 14h au lieu de 11h.', price: 35, currency: '€', isActive: true },
      { id: 'u2', name: 'Ménage supplémentaire', description: 'Un ménage complet pendant votre séjour.', price: 45, currency: '€', isActive: true },
      { id: 'u3', name: 'Pack linge premium', description: 'Serviettes et draps supplémentaires de qualité hôtelière.', price: 20, currency: '€', isActive: true },
    ],
    welcomeMessage: 'Bienvenue dans votre appartement ! Nous espérons que vous passerez un excellent séjour. N\'hésitez pas à nous contacter si besoin.',
    wifiName: 'Bellecour_Guest',
    wifiPassword: 'Welcome2024!',
    houseRules: ['Pas de fête ni de bruit après 22h', 'Ne pas fumer dans l\'appartement', 'Merci de trier les déchets'],
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-10'),
  },
  {
    id: 'tpl-2',
    name: 'Template Paris Marais',
    propertyId: 'prop-2',
    propertyName: 'Studio Marais – Charme',
    steps: [
      { id: 's1b', order: 1, type: 'building_arrival', title: 'Arrivée au bâtiment', description: '15 Rue des Archives, Paris 4e. Digicode : 45A12.', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', validationLabel: 'Oui, je suis devant le bâtiment', isOptional: false, isActive: true },
      { id: 's2b', order: 2, type: 'key_access', title: 'Récupération des clés', description: 'Boîte à clés dans le hall. Code : 7721.', validationLabel: 'J\'ai récupéré les clés', isOptional: false, isActive: true },
      { id: 's3b', order: 3, type: 'apartment_access', title: 'Accès au logement', description: '2ème étage sans ascenseur, porte droite.', validationLabel: 'Je suis entré dans le logement', isOptional: false, isActive: true },
      { id: 's4b', order: 4, type: 'welcome', title: 'Bienvenue !', description: '', validationLabel: 'C\'est noté !', isOptional: false, isActive: true },
      { id: 's5b', order: 5, type: 'upsell', title: 'Extras', description: '', validationLabel: 'Continuer', isOptional: true, isActive: true },
    ],
    upsells: [
      { id: 'u4', name: 'Check-out tardif (13h)', description: 'Départ repoussé à 13h.', price: 30, currency: '€', isActive: true },
      { id: 'u5', name: 'Petit-déjeuner livré', description: 'Croissants, jus et café livrés le matin.', price: 18, currency: '€', isActive: true },
    ],
    welcomeMessage: 'Bienvenue au cœur du Marais ! Profitez bien de Paris.',
    wifiName: 'Marais_Guest',
    wifiPassword: 'Paris2024!',
    houseRules: ['Pas de bruit après 22h', 'Ne pas fumer'],
    isActive: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-04-05'),
  },
];

const MOCK_SESSIONS: WelcomeGuideSession[] = [
  {
    id: 'sess-1', templateId: 'tpl-1', reservationId: 'res-101', guestName: 'Jean Dupont', propertyName: 'Apt Bellecour – T2 Premium', token: 'abc123', checkIn: new Date('2024-06-15'), checkOut: new Date('2024-06-18'),
    completedSteps: ['s1', 's2', 's3', 's4', 's5'], stepTimestamps: {}, upsellsViewed: ['u1', 'u2'], upsellsAccepted: ['u1'], completedAt: new Date('2024-06-15T16:30:00'), createdAt: new Date('2024-06-14'),
  },
  {
    id: 'sess-2', templateId: 'tpl-1', reservationId: 'res-102', guestName: 'Emma Wilson', propertyName: 'Apt Bellecour – T2 Premium', token: 'def456', checkIn: new Date('2024-06-20'), checkOut: new Date('2024-06-23'),
    completedSteps: ['s1', 's2'], stepTimestamps: {}, upsellsViewed: [], upsellsAccepted: [], createdAt: new Date('2024-06-19'),
  },
  {
    id: 'sess-3', templateId: 'tpl-2', reservationId: 'res-103', guestName: 'Marco Rossi', propertyName: 'Studio Marais – Charme', token: 'ghi789', checkIn: new Date('2024-06-22'), checkOut: new Date('2024-06-25'),
    completedSteps: ['s1b', 's2b', 's3b', 's4b', 's5b'], stepTimestamps: {}, upsellsViewed: ['u4', 'u5'], upsellsAccepted: ['u4', 'u5'], completedAt: new Date('2024-06-22T15:00:00'), createdAt: new Date('2024-06-21'),
  },
];

export function useWelcomeGuide() {
  const [templates, setTemplates] = useState<WelcomeGuideTemplate[]>(MOCK_TEMPLATES);
  const [sessions] = useState<WelcomeGuideSession[]>(MOCK_SESSIONS);
  const [selectedTemplate, setSelectedTemplate] = useState<WelcomeGuideTemplate | null>(null);

  const analytics: WelcomeGuideAnalytics = {
    totalSessions: sessions.length,
    completionRate: Math.round((sessions.filter(s => s.completedAt).length / sessions.length) * 100),
    averageCompletionTime: 12,
    upsellConversionRate: 45,
    upsellRevenue: 83,
    stepDropoffRates: { 'building_arrival': 5, 'key_access': 12, 'apartment_access': 8, 'welcome': 2, 'upsell': 15 },
  };

  const toggleTemplate = useCallback((id: string) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t));
  }, []);

  return { templates, sessions, analytics, selectedTemplate, setSelectedTemplate, toggleTemplate };
}
