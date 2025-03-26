import { createContext, useContext, useState, ReactNode } from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from "sonner";
import { CleaningTask, CleaningStatus, NewCleaningTask } from '@/types/cleaning';
import { getNextId, sortTasksByDateTime } from '@/utils/cleaningUtils';

interface CleaningContextType {
  // Task collections
  todayCleaningTasks: CleaningTask[];
  tomorrowCleaningTasks: CleaningTask[];
  completedCleaningTasks: CleaningTask[];
  
  // Dialog states
  currentTask: CleaningTask | null;
  selectedAgent: string;
  problemDescription: string;
  selectedDate: Date;
  activeTab: string;
  selectedTasks: CleaningTask[];
  labelType: "standard" | "detailed" | "qrcode";
  taskComments: string;
  newTask: NewCleaningTask;
  
  // Dialog open/close states
  assignDialogOpen: boolean;
  detailsDialogOpen: boolean;
  problemDialogOpen: boolean;
  calendarDialogOpen: boolean;
  labelsDialogOpen: boolean;
  addTaskDialogOpen: boolean;
  deleteConfirmDialogOpen: boolean;
  editCommentsDialogOpen: boolean;
  
  // Setters
  setTodayCleaningTasks: (tasks: CleaningTask[]) => void;
  setTomorrowCleaningTasks: (tasks: CleaningTask[]) => void;
  setCompletedCleaningTasks: (tasks: CleaningTask[]) => void;
  setCurrentTask: (task: CleaningTask | null) => void;
  setSelectedAgent: (agent: string) => void;
  setProblemDescription: (description: string) => void;
  setSelectedDate: (date: Date) => void;
  setActiveTab: (tab: string) => void;
  setSelectedTasks: (tasks: CleaningTask[]) => void;
  setLabelType: (type: "standard" | "detailed" | "qrcode") => void;
  setTaskComments: (comments: string) => void;
  setNewTask: (task: NewCleaningTask) => void;
  
  // Dialog controllers
  setAssignDialogOpen: (open: boolean) => void;
  setDetailsDialogOpen: (open: boolean) => void;
  setProblemDialogOpen: (open: boolean) => void;
  setCalendarDialogOpen: (open: boolean) => void;
  setLabelsDialogOpen: (open: boolean) => void;
  setAddTaskDialogOpen: (open: boolean) => void;
  setDeleteConfirmDialogOpen: (open: boolean) => void;
  setEditCommentsDialogOpen: (open: boolean) => void;
  
  // Actions
  handleStartCleaning: (task: CleaningTask) => void;
  handleCompleteCleaning: (task: CleaningTask) => void;
  handleAssignAgent: () => void;
  handleReportProblem: () => void;
  handleExport: () => void;
  handleSync: () => void;
  handleDateChange: (date: Date | undefined) => void;
  handlePrintLabels: () => void;
  handleAddTask: () => void;
  handleDeleteTask: () => void;
  handleSaveComments: () => void;
  handleUpdateCheckTimes: (checkoutTime: string, checkinTime: string) => void;
  
  // Helpers
  openAssignDialog: (task: CleaningTask) => void;
  openDetailsDialog: (task: CleaningTask) => void;
  openProblemDialog: (task: CleaningTask) => void;
  openCalendarDialog: () => void;
  openLabelsDialog: () => void;
  openDeleteDialog: (task: CleaningTask) => void;
  handleEditComments: () => void;
  handleSelectTask: (task: CleaningTask) => void;
}

interface CleaningProviderProps {
  children: ReactNode;
}

// Initial sample cleaning tasks
const initialTodayTasks: CleaningTask[] = [
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
    comments: 'Attention aux taches sur le canapé'
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
    comments: ''
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
    comments: 'Vérifier l\'état du four'
  }
];

const initialTomorrowTasks: CleaningTask[] = [
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
    comments: ''
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
    comments: ''
  }
];

const initialCompletedTasks: CleaningTask[] = [
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
    comments: ''
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
    comments: ''
  }
];

