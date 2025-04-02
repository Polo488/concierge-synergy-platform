
import { CleaningTask } from '@/types/cleaning';
import { CleaningTaskCard } from './CleaningTaskCard';

interface CleaningTaskListProps {
  tasks: CleaningTask[];
  emptyMessage: string;
  labelsDialogOpen: boolean;
  selectedTasks: CleaningTask[];
  onSelectTask?: (task: CleaningTask) => void;
  onStartCleaning: (task: CleaningTask) => void;
  onCompleteCleaning: (task: CleaningTask) => void;
  onOpenDetails: (task: CleaningTask) => void;
  onAssign?: (task: CleaningTask) => void;
  onReportProblem: (task: CleaningTask) => void;
  onDelete?: (task: CleaningTask) => void;
  isCleaningAgent?: boolean;
}

export const CleaningTaskList = ({
  tasks,
  emptyMessage,
  labelsDialogOpen,
  selectedTasks,
  onSelectTask,
  onStartCleaning,
  onCompleteCleaning,
  onOpenDetails,
  onAssign,
  onReportProblem,
  onDelete,
  isCleaningAgent = false
}: CleaningTaskListProps) => {
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <CleaningTaskCard
          key={task.id}
          task={task}
          labelsDialogOpen={labelsDialogOpen}
          isTaskSelected={selectedTasks.some(t => t.id === task.id)}
          onSelectTask={onSelectTask}
          onStartCleaning={onStartCleaning}
          onCompleteCleaning={onCompleteCleaning}
          onOpenDetails={onOpenDetails}
          onAssign={onAssign}
          onReportProblem={onReportProblem}
          onDelete={onDelete}
          isCleaningAgent={isCleaningAgent}
        />
      ))}
      
      {tasks.length === 0 && (
        <div className="text-center p-4">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};
