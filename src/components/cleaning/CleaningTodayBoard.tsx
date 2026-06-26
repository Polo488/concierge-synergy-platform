import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  UserPlus,
  ArrowRight,
  Sparkles,
  Clock,
} from 'lucide-react';
import { useCleaning } from '@/contexts/cleaning/CleaningContext';
import { useOperations } from '@/contexts/OperationsContext';
import { useCleaningTeam } from '@/contexts/CleaningTeamContext';
import { CleaningTaskCard } from './CleaningTaskCard';
import { CleaningAgentsMap } from './CleaningAgentsMap';
import { Button } from '@/components/ui/button';
import { CleaningTask } from '@/types/cleaning';

type Exception =
  | { kind: 'late'; task: CleaningTask; sentence: string }
  | { kind: 'problem'; issueId: number; property: string; sentence: string }
  | { kind: 'unassigned'; task: CleaningTask; sentence: string };

const ProgressRing = ({ pct, size = 88, stroke = 8 }: { pct: number; size?: number; stroke?: number }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (c * pct) / 100;
  const color = pct >= 80 ? 'hsl(142,71%,40%)' : pct >= 40 ? 'hsl(45,93%,55%)' : 'hsl(21,100%,53%)';
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="hsl(var(--muted))" strokeWidth={stroke} fill="none" />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
      />
    </svg>
  );
};

