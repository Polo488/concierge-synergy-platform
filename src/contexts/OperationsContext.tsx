
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { 
  LinkedOperationalTask, 
  MessagingMaintenanceFormData, 
  MessagingCleaningIssueFormData,
  MessagingOperationsStats 
} from '@/types/operations';
import { MaintenanceTask, NewMaintenanceFormData } from '@/types/maintenance';
import { CleaningIssue, CleaningTask, CleaningIssueType, NewCleaningTask } from '@/types/cleaning';
import { toast } from 'sonner';

interface OperationsContextType {
  // Linked tasks created from messaging
  linkedTasks: LinkedOperationalTask[];
  
  // Stats
  stats: MessagingOperationsStats;
  
  // Creation functions
  createMaintenanceFromMessaging: (data: MessagingMaintenanceFormData) => MaintenanceTask;
  createCleaningIssueFromMessaging: (data: MessagingCleaningIssueFormData) => CleaningIssue;
  createRepasseFromMessaging: (
    issueId: number,
    propertyId: string,
    propertyName: string,
    conversationId: string,
    reservationId?: string
  ) => CleaningTask;
  
  // Query functions
  getTasksByConversation: (conversationId: string) => LinkedOperationalTask[];
  getTasksByProperty: (propertyId: string) => LinkedOperationalTask[];
  getTasksByReservation: (reservationId: string) => LinkedOperationalTask[];
  
  // Check for duplicates
  hasSimilarTask: (
    conversationId: string, 
    taskType: 'maintenance' | 'cleaning_issue' | 'repasse'
  ) => boolean;
  
  // Navigation helpers
  getConversationIdForTask: (taskId: string, taskType: string) => string | null;
}

const OperationsContext = createContext<OperationsContextType | undefined>(undefined);

