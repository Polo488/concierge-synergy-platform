
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search,
  AlertTriangle,
  Plus,
  Calendar as CalendarIcon,
  SlidersHorizontal,
} from 'lucide-react';
import { CleaningTaskList } from '@/components/cleaning/CleaningTaskList';
import { CleaningIssuesList } from '@/components/cleaning/CleaningIssuesList';
import { useCleaning } from '@/contexts/cleaning/CleaningContext';
import { useOperations } from '@/contexts/OperationsContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CleaningTabsProps {
  initialTab?: TabValue;
}

type TabValue = 'today' | 'late' | 'tomorrow' | 'upcoming' | 'completed' | 'issues';

export const CleaningTabs = ({ initialTab }: CleaningTabsProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const isCleaningAgent = user?.role === 'cleaning';

  const {
    activeTab: ctxTab,
    setActiveTab: setCtxTab,
    todayCleaningTasks,
    tomorrowCleaningTasks,
    completedCleaningTasks,
    cleaningIssues: localCleaningIssues,
    selectedTasks,
    handleSelectTask,
    handleStartCleaning,
    handleCompleteCleaning,
    openDetailsDialog,
    openAssignDialog,
    openProblemDialog,
    openDeleteDialog,
    openIssueDialog,
    handleResolveIssue: localHandleResolveIssue,
  } = useCleaning();

  const [activeTab, setActiveTab] = useState<TabValue>(initialTab || (ctxTab as TabValue) || 'today');

  const setTab = (t: TabValue) => {
    setActiveTab(t);
    // Sync legacy context tab if it understands this value
    if (t === 'today' || t === 'tomorrow' || t === 'completed' || t === 'issues') {
      setCtxTab(t as any);
    }
  };

  const {
    cleaningIssuesFromMessaging,
    repasseTasksFromMessaging,
    resolveCleaningIssue: messagingResolveIssue,
  } = useOperations();

  const allCleaningIssues = useMemo(
    () =>
      [...localCleaningIssues, ...cleaningIssuesFromMessaging].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [localCleaningIssues, cleaningIssuesFromMessaging]
  );

  const allTodayTasks = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayRepasses = repasseTasksFromMessaging.filter((t) => t.date === today);
    return [...todayCleaningTasks, ...todayRepasses];
  }, [todayCleaningTasks, repasseTasksFromMessaging]);

  const lateTasks = useMemo(
    () => allTodayTasks.filter((t) => t.status === 'todo' && t.isSameDayCheckin),
    [allTodayTasks]
  );
  const upcomingTasks = useMemo(
    () => [...tomorrowCleaningTasks].filter((t) => t.status !== 'completed'),
    [tomorrowCleaningTasks]
  );

  const handleResolveIssue = (issueId: number) => {
    const isMessagingIssue = cleaningIssuesFromMessaging.some((i) => i.id === issueId);
    if (isMessagingIssue) messagingResolveIssue(issueId);
    else localHandleResolveIssue(issueId);
  };

  const filterTasks = (tasks: any[]) => {
    if (!searchTerm) return tasks;
    const s = searchTerm.toLowerCase();
    return tasks.filter(
      (t) =>
        t.property.toLowerCase().includes(s) ||
        (t.cleaningAgent && t.cleaningAgent.toLowerCase().includes(s)) ||
        (t.agency && t.agency.toLowerCase().includes(s)) ||
        (t.address && t.address.toLowerCase().includes(s))
    );
  };

  const filterByRole = (tasks: any[]) => {
    if (!isCleaningAgent || !user) return tasks;
    return tasks.filter((t) => t.cleaningAgent === user.name);
  };

  const sortByPriority = (tasks: any[]) =>
    [...tasks].sort((a, b) => {
      const aPrio = a.isSameDayCheckin && a.status !== 'completed' ? 1 : 0;
      const bPrio = b.isSameDayCheckin && b.status !== 'completed' ? 1 : 0;
      return bPrio - aPrio;
    });

  const apply = (tasks: any[]) => sortByPriority(filterTasks(filterByRole(tasks)));

  const counts = {
    today: filterByRole(allTodayTasks).length,
    late: filterByRole(lateTasks).length,
    tomorrow: filterByRole(tomorrowCleaningTasks).length,
    upcoming: filterByRole([...upcomingTasks, ...tomorrowCleaningTasks]).length,
    completed: filterByRole(completedCleaningTasks).length + filterByRole(allTodayTasks.filter((t) => t.status === 'completed')).length,
    issues: allCleaningIssues.filter((i) => i.status === 'open').length,
  };

  const tabs: { value: TabValue; label: string; count: number; danger?: boolean; icon?: React.ReactNode }[] = (
    [
      { value: 'today', label: "Aujourd'hui", count: counts.today },
      { value: 'late', label: 'En retard', count: counts.late, danger: true, icon: <AlertTriangle className="h-3.5 w-3.5" /> },
      { value: 'tomorrow', label: 'Demain', count: counts.tomorrow },
      { value: 'upcoming', label: 'À venir', count: counts.upcoming },
      { value: 'completed', label: 'Terminés', count: counts.completed },
      { value: 'issues', label: 'Problèmes', count: counts.issues, danger: true, icon: <AlertTriangle className="h-3.5 w-3.5" /> },
    ] as { value: TabValue; label: string; count: number; danger?: boolean; icon?: React.ReactNode }[]
  ).filter((t) => !(isCleaningAgent && (t.value === 'tomorrow' || t.value === 'upcoming')));

  const renderTabContent = () => {
    switch (activeTab) {
      case 'today':
        return (
          <CleaningTaskList
            tasks={apply(allTodayTasks)}
            emptyMessage="Aucune tâche pour aujourd'hui"
            labelsDialogOpen={false}
            selectedTasks={selectedTasks}
            onSelectTask={isCleaningAgent ? undefined : handleSelectTask}
            onStartCleaning={handleStartCleaning}
            onCompleteCleaning={handleCompleteCleaning}
            onOpenDetails={openDetailsDialog}
            onAssign={isCleaningAgent ? undefined : openAssignDialog}
            onReportProblem={openProblemDialog}
            onReportIssue={!isCleaningAgent ? openIssueDialog : undefined}
            onDelete={isCleaningAgent ? undefined : openDeleteDialog}
            isCleaningAgent={isCleaningAgent}
            groupCheckin
          />
        );
      case 'late':
        return (
          <CleaningTaskList
            tasks={apply(lateTasks)}
            emptyMessage="Aucun ménage en retard"
            labelsDialogOpen={false}
            selectedTasks={selectedTasks}
            onSelectTask={isCleaningAgent ? undefined : handleSelectTask}
            onStartCleaning={handleStartCleaning}
            onCompleteCleaning={handleCompleteCleaning}
            onOpenDetails={openDetailsDialog}
            onAssign={isCleaningAgent ? undefined : openAssignDialog}
            onReportProblem={openProblemDialog}
            onReportIssue={!isCleaningAgent ? openIssueDialog : undefined}
            onDelete={isCleaningAgent ? undefined : openDeleteDialog}
            isCleaningAgent={isCleaningAgent}
          />
        );
      case 'tomorrow':
        return (
          <CleaningTaskList
            tasks={apply(tomorrowCleaningTasks)}
            emptyMessage="Aucune tâche pour demain"
            labelsDialogOpen={false}
            selectedTasks={selectedTasks}
            onSelectTask={handleSelectTask}
            onStartCleaning={handleStartCleaning}
            onCompleteCleaning={handleCompleteCleaning}
            onOpenDetails={openDetailsDialog}
            onAssign={openAssignDialog}
            onReportProblem={openProblemDialog}
            onReportIssue={openIssueDialog}
            onDelete={openDeleteDialog}
            isCleaningAgent={false}
          />
        );
      case 'upcoming':
        return (
          <CleaningTaskList
            tasks={apply(tomorrowCleaningTasks)}
            emptyMessage="Aucune tâche à venir"
            labelsDialogOpen={false}
            selectedTasks={selectedTasks}
            onSelectTask={handleSelectTask}
            onStartCleaning={handleStartCleaning}
            onCompleteCleaning={handleCompleteCleaning}
            onOpenDetails={openDetailsDialog}
            onAssign={openAssignDialog}
            onReportProblem={openProblemDialog}
            onReportIssue={openIssueDialog}
            onDelete={openDeleteDialog}
            isCleaningAgent={false}
          />
        );
      case 'completed':
        return (
          <CleaningTaskList
            tasks={apply(completedCleaningTasks)}
            emptyMessage="Aucune tâche terminée"
            labelsDialogOpen={false}
            selectedTasks={selectedTasks}
            onSelectTask={isCleaningAgent ? undefined : handleSelectTask}
            onStartCleaning={isCleaningAgent ? undefined : handleStartCleaning}
            onCompleteCleaning={isCleaningAgent ? undefined : handleCompleteCleaning}
            onOpenDetails={openDetailsDialog}
            onAssign={isCleaningAgent ? undefined : openAssignDialog}
            onReportProblem={isCleaningAgent ? undefined : openProblemDialog}
            onReportIssue={!isCleaningAgent ? openIssueDialog : undefined}
            onDelete={isCleaningAgent ? undefined : openDeleteDialog}
            isCleaningAgent={isCleaningAgent}
          />
        );
      case 'issues':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">Signalements de problèmes de ménage</p>
              {!isCleaningAgent && (
                <Button onClick={() => openIssueDialog()} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Signaler
                </Button>
              )}
            </div>
            <CleaningIssuesList
              issues={allCleaningIssues}
              onResolve={!isCleaningAgent ? handleResolveIssue : undefined}
              onViewRepasseTask={(taskId) => {
                const task = allTodayTasks.find((t) => t.id === taskId);
                if (task) openDetailsDialog(task);
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Tabs */}
      <div
        className="flex overflow-x-auto border-b border-border gap-2 scrollbar-hide"
        style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
        data-tutorial="cleaning-tabs"
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setTab(tab.value)}
            className={`whitespace-nowrap px-3.5 py-2.5 text-[13px] flex-shrink-0 transition-colors border-b-2 inline-flex items-center gap-1.5 ${
              activeTab === tab.value
                ? 'text-primary border-primary font-semibold'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span
                className={`min-w-[20px] h-[20px] inline-flex items-center justify-center rounded-full px-1.5 text-[10px] font-bold tabular-nums ${
                  tab.danger
                    ? 'bg-[hsl(0,72%,50%)] text-white'
                    : activeTab === tab.value
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search + Période + Filtres */}
      <div className="my-4 flex items-center gap-2">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un logement, agent, agence…"
            className="pl-10 h-11 rounded-[12px] bg-muted/50 border-border text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="h-11 rounded-[12px] gap-1.5 px-3.5 text-[13px] font-medium flex-shrink-0"
          onClick={() => toast.info('Sélecteur de période — bientôt disponible')}
        >
          <CalendarIcon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Période</span>
        </Button>
        <Button
          variant="outline"
          className="h-11 rounded-[12px] gap-1.5 px-3.5 text-[13px] font-medium flex-shrink-0"
          onClick={() => toast.info('Filtres avancés — bientôt disponibles')}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Filtres</span>
        </Button>
      </div>

      <div data-tutorial="cleaning-task">{renderTabContent()}</div>
    </div>
  );
};
