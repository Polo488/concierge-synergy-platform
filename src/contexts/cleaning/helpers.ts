
import { CleaningTask } from '@/types/cleaning';

export const createCleaningHelpers = (
  state: any,
  setState: any
) => {
  const {
    setCurrentTask,
    setSelectedAgent,
    setProblemDescription,
    setTaskComments,
    setSelectedTasks,
    setLabelType,
    setAssignDialogOpen,
    setDetailsDialogOpen,
    setProblemDialogOpen,
    setCalendarDialogOpen,
    setLabelsDialogOpen,
    setDeleteConfirmDialogOpen,
    setEditCommentsDialogOpen
  } = setState;

  const openAssignDialog = (task: CleaningTask) => {
    setCurrentTask(task);
    setSelectedAgent(task.cleaningAgent || "");
    setAssignDialogOpen(true);
  };

  const openDetailsDialog = (task: CleaningTask) => {
    setCurrentTask(task);
    setDetailsDialogOpen(true);
  };

  const openProblemDialog = (task: CleaningTask) => {
    setCurrentTask(task);
    setProblemDialog(true);
    setProblemDescription("");
  };

  const openCalendarDialog = () => {
    setCalendarDialogOpen(true);
  };

  const openLabelsDialog = () => {
    setSelectedTasks([]);
    setLabelType("standard");
    setLabelsDialogOpen(true);
  };

  const openDeleteDialog = (task: CleaningTask) => {
    setCurrentTask(task);
    setDeleteConfirmDialogOpen(true);
  };
  
  const handleEditComments = () => {
    if (!state.currentTask) return;
    
    setTaskComments(state.currentTask.comments);
    setDetailsDialogOpen(false);
    setEditCommentsDialogOpen(true);
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

  // Fix the typo in the function name
  const setProblemDialog = (open: boolean) => {
    setProblemDialogOpen(open);
  };

  return {
    openAssignDialog,
    openDetailsDialog,
    openProblemDialog,
    openCalendarDialog,
    openLabelsDialog,
    openDeleteDialog,
    handleEditComments,
    handleSelectTask
  };
};
