
import { format } from 'date-fns';
import { CleaningTask, NewCleaningTask, CleaningStatus, CleaningPhoto } from '@/types/cleaning';

import photoSalon from '@/assets/cleaning/photo-salon.jpg';
import photoCuisine from '@/assets/cleaning/photo-cuisine.jpg';
import photoChambre from '@/assets/cleaning/photo-chambre.jpg';
import photoSdb from '@/assets/cleaning/photo-sdb.jpg';
import photoEntree from '@/assets/cleaning/photo-entree.jpg';
import photoChambre2 from '@/assets/cleaning/photo-chambre2.jpg';
import photoSdb2 from '@/assets/cleaning/photo-sdb2.jpg';
import photoCuisine2 from '@/assets/cleaning/photo-cuisine2.jpg';

// Initial sample cleaning tasks
export const initialTodayTasks: CleaningTask[] = [
  {
    id: 1,
    property: 'Appartement 12 Rue du Port',
    checkoutTime: '11:00',
    checkinTime: '15:00',
    status: 'todo',
    cleaningAgent: 'Marie Lambert',
    startTime: '',
    endTime: '',
    linens: ['Draps king size x1', 'Serviettes bain x2', 'Serviettes main x2', 'Housse de couette king size x1', 'Taies d\'oreiller x2'],
    consumables: ['Capsules café x4', 'Sachets thé x2', 'Gel douche x1', 'Shampoing x1'],
    comments: 'Attention aux taches sur le canapé',
    problems: []
  },
  {
    id: 2,
    property: 'Studio 8 Avenue des Fleurs',
    checkoutTime: '10:00',
    checkinTime: '16:00',
    status: 'inProgress',
    cleaningAgent: 'Marie Lambert',
    startTime: '10:30',
    endTime: '',
    linens: ['Draps simple x1', 'Serviettes bain x1', 'Serviettes main x1', 'Housse de couette simple x1', 'Taie d\'oreiller x1'],
    consumables: ['Capsules café x2', 'Sachets thé x2', 'Gel douche x1'],
    comments: '',
    problems: []
  },
  {
    id: 3,
    property: 'Loft 72 Rue des Arts',
    checkoutTime: '12:00',
    checkinTime: '17:00',
    status: 'todo',
    cleaningAgent: null,
    startTime: '',
    endTime: '',
    linens: ['Draps queen x1', 'Serviettes bain x2', 'Serviettes main x2', 'Peignoirs x2', 'Housse de couette queen x1', 'Taies d\'oreiller x2'],
    consumables: ['Capsules café x4', 'Sachets thé x4', 'Gel douche x2', 'Shampoing x2'],
    comments: 'Changer les draps de la chambre principale',
    problems: []
  },
  {
    id: 8,
    property: 'Maison 23 Rue de la Paix',
    checkoutTime: '09:00',
    checkinTime: '14:00',
    status: 'completed',
    cleaningAgent: 'Sophie Renard',
    startTime: '09:15',
    endTime: '11:30',
    linens: ['Draps king size x2', 'Serviettes bain x4', 'Serviettes main x4'],
    consumables: ['Capsules café x6', 'Gel douche x2', 'Shampoing x2'],
    comments: '',
    problems: [],
    photos: [
      { id: 'p1', url: photoSalon, caption: 'Salon', timestamp: '2026-03-31T11:23:00', agent: 'Sophie Renard' },
      { id: 'p2', url: photoCuisine, caption: 'Cuisine', timestamp: '2026-03-31T11:31:00', agent: 'Sophie Renard' },
      { id: 'p3', url: photoChambre, caption: 'Chambre principale', timestamp: '2026-03-31T11:45:00', agent: 'Sophie Renard' },
      { id: 'p4', url: photoSdb, caption: 'Salle de bain', timestamp: '2026-03-31T11:52:00', agent: 'Sophie Renard' },
      { id: 'p5', url: photoEntree, caption: 'Entrée', timestamp: '2026-03-31T12:01:00', agent: 'Sophie Renard' },
    ],
  }
];

