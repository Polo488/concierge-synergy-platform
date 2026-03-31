
import { CleaningTask } from '@/types/cleaning';
import { CleaningTaskCard } from './CleaningTaskCard';
import { CheckCircle } from 'lucide-react';

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
  onReportIssue?: (task: CleaningTask) => void;
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
  onReportIssue,
  onDelete,
  isCleaningAgent = false
}: CleaningTaskListProps) => {
  return (
    <div className="space-y-3">
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
          onReportIssue={onReportIssue}
          onDelete={onDelete}
          isCleaningAgent={isCleaningAgent}
        />
      ))}
      
      {tasks.length === 0 && (
        <div className="text-center py-10">
          <CheckCircle className="h-12 w-12 text-[hsl(142,76%,36%)] mx-auto mb-3" />
          <p className="text-[15px] text-muted-foreground">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};
