
import { useCleaning } from '@/contexts/CleaningContext';
import { CleaningAgentAssignDialog } from './CleaningAgentAssignDialog';
import { CleaningTaskDetailsDialog } from './CleaningTaskDetailsDialog';
import { ProblemReportDialog } from './ProblemReportDialog';
import { CalendarDialog } from './CalendarDialog';
import { LabelsDialog } from './LabelsDialog';
import { AddCleaningTaskDialog } from './AddCleaningTaskDialog';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { EditCommentsDialog } from './EditCommentsDialog';
import { CleaningRatingDialog } from './CleaningRatingDialog';
import { getStatusBadgeClass, getStatusLabel } from '@/utils/cleaningUtils';
import { Badge } from '@/components/ui/badge';
import { CleaningStatus } from '@/types/cleaning';
import { useLanguage } from '@/contexts/LanguageContext';

export const CleaningDialogs = () => {
  const { t } = useLanguage();
  
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
    ratingDialogOpen,
    taskToRate,
    
    // Data
    currentTask,
    selectedAgent,
    problemDescription,
    selectedDate,
    selectedTasks,
    labelType,
    taskComments,
    newTask,
    
    // Actions
    handleAssignAgent,
    handleReportProblem,
    handleDateChange,
    handlePrintLabels,
    handleAddTask,
    handleDeleteTask,
    handleSaveComments,
    handleUpdateCheckTimes,
    handleSubmitRating,
    
    // Setters and handlers
    setSelectedAgent,
    setProblemDescription,
    setDetailsDialogOpen,
    setAssignDialogOpen,
    setProblemDialogOpen,
    setCalendarDialogOpen,
    setLabelsDialogOpen,
    setSelectedTasks,
    setLabelType,
    setAddTaskDialogOpen,
    setDeleteConfirmDialogOpen,
    setTaskComments,
    setEditCommentsDialogOpen,
    setNewTask,
    setRatingDialogOpen,
    handleEditComments,
  } = useCleaning();
  
  // Fonction pour obtenir le badge de statut approprié pour l'affichage
  const getStatusBadge = (status: CleaningStatus) => {
    const badgeClass = getStatusBadgeClass(status);
    const label = t(`status.${status}`);
    
    return (
      <Badge className={`rounded-full ${badgeClass}`}>
        {label}
      </Badge>
    );
  };
  
  // Liste des agents de ménage (à déplacer vers un service ou un hook plus tard)
  const cleaningAgents = ["Marie Lambert", "Lucas Martin", "Sophie Dubois", "Thomas Richard"];
  
  return (
    <>
      <CleaningAgentAssignDialog 
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        agents={cleaningAgents}
        selectedAgent={selectedAgent}
        onSelectAgent={setSelectedAgent}
        onAssign={handleAssignAgent}
      />
      
      <CleaningTaskDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        currentTask={currentTask}
        getStatusBadge={getStatusBadge}
        onEditComments={handleEditComments}
        onUpdateCheckTimes={handleUpdateCheckTimes}
      />
      
      <ProblemReportDialog
        open={problemDialogOpen}
        onOpenChange={setProblemDialogOpen}
        description={problemDescription}
        onDescriptionChange={setProblemDescription}
        onSubmit={handleReportProblem}
      />
      
      <CalendarDialog
        open={calendarDialogOpen}
        onOpenChange={setCalendarDialogOpen}
        selectedDate={selectedDate}
        onSelect={handleDateChange}
      />
      
      <LabelsDialog
        open={labelsDialogOpen}
        onOpenChange={setLabelsDialogOpen}
        selectedTasks={selectedTasks}
        labelType={labelType}
        onLabelTypeChange={setLabelType}
        onPrint={handlePrintLabels}
      />
      
      <AddCleaningTaskDialog
        open={addTaskDialogOpen}
        onOpenChange={setAddTaskDialogOpen}
        newTask={newTask}
        setNewTask={setNewTask}
        cleaningAgents={cleaningAgents}
        onAddTask={handleAddTask}
      />
      
      <DeleteConfirmDialog
        open={deleteConfirmDialogOpen}
        onOpenChange={setDeleteConfirmDialogOpen}
        onDelete={handleDeleteTask}
        taskName={currentTask?.property || ""}
      />
      
      <EditCommentsDialog
        open={editCommentsDialogOpen}
        onOpenChange={setEditCommentsDialogOpen}
        comments={taskComments}
        onCommentsChange={setTaskComments}
        onSave={handleSaveComments}
      />
      
      <CleaningRatingDialog
        open={ratingDialogOpen}
        onOpenChange={setRatingDialogOpen}
        task={taskToRate}
        onSubmit={handleSubmitRating}
      />
    </>
  );
};
