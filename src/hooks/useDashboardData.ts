import { useMemo } from 'react';
import { format, isToday, parseISO, startOfDay } from 'date-fns';
import { properties, bookingsData } from '@/hooks/calendar/mockData';
import { initialTodayTasks, initialTomorrowTasks } from '@/contexts/cleaning/initialState';

export interface TodayBooking {
  id: number;
  guestName: string;
  propertyName: string;
  channel: 'airbnb' | 'booking' | 'direct';
  time: string;
  status: 'confirmed' | 'pending' | 'issue';
  cleaningTaskStatus?: string;
}

export interface TodayTask {
  id: number | string;
  type: 'cleaning' | 'maintenance' | 'repasse';
  property: string;
  agent: string | null;
  time: string;
  status: string;
}

export interface DashboardStats {
  checkInsToday: number;
  checkOutsToday: number;
  scheduledMessages: number;
  unassignedTasks: number;
}

// Generate realistic today's data
const generateTodayBookings = () => {
  const today = new Date();
  
  // Mock check-ins for today
  const checkIns: TodayBooking[] = [
    {
      id: 101,
      guestName: 'Marie Dubois',
      propertyName: 'Appartement 12 Rue du Port',
      channel: 'airbnb',
      time: '15:00',
      status: 'confirmed'
    },
    {
      id: 102,
      guestName: 'Pierre Martin',
      propertyName: 'Studio 8 Avenue des Fleurs',
      channel: 'booking',
      time: '16:00',
      status: 'confirmed'
    },
    {
      id: 103,
      guestName: 'Jean-Luc Bernard',
      propertyName: 'Loft 72 Rue des Arts',
      channel: 'airbnb',
      time: '17:00',
      status: 'pending'
    },
    {
      id: 104,
      guestName: 'Sophie Leroy',
      propertyName: 'Maison 23 Rue de la Paix',
      channel: 'direct',
      time: '14:00',
      status: 'confirmed'
    }
  ];

  // Mock check-outs for today
  const checkOuts: TodayBooking[] = [
    {
      id: 201,
      guestName: 'Thomas Petit',
      propertyName: 'Appartement 12 Rue du Port',
      channel: 'airbnb',
      time: '11:00',
      status: 'confirmed',
      cleaningTaskStatus: 'inProgress'
    },
    {
      id: 202,
      guestName: 'Claire Moreau',
      propertyName: 'Studio 8 Avenue des Fleurs',
      channel: 'booking',
      time: '10:00',
      status: 'confirmed',
      cleaningTaskStatus: 'completed'
    },
    {
      id: 203,
      guestName: 'Lucas Girard',
      propertyName: 'Loft 72 Rue des Arts',
      channel: 'airbnb',
      time: '12:00',
      status: 'confirmed',
      cleaningTaskStatus: 'todo'
    }
  ];

  return { checkIns, checkOuts };
};

// Generate today's tasks from cleaning context
const generateTodayTasks = (): TodayTask[] => {
  const cleaningTasks: TodayTask[] = initialTodayTasks.map(task => ({
    id: task.id,
    type: task.taskType === 'repasse' ? 'repasse' : 'cleaning',
    property: task.property,
    agent: task.cleaningAgent,
    time: task.checkoutTime || '11:00',
    status: task.status
  }));

  // Add some mock maintenance tasks for today
  const maintenanceTasks: TodayTask[] = [
    {
      id: 'maint-1',
      type: 'maintenance',
      property: 'Appartement 45 Boulevard Central',
      agent: 'Jean Technicien',
      time: '09:00',
      status: 'inProgress'
    },
    {
      id: 'maint-2',
      type: 'maintenance',
      property: 'Studio 15 Rue des Lilas',
      agent: null,
      time: '14:00',
      status: 'todo'
    }
  ];

  return [...cleaningTasks, ...maintenanceTasks];
};

export const useDashboardData = () => {
  const { checkIns, checkOuts } = useMemo(() => generateTodayBookings(), []);
  const tasks = useMemo(() => generateTodayTasks(), []);

  const stats: DashboardStats = useMemo(() => {
    const unassignedTasks = tasks.filter(t => !t.agent).length;
    
    return {
      checkInsToday: checkIns.length,
      checkOutsToday: checkOuts.length,
      scheduledMessages: 8, // Mock value for scheduled messages
      unassignedTasks
    };
  }, [checkIns, checkOuts, tasks]);

  return {
    checkIns,
    checkOuts,
    tasks,
    stats
  };
};
