
import { useState, useMemo, useCallback } from 'react';
import { 
  Conversation, 
  Message, 
  MessagingFilters, 
  ConversationStatus,
  ConversationTag,
  QuickReplyTemplate,
  MessageChannel,
  LinkedTask
} from '@/types/messaging';
import { addDays, subDays } from 'date-fns';

// Mock data for conversations
const generateMockConversations = (): Conversation[] => {
  const now = new Date();
  
  return [
    {
      id: 'conv-1',
      guestId: 'guest-1',
      guest: {
        id: 'guest-1',
        name: 'Jean-Pierre Dubois',
        firstName: 'Jean-Pierre',
        lastName: 'Dubois',
        email: 'jp.dubois@email.com',
        phone: '+33 6 12 34 56 78',
        language: 'Français',
        totalStays: 3,
        averageRating: 4.8,
      },
      reservationId: 'res-1',
      reservation: {
        id: 'res-1',
        propertyId: 'prop-1',
        propertyName: 'Appartement Marais',
        propertyAddress: '15 Rue des Archives, 75003 Paris',
        checkIn: addDays(now, 2),
        checkOut: addDays(now, 5),
        guests: 2,
        status: 'confirmed',
        channel: 'airbnb',
        totalAmount: 450,
        paidAmount: 450,
        accessCode: '1234#',
        wifiPassword: 'Marais2024!',
        wifiNetwork: 'Apt_Marais_Guest',
      },
      messages: [
        {
          id: 'msg-1-1',
          conversationId: 'conv-1',
          sender: 'guest',
          senderName: 'Jean-Pierre Dubois',
          content: "Bonjour, à quelle heure puis-je arriver pour le check-in ?",
          timestamp: subDays(now, 1),
          channel: 'airbnb',
          isRead: true,
          isInternal: false,
          isAutomated: false,
        },
        {
          id: 'msg-1-2',
          conversationId: 'conv-1',
          sender: 'team',
          senderName: 'Marie',
          content: "Bonjour Jean-Pierre ! Le check-in est possible à partir de 15h. Vous recevrez le code d'accès la veille de votre arrivée.",
          timestamp: subDays(now, 1),
          channel: 'airbnb',
          isRead: true,
          isInternal: false,
          isAutomated: false,
        },
        {
          id: 'msg-1-3',
          conversationId: 'conv-1',
          sender: 'guest',
          senderName: 'Jean-Pierre Dubois',
          content: "Parfait, merci beaucoup ! Est-il possible d'arriver un peu plus tôt, vers 14h ?",
          timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
          channel: 'airbnb',
          isRead: false,
          isInternal: false,
          isAutomated: false,
        },
      ],
      status: 'open',
      tags: [],
      isUnread: true,
      isPriority: false,
      lastMessageAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      lastMessagePreview: "Parfait, merci beaucoup ! Est-il possible d'arriver un peu plus tôt, vers 14h ?",
      linkedTasks: [],
      createdAt: subDays(now, 2),
      updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    },
    {
      id: 'conv-2',
      guestId: 'guest-2',
      guest: {
        id: 'guest-2',
        name: 'Sarah Johnson',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.j@email.com',
        phone: '+1 555 123 4567',
        language: 'English',
        totalStays: 1,
        averageRating: undefined,
      },
      reservationId: 'res-2',
      reservation: {
        id: 'res-2',
        propertyId: 'prop-2',
        propertyName: 'Studio Saint-Germain',
        propertyAddress: '28 Rue de Buci, 75006 Paris',
        checkIn: now,
        checkOut: addDays(now, 3),
        guests: 1,
        status: 'confirmed',
        channel: 'booking',
        totalAmount: 320,
        paidAmount: 320,
        accessCode: '5678#',
        wifiPassword: 'StGermain2024!',
        wifiNetwork: 'Studio_StGermain',
      },
      messages: [
        {
          id: 'msg-2-1',
          conversationId: 'conv-2',
          sender: 'system',
          senderName: 'Système',
          content: "Message automatique: Bienvenue Sarah ! Votre réservation est confirmée. Voici les informations d'accès...",
          timestamp: subDays(now, 3),
          channel: 'booking',
          isRead: true,
          isInternal: false,
          isAutomated: true,
          automationRuleName: 'Confirmation de réservation',
        },
        {
          id: 'msg-2-2',
          conversationId: 'conv-2',
          sender: 'guest',
          senderName: 'Sarah Johnson',
          content: "Hi! I just arrived but the door code doesn't seem to work. Can you help?",
          timestamp: new Date(now.getTime() - 30 * 60 * 1000),
          channel: 'booking',
          isRead: false,
          isInternal: false,
          isAutomated: false,
        },
      ],
      status: 'open',
      tags: ['check-in-issue', 'urgent'],
      isUnread: true,
      isPriority: true,
      lastMessageAt: new Date(now.getTime() - 30 * 60 * 1000),
      lastMessagePreview: "Hi! I just arrived but the door code doesn't seem to work. Can you help?",
      linkedTasks: [],
      createdAt: subDays(now, 3),
      updatedAt: new Date(now.getTime() - 30 * 60 * 1000),
    },
    {
      id: 'conv-3',
      guestId: 'guest-3',
      guest: {
        id: 'guest-3',
        name: 'Marco Rossi',
        firstName: 'Marco',
        lastName: 'Rossi',
        email: 'marco.rossi@email.it',
        phone: '+39 333 123 4567',
        language: 'Italiano',
        totalStays: 5,
        averageRating: 4.9,
        notes: 'Client VIP - toujours très satisfait',
      },
      reservationId: 'res-3',
      reservation: {
        id: 'res-3',
        propertyId: 'prop-3',
        propertyName: 'Loft Bastille',
        propertyAddress: '45 Rue de la Roquette, 75011 Paris',
        checkIn: subDays(now, 2),
        checkOut: addDays(now, 1),
        guests: 4,
        status: 'confirmed',
        channel: 'direct',
        totalAmount: 680,
        paidAmount: 680,
        accessCode: '9012#',
        wifiPassword: 'Bastille2024!',
        wifiNetwork: 'Loft_Bastille_Guest',
      },
      messages: [
        {
          id: 'msg-3-1',
          conversationId: 'conv-3',
          sender: 'guest',
          senderName: 'Marco Rossi',
          content: "Ciao! L'appartamento è fantastico come sempre. Avete il servizio di late checkout disponibile?",
          timestamp: subDays(now, 1),
          channel: 'direct',
          isRead: true,
          isInternal: false,
          isAutomated: false,
        },
        {
          id: 'msg-3-2',
          conversationId: 'conv-3',
          sender: 'team',
          senderName: 'Thomas',
          content: "Bonjour Marco ! Ravi que vous appréciiez le séjour. Oui, le late checkout est disponible jusqu'à 14h pour 30€. Souhaitez-vous en profiter ?",
          timestamp: subDays(now, 1),
          channel: 'direct',
          isRead: true,
          isInternal: false,
          isAutomated: false,
        },
        {
          id: 'msg-3-3',
          conversationId: 'conv-3',
          sender: 'team',
          senderName: 'Thomas',
          content: "[Note interne] Marco est un client VIP, lui proposer un upgrade gratuit si possible.",
          timestamp: subDays(now, 1),
          channel: 'direct',
          isRead: true,
          isInternal: true,
          isAutomated: false,
        },
        {
          id: 'msg-3-4',
          conversationId: 'conv-3',
          sender: 'guest',
          senderName: 'Marco Rossi',
          content: "Perfetto! Sì, vorrei il late checkout per favore.",
          timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000),
          channel: 'direct',
          isRead: true,
          isInternal: false,
          isAutomated: false,
        },
      ],
      status: 'pending',
      tags: ['vip', 'upsell'],
      assignedTo: 'user-thomas',
      assignedToName: 'Thomas',
      isUnread: false,
      isPriority: false,
      lastMessageAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
      lastMessagePreview: "Perfetto! Sì, vorrei il late checkout per favore.",
      linkedTasks: [
        {
          id: 'task-1',
          type: 'agenda',
          title: 'Late checkout - Marco Rossi',
          status: 'À faire',
          createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
        },
      ],
      createdAt: subDays(now, 5),
      updatedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
    },
    {
      id: 'conv-4',
      guestId: 'guest-4',
      guest: {
        id: 'guest-4',
        name: 'Emma Wilson',
        firstName: 'Emma',
        lastName: 'Wilson',
        email: 'emma.w@email.co.uk',
        phone: '+44 7700 900123',
        language: 'English',
        totalStays: 2,
        averageRating: 4.5,
      },
      reservationId: 'res-4',
      reservation: {
        id: 'res-4',
        propertyId: 'prop-1',
        propertyName: 'Appartement Marais',
        propertyAddress: '15 Rue des Archives, 75003 Paris',
        checkIn: subDays(now, 5),
        checkOut: subDays(now, 2),
        guests: 2,
        status: 'completed',
        channel: 'airbnb',
        totalAmount: 540,
        paidAmount: 540,
        accessCode: '1234#',
        wifiPassword: 'Marais2024!',
        wifiNetwork: 'Apt_Marais_Guest',
      },
      messages: [
        {
          id: 'msg-4-1',
          conversationId: 'conv-4',
          sender: 'guest',
          senderName: 'Emma Wilson',
          content: "Thank you so much for the wonderful stay! The apartment was perfect.",
          timestamp: subDays(now, 2),
          channel: 'airbnb',
          isRead: true,
          isInternal: false,
          isAutomated: false,
        },
        {
          id: 'msg-4-2',
          conversationId: 'conv-4',
          sender: 'team',
          senderName: 'Marie',
          content: "Thank you Emma! We're so glad you enjoyed your stay. Hope to see you again soon! 🙏",
          timestamp: subDays(now, 2),
          channel: 'airbnb',
          isRead: true,
          isInternal: false,
          isAutomated: false,
        },
      ],
      status: 'resolved',
      tags: [],
      isUnread: false,
      isPriority: false,
      lastMessageAt: subDays(now, 2),
      lastMessagePreview: "Thank you Emma! We're so glad you enjoyed your stay. Hope to see you again soon! 🙏",
      linkedTasks: [],
      createdAt: subDays(now, 6),
      updatedAt: subDays(now, 2),
    },
    {
      id: 'conv-5',
      guestId: 'guest-5',
      guest: {
        id: 'guest-5',
        name: 'Hans Mueller',
        firstName: 'Hans',
        lastName: 'Mueller',
        email: 'hans.mueller@email.de',
        phone: '+49 170 1234567',
        language: 'Deutsch',
        totalStays: 1,
      },
      reservationId: 'res-5',
      reservation: {
        id: 'res-5',
        propertyId: 'prop-4',
        propertyName: 'Duplex Montmartre',
        propertyAddress: '8 Rue Lepic, 75018 Paris',
        checkIn: addDays(now, 7),
        checkOut: addDays(now, 10),
        guests: 3,
        status: 'confirmed',
        channel: 'vrbo',
        totalAmount: 720,
        paidAmount: 360,
        accessCode: '3456#',
        wifiPassword: 'Montmartre2024!',
        wifiNetwork: 'Duplex_Montmartre',
      },
      messages: [
        {
          id: 'msg-5-1',
          conversationId: 'conv-5',
          sender: 'system',
          senderName: 'Système',
          content: "Message automatique: Votre réservation pour Duplex Montmartre est confirmée.",
          timestamp: subDays(now, 5),
          channel: 'vrbo',
          isRead: true,
          isInternal: false,
          isAutomated: true,
          automationRuleName: 'Confirmation de réservation',
        },
        {
          id: 'msg-5-2',
          conversationId: 'conv-5',
          sender: 'guest',
          senderName: 'Hans Mueller',
          content: "Guten Tag! Gibt es einen Parkplatz in der Nähe der Wohnung?",
          timestamp: subDays(now, 4),
          channel: 'vrbo',
          isRead: true,
          isInternal: false,
          isAutomated: false,
        },
        {
          id: 'msg-5-3',
          conversationId: 'conv-5',
          sender: 'team',
          senderName: 'Sophie',
          content: "Bonjour Hans ! Il y a un parking public à 200m de l'appartement. Je vous enverrai les détails avant votre arrivée.",
          timestamp: subDays(now, 4),
          channel: 'vrbo',
          isRead: true,
          isInternal: false,
          isAutomated: false,
        },
      ],
      status: 'resolved',
      tags: [],
      isUnread: false,
      isPriority: false,
      lastMessageAt: subDays(now, 4),
      lastMessagePreview: "Bonjour Hans ! Il y a un parking public à 200m de l'appartement.",
      linkedTasks: [],
      createdAt: subDays(now, 5),
      updatedAt: subDays(now, 4),
    },
  ];
};