export const CleaningTodayBoard = () => {
  const {
    todayCleaningTasks,
    cleaningIssues,
    openDetailsDialog,
    openAssignDialog,
    openIssueDialog,
    handleStartCleaning,
    handleCompleteCleaning,
    openProblemDialog,
    openDeleteDialog,
    selectedTasks,
  } = useCleaning();
  const { cleaningIssuesFromMessaging } = useOperations();
  const { agencies } = useCleaningTeam();

  const [routineOpen, setRoutineOpen] = useState(false);

  const exceptions = useMemo<Exception[]>(() => {
    const out: Exception[] = [];

    // Late = same-day check-in still todo (mock: pick first 1-2)
    const late = todayCleaningTasks.filter((t) => t.isSameDayCheckin && t.status === 'todo').slice(0, 2);
    late.forEach((t) => {
      const agent = t.cleaningAgent || t.agency || 'L\'agence';
      out.push({
        kind: 'late',
        task: t,
        sentence: `${agent} n'est pas partie — risque de retard sur le check-in ${t.checkinTime ?? ''}`.trim(),
      });
    });

    // Unassigned
    todayCleaningTasks
      .filter((t) => !t.cleaningAgent && t.status !== 'completed')
      .forEach((t) => {
        out.push({
          kind: 'unassigned',
          task: t,
          sentence: `Aucun prestataire assigné — à attribuer avant le check-in`,
        });
      });

    // Problems (issues open today)
    const allIssues = [...cleaningIssues, ...cleaningIssuesFromMessaging].filter((i) => i.status === 'open');
    allIssues.slice(0, 3).forEach((i) =>
      out.push({
        kind: 'problem',
        issueId: i.id,
        property: i.propertyName,
        sentence: i.description || 'Problème signalé sur le ménage',
      })
    );

    return out;
  }, [todayCleaningTasks, cleaningIssues, cleaningIssuesFromMessaging]);

  const exceptionTaskIds = new Set(
    exceptions.flatMap((e) => (e.kind === 'late' || e.kind === 'unassigned' ? [e.task.id] : []))
  );
  const routine = todayCleaningTasks.filter((t) => !exceptionTaskIds.has(t.id) && t.status !== 'completed');

  const total = todayCleaningTasks.length;
  const done = todayCleaningTasks.filter((t) => t.status === 'completed').length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const hasExceptions = exceptions.length > 0;

  return (
    <div className="space-y-4">
      {/* État du jour */}
      <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-5">
        <div className="relative flex items-center justify-center flex-shrink-0">
          <ProgressRing pct={pct} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[20px] font-bold tabular-nums leading-none text-foreground">{done}</span>
            <span className="text-[10px] text-muted-foreground mt-0.5">/ {total}</span>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          {hasExceptions ? (
            <>
              <p className="text-[17px] md:text-[18px] font-semibold text-foreground leading-snug">
                {exceptions.length} chose{exceptions.length > 1 ? 's' : ''} demande{exceptions.length > 1 ? 'nt' : ''} ton attention
              </p>
              <p className="text-[13px] text-muted-foreground mt-1">
                Le reste roule tout seul.
              </p>
            </>
          ) : (
            <>
              <p className="text-[17px] md:text-[18px] font-semibold text-[hsl(142,71%,35%)] leading-snug inline-flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Tout est sur les rails
              </p>
              <p className="text-[13px] text-muted-foreground mt-1">
                {done} sur {total} ménages effectués · auto-assignation en place.
              </p>
            </>
          )}
        </div>
      </div>

      {/* À traiter — exceptions only */}
      {hasExceptions && (
        <section>
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              À traiter
            </h2>
            <span className="text-[11px] text-muted-foreground tabular-nums">{exceptions.length}</span>
          </div>
          <div className="space-y-2">
            {exceptions.map((e, idx) => (
              <ExceptionRow
                key={`${e.kind}-${idx}`}
                exception={e}
                onReassign={openAssignDialog}
                onOpen={openDetailsDialog}
                onOpenIssue={() => {
                  /* could open issue dialog */
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Map view */}
      <section>
        <div className="flex items-center justify-between mb-2 px-1">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground inline-flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-primary" />
            Vue live des prestataires
          </h2>
          <span className="text-[11px] text-muted-foreground">{agencies.length} agences actives</span>
        </div>
        <CleaningAgentsMap />
      </section>

      {/* Routine */}
      {routine.length > 0 && (
        <section>
          <button
            type="button"
            onClick={() => setRoutineOpen((v) => !v)}
            className="w-full flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3.5 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="h-2 w-2 rounded-full bg-[hsl(142,71%,45%)]" />
              <span className="text-[14px] font-semibold text-foreground">
                {routine.length} ménage{routine.length > 1 ? 's' : ''} de routine
              </span>
              <span className="text-[13px] text-muted-foreground hidden sm:inline">— tout est sur les rails</span>
            </div>
            <ChevronRight
              className={`h-4 w-4 text-muted-foreground transition-transform ${routineOpen ? 'rotate-90' : ''}`}
            />
          </button>

          {routineOpen && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
              {routine.map((task) => (
                <CleaningTaskCard
                  key={task.id}
                  task={task}
                  labelsDialogOpen={false}
                  isTaskSelected={selectedTasks.some((t) => t.id === task.id)}
                  onStartCleaning={handleStartCleaning}
                  onCompleteCleaning={handleCompleteCleaning}
                  onOpenDetails={openDetailsDialog}
                  onAssign={openAssignDialog}
                  onReportProblem={openProblemDialog}
                  onReportIssue={openIssueDialog}
                  onDelete={openDeleteDialog}
                  isCleaningAgent={false}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

const ExceptionRow = ({
  exception,
  onReassign,
  onOpen,
}: {
  exception: Exception;
  onReassign: (task: CleaningTask) => void;
  onOpen: (task: CleaningTask) => void;
  onOpenIssue: () => void;
}) => {
  const tone =
    exception.kind === 'late'
      ? 'border-l-[hsl(0,72%,50%)] bg-[hsl(0,86%,98%)]'
      : exception.kind === 'unassigned'
      ? 'border-l-[hsl(21,100%,53%)] bg-[hsl(21,100%,98%)]'
      : 'border-l-[hsl(38,92%,50%)] bg-[hsl(38,92%,97%)]';
  const icon =
    exception.kind === 'late' ? (
      <Clock className="h-4 w-4 text-[hsl(0,72%,50%)]" />
    ) : exception.kind === 'unassigned' ? (
      <UserPlus className="h-4 w-4 text-primary" />
    ) : (
      <AlertTriangle className="h-4 w-4 text-[hsl(38,92%,40%)]" />
    );

  const property = exception.kind === 'problem' ? exception.property : exception.task.property;

  const handleAction = () => {
    if (exception.kind === 'late' || exception.kind === 'unassigned') {
      onReassign(exception.task);
    }
  };

  const handleOpen = () => {
    if (exception.kind !== 'problem') onOpen(exception.task);
  };

  return (
    <div className={`rounded-2xl border border-border border-l-4 ${tone} p-3.5 flex items-center gap-3`}>
      <div className="h-9 w-9 rounded-xl bg-card border border-border flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-foreground truncate">{property}</p>
        <p className="text-[12.5px] text-muted-foreground truncate">{exception.sentence}</p>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {(exception.kind === 'late' || exception.kind === 'unassigned') && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleAction}
            className="h-8 rounded-lg text-[12px] font-semibold gap-1.5"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Réassigner
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={handleOpen}
          className="h-8 rounded-lg text-[12px] font-semibold gap-1 text-foreground"
        >
          Ouvrir
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
