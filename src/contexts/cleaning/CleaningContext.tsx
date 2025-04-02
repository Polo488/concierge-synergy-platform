
import { createContext, useContext, useState, ReactNode } from 'react';
import { fr } from 'date-fns/locale';
import { CleaningTask, CleaningStatus, NewCleaningTask } from '@/types/cleaning';
import { useLanguage } from '@/contexts/LanguageContext';
import { CleaningContextType, CleaningProviderProps } from './types';
import { createCleaningActions } from './actions';
import { createCleaningHelpers } from './helpers';
import { initialTodayTasks, initialTomorrowTasks, initialCompletedTasks, initialNewTask } from './initialState';

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
  
  // New task form state
  const [newTask, setNewTask] = useState<NewCleaningTask>(initialNewTask);

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
    newTask
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
    setEditCommentsDialogOpen
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
