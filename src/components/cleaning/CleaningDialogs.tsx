
import { CleaningAgentAssignDialog } from '@/components/cleaning/CleaningAgentAssignDialog';
import { CleaningTaskDetailsDialog } from '@/components/cleaning/CleaningTaskDetailsDialog';
import { ProblemReportDialog } from '@/components/cleaning/ProblemReportDialog';
import { CalendarDialog } from '@/components/cleaning/CalendarDialog';
import { LabelsDialog } from '@/components/cleaning/LabelsDialog';
import { AddCleaningTaskDialog } from '@/components/cleaning/AddCleaningTaskDialog';
import { EditCommentsDialog } from '@/components/cleaning/EditCommentsDialog';
import { DeleteConfirmDialog } from '@/components/cleaning/DeleteConfirmDialog';
import { useCleaning } from '@/contexts/CleaningContext';
import { Badge } from '@/components/ui/badge';
import { CleaningStatus } from '@/types/cleaning';

export const CleaningDialogs = () => {
  const {
    // Dialog states
    assignDialogOpen,
    detailsDialogOpen,
    problemDialogOpen,
    calendarDialogOpen,
    labelsDialogOpen,
    addTaskDialogOpen,
    deleteConfirmDialogOpen,
    editCommentsDialogOpen,
    
    // Data
    currentTask,
    selectedAgent,
    problemDescription,
    selectedDate,
    activeTab,
    todayCleaningTasks,
    tomorrowCleaningTasks,
    completedCleaningTasks,
    selectedTasks,
    labelType,
    taskComments,
    newTask,
    
    // Setters
    setSelectedAgent,
    setProblemDescription,
    setLabelType,
    setActiveTab,
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
    handleAssignAgent,
    handleReportProblem,
    handleDateChange,
    handlePrintLabels,
    handleAddTask,
    handleDeleteTask,
    handleSaveComments,
    handleEditComments,
    handleSelectTask,
    handleStartCleaning,
    handleCompleteCleaning,
    openDetailsDialog,
    openAssignDialog,
    openProblemDialog,
    openDeleteDialog,
  } = useCleaning();

  // Cleaning agent list (mock data)
  const cleaningAgents = [
    'Marie Lambert',
    'Lucas Martin',
    'Sophie Berger',
    'Thomas Laurent'
  ];

  const getStatusBadge = (status: CleaningStatus) => {
    switch(status) {
      case 'todo':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-full">À faire</Badge>;
      case 'inProgress':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 rounded-full">En cours</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 rounded-full">Terminé</Badge>;
      case 'scheduled':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 rounded-full">Planifié</Badge>;
      default:
        return null;
    }
  };

  return (
    <>
      <CleaningAgentAssignDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        currentTask={currentTask}
        selectedAgent={selectedAgent}
        setSelectedAgent={setSelectedAgent}
        cleaningAgents={cleaningAgents}
        onAssign={handleAssignAgent}
      />

      <CleaningTaskDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        currentTask={currentTask}
        getStatusBadge={getStatusBadge}
        onEditComments={handleEditComments}
      />

      <ProblemReportDialog
        open={problemDialogOpen}
        onOpenChange={setProblemDialogOpen}
        currentTask={currentTask}
        problemDescription={problemDescription}
        setProblemDescription={setProblemDescription}
        onReport={handleReportProblem}
      />

      <CalendarDialog
        open={calendarDialogOpen}
        onOpenChange={setCalendarDialogOpen}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />

      <LabelsDialog
        open={labelsDialogOpen}
        onOpenChange={setLabelsDialogOpen}
        labelType={labelType}
        setLabelType={setLabelType}
        selectedTasks={selectedTasks}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        todayCleaningTasks={todayCleaningTasks}
        tomorrowCleaningTasks={tomorrowCleaningTasks}
        completedCleaningTasks={completedCleaningTasks}
        onSelectTask={handleSelectTask}
        onStartCleaning={handleStartCleaning}
        onCompleteCleaning={handleCompleteCleaning}
        onOpenDetails={openDetailsDialog}
        onAssign={openAssignDialog}
        onReportProblem={openProblemDialog}
        onDelete={openDeleteDialog}
        onPrintLabels={handlePrintLabels}
      />

      <AddCleaningTaskDialog
        open={addTaskDialogOpen}
        onOpenChange={setAddTaskDialogOpen}
        newTask={newTask}
        setNewTask={setNewTask}
        cleaningAgents={cleaningAgents}
        onAddTask={handleAddTask}
      />

      <EditCommentsDialog
        open={editCommentsDialogOpen}
        onOpenChange={setEditCommentsDialogOpen}
        currentTask={currentTask}
        taskComments={taskComments}
        setTaskComments={setTaskComments}
        onSaveComments={handleSaveComments}
      />

      <DeleteConfirmDialog
        open={deleteConfirmDialogOpen}
        onOpenChange={setDeleteConfirmDialogOpen}
        onDelete={handleDeleteTask}
      />
    </>
  );
};
