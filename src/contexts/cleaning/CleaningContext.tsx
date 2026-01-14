
import { createContext, useContext, useState, ReactNode } from 'react';
import { fr } from 'date-fns/locale';
import { CleaningTask, CleaningStatus, NewCleaningTask, CleaningTaskRating } from '@/types/cleaning';
import { useLanguage } from '@/contexts/LanguageContext';
import { CleaningContextType, CleaningProviderProps, CleaningRatingData } from './types';
import { createCleaningActions } from './actions';
import { createCleaningHelpers } from './helpers';
import { initialTodayTasks, initialTomorrowTasks, initialCompletedTasks, initialNewTask } from './initialState';
import { toast } from '@/components/ui/use-toast';

const CleaningContext = createContext<CleaningContextType | undefined>(undefined);

export const CleaningProvider = ({ children }: CleaningProviderProps) => {
  const { language, t } = useLanguage();
  const dateLocale = language === 'fr' ? fr : undefined;
  
  // Tasks data state
  const [todayCleaningTasks, setTodayCleaningTasks] = useState<CleaningTask[]>(initialTodayTasks);
  const [tomorrowCleaningTasks, setTomorrowCleaningTasks] = useState<CleaningTask[]>(initialTomorrowTasks);
  const [completedCleaningTasks, setCompletedCleaningTasks] = useState<CleaningTask[]>(initialCompletedTasks);
  
  // UI state
  const [currentTask, setCurrentTask] = useState<CleaningTask | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [problemDescription, setProblemDescription] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState("today");
  const [selectedTasks, setSelectedTasks] = useState<CleaningTask[]>([]);
  const [labelType, setLabelType] = useState<"standard" | "detailed" | "qrcode">("standard");
  const [taskComments, setTaskComments] = useState<string>("");
  
  // Dialog state
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [problemDialogOpen, setProblemDialogOpen] = useState(false);
  const [calendarDialogOpen, setCalendarDialogOpen] = useState(false);
  const [labelsDialogOpen, setLabelsDialogOpen] = useState(false);
  const [addTaskDialogOpen, setAddTaskDialogOpen] = useState(false);
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);
  const [editCommentsDialogOpen, setEditCommentsDialogOpen] = useState(false);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [taskToRate, setTaskToRate] = useState<CleaningTask | null>(null);
  
  // New task form state
  const [newTask, setNewTask] = useState<NewCleaningTask>(initialNewTask);

  // Handle rating submission
  const handleSubmitRating = (ratingData: CleaningRatingData) => {
    const qualityRating: CleaningTaskRating = {
      rating: ratingData.rating,
      comment: ratingData.comment,
      tags: ratingData.tags,
      reworkRequired: ratingData.reworkRequired,
      reworkReason: ratingData.reworkReason,
      ratedAt: new Date().toISOString(),
      ratedBy: 'manager', // In real app, use current user
    };

    // Update the completed task with rating
    setCompletedCleaningTasks((prev) =>
      prev.map((task) =>
        task.id === ratingData.taskId
          ? { ...task, qualityRating }
          : task
      )
    );

    if (ratingData.rating > 0) {
      toast({
        title: 'Note enregistrée',
        description: `Note de ${ratingData.rating}/5 enregistrée pour ${taskToRate?.property}`,
      });
    }

    setRatingDialogOpen(false);
    setTaskToRate(null);
  };

  // Gather all state variables
  const state = {
    todayCleaningTasks,
    tomorrowCleaningTasks,
    completedCleaningTasks,
    currentTask,
    selectedAgent,
    problemDescription,
    selectedDate,
    activeTab,
    selectedTasks,
    labelType,
    taskComments,
    newTask,
    ratingDialogOpen,
    taskToRate
  };

  // Gather all state setters
  const stateSetters = {
    setTodayCleaningTasks,
    setTomorrowCleaningTasks,
    setCompletedCleaningTasks,
    setCurrentTask,
    setSelectedAgent,
    setProblemDescription,
    setSelectedDate,
    setActiveTab,
    setSelectedTasks,
    setLabelType,
    setTaskComments,
    setNewTask,
    setAssignDialogOpen,
    setDetailsDialogOpen,
    setProblemDialogOpen,
    setCalendarDialogOpen,
    setLabelsDialogOpen,
    setAddTaskDialogOpen,
    setDeleteConfirmDialogOpen,
    setEditCommentsDialogOpen,
    setRatingDialogOpen,
    setTaskToRate
  };

  // Create actions and helpers
  const actions = createCleaningActions(state, stateSetters, t);
  const helpers = createCleaningHelpers(state, stateSetters);

  const value: CleaningContextType = {
    // Data
    todayCleaningTasks,
    tomorrowCleaningTasks,
    completedCleaningTasks,
    currentTask,
    selectedAgent,
    problemDescription,
    selectedDate,
    activeTab,
    selectedTasks,
    labelType,
    taskComments,
    newTask,
    ratingDialogOpen,
    taskToRate,
    
    // Dialog states
    assignDialogOpen,
    detailsDialogOpen,
    problemDialogOpen,
    calendarDialogOpen,
    labelsDialogOpen,
    addTaskDialogOpen,
    deleteConfirmDialogOpen,
    editCommentsDialogOpen,
    
    // Setters
    setTodayCleaningTasks,
    setTomorrowCleaningTasks,
    setCompletedCleaningTasks,
    setCurrentTask,
    setSelectedAgent,
    setProblemDescription,
    setSelectedDate,
    setActiveTab,
    setSelectedTasks,
    setLabelType,
    setTaskComments,
    setNewTask,
    setRatingDialogOpen,
    setTaskToRate,
    
    // Dialog controllers
    setAssignDialogOpen,
    setDetailsDialogOpen,
    setProblemDialogOpen,
    setCalendarDialogOpen,
    setLabelsDialogOpen,
    setAddTaskDialogOpen,
    setDeleteConfirmDialogOpen,
    setEditCommentsDialogOpen,
    
    // Actions
    ...actions,
    handleSubmitRating,
    
    // Helpers
    ...helpers,
  };

  return (
    <CleaningContext.Provider value={value}>
      {children}
    </CleaningContext.Provider>
  );
};

export const useCleaning = () => {
  const context = useContext(CleaningContext);
  if (context === undefined) {
    throw new Error('useCleaning must be used within a CleaningProvider');
  }
  return context;
};