export const OperationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [linkedTasks, setLinkedTasks] = useState<LinkedOperationalTask[]>([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>([]);
  const [cleaningIssues, setCleaningIssues] = useState<CleaningIssue[]>([]);
  const [repasseTasks, setRepasseTasks] = useState<CleaningTask[]>([]);

  // Calculate stats
  const stats: MessagingOperationsStats = {
    maintenanceFromMessaging: linkedTasks.filter(t => t.type === 'maintenance').length,
    cleaningIssuesFromMessaging: linkedTasks.filter(t => t.type === 'cleaning_issue').length,
    repassesFromMessaging: linkedTasks.filter(t => t.type === 'repasse').length,
    issuesPerProperty: linkedTasks.reduce((acc, task) => {
      acc[task.propertyId] = (acc[task.propertyId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    issuesPerReservation: linkedTasks.reduce((acc, task) => {
      if (task.reservationId) {
        acc[task.reservationId] = (acc[task.reservationId] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>),
  };

  const createMaintenanceFromMessaging = useCallback((data: MessagingMaintenanceFormData): MaintenanceTask => {
    const taskId = Date.now();
    
    const newTask: MaintenanceTask = {
      id: taskId,
      title: data.title,
      property: data.propertyName,
      propertyId: data.propertyId,
      urgency: data.urgency,
      description: data.description,
      createdAt: new Date().toISOString().split('T')[0],
      notes: data.prefilledMessage ? `Source: Message voyageur\n\n${data.prefilledMessage}` : 'Source: Message voyageur',
    };

    setMaintenanceTasks(prev => [newTask, ...prev]);

    // Create linked task reference
    const linkedTask: LinkedOperationalTask = {
      id: `maint-${taskId}`,
      type: 'maintenance',
      title: data.title,
      status: 'En attente',
      propertyId: data.propertyId,
      propertyName: data.propertyName,
      reservationId: data.reservationId,
      conversationId: data.conversationId,
      createdAt: new Date(),
      source: 'guest_message',
      canNavigateToTask: true,
      canNavigateToConversation: true,
    };

    setLinkedTasks(prev => [...prev, linkedTask]);

    toast.success("Tâche de maintenance créée", {
      description: `"${data.title}" - origine: message voyageur`,
    });

    return newTask;
  }, []);

  const createCleaningIssueFromMessaging = useCallback((data: MessagingCleaningIssueFormData): CleaningIssue => {
    const issueId = Date.now();

    const newIssue: CleaningIssue = {
      id: issueId,
      propertyId: data.propertyId,
      propertyName: data.propertyName,
      linkedReservationId: data.reservationId,
      source: 'reservation',
      issueType: data.issueTypes[0] as CleaningIssueType,
      issueTypes: data.issueTypes as CleaningIssueType[],
      description: data.description,
      photos: data.photos,
      repasseRequired: data.repasseRequired,
      status: 'open',
      createdAt: new Date().toISOString(),
      createdBy: 'Messagerie',
    };

    setCleaningIssues(prev => [...prev, newIssue]);

    // Create linked task reference
    const linkedTask: LinkedOperationalTask = {
      id: `issue-${issueId}`,
      type: 'cleaning_issue',
      title: `Problème: ${data.issueTypes.join(', ')}`,
      status: 'Ouvert',
      propertyId: data.propertyId,
      propertyName: data.propertyName,
      reservationId: data.reservationId,
      conversationId: data.conversationId,
      createdAt: new Date(),
      source: 'guest_message',
      canNavigateToTask: true,
      canNavigateToConversation: true,
    };

    setLinkedTasks(prev => [...prev, linkedTask]);

    toast.success("Problème ménage signalé", {
      description: `${data.issueTypes.length} type(s) de problème - origine: message voyageur`,
    });

    return newIssue;
  }, []);

  const createRepasseFromMessaging = useCallback((
    issueId: number,
    propertyId: string,
    propertyName: string,
    conversationId: string,
    reservationId?: string
  ): CleaningTask => {
    const taskId = Date.now();

    const newRepasse: CleaningTask = {
      id: taskId,
      property: propertyName,
      status: 'scheduled',
      cleaningAgent: null,
      startTime: '14:00',
      endTime: '16:00',
      date: new Date().toISOString().split('T')[0],
      linens: [],
      consumables: [],
      comments: `Repasse suite au message voyageur - Issue #${issueId}`,
      problems: [],
      taskType: 'repasse',
      linkedIssueId: issueId,
    };

    setRepasseTasks(prev => [...prev, newRepasse]);

    // Create linked task reference
    const linkedTask: LinkedOperationalTask = {
      id: `repasse-${taskId}`,
      type: 'repasse',
      title: `Repasse - ${propertyName}`,
      status: 'Planifiée',
      propertyId,
      propertyName,
      reservationId,
      conversationId,
      createdAt: new Date(),
      source: 'guest_message',
      canNavigateToTask: true,
      canNavigateToConversation: true,
    };

    setLinkedTasks(prev => [...prev, linkedTask]);

    toast.success("Repasse planifiée", {
      description: `Repasse créée pour ${propertyName} - origine: message voyageur`,
    });

    return newRepasse;
  }, []);

  const getTasksByConversation = useCallback((conversationId: string) => {
    return linkedTasks.filter(t => t.conversationId === conversationId);
  }, [linkedTasks]);

  const getTasksByProperty = useCallback((propertyId: string) => {
    return linkedTasks.filter(t => t.propertyId === propertyId);
  }, [linkedTasks]);

  const getTasksByReservation = useCallback((reservationId: string) => {
    return linkedTasks.filter(t => t.reservationId === reservationId);
  }, [linkedTasks]);

  const hasSimilarTask = useCallback((
    conversationId: string,
    taskType: 'maintenance' | 'cleaning_issue' | 'repasse'
  ) => {
    const recentTasks = linkedTasks.filter(t => 
      t.conversationId === conversationId && 
      t.type === taskType &&
      // Created within last hour
      (Date.now() - t.createdAt.getTime()) < 60 * 60 * 1000
    );
    return recentTasks.length > 0;
  }, [linkedTasks]);

  const getConversationIdForTask = useCallback((taskId: string, taskType: string) => {
    const task = linkedTasks.find(t => 
      t.id === taskId || 
      t.id === `${taskType}-${taskId}` ||
      t.id.includes(taskId)
    );
    return task?.conversationId || null;
  }, [linkedTasks]);

  return (
    <OperationsContext.Provider value={{
      linkedTasks,
      stats,
      createMaintenanceFromMessaging,
      createCleaningIssueFromMessaging,
      createRepasseFromMessaging,
      getTasksByConversation,
      getTasksByProperty,
      getTasksByReservation,
      hasSimilarTask,
      getConversationIdForTask,
    }}>
      {children}
    </OperationsContext.Provider>
  );
};

export const useOperations = () => {
  const context = useContext(OperationsContext);
  if (!context) {
    throw new Error('useOperations must be used within an OperationsProvider');
  }
  return context;
};
