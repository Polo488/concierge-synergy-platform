
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { CleaningTaskList } from '@/components/cleaning/CleaningTaskList';
import { useCleaning } from '@/contexts/CleaningContext';

export const CleaningTabs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
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
        <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
        <TabsTrigger value="tomorrow">Demain</TabsTrigger>
        <TabsTrigger value="completed">Complétés</TabsTrigger>
      </TabsList>
      
      <div className="my-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un appartement, un agent..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <TabsContent value="today" className="space-y-4">
        <CleaningTaskList
          tasks={filterTasks(todayCleaningTasks)}
          emptyMessage="Aucun ménage prévu pour aujourd'hui"
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
          emptyMessage="Aucun ménage prévu pour demain"
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
          emptyMessage="Aucun ménage complété"
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