// Initial new task template
const initialNewTask: NewCleaningTask = {
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

const CleaningContext = createContext<CleaningContextType | undefined>(undefined);

export const CleaningProvider = ({ children }: CleaningProviderProps) => {
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
  
  // Action handlers
  const handleStartCleaning = (task: CleaningTask) => {
    const updatedTasks = todayCleaningTasks.map(t => {
      if (t.id === task.id) {
        return {
          ...t,
          status: 'inProgress' as CleaningStatus,
          startTime: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        };
      }
      return t;
    });
    
    setTodayCleaningTasks(updatedTasks);
    
    toast("Ménage commencé", {
      description: `Le ménage pour ${task.property} a débuté.`
    });
  };

  const handleCompleteCleaning = (task: CleaningTask) => {
    const updatedTodayTasks = todayCleaningTasks.filter(t => t.id !== task.id);
    setTodayCleaningTasks(updatedTodayTasks);
    
    const now = new Date();
    const completedTask: CleaningTask = {
      ...task,
      status: 'completed' as CleaningStatus,
      date: now.toISOString().split('T')[0],
      endTime: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
    
    setCompletedCleaningTasks([completedTask, ...completedCleaningTasks]);
    
    toast("Ménage terminé", {
      description: `Le ménage pour ${task.property} a été complété avec succès.`
    });
  };

  const openAssignDialog = (task: CleaningTask) => {
    setCurrentTask(task);
    setSelectedAgent(task.cleaningAgent || "");
    setAssignDialogOpen(true);
  };

  const handleAssignAgent = () => {
    if (!currentTask) return;
    
    const updateTask = (tasks: CleaningTask[], taskId: number) => {
      return tasks.map(t => {
        if (t.id === taskId) {
          return { 
            ...t, 
            cleaningAgent: selectedAgent === "non_assigne" ? null : selectedAgent 
          };
        }
        return t;
      });
    };

    if (currentTask.status === 'todo' || currentTask.status === 'inProgress') {
      setTodayCleaningTasks(updateTask(todayCleaningTasks, currentTask.id));
    } else if (currentTask.status === 'scheduled') {
      setTomorrowCleaningTasks(updateTask(tomorrowCleaningTasks, currentTask.id));
    }

    setAssignDialogOpen(false);
    
    toast("Agent assigné", {
      description: `${selectedAgent === "non_assigne" ? "Aucun agent" : selectedAgent} a été assigné au ménage pour ${currentTask.property}.`
    });
  };

  const openDetailsDialog = (task: CleaningTask) => {
    setCurrentTask(task);
    setDetailsDialogOpen(true);
  };

  const openProblemDialog = (task: CleaningTask) => {
    setCurrentTask(task);
    setProblemDialogOpen(true);
    setProblemDescription("");
  };

  const handleReportProblem = () => {
    toast.error("Problème signalé", {
      description: `Un problème a été signalé pour ${currentTask?.property}. L'équipe de support a été notifiée.`
    });
    setProblemDialogOpen(false);
  };

  const handleExport = () => {
    toast("Exportation réussie", {
      description: "Les données de ménage ont été exportées avec succès."
    });
  };

  const handleSync = () => {
    toast("Synchronisation réussie", {
      description: "Les données de ménage ont été synchronisées avec succès."
    });
  };

  const openCalendarDialog = () => {
    setCalendarDialogOpen(true);
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      
      if (isSameDay(date, new Date())) {
        setActiveTab("today");
      } else if (isSameDay(date, addDays(new Date(), 1))) {
        setActiveTab("tomorrow");
      } else {
        toast("Date sélectionnée", {
          description: `Vous avez sélectionné le ${format(date, 'dd MMMM yyyy', { locale: fr })}`
        });
      }
      
      setCalendarDialogOpen(false);
    }
  };

  const openLabelsDialog = () => {
    setSelectedTasks([]);
    setLabelType("standard");
    setLabelsDialogOpen(true);
  };

  const handleSelectTask = (task: CleaningTask) => {
    setSelectedTasks(prev => {
      const taskIndex = prev.findIndex(t => t.id === task.id);
      if (taskIndex === -1) {
        return [...prev, task];
      } else {
        return prev.filter(t => t.id !== task.id);
      }
    });
  };

  const handleAddTask = () => {
    const allTasks = [...todayCleaningTasks, ...tomorrowCleaningTasks, ...completedCleaningTasks];
    const id = getNextId(allTasks);
    
    const taskToAdd: CleaningTask = {
      ...newTask,
      id,
      cleaningAgent: newTask.cleaningAgent === '' || newTask.cleaningAgent === 'non_assigne' ? null : newTask.cleaningAgent,
      startTime: '',
      endTime: ''
    };
    
    // Déterminer dans quelle liste ajouter la tâche selon la date et le statut
    const taskDate = new Date(newTask.date);
    const today = new Date();
    const tomorrow = addDays(today, 1);
    
    if (isSameDay(taskDate, today)) {
      if (newTask.status === 'completed') {
        setCompletedCleaningTasks([taskToAdd, ...completedCleaningTasks]);
      } else {
        setTodayCleaningTasks([...todayCleaningTasks, taskToAdd]);
      }
      setActiveTab("today");
    } else if (isSameDay(taskDate, tomorrow)) {
      setTomorrowCleaningTasks([...tomorrowCleaningTasks, taskToAdd]);
      setActiveTab("tomorrow");
    } else {
      // Pour les dates futures, ajouter à "demain" avec statut planifié
      const scheduledTask: CleaningTask = { 
        ...taskToAdd, 
        status: 'scheduled' 
      };
      setTomorrowCleaningTasks([...tomorrowCleaningTasks, scheduledTask]);
      setActiveTab("tomorrow");
    }
    
    // Réinitialiser le formulaire
    setNewTask(initialNewTask);
    
    setAddTaskDialogOpen(false);
    
    toast("Ménage ajouté", {
      description: `Un nouveau ménage pour ${taskToAdd.property} a été ajouté.`
    });
  };

  const openDeleteDialog = (task: CleaningTask) => {
    setCurrentTask(task);
    setDeleteConfirmDialogOpen(true);
  };

  const handleDeleteTask = () => {
    if (!currentTask) return;
    
    // Trouver dans quelle liste est la tâche
    if (currentTask.status === 'completed') {
      setCompletedCleaningTasks(completedCleaningTasks.filter(t => t.id !== currentTask.id));
    } else if (currentTask.status === 'scheduled') {
      setTomorrowCleaningTasks(tomorrowCleaningTasks.filter(t => t.id !== currentTask.id));
    } else {
      setTodayCleaningTasks(todayCleaningTasks.filter(t => t.id !== currentTask.id));
    }
    
    setDeleteConfirmDialogOpen(false);
    
    toast.error("Ménage supprimé", {
      description: `Le ménage pour ${currentTask.property} a été supprimé.`
    });
  };

  const handlePrintLabels = () => {
    if (selectedTasks.length === 0) {
      toast.error("Sélection requise", {
        description: "Veuillez sélectionner au moins un ménage pour générer des étiquettes."
      });
      return;
    }

    import('@/utils/cleaningUtils').then(({ generateLabelsPrintWindow }) => {
      generateLabelsPrintWindow(selectedTasks);
      
      toast("Étiquettes générées", {
        description: `${selectedTasks.length} étiquette(s) prête(s) à imprimer.`
      });
      
      setLabelsDialogOpen(false);
    });
  };
  
  const handleEditComments = () => {
    if (!currentTask) return;
    
    setTaskComments(currentTask.comments);
    setDetailsDialogOpen(false);
    setEditCommentsDialogOpen(true);
  };
  
  const handleSaveComments = () => {
    if (!currentTask) return;
    
    // Update comments in the appropriate task list
    if (currentTask.status === 'completed') {
      setCompletedCleaningTasks(completedCleaningTasks.map(t => 
        t.id === currentTask.id ? {...t, comments: taskComments} : t
      ));
    } else if (currentTask.status === 'scheduled') {
      setTomorrowCleaningTasks(tomorrowCleaningTasks.map(t => 
        t.id === currentTask.id ? {...t, comments: taskComments} : t
      ));
    } else {
      setTodayCleaningTasks(todayCleaningTasks.map(t => 
        t.id === currentTask.id ? {...t, comments: taskComments} : t
      ));
    }
    
    toast("Commentaires modifiés", {
      description: `Les commentaires pour ${currentTask.property} ont été mis à jour.`
    });
    
    setEditCommentsDialogOpen(false);
  };

  // Nouvel handler pour la mise à jour des heures de check-in/check-out
  const handleUpdateCheckTimes = (checkoutTime: string, checkinTime: string) => {
    if (!currentTask) return;
    
    const updateTask = (tasks: CleaningTask[], taskId: number) => {
      return tasks.map(t => {
        if (t.id === taskId) {
          return { 
            ...t, 
            checkoutTime,
            checkinTime
          };
        }
        return t;
      });
    };

    // Mettre à jour la tâche dans la liste appropriée selon son statut
    if (currentTask.status === 'todo' || currentTask.status === 'inProgress') {
      setTodayCleaningTasks(updateTask(todayCleaningTasks, currentTask.id));
    } else if (currentTask.status === 'scheduled') {
      setTomorrowCleaningTasks(updateTask(tomorrowCleaningTasks, currentTask.id));
    } else if (currentTask.status === 'completed') {
      setCompletedCleaningTasks(updateTask(completedCleaningTasks, currentTask.id));
    }
    
    // Mettre à jour la tâche courante
    setCurrentTask({
      ...currentTask,
      checkoutTime,
      checkinTime
    });
    
    toast("Horaires mis à jour", {
      description: `Les horaires de check-in/check-out pour ${currentTask.property} ont été mis à jour.`
    });
  };

  const value = {
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
    handleStartCleaning,
    handleCompleteCleaning,
    handleAssignAgent,
    handleReportProblem,
    handleExport,
    handleSync,
    handleDateChange,
    handlePrintLabels,
    handleAddTask,
    handleDeleteTask,
    handleSaveComments,
    handleUpdateCheckTimes,
    
    // Helpers
    openAssignDialog,
    openDetailsDialog,
    openProblemDialog,
    openCalendarDialog,
    openLabelsDialog,
    openDeleteDialog,
    handleEditComments,
    handleSelectTask,
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
