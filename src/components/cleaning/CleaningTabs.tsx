
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, AlertTriangle, Plus } from 'lucide-react';
import { CleaningTaskList } from '@/components/cleaning/CleaningTaskList';
import { CleaningIssuesList } from '@/components/cleaning/CleaningIssuesList';
import { useCleaning } from '@/contexts/CleaningContext';
import { useOperations } from '@/contexts/OperationsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

interface CleaningTabsProps {
  initialTab?: 'today' | 'tomorrow' | 'completed' | 'issues';
}

type TabValue = 'today' | 'tomorrow' | 'completed' | 'issues';

const tabs: { value: TabValue; label: string; agentOnly?: boolean }[] = [
  { value: 'today', label: "Aujourd'hui" },
  { value: 'tomorrow', label: 'Demain' },
  { value: 'completed', label: 'Terminés' },
  { value: 'issues', label: 'Problèmes' },
];

export const CleaningTabs = ({ initialTab = 'today' }: CleaningTabsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useLanguage();
  const { user } = useAuth();
  const isCleaningAgent = user?.role === 'cleaning';
  
  const { 
    activeTab, 
    setActiveTab,
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

  const { 
    cleaningIssuesFromMessaging, 
    repasseTasksFromMessaging,
    resolveCleaningIssue: messagingResolveIssue 
  } = useOperations();

  const allCleaningIssues = useMemo(() => {
    const allIssues = [...localCleaningIssues, ...cleaningIssuesFromMessaging];
    return allIssues.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [localCleaningIssues, cleaningIssuesFromMessaging]);

  const allTodayTasks = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayRepasses = repasseTasksFromMessaging.filter(t => t.date === today);
    return [...todayCleaningTasks, ...todayRepasses];
  }, [todayCleaningTasks, repasseTasksFromMessaging]);

  const handleResolveIssue = (issueId: number) => {
    const isMessagingIssue = cleaningIssuesFromMessaging.some(i => i.id === issueId);
    if (isMessagingIssue) {
      messagingResolveIssue(issueId);
    } else {
      localHandleResolveIssue(issueId);
    }
  };

  const filterTasks = (tasks: any[]) => {
    if (!searchTerm) return tasks;
    const searchLower = searchTerm.toLowerCase();
    return tasks.filter(task => 
      task.property.toLowerCase().includes(searchLower) || 
      (task.cleaningAgent && task.cleaningAgent.toLowerCase().includes(searchLower))
    );
  };

  const filterTasksByRole = (tasks: any[]) => {
    if (!isCleaningAgent || !user) return tasks;
    return tasks.filter(task => task.cleaningAgent === user.name);
  };

  const getFilteredTasks = (tasks: any[]) => {
    return filterTasks(filterTasksByRole(tasks));
  };

  const openIssuesCount = allCleaningIssues.filter(i => i.status === 'open').length;

  const visibleTabs = tabs.filter(tab => {
    if (tab.value === 'tomorrow' && isCleaningAgent) return false;
    return true;
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'today':
        return (
          <CleaningTaskList
            tasks={getFilteredTasks(allTodayTasks)}
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
          />
        );
      case 'tomorrow':
        return (
          <CleaningTaskList
            tasks={getFilteredTasks(tomorrowCleaningTasks)}
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
      case 'completed':
        return (
          <CleaningTaskList
            tasks={getFilteredTasks(completedCleaningTasks)}
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
              <p className="text-sm text-muted-foreground">
                Signalements de problèmes de ménage
              </p>
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
                const task = allTodayTasks.find(t => t.id === taskId);
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
    <div className="mt-2">
      {/* Custom tabs */}
      <div 
        className="flex overflow-x-auto border-b border-border gap-1 px-0 scrollbar-hide"
        style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
        data-tutorial="cleaning-tabs"
      >
        {visibleTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`whitespace-nowrap px-4 py-2.5 text-[13px] flex-shrink-0 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === tab.value
                ? 'text-primary border-primary font-semibold'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            {tab.value === 'issues' && <AlertTriangle className="h-3.5 w-3.5" />}
            {tab.label}
            {tab.value === 'issues' && openIssuesCount > 0 && (
              <span className="ml-1 bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full">
                {openIssuesCount}
              </span>
            )}
          </button>
        ))}
      </div>
      
      {/* Search */}
      <div className="my-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un logement, agent..."
            className="pl-10 h-11 rounded-[10px] bg-muted/50 border-border text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Tab content */}
      <div data-tutorial="cleaning-task">
        {renderTabContent()}
      </div>
    </div>
  );
};