const mockQuickReplies: QuickReplyTemplate[] = [
  {
    id: 'qr-1',
    name: 'Check-in instructions',
    content: "Bonjour {{guest_first_name}}, \n\nVoici les informations pour votre check-in :\n- Adresse : {{property_address}}\n- Code d'accès : {{access_code}}\n- WiFi : {{wifi_network}} / {{wifi_password}}\n\nLe check-in est possible à partir de 15h.\n\nBon séjour !",
    category: 'Check-in',
    variables: ['guest_first_name', 'property_address', 'access_code', 'wifi_network', 'wifi_password'],
  },
  {
    id: 'qr-2',
    name: 'Check-out reminder',
    content: "Bonjour {{guest_first_name}},\n\nNous espérons que vous avez passé un excellent séjour !\n\nPour rappel, le check-out est prévu demain avant 11h. Merci de :\n- Fermer toutes les fenêtres\n- Éteindre les lumières\n- Déposer les clés {{checkout_instructions}}\n\nMerci et à bientôt !",
    category: 'Check-out',
    variables: ['guest_first_name', 'checkout_instructions'],
  },
  {
    id: 'qr-3',
    name: 'Late checkout offer',
    content: "Bonjour {{guest_first_name}},\n\nSouhaiteriez-vous profiter d'un départ tardif ? Nous pouvons vous proposer un late checkout jusqu'à 14h pour {{late_checkout_price}}€.\n\nN'hésitez pas à nous confirmer si vous êtes intéressé(e) !",
    category: 'Upsell',
    variables: ['guest_first_name', 'late_checkout_price'],
  },
  {
    id: 'qr-4',
    name: 'Problem acknowledgment',
    content: "Bonjour {{guest_first_name}},\n\nNous avons bien reçu votre message concernant {{issue_description}}. Notre équipe s'en occupe immédiatement.\n\nNous revenons vers vous très rapidement avec une solution.\n\nMerci de votre patience.",
    category: 'Support',
    variables: ['guest_first_name', 'issue_description'],
  },
];