export const initialTomorrowTasks: CleaningTask[] = [
  {
    id: 4,
    property: 'Appartement 45 Boulevard Central',
    checkoutTime: '11:00',
    checkinTime: '15:00',
    status: 'scheduled',
    cleaningAgent: 'Marie Lambert',
    startTime: '',
    endTime: '',
    linens: ['Draps queen x1', 'Serviettes bain x2', 'Serviettes main x2', 'Housse de couette queen x1', 'Taies d\'oreiller x2'],
    consumables: ['Capsules café x4', 'Sachets thé x2', 'Gel douche x1', 'Shampoing x1'],
    comments: '',
    problems: []
  },
  {
    id: 5,
    property: 'Studio 15 Rue des Lilas',
    checkoutTime: '10:00',
    checkinTime: '14:00',
    status: 'scheduled',
    cleaningAgent: null,
    startTime: '',
    endTime: '',
    linens: ['Draps simple x1', 'Serviettes bain x1', 'Serviettes main x1'],
    consumables: ['Capsules café x2', 'Sachets thé x2', 'Gel douche x1'],
    comments: 'Vérifier l\'état de la machine à laver',
    problems: []
  }
];

export const initialCompletedTasks: CleaningTask[] = [
  {
    id: 6,
    property: 'Studio 15 Rue des Lilas',
    date: '2026-03-30',
    status: 'completed',
    cleaningAgent: 'Lucas Martin',
    startTime: '10:30',
    endTime: '11:45',
    linens: ['Draps simple x1', 'Serviettes bain x1', 'Serviettes main x1', 'Housse de couette simple x1', 'Taie d\'oreiller x1'],
    consumables: ['Capsules café x2', 'Sachets thé x2', 'Gel douche x1'],
    comments: '',
    problems: [],
    photos: [
      { id: 'p6', url: photoChambre2, caption: 'Chambre', timestamp: '2026-03-30T11:20:00', agent: 'Lucas Martin' },
      { id: 'p7', url: photoSdb2, caption: 'Salle de bain', timestamp: '2026-03-30T11:28:00', agent: 'Lucas Martin' },
      { id: 'p8', url: photoCuisine2, caption: 'Cuisine', timestamp: '2026-03-30T11:35:00', agent: 'Lucas Martin' },
      { id: 'p9', url: photoEntree, caption: 'Entrée', timestamp: '2026-03-30T11:40:00', agent: 'Lucas Martin' },
    ],
  },
  {
    id: 7,
    property: 'Appartement 28 Avenue Victor Hugo',
    date: '2026-03-30',
    status: 'completed',
    cleaningAgent: 'Marie Lambert',
    startTime: '13:00',
    endTime: '14:30',
    linens: ['Draps queen x1', 'Serviettes bain x2', 'Serviettes main x2', 'Housse de couette queen x1', 'Taies d\'oreiller x2'],
    consumables: ['Capsules café x4', 'Sachets thé x2', 'Gel douche x1', 'Shampoing x1'],
    comments: '',
    problems: [],
    photos: [
      { id: 'p10', url: photoSalon, caption: 'Salon', timestamp: '2026-03-30T14:05:00', agent: 'Marie Lambert' },
      { id: 'p11', url: photoChambre, caption: 'Chambre', timestamp: '2026-03-30T14:12:00', agent: 'Marie Lambert' },
      { id: 'p12', url: photoSdb, caption: 'Salle de bain', timestamp: '2026-03-30T14:18:00', agent: 'Marie Lambert' },
    ],
  }
];

// Initial new task template
export const initialNewTask: NewCleaningTask = {
  property: '',
  checkoutTime: '11:00',
  checkinTime: '15:00',
  status: 'todo',
  cleaningAgent: '',
  date: format(new Date(), 'yyyy-MM-dd'),
  linens: ['Serviettes bain x2', 'Serviettes main x2', 'Housse de couette queen x1', 'Taies d\'oreiller x2'],
  consumables: ['Capsules café x4', 'Sachets thé x2'],
  comments: ''
};
