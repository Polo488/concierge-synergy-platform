
import { toast } from "@/components/ui/use-toast";
import { CleaningTask, CleaningStatus } from '@/types/cleaning';
import { getNextId } from '@/utils/cleaningUtils';

export const createCleaningActions = (
  state: any,
  setState: any,
  t: (key: string, params?: Record<string, any>) => string
) => {
  const {
    todayCleaningTasks,
    tomorrowCleaningTasks,
    completedCleaningTasks,
    currentTask,
    selectedAgent,
    newTask,
    taskComments
  } = state;

  const {
    setTodayCleaningTasks,
    setCompletedCleaningTasks,
    setTomorrowCleaningTasks,
    setAssignDialogOpen,
    setProblemDialogOpen,
    setCalendarDialogOpen,
    setDetailsDialogOpen,
    setSelectedTasks,
    setLabelsDialogOpen,
    setLabelType,
    setAddTaskDialogOpen,
    setNewTask,
    setDeleteConfirmDialogOpen,
    setEditCommentsDialogOpen
  } = setState;

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
    
    toast({
      title: t('cleaning.toast.started.title'),
      description: t('cleaning.toast.started.description', { property: task.property })
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
    
    toast({
      title: t('cleaning.toast.completed.title'),
      description: t('cleaning.toast.completed.description', { property: task.property })
    });
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
    
    toast({
      title: t('cleaning.toast.agent.title'),
      description: t('cleaning.toast.agent.description', {
        agent: selectedAgent === "non_assigne" ? t('cleaning.no.agent') : selectedAgent,
        property: currentTask.property
      })
    });
  };

  const handleReportProblem = () => {
    toast({
      title: t('cleaning.toast.problem.title'),
      description: t('cleaning.toast.problem.description', { property: currentTask?.property || '' }),
      variant: "destructive"
    });
    setProblemDialogOpen(false);
  };

  const handleExport = () => {
    toast({
      title: t('cleaning.toast.export.title'),
      description: t('cleaning.toast.export.description')
    });
  };

  const handleSync = () => {
    toast({
      title: t('cleaning.toast.sync.title'),
      description: t('cleaning.toast.sync.description')
    });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    
    if (isToday) {
      setState.setActiveTab("today");
    } else if (isTomorrow) {
      setState.setActiveTab("tomorrow");
    } else {
      toast({
        title: t('cleaning.toast.date.title'),
        description: t('cleaning.toast.date.description', {
          date: date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
        })
      });
    }
    
    setCalendarDialogOpen(false);
  };

  const handleAddTask = () => {
    const allTasks = [...todayCleaningTasks, ...tomorrowCleaningTasks, ...completedCleaningTasks];
    const id = getNextId(allTasks);
    
    const taskToAdd: CleaningTask = {
      ...newTask,
      id,
      cleaningAgent: newTask.cleaningAgent === '' || newTask.cleaningAgent === 'non_assigne' ? null : newTask.cleaningAgent,
      startTime: '',
      endTime: '',
      problems: []
    };
    
    // Déterminer dans quelle liste ajouter la tâche selon la date et le statut
    const taskDate = new Date(newTask.date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const isToday = taskDate.toDateString() === today.toDateString();
    const isTomorrow = taskDate.toDateString() === tomorrow.toDateString();
    
    if (isToday) {
      if (newTask.status === 'completed') {
        setCompletedCleaningTasks([taskToAdd, ...completedCleaningTasks]);
      } else {
        setTodayCleaningTasks([...todayCleaningTasks, taskToAdd]);
      }
      setState.setActiveTab("today");
    } else if (isTomorrow) {
      setTomorrowCleaningTasks([...tomorrowCleaningTasks, taskToAdd]);
      setState.setActiveTab("tomorrow");
    } else {
      // Pour les dates futures, ajouter à "demain" avec statut planifié
      const scheduledTask: CleaningTask = { 
        ...taskToAdd, 
        status: 'scheduled' 
      };
      setTomorrowCleaningTasks([...tomorrowCleaningTasks, scheduledTask]);
      setState.setActiveTab("tomorrow");
    }
    
    // Réinitialiser le formulaire
    setNewTask({
      property: '',
      checkoutTime: '11:00',
      checkinTime: '15:00',
      status: 'todo',
      cleaningAgent: '',
      date: new Date().toISOString().split('T')[0],
      linens: ['Serviettes bain x2', 'Serviettes main x2', 'Housse de couette queen x1', 'Taies d\'oreiller x2'],
      consumables: ['Capsules café x4', 'Sachets thé x2'],
      comments: ''
    });
    
    setAddTaskDialogOpen(false);
    
    toast({
      title: t('cleaning.toast.added.title'),
      description: t('cleaning.toast.added.description', { property: taskToAdd.property })
    });
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
    
    toast({
      title: t('cleaning.toast.deleted.title'),
      description: t('cleaning.toast.deleted.description', { property: currentTask.property }),
      variant: "destructive"
    });
  };

  const handlePrintLabels = () => {
    const { selectedTasks } = state;
    
    if (selectedTasks.length === 0) {
      toast({
        title: t('cleaning.toast.labels.error.title'),
        description: t('cleaning.toast.labels.error.description'),
        variant: "destructive"
      });
      return;
    }

    import('@/utils/cleaningUtils').then(({ generateLabelsPrintWindow }) => {
      generateLabelsPrintWindow(selectedTasks);
      
      toast({
        title: t('cleaning.toast.labels.success.title'),
        description: t('cleaning.toast.labels.success.description', { count: selectedTasks.length })
      });
      
      setLabelsDialogOpen(false);
    });
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
    
    toast({
      title: t('cleaning.toast.comments.title'),
      description: t('cleaning.toast.comments.description', { property: currentTask.property })
    });
    
    setEditCommentsDialogOpen(false);
  };

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
    setState.setCurrentTask({
      ...currentTask,
      checkoutTime,
      checkinTime
    });
    
    toast({
      title: t('cleaning.toast.times.title'),
      description: t('cleaning.toast.times.description', { property: currentTask.property })
    });
  };

  return {
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
    handleUpdateCheckTimes
  };
};
