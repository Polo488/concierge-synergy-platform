
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, AlertTriangle, Plus } from 'lucide-react';
import { CleaningTaskList } from '@/components/cleaning/CleaningTaskList';
import { CleaningIssuesList } from '@/components/cleaning/CleaningIssuesList';
import { useCleaning } from '@/contexts/CleaningContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

interface CleaningTabsProps {
  initialTab?: 'today' | 'tomorrow' | 'completed' | 'issues';
}

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
    cleaningIssues,
    selectedTasks,
    handleSelectTask,
    handleStartCleaning,
    handleCompleteCleaning,
    openDetailsDialog,
    openAssignDialog,
    openProblemDialog,
    openDeleteDialog,
    openIssueDialog,
    handleResolveIssue,
  } = useCleaning();

  const filterTasks = (tasks) => {
    if (!searchTerm) return tasks;
    
    const searchLower = searchTerm.toLowerCase();
    return tasks.filter(task => 
      task.property.toLowerCase().includes(searchLower) || 
      (task.cleaningAgent && task.cleaningAgent.toLowerCase().includes(searchLower))
    );
  };

  // If user is a cleaning agent, filter tasks assigned to them
  const filterTasksByRole = (tasks) => {
    if (!isCleaningAgent || !user) return tasks;
    return tasks.filter(task => task.cleaningAgent === user.name);
  };

  // Combined filtering
  const getFilteredTasks = (tasks) => {
    return filterTasks(filterTasksByRole(tasks));
  };

  const openIssuesCount = cleaningIssues.filter(i => i.status === 'open').length;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2" defaultValue={initialTab}>
      <TabsList className="grid grid-cols-4 w-full max-w-lg">
        <TabsTrigger value="today">{t('cleaning.tabs.today')}</TabsTrigger>
        {!isCleaningAgent && (
          <TabsTrigger value="tomorrow">{t('cleaning.tabs.tomorrow')}</TabsTrigger>
        )}
        <TabsTrigger value="completed">{t('cleaning.tabs.completed')}</TabsTrigger>
        <TabsTrigger value="issues" className="flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5" />
          Problèmes
          {openIssuesCount > 0 && (
            <span className="ml-1 bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full">
              {openIssuesCount}
            </span>
          )}
        </TabsTrigger>
      </TabsList>
      
      <div className="my-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('cleaning.search.placeholder')}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <TabsContent value="today" className="space-y-4">
        <CleaningTaskList
          tasks={getFilteredTasks(todayCleaningTasks)}
          emptyMessage={t('cleaning.empty.today')}
          labelsDialogOpen={false}
          selectedTasks={selectedTasks}
          onSelectTask={isCleaningAgent ? undefined : handleSelectTask}
          onStartCleaning={handleStartCleaning}
          onCompleteCleaning={handleCompleteCleaning}
          onOpenDetails={openDetailsDialog}
          onAssign={isCleaningAgent ? undefined : openAssignDialog}
          onReportProblem={openProblemDialog}
          onDelete={isCleaningAgent ? undefined : openDeleteDialog}
          isCleaningAgent={isCleaningAgent}
        />
      </TabsContent>
      
      {!isCleaningAgent && (
        <TabsContent value="tomorrow" className="space-y-4">
          <CleaningTaskList
            tasks={getFilteredTasks(tomorrowCleaningTasks)}
            emptyMessage={t('cleaning.empty.tomorrow')}
            labelsDialogOpen={false}
            selectedTasks={selectedTasks}
            onSelectTask={handleSelectTask}
            onStartCleaning={handleStartCleaning}
            onCompleteCleaning={handleCompleteCleaning}
            onOpenDetails={openDetailsDialog}
            onAssign={openAssignDialog}
            onReportProblem={openProblemDialog}
            onDelete={openDeleteDialog}
            isCleaningAgent={false}
          />
        </TabsContent>
      )}
      
      <TabsContent value="completed" className="space-y-4">
        <CleaningTaskList
          tasks={getFilteredTasks(completedCleaningTasks)}
          emptyMessage={t('cleaning.empty.completed')}
          labelsDialogOpen={false}
          selectedTasks={selectedTasks}
          onSelectTask={isCleaningAgent ? undefined : handleSelectTask}
          onStartCleaning={isCleaningAgent ? undefined : handleStartCleaning}
          onCompleteCleaning={isCleaningAgent ? undefined : handleCompleteCleaning}
          onOpenDetails={openDetailsDialog}
          onAssign={isCleaningAgent ? undefined : openAssignDialog}
          onReportProblem={isCleaningAgent ? undefined : openProblemDialog}
          onDelete={isCleaningAgent ? undefined : openDeleteDialog}
          isCleaningAgent={isCleaningAgent}
        />
      </TabsContent>

      <TabsContent value="issues" className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Signalements de problèmes de ménage avec suivi et repasses
          </p>
          {!isCleaningAgent && (
            <Button onClick={() => openIssueDialog()} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Signaler un problème
            </Button>
          )}
        </div>
        <CleaningIssuesList
          issues={cleaningIssues}
          onResolve={!isCleaningAgent ? handleResolveIssue : undefined}
          onViewRepasseTask={(taskId) => {
            const task = todayCleaningTasks.find(t => t.id === taskId);
            if (task) openDetailsDialog(task);
          }}
        />
      </TabsContent>
    </Tabs>
  );
};