export const useMessaging = () => {
  const [conversations, setConversations] = useState<Conversation[]>(generateMockConversations());
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [filters, setFilters] = useState<MessagingFilters>({
    search: '',
    status: 'all',
    channel: 'all',
    propertyId: 'all',
    assignedTo: 'all',
    tags: [],
    unreadOnly: false,
  });

  const quickReplies = mockQuickReplies;

  // Get unique properties from conversations
  const properties = useMemo(() => {
    const propertyMap = new Map<string, { id: string; name: string }>();
    conversations.forEach(conv => {
      if (!propertyMap.has(conv.reservation.propertyId)) {
        propertyMap.set(conv.reservation.propertyId, {
          id: conv.reservation.propertyId,
          name: conv.reservation.propertyName,
        });
      }
    });
    return Array.from(propertyMap.values());
  }, [conversations]);

  // Filter conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter(conv => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          conv.guest.name.toLowerCase().includes(searchLower) ||
          conv.reservation.propertyName.toLowerCase().includes(searchLower) ||
          conv.lastMessagePreview.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status !== 'all' && conv.status !== filters.status) return false;

      // Channel filter
      if (filters.channel !== 'all' && conv.reservation.channel !== filters.channel) return false;

      // Property filter
      if (filters.propertyId !== 'all' && conv.reservation.propertyId !== filters.propertyId) return false;

      // Assigned filter
      if (filters.assignedTo !== 'all' && conv.assignedTo !== filters.assignedTo) return false;

      // Tags filter
      if (filters.tags.length > 0 && !filters.tags.some(tag => conv.tags.includes(tag))) return false;

      // Unread filter
      if (filters.unreadOnly && !conv.isUnread) return false;

      return true;
    }).sort((a, b) => {
      // Priority first, then by last message date
      if (a.isPriority && !b.isPriority) return -1;
      if (!a.isPriority && b.isPriority) return 1;
      return b.lastMessageAt.getTime() - a.lastMessageAt.getTime();
    });
  }, [conversations, filters]);

  // Selected conversation
  const selectedConversation = useMemo(() => {
    return conversations.find(c => c.id === selectedConversationId) || null;
  }, [conversations, selectedConversationId]);

  // Stats
  const stats = useMemo(() => ({
    total: conversations.length,
    unread: conversations.filter(c => c.isUnread).length,
    open: conversations.filter(c => c.status === 'open').length,
    pending: conversations.filter(c => c.status === 'pending').length,
    resolved: conversations.filter(c => c.status === 'resolved').length,
    priority: conversations.filter(c => c.isPriority).length,
  }), [conversations]);

  // Actions
  const selectConversation = useCallback((id: string) => {
    setSelectedConversationId(id);
    // Mark as read
    setConversations(prev => prev.map(conv => 
      conv.id === id ? { ...conv, isUnread: false, messages: conv.messages.map(m => ({ ...m, isRead: true })) } : conv
    ));
  }, []);

  const sendMessage = useCallback((conversationId: string, content: string, isInternal: boolean = false) => {
    const now = new Date();
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      sender: isInternal ? 'team' : 'team',
      senderName: 'Moi',
      content,
      timestamp: now,
      channel: selectedConversation?.reservation.channel || 'direct',
      isRead: true,
      isInternal,
      isAutomated: false,
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessageAt: now,
          lastMessagePreview: isInternal ? conv.lastMessagePreview : content.substring(0, 100),
          updatedAt: now,
        };
      }
      return conv;
    }));
  }, [selectedConversation]);

  const updateConversationStatus = useCallback((conversationId: string, status: ConversationStatus) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, status, updatedAt: new Date() } : conv
    ));
  }, []);

  const toggleTag = useCallback((conversationId: string, tag: ConversationTag) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const newTags = conv.tags.includes(tag) 
          ? conv.tags.filter(t => t !== tag)
          : [...conv.tags, tag];
        return { ...conv, tags: newTags, updatedAt: new Date() };
      }
      return conv;
    }));
  }, []);

  const togglePriority = useCallback((conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, isPriority: !conv.isPriority, updatedAt: new Date() } : conv
    ));
  }, []);

  const assignConversation = useCallback((conversationId: string, userId: string | undefined, userName: string | undefined) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, assignedTo: userId, assignedToName: userName, updatedAt: new Date() } 
        : conv
    ));
  }, []);

  const addLinkedTask = useCallback((conversationId: string, task: Omit<LinkedTask, 'id' | 'createdAt'>) => {
    const newTask: LinkedTask = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date(),
    };

    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, linkedTasks: [...conv.linkedTasks, newTask], updatedAt: new Date() } 
        : conv
    ));

    return newTask;
  }, []);

  return {
    conversations: filteredConversations,
    allConversations: conversations,
    selectedConversation,
    selectedConversationId,
    filters,
    setFilters,
    properties,
    quickReplies,
    stats,
    selectConversation,
    sendMessage,
    updateConversationStatus,
    toggleTag,
    togglePriority,
    assignConversation,
    addLinkedTask,
  };
};
