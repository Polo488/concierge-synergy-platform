
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { CleaningTaskList } from '@/components/cleaning/CleaningTaskList';
import { useCleaning } from '@/contexts/CleaningContext';
import { useLanguage } from '@/contexts/LanguageContext';

export const CleaningTabs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useLanguage();
  
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

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
      <TabsList className="grid grid-cols-3 w-full max-w-md">
        <TabsTrigger value="today">{t('cleaning.tabs.today')}</TabsTrigger>
        <TabsTrigger value="tomorrow">{t('cleaning.tabs.tomorrow')}</TabsTrigger>
        <TabsTrigger value="completed">{t('cleaning.tabs.completed')}</TabsTrigger>
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
          tasks={filterTasks(todayCleaningTasks)}
          emptyMessage={t('cleaning.empty.today')}
          labelsDialogOpen={false}
          selectedTasks={selectedTasks}
          onSelectTask={handleSelectTask}
          onStartCleaning={handleStartCleaning}
          onCompleteCleaning={handleCompleteCleaning}
          onOpenDetails={openDetailsDialog}
          onAssign={openAssignDialog}
          onReportProblem={openProblemDialog}
          onDelete={openDeleteDialog}
        />
      </TabsContent>
      
      <TabsContent value="tomorrow" className="space-y-4">
        <CleaningTaskList
          tasks={filterTasks(tomorrowCleaningTasks)}
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
        />
      </TabsContent>
      
      <TabsContent value="completed" className="space-y-4">
        <CleaningTaskList
          tasks={filterTasks(completedCleaningTasks)}
          emptyMessage={t('cleaning.empty.completed')}
          labelsDialogOpen={false}
          selectedTasks={selectedTasks}
          onSelectTask={handleSelectTask}
          onStartCleaning={handleStartCleaning}
          onCompleteCleaning={handleCompleteCleaning}
          onOpenDetails={openDetailsDialog}
          onAssign={openAssignDialog}
          onReportProblem={openProblemDialog}
          onDelete={openDeleteDialog}
        />
      </TabsContent>
    </Tabs>
  );
};
