import { CleaningTask } from '@/types/cleaning';
import { CleaningTaskCard } from './CleaningTaskCard';
import { CheckCircle, Flame } from 'lucide-react';

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
  /** Group by check-in J vs others with section headers */
  groupCheckin?: boolean;
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
  isCleaningAgent = false,
  groupCheckin = false,
}: CleaningTaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-10">
        <CheckCircle className="h-12 w-12 text-[hsl(142,76%,36%)] mx-auto mb-3" />
        <p className="text-[15px] text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  const checkinJ = groupCheckin
    ? tasks.filter((t) => t.isSameDayCheckin && t.status !== 'completed')
    : [];
  const others = groupCheckin ? tasks.filter((t) => !checkinJ.includes(t)) : tasks;

  const renderCard = (task: CleaningTask) => (
    <CleaningTaskCard
      key={task.id}
      task={task}
      labelsDialogOpen={labelsDialogOpen}
      isTaskSelected={selectedTasks.some((t) => t.id === task.id)}
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
  );

  const SectionHeader = ({ label, count, accent }: { label: string; count: number; accent?: boolean }) => (
    <div className="flex items-center gap-2 mb-3 mt-1">
      <span className={`inline-block h-2 w-2 rounded-full ${accent ? 'bg-primary' : 'bg-muted-foreground/40'}`} />
      <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-foreground inline-flex items-center gap-1.5">
        {accent && <Flame className="h-3 w-3 text-primary" />}
        {label}
      </span>
      <span className="text-[11px] font-semibold text-muted-foreground">{count}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {groupCheckin && checkinJ.length > 0 && (
        <div>
          <SectionHeader label="Check-in jour J" count={checkinJ.length} accent />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">{checkinJ.map(renderCard)}</div>
        </div>
      )}
      {others.length > 0 && (
        <div>
          {groupCheckin && checkinJ.length > 0 && <SectionHeader label="Autres" count={others.length} />}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">{others.map(renderCard)}</div>
        </div>
      )}
    </div>
  );
};
