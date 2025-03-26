import { useEffect, useState } from 'react';
import { 
  Sparkles, CheckCircle, Clock, Calendar as CalendarIcon, 
  Search, Download, Filter, Tag, Plus, Printer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/dashboard/StatCard';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { format, addDays, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CleaningTask, CleaningStatus, NewCleaningTask } from '@/types/cleaning';
import { getNextId, generateLabelsPrintWindow, getStatusBadgeClass, getStatusLabel } from '@/utils/cleaningUtils';

// Component imports
import { CleaningTaskList } from '@/components/cleaning/CleaningTaskList';
import { CleaningAgentAssignDialog } from '@/components/cleaning/CleaningAgentAssignDialog';
import { CleaningTaskDetailsDialog } from '@/components/cleaning/CleaningTaskDetailsDialog';
import { ProblemReportDialog } from '@/components/cleaning/ProblemReportDialog';
import { CalendarDialog } from '@/components/cleaning/CalendarDialog';
import { LabelsDialog } from '@/components/cleaning/LabelsDialog';
import { AddCleaningTaskDialog } from '@/components/cleaning/AddCleaningTaskDialog';
import { EditCommentsDialog } from '@/components/cleaning/EditCommentsDialog';
import { DeleteConfirmDialog } from '@/components/cleaning/DeleteConfirmDialog';

const cleaningAgents = [
  'Marie Lambert',
  'Lucas Martin',
  'Sophie Berger',
  'Thomas Laurent'
];

const getStatusBadge = (status: CleaningStatus) => {
  switch(status) {
    case 'todo':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-full">À faire</Badge>;
    case 'inProgress':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 rounded-full">En cours</Badge>;
    case 'completed':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 rounded-full">Terminé</Badge>;
    case 'scheduled':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 rounded-full">Planifié</Badge>;
    default:
      return null;
  }
};

const Cleaning = () => {
  const [todayCleaningTasks, setTodayCleaningTasks] = useState<CleaningTask[]>([
    {
      id: 1,
      property: 'Appartement 12 Rue du Port',
      checkoutTime: '11:00',
      checkinTime: '15:00',
      status: 'todo',
      cleaningAgent: null,
      startTime: '',
      endTime: '',
      linens: ['Draps king size x1', 'Serviettes bain x2', 'Serviettes main x2', 'Housse de couette king size x1', 'Taies d\'oreiller x2'],
      consumables: ['Capsules café x4', 'Sachets thé x2', 'Gel douche x1', 'Shampoing x1'],
      comments: 'Attention aux taches sur le canapé'
    },
    {
      id: 2,
      property: 'Studio 8 Avenue des Fleurs',
      checkoutTime: '10:00',
      checkinTime: '16:00',
      status: 'inProgress',
      cleaningAgent: 'Marie Lambert',
      startTime: '10:30',
      endTime: '',
      linens: ['Draps simple x1', 'Serviettes bain x1', 'Serviettes main x1', 'Housse de couette simple x1', 'Taie d\'oreiller x1'],
      consumables: ['Capsules café x2', 'Sachets thé x2', 'Gel douche x1'],
      comments: ''
    },
    {
      id: 3,
      property: 'Loft 72 Rue des Arts',
      checkoutTime: '12:00',
      checkinTime: '17:00',
      status: 'todo',
      cleaningAgent: 'Lucas Martin',
      startTime: '',
      endTime: '',
      linens: ['Draps queen x1', 'Serviettes bain x2', 'Serviettes main x2', 'Peignoirs x2', 'Housse de couette queen x1', 'Taies d\'oreiller x2'],
      consumables: ['Capsules café x4', 'Sachets thé x4', 'Gel douche x2', 'Shampoing x2'],
      comments: 'Vérifier l\'état du four'
    }
  ]);

  const [tomorrowCleaningTasks, setTomorrowCleaningTasks] = useState<CleaningTask[]>([
    {
      id: 4,
      property: 'Maison 23 Rue de la Paix',
      checkoutTime: '10:00',
      checkinTime: '15:00',
      status: 'scheduled',
      cleaningAgent: null,
      startTime: '',
      endTime: '',
      linens: ['Draps king size x2', 'Serviettes bain x4', 'Serviettes main x4', 'Peignoirs x2', 'Housse de couette king size x2', 'Taies d\'oreiller x4'],
      consumables: ['Capsules café x6', 'Sachets thé x4', 'Gel douche x2', 'Shampoing x2'],
      comments: ''
    },
    {
      id: 5,
      property: 'Appartement 45 Boulevard Central',
      checkoutTime: '11:00',
      checkinTime: '14:00',
      status: 'scheduled',
      cleaningAgent: 'Marie Lambert',
      startTime: '',
      endTime: '',
      linens: ['Draps queen x1', 'Serviettes bain x2', 'Serviettes main x2', 'Housse de couette queen x1', 'Taies d\'oreiller x2'],
      consumables: ['Capsules café x4', 'Sachets thé x2', 'Gel douche x1', 'Shampoing x1'],
      comments: ''
    }
  ]);

  const [completedCleaningTasks, setCompletedCleaningTasks] = useState<CleaningTask[]>([
    {
      id: 6,
      property: 'Studio 15 Rue des Lilas',
      date: '2023-11-21',
      status: 'completed',
      cleaningAgent: 'Lucas Martin',
      startTime: '10:30',
      endTime: '11:45',
      linens: ['Draps simple x1', 'Serviettes bain x1', 'Serviettes main x1', 'Housse de couette simple x1', 'Taie d\'oreiller x1'],
      consumables: ['Capsules café x2', 'Sachets thé x2', 'Gel douche x1'],
      comments: ''
    },
    {
      id: 7,
      property: 'Appartement 28 Avenue Victor Hugo',
      date: '2023-11-21',
      status: 'completed',
      cleaningAgent: 'Marie Lambert',
      startTime: '13:00',
      endTime: '14:30',
      linens: ['Draps queen x1', 'Serviettes bain x2', 'Serviettes main x2', 'Housse de couette queen x1', 'Taies d\'oreiller x2'],
      consumables: ['Capsules café x4', 'Sachets thé x2', 'Gel douche x1', 'Shampoing x1'],
      comments: ''
    }
  ]);

  // État pour les dialogues
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [problemDialogOpen, setProblemDialogOpen] = useState(false);
  const [calendarDialogOpen, setCalendarDialogOpen] = useState(false);
  const [labelsDialogOpen, setLabelsDialogOpen] = useState(false);
  const [addTaskDialogOpen, setAddTaskDialogOpen] = useState(false);
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);
  const [editCommentsDialogOpen, setEditCommentsDialogOpen] = useState(false);
  
  // État pour les tâches et données sélectionnées
  const [currentTask, setCurrentTask] = useState<CleaningTask | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [problemDescription, setProblemDescription] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState("today");
  const [selectedTasks, setSelectedTasks] = useState<CleaningTask[]>([]);
  const [labelType, setLabelType] = useState<"standard" | "detailed" | "qrcode">("standard");
  
  // Ajout d'un état pour les commentaires lors de la modification
  const [taskComments, setTaskComments] = useState<string>("");
  
  // État pour la nouvelle tâche à ajouter
  const [newTask, setNewTask] = useState<NewCleaningTask>({
    property: '',
    checkoutTime: '11:00',
    checkinTime: '15:00',
    status: 'todo',
    cleaningAgent: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    linens: ['Serviettes bain x2', 'Serviettes main x2', 'Housse de couette queen x1', 'Taies d\'oreiller x2'],
    consumables: ['Capsules café x4', 'Sachets thé x2'],
    comments: ''
  });

  useEffect(() => {
    document.title = 'Ménage - GESTION BNB LYON';
  }, []);

  const handleStartCleaning = (task: CleaningTask) => {
    const updatedTasks = todayCleaningTasks.map(t => {
      if (t.id === task.id) {
        return {
          ...t,
          status: 'inProgress' as CleaningStatus,
          startTime: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        };
      }
      return t;
    });
    
    setTodayCleaningTasks(updatedTasks);
    
    toast("Ménage commencé", {
      description: `Le ménage pour ${task.property} a débuté.`
    });
  };

  const handleCompleteCleaning = (task: CleaningTask) => {
    const updatedTodayTasks = todayCleaningTasks.filter(t => t.id !== task.id);
    setTodayCleaningTasks(updatedTodayTasks);
    
    const now = new Date();
    const completedTask: CleaningTask = {
      ...task,
      status: 'completed' as CleaningStatus,
      date: now.toISOString().split('T')[0],
      endTime: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
    
    setCompletedCleaningTasks([completedTask, ...completedCleaningTasks]);
    
    toast("Ménage terminé", {
      description: `Le ménage pour ${task.property} a été complété avec succès.`
    });
  };

  const openAssignDialog = (task: CleaningTask) => {
    setCurrentTask(task);
    setSelectedAgent(task.cleaningAgent || "");
    setAssignDialogOpen(true);
  };

  const handleAssignAgent = () => {
    if (!currentTask) return;
    
    const updateTask = (tasks: CleaningTask[], taskId: number) => {
      return tasks.map(t => {
        if (t.id === taskId) {
          return { 
            ...t, 
            cleaningAgent: selectedAgent === "non_assigne" ? null : selectedAgent 
          };
        }
        return t;
      });
    };

    if (currentTask.status === 'todo' || currentTask.status === 'inProgress') {
      setTodayCleaningTasks(updateTask(todayCleaningTasks, currentTask.id));
    } else if (currentTask.status === 'scheduled') {
      setTomorrowCleaningTasks(updateTask(tomorrowCleaningTasks, currentTask.id));
    }

    setAssignDialogOpen(false);
    
    toast("Agent assigné", {
      description: `${selectedAgent === "non_assigne" ? "Aucun agent" : selectedAgent} a été assigné au ménage pour ${currentTask.property}.`
    });
  };

  const openDetailsDialog = (task: CleaningTask) => {
    setCurrentTask(task);
    setDetailsDialogOpen(true);
  };

  const openProblemDialog = (task: CleaningTask) => {
    setCurrentTask(task);
    setProblemDialogOpen(true);
    setProblemDescription("");
  };

  const handleReportProblem = () => {
    toast.error("Problème signalé", {
      description: `Un problème a été signalé pour ${currentTask?.property}. L'équipe de support a été notifiée.`
    });
    setProblemDialogOpen(false);
  };

  const handleExport = () => {
    toast("Exportation réussie", {
      description: "Les données de ménage ont été exportées avec succès."
    });
  };

  const handleSync = () => {
    toast("Synchronisation réussie", {
      description: "Les données de ménage ont été synchronisées avec succès."
    });
  };

  const openCalendarDialog = () => {
    setCalendarDialogOpen(true);
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      
      if (isSameDay(date, new Date())) {
        setActiveTab("today");
      } else if (isSameDay(date, addDays(new Date(), 1))) {
        setActiveTab("tomorrow");
      } else {
        toast("Date sélectionnée", {
          description: `Vous avez sélectionné le ${format(date, 'dd MMMM yyyy', { locale: fr })}`
        });
      }
      
      setCalendarDialogOpen(false);
    }
  };

  const openLabelsDialog = () => {
    setSelectedTasks([]);
    setLabelType("standard");
    setLabelsDialogOpen(true);
  };

  const handleSelectTask = (task: CleaningTask) => {
    setSelectedTasks(prev => {
      const taskIndex = prev.findIndex(t => t.id === task.id);
      if (taskIndex === -1) {
        return [...prev, task];
      } else {
        return prev.filter(t => t.id !== task.id);
      }
    });
  };

  const handleAddTask = () => {
    const allTasks = [...todayCleaningTasks, ...tomorrowCleaningTasks, ...completedCleaningTasks];
    const id = getNextId(allTasks);
    
    const taskToAdd: CleaningTask = {
      ...newTask,
      id,
      cleaningAgent: newTask.cleaningAgent === '' || newTask.cleaningAgent === 'non_assigne' ? null : newTask.cleaningAgent,
      startTime: '',
      endTime: ''
    };
    
    // Déterminer dans quelle liste ajouter la tâche selon la date et le statut
    const taskDate = new Date(newTask.date);
    const today = new Date();
    const tomorrow = addDays(today, 1);
    
    if (isSameDay(taskDate, today)) {
      if (newTask.status === 'completed') {
        setCompletedCleaningTasks([taskToAdd, ...completedCleaningTasks]);
      } else {
        setTodayCleaningTasks([...todayCleaningTasks, taskToAdd]);
      }
      setActiveTab("today");
    } else if (isSameDay(taskDate, tomorrow)) {
      setTomorrowCleaningTasks([...tomorrowCleaningTasks, taskToAdd]);
      setActiveTab("tomorrow");
    } else {
      // Pour les dates futures, ajouter à "demain" avec statut planifié
      const scheduledTask: CleaningTask = { 
        ...taskToAdd, 
        status: 'scheduled' 
      };
      setTomorrowCleaningTasks([...tomorrowCleaningTasks, scheduledTask]);
      setActiveTab("tomorrow");
    }
    
    // Réinitialiser le formulaire
    setNewTask({
      property: '',
      checkoutTime: '11:00',
      checkinTime: '15:00',
      status: 'todo',
      cleaningAgent: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      linens: ['Serviettes bain x2', 'Serviettes main x2', 'Housse de couette queen x1', 'Taies d\'oreiller x2'],
      consumables: ['Capsules café x4', 'Sachets thé x2'],
      comments: ''
    });
    
    setAddTaskDialogOpen(false);
    
    toast("Ménage ajouté", {
      description: `Un nouveau ménage pour ${taskToAdd.property} a été ajouté.`
    });
  };

  // Supprimer une tâche
  const openDeleteDialog = (task: CleaningTask) => {
    setCurrentTask(task);
    setDeleteConfirmDialogOpen(true);
  };

  const handleDeleteTask = () => {
    if (!currentTask) return;
    
    // Trouver dans quelle liste est la tâche
    if (currentTask.status === 'completed') {
      setCompletedCleaningTasks(completedCleaningTasks.filter(t => t.id !== currentTask.id));
    } else if (currentTask.status === 'scheduled') {
      setTomorrowCleaningTasks(tomorrowCleaningTasks.filter(t => t.id !== currentTask.id));
    } else {
      setTodayCleaningTasks(todayCleaningTasks.filter(t => t.id !== currentTask.id));
    }
    
    setDeleteConfirmDialogOpen(false);
    
    toast.error("Ménage supprimé", {
      description: `Le ménage pour ${currentTask.property} a été supprimé.`
    });
  };

  const handlePrintLabels = () => {
    if (selectedTasks.length === 0) {
      toast.error("Sélection requise", {
        description: "Veuillez sélectionner au moins un ménage pour générer des étiquettes."
      });
      return;
    }

    generateLabelsPrintWindow(selectedTasks);

    toast("Étiquettes générées", {
      description: `${selectedTasks.length} étiquette(s) prête(s) à imprimer.`
    });
    
    setLabelsDialogOpen(false);
  };
  
  const handleEditComments = () => {
    if (!currentTask) return;
    
    setTaskComments(currentTask.comments);
    setDetailsDialogOpen(false);
    setEditCommentsDialogOpen(true);
  };
  
  const handleSaveComments = () => {
    if (!currentTask) return;
    
    // Update comments in the appropriate task list
    if (currentTask.status === 'completed') {
      setCompletedCleaningTasks(completedCleaningTasks.map(t => 
        t.id === currentTask.id ? {...t, comments: taskComments} : t
      ));
    } else if (currentTask.status === 'scheduled') {
      setTomorrowCleaningTasks(tomorrowCleaningTasks.map(t => 
        t.id === currentTask.id ? {...t, comments: taskComments} : t
      ));
    } else {
      setTodayCleaningTasks(todayCleaningTasks.map(t => 
        t.id === currentTask.id ? {...t, comments: taskComments} : t
      ));
    }
    
    toast("Commentaires modifiés", {
      description: `Les commentaires pour ${currentTask.property} ont été mis à jour.`
    });
    
    setEditCommentsDialogOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ménage</h1>
          <p className="text-muted-foreground mt-1">
            Planification et suivi des ménages
          </p>
        </div>
        <Button onClick={() => setAddTaskDialogOpen(true)} className="gap-1">
          <Plus className="h-4 w-4" />
          Ajouter un ménage
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Aujourd'hui" 
          value={todayCleaningTasks.length.toString()} 
          icon={<Clock className="h-5 w-5" />}
          className="stagger-1"
        />
        <StatCard 
          title="En cours" 
          value={todayCleaningTasks.filter(t => t.status === 'inProgress').length.toString()} 
          icon={<Sparkles className="h-5 w-5" />}
          className="stagger-2"
        />
        <StatCard 
          title="Demain" 
          value={tomorrowCleaningTasks.length.toString()} 
          icon={<CalendarIcon className="h-5 w-5" />}
          className="stagger-3"
        />
        <StatCard 
          title="Terminés (semaine)" 
          value={completedCleaningTasks.length.toString()} 
          icon={<CheckCircle className="h-5 w-5" />}
          change={{ value: 2, type: 'increase' }}
          className="stagger-4"
        />
      </div>
      
      <DashboardCard 
        title="Planification des ménages"
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-1" onClick={openLabelsDialog}>
              <Tag className="h-4 w-4" />
              Étiquettes
            </Button>
            <Button size="sm" variant="outline" className="gap-1" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Exporter
            </Button>
            <Button size="sm" variant="outline" className="gap-1" onClick={openCalendarDialog}>
              <CalendarIcon className="h-4 w-4" />
              Calendrier
            </Button>
            <Button size="sm" variant="outline" className="gap-1" onClick={handleSync}>
              <Sparkles className="h-5 w-5" />
              Synchroniser
            </Button>
          </div>
        }
      >
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
              />
            </div>
          </div>
          
          <TabsContent value="today" className="space-y-4">
            <CleaningTaskList
              tasks={todayCleaningTasks}
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
              tasks={tomorrowCleaningTasks}
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
              tasks={completedCleaningTasks}
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
      </DashboardCard>

      {/* Dialogs */}
      <CleaningAgentAssignDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        currentTask={currentTask}
        selectedAgent={selectedAgent}
        setSelectedAgent={setSelectedAgent}
        cleaningAgents={cleaningAgents}
        onAssign={handleAssignAgent}
      />

      <CleaningTaskDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        currentTask={currentTask}
        getStatusBadge={getStatusBadge}
        onEditComments={handleEditComments}
      />

      <ProblemReportDialog
        open={problemDialogOpen}
        onOpenChange={setProblemDialogOpen}
        currentTask={currentTask}
        problemDescription={problemDescription}
        setProblemDescription={setProblemDescription}
        onReport={handleReportProblem}
      />

      <CalendarDialog
        open={calendarDialogOpen}
        onOpenChange={setCalendarDialogOpen}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />

      <LabelsDialog
        open={labelsDialogOpen}
        onOpenChange={setLabelsDialogOpen}
        labelType={labelType}
        setLabelType={setLabelType}
        selectedTasks={selectedTasks}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        todayCleaningTasks={todayCleaningTasks}
        tomorrowCleaningTasks={tomorrowCleaningTasks}
        completedCleaningTasks={completedCleaningTasks}
        onSelectTask={handleSelectTask}
        onStartCleaning={handleStartCleaning}
        onCompleteCleaning={handleCompleteCleaning}
        onOpenDetails={openDetailsDialog}
        onAssign={openAssignDialog}
        onReportProblem={openProblemDialog}
        onDelete={openDeleteDialog}
        onPrintLabels={handlePrintLabels}
      />

      <AddCleaningTaskDialog
        open={addTaskDialogOpen}
        onOpenChange={setAddTaskDialogOpen}
        newTask={newTask}
        setNewTask={setNewTask}
        cleaningAgents={cleaningAgents}
        onAddTask={handleAddTask}
      />

      <EditCommentsDialog
        open={editCommentsDialogOpen}
        onOpenChange={setEditCommentsDialogOpen}
        currentTask={currentTask}
        taskComments={taskComments}
        setTaskComments={setTaskComments}
        onSaveComments={handleSaveComments}
      />

      <DeleteConfirmDialog
        open={deleteConfirmDialogOpen}
        onOpenChange={setDeleteConfirmDialogOpen}
        onDelete={handleDeleteTask}
      />
    </div>
  );
};

export default Cleaning;
