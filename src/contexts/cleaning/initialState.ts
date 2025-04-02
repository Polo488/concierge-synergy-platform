
import { format } from 'date-fns';
import { CleaningTask, NewCleaningTask, CleaningStatus } from '@/types/cleaning';

// Initial sample cleaning tasks
export const initialTodayTasks: CleaningTask[] = [
  {
    id: 1,
    property: 'Appartement 12 Rue du Port',
    checkoutTime: '11:00',
    checkinTime: '15:00',
    status: 'todo',
    cleaningAgent: null,
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
    cleaningAgent: 'Lucas Martin',
    startTime: '',
    endTime: '',
    linens: ['Draps queen x1', 'Serviettes bain x2', 'Serviettes main x2', 'Peignoirs x2', 'Housse de couette queen x1', 'Taies d\'oreiller x2'],
    consumables: ['Capsules café x4', 'Sachets thé x4', 'Gel douche x2', 'Shampoing x2'],
    comments: 'Vérifier l\'état du four',
    problems: []
  }
];

export const initialTomorrowTasks: CleaningTask[] = [
  {
    id: 4,
    property: 'Maison 23 Rue de la Paix',
    checkoutTime: '10:00',
    checkinTime: '15:00',
    status: 'scheduled',
    cleaningAgent: null,
    startTime: '',
    endTime: '',
    linens: ['Draps king size x2', 'Serviettes bain x4', 'Serviettes main x4', 'Peignoirs x2', 'Housse de couette king size x2', 'Taies d\'oreiller x4'],
    consumables: ['Capsules café x6', 'Sachets thé x4', 'Gel douche x2', 'Shampoing x2'],
    comments: '',
    problems: []
  },
  {
    id: 5,
    property: 'Appartement 45 Boulevard Central',
    checkoutTime: '11:00',
    checkinTime: '14:00',
    status: 'scheduled',
    cleaningAgent: 'Marie Lambert',
    startTime: '',
    endTime: '',
    linens: ['Draps queen x1', 'Serviettes bain x2', 'Serviettes main x2', 'Housse de couette queen x1', 'Taies d\'oreiller x2'],
    consumables: ['Capsules café x4', 'Sachets thé x2', 'Gel douche x1', 'Shampoing x1'],
    comments: '',
    problems: []
  }
];

export const initialCompletedTasks: CleaningTask[] = [
  {
    id: 6,
    property: 'Studio 15 Rue des Lilas',
    date: '2023-11-21',
    status: 'completed',
    cleaningAgent: 'Lucas Martin',
    startTime: '10:30',
    endTime: '11:45',
    linens: ['Draps simple x1', 'Serviettes bain x1', 'Serviettes main x1', 'Housse de couette simple x1', 'Taie d\'oreiller x1'],
    consumables: ['Capsules café x2', 'Sachets thé x2', 'Gel douche x1'],
    comments: '',
    problems: []
  },
  {
    id: 7,
    property: 'Appartement 28 Avenue Victor Hugo',
    date: '2023-11-21',
    status: 'completed',
    cleaningAgent: 'Marie Lambert',
    startTime: '13:00',
    endTime: '14:30',
    linens: ['Draps queen x1', 'Serviettes bain x2', 'Serviettes main x2', 'Housse de couette queen x1', 'Taies d\'oreiller x2'],
    consumables: ['Capsules café x4', 'Sachets thé x2', 'Gel douche x1', 'Shampoing x1'],
    comments: '',
    problems: []
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
