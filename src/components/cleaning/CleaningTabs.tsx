
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { CleaningTaskList } from '@/components/cleaning/CleaningTaskList';
import { useCleaning } from '@/contexts/CleaningContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

interface CleaningTabsProps {
  initialTab?: 'today' | 'tomorrow' | 'completed';
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
    selectedTasks,
    handleSelectTask,
    handleStartCleaning,
    handleCompleteCleaning,
    openDetailsDialog,
    openAssignDialog,
    openProblemDialog,
    openDeleteDialog
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

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2" defaultValue={initialTab}>
      <TabsList className="grid grid-cols-3 w-full max-w-md">
        <TabsTrigger value="today">{t('cleaning.tabs.today')}</TabsTrigger>
        {!isCleaningAgent && (
          <TabsTrigger value="tomorrow">{t('cleaning.tabs.tomorrow')}</TabsTrigger>
        )}
        <TabsTrigger value="completed">{t('cleaning.tabs.completed')}</TabsTrigger>
        {isCleaningAgent && (
          <TabsTrigger value="problems">{t('cleaning.tabs.problems')}</TabsTrigger>
        )}
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

      {isCleaningAgent && (
        <TabsContent value="problems" className="space-y-4">
          <CleaningTaskList
            tasks={getFilteredTasks(todayCleaningTasks.filter(task => task.problems && task.problems.length > 0))}
            emptyMessage={t('cleaning.empty.problems')}
            labelsDialogOpen={false}
            selectedTasks={selectedTasks}
            onSelectTask={undefined}
            onStartCleaning={handleStartCleaning}
            onCompleteCleaning={handleCompleteCleaning}
            onOpenDetails={openDetailsDialog}
            onAssign={undefined}
            onReportProblem={openProblemDialog}
            onDelete={undefined}
            isCleaningAgent={true}
          />
        </TabsContent>
      )}
    </Tabs>
  );
};
