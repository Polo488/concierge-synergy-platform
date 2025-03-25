import { useEffect, useState } from 'react';
import { 
  Sparkles, CheckCircle, Clock, Calendar as CalendarIcon, 
  Search, Download, Filter, User, ChevronLeft, ChevronRight,
  Printer, Tag, Tags, QrCode, ChevronDown, ChevronUp, Eye,
  Plus, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatCard } from '@/components/dashboard/StatCard';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addDays, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const cleaningAgents = [
  'Marie Lambert',
  'Lucas Martin',
  'Sophie Berger',
  'Thomas Laurent'
];

const Cleaning = () => {
  const [todayCleaningTasks, setTodayCleaningTasks] = useState([
    {
      id: 1,
      property: 'Appartement 12 Rue du Port',
      checkoutTime: '11:00',
      checkinTime: '15:00',
      status: 'todo',
      cleaningAgent: null,
      startTime: '',
      endTime: '',
      items: ['Draps king size x1', 'Serviettes bain x2', 'Serviettes main x2'],
      consumables: ['Capsules café x4', 'Sachets thé x2', 'Gel douche x1', 'Shampoing x1'],
      bedding: ['Housse de couette king size x1', 'Taies d\'oreiller x2'],
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
      items: ['Draps simple x1', 'Serviettes bain x1', 'Serviettes main x1'],
      consumables: ['Capsules café x2', 'Sachets thé x2', 'Gel douche x1'],
      bedding: ['Housse de couette simple x1', 'Taie d\'oreiller x1'],
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
      items: ['Draps queen x1', 'Serviettes bain x2', 'Serviettes main x2', 'Peignoirs x2'],
      consumables: ['Capsules café x4', 'Sachets thé x4', 'Gel douche x2', 'Shampoing x2'],
      bedding: ['Housse de couette queen x1', 'Taies d\'oreiller x2'],
      comments: 'Vérifier l\'état du four'
    }
  ]);

  const [tomorrowCleaningTasks, setTomorrowCleaningTasks] = useState([
    {
      id: 4,
      property: 'Maison 23 Rue de la Paix',
      checkoutTime: '10:00',
      checkinTime: '15:00',
      status: 'scheduled',
      cleaningAgent: null,
      startTime: '',
      endTime: '',
      items: ['Draps king size x2', 'Serviettes bain x4', 'Serviettes main x4', 'Peignoirs x2'],
      consumables: ['Capsules café x6', 'Sachets thé x4', 'Gel douche x2', 'Shampoing x2'],
      bedding: ['Housse de couette king size x2', 'Taies d\'oreiller x4'],
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
      items: ['Draps queen x1', 'Serviettes bain x2', 'Serviettes main x2'],
      consumables: ['Capsules café x4', 'Sachets thé x2', 'Gel douche x1', 'Shampoing x1'],
      bedding: ['Housse de couette queen x1', 'Taies d\'oreiller x2'],
      comments: ''
    }
  ]);

  const [completedCleaningTasks, setCompletedCleaningTasks] = useState([
    {
      id: 6,
      property: 'Studio 15 Rue des Lilas',
      date: '2023-11-21',
      status: 'completed',
      cleaningAgent: 'Lucas Martin',
      startTime: '10:30',
      endTime: '11:45',
      items: ['Draps simple x1', 'Serviettes bain x1', 'Serviettes main x1'],
      consumables: ['Capsules café x2', 'Sachets thé x2', 'Gel douche x1'],
      bedding: ['Housse de couette simple x1', 'Taie d\'oreiller x1'],
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
      items: ['Draps queen x1', 'Serviettes bain x2', 'Serviettes main x2'],
      consumables: ['Capsules café x4', 'Sachets thé x2', 'Gel douche x1', 'Shampoing x1'],
      bedding: ['Housse de couette queen x1', 'Taies d\'oreiller x2'],
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
  
  // État pour les tâches et données sélectionnées
  const [currentTask, setCurrentTask] = useState<any>(null);
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [problemDescription, setProblemDescription] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState("today");
  const [selectedTasks, setSelectedTasks] = useState<Array<any>>([]);
  const [labelType, setLabelType] = useState<"standard" | "detailed" | "qrcode">("standard");
  
  // Ajout d'un état pour les commentaires lors de la modification
  const [taskComments, setTaskComments] = useState<string>("");
  const [editCommentsDialogOpen, setEditCommentsDialogOpen] = useState(false);
  
  // État pour la nouvelle tâche à ajouter
  const [newTask, setNewTask] = useState({
    property: '',
    checkoutTime: '11:00',
    checkinTime: '15:00',
    status: 'todo',
    cleaningAgent: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    items: ['Serviettes bain x2', 'Serviettes main x2'],
    consumables: ['Capsules café x4', 'Sachets thé x2'],
    bedding: ['Housse de couette queen x1', 'Taies d\'oreiller x2'],
    comments: ''
  });

  // Générer prochain ID disponible
  const getNextId = () => {
    const allTasks = [...todayCleaningTasks, ...tomorrowCleaningTasks, ...completedCleaningTasks];
    return Math.max(...allTasks.map(t => t.id), 0) + 1;
  };

  useEffect(() => {
    document.title = 'Ménage - GESTION BNB LYON';
  }, []);

  const getStatusBadge = (status: string) => {
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

  const handleStartCleaning = (task: any) => {
    const updatedTasks = todayCleaningTasks.map(t => {
      if (t.id === task.id) {
        return {
          ...t,
          status: 'inProgress',
          startTime: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        };
      }
      return t;
    });
    
    setTodayCleaningTasks(updatedTasks);
    
    toast({
      title: "Ménage commencé",
      description: `Le ménage pour ${task.property} a débuté.`
    });
  };

  const handleCompleteCleaning = (task: any) => {
    const updatedTodayTasks = todayCleaningTasks.filter(t => t.id !== task.id);
    setTodayCleaningTasks(updatedTodayTasks);
    
    const now = new Date();
    const completedTask = {
      ...task,
      status: 'completed',
      date: now.toISOString().split('T')[0],
      endTime: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
    
    setCompletedCleaningTasks([completedTask, ...completedCleaningTasks]);
    
    toast({
      title: "Ménage terminé",
      description: `Le ménage pour ${task.property} a été complété avec succès.`
    });
  };

  const openAssignDialog = (task: any) => {
    setCurrentTask(task);
    setSelectedAgent(task.cleaningAgent || "");
    setAssignDialogOpen(true);
  };

  const handleAssignAgent = () => {
    const updateTask = (tasks: any[], taskId: number) => {
      return tasks.map(t => {
        if (t.id === taskId) {
          return { ...t, cleaningAgent: selectedAgent };
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
    
    toast({
      title: "Agent assigné",
      description: `${selectedAgent} a été assigné au ménage pour ${currentTask.property}.`
    });
  };

  const openDetailsDialog = (task: any) => {
    setCurrentTask(task);
    setDetailsDialogOpen(true);
  };

  const openProblemDialog = (task: any) => {
    setCurrentTask(task);
    setProblemDialogOpen(true);
    setProblemDescription("");
  };

  const handleReportProblem = () => {
    toast({
      title: "Problème signalé",
      description: `Un problème a été signalé pour ${currentTask.property}. L'équipe de support a été notifiée.`,
      variant: "destructive"
    });
    setProblemDialogOpen(false);
  };

  const handleExport = () => {
    toast({
      title: "Exportation réussie",
      description: "Les données de ménage ont été exportées avec succès."
    });
  };

  const handleSync = () => {
    toast({
      title: "Synchronisation réussie",
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
        toast({
          title: "Date sélectionnée",
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

  const handleSelectTask = (task: any) => {
    setSelectedTasks(prev => {
      const taskIndex = prev.findIndex(t => t.id === task.id);
      if (taskIndex === -1) {
        return [...prev, task];
      } else {
        return prev.filter(t => t.id !== task.id);
      }
    });
  };

  // Nouvelle fonction pour ajouter une tâche
  const handleAddTask = () => {
    const id = getNextId();
    const now = new Date();
    const currentTime = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    const taskToAdd = {
      ...newTask,
      id,
      cleaningAgent: newTask.cleaningAgent === '' ? null : newTask.cleaningAgent,
      // Add startTime and endTime properties for all tasks
      startTime: currentTime,
      endTime: currentTime
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
      const scheduledTask = { ...taskToAdd, status: 'scheduled' };
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
      items: ['Serviettes bain x2', 'Serviettes main x2'],
      consumables: ['Capsules café x4', 'Sachets thé x2'],
      bedding: ['Housse de couette queen x1', 'Taies d\'oreiller x2'],
      comments: ''
    });
    
    setAddTaskDialogOpen(false);
    
    toast({
      title: "Ménage ajouté",
      description: `Un nouveau ménage pour ${taskToAdd.property} a été ajouté.`
    });
  };

  // Supprimer une tâche
  const openDeleteDialog = (task: any) => {
    setCurrentTask(task);
    setDeleteConfirmDialogOpen(true);
  };

  const handleDeleteTask = () => {
    // Trouver dans quelle liste est la tâche
    if (currentTask.status === 'completed') {
      setCompletedCleaningTasks(completedCleaningTasks.filter(t => t.id !== currentTask.id));
    } else if (currentTask.status === 'scheduled') {
      setTomorrowCleaningTasks(tomorrowCleaningTasks.filter(t => t.id !== currentTask.id));
    } else {
      setTodayCleaningTasks(todayCleaningTasks.filter(t => t.id !== currentTask.id));
    }
    
    setDeleteConfirmDialogOpen(false);
    
    toast({
      title: "Ménage supprimé",
      description: `Le ménage pour ${currentTask.property} a été supprimé.`,
      variant: "destructive"
    });
  };

  const handlePrintLabels = () => {
    if (selectedTasks.length === 0) {
      toast({
        title: "Sélection requise",
        description: "Veuillez sélectionner au moins un ménage pour générer des étiquettes.",
        variant: "destructive"
      });
      return;
    }

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Étiquettes Ménage - GESTION BNB LYON</title>
            <style>
              @media print {
                @page { 
                  margin: 0.5cm;
                  size: auto;
                }
              }
              body { 
                font-family: Arial, sans-serif; 
                margin: 0;
                padding: 15px;
              }
              .container { 
                display: flex;
                flex-direction: column;
                gap: 30px;
              }
              .label { 
                page-break-inside: avoid;
                page-break-after: always;
                width: 100%;
                max-width: 800px;
              }
              .property-header {
                border: 3px solid #000;
                border-radius: 15px;
                padding: 10px 15px;
                font-weight: bold;
                font-size: 24px;
                display: inline-block;
                margin-bottom: 15px;
              }
              .arrival-status {
                font-size: 24px;
                font-weight: bold;
                float: right;
                margin-top: 10px;
              }
              .items-container {
                display: flex;
                justify-content: space-between;
              }
              .left-column {
                flex: 3;
                font-size: 18px;
              }
              .right-column {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 10px;
                font-size: 24px;
                font-weight: bold;
              }
              .item-row {
                margin-bottom: 10px;
                font-size: 22px;
              }
              .item-qty {
                font-weight: bold;
                font-size: 24px;
              }
              .item-name {
                font-style: italic;
              }
              .consumable-row {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 10px;
              }
              .consumable-icon {
                border: 1px solid #000;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
              }
              .consumable-text {
                font-size: 24px;
                font-weight: bold;
              }
              .box-icon {
                border: 1px solid #000;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              ${selectedTasks.map(task => {
                // Extract property number and name
                const propertyMatch = task.property.match(/^([^a-zA-Z]+)\\s*(.*)$/);
                const propertyNum = propertyMatch ? propertyMatch[1].trim() : '';
                const propertyName = propertyMatch ? propertyMatch[2].trim() : task.property;
                
                return `
                <div class="label">
                  <div class="header-row">
                    <span class="property-header">${propertyNum} : ${propertyName}</span>
                    <span class="arrival-status">ARRIVÉE AUJD : ${task.status === 'scheduled' ? 'NON' : 'OUI'}</span>
                  </div>
                  
                  <div class="items-container">
                    <div class="left-column">
                      ${task.bedding?.map(item => {
                        const qtyMatch = item.match(/x(\\d+)$/);
                        const qty = qtyMatch ? qtyMatch[1] : '1';
                        const itemName = item.replace(/x\\d+$/, '').trim();
                        return `<div class="item-row"><span class="item-qty">${qty} x</span> <span class="item-name">${itemName}</span></div>`;
                      }).join('') || ''}
                      
                      ${task.items?.map(item => {
                        const qtyMatch = item.match(/x(\\d+)$/);
                        const qty = qtyMatch ? qtyMatch[1] : '1';
                        const itemName = item.replace(/x\\d+$/, '').trim();
                        // Filter out only items related to towels, bath mats, etc.
                        if (itemName.toLowerCase().includes('serviette') || 
                            itemName.toLowerCase().includes('tapis')) {
                          return `<div class="item-row"><span class="item-qty">${qty} x</span> <span class="item-name">${itemName}</span></div>`;
                        }
                        return '';
                      }).join('') || ''}
                    </div>
                    
                    <div class="right-column">
                      <div class="consumable-row">
                        <div class="box-icon">☕</div>
                        <span class="consumable-text">x 4</span>
                      </div>
                      <div class="consumable-row">
                        <div class="box-icon">🍵</div>
                        <span class="consumable-text">x 4</span>
                      </div>
                      <div class="consumable-row">
                        <div class="box-icon">CUISINE</div>
                        <span class="consumable-text">x 1</span>
                      </div>
                      <div class="consumable-row">
                        <div class="box-icon">SDB</div>
                        <span class="consumable-text">x 2</span>
                      </div>
                    </div>
                  </div>
                </div>
              `;
              }).join('')}
            </div>
            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }

    toast({
      title: "Étiquettes générées",
      description: `${selectedTasks.length} étiquette(s) prête(s) à imprimer.`
    });
    
    setLabelsDialogOpen(false);
  };

  const CleaningTask = ({ task }: { task: any }) => {
    const isTaskSelected = selectedTasks.some(t => t.id === task.id);
    const [isExpanded, setIsExpanded] = useState(false);
    
    return (
      <Card className={`p-3 mb-2 animate-slide-up card-hover border border-border/40 ${labelsDialogOpen && isTaskSelected ? 'ring-2 ring-primary' : ''}`}>
        <div className="flex justify-between items-center">
          <div 
            className={`flex-1 ${labelsDialogOpen ? "cursor-pointer" : ""}`} 
            onClick={labelsDialogOpen ? () => handleSelectTask(task) : undefined}
          >
            <div className="flex items-center gap-2">
              {getStatusBadge(task.status)}
              <h3 className="font-semibold">{task.property}</h3>
              {labelsDialogOpen && (
                <div className="ml-auto">
                  <input 
                    type="checkbox" 
                    checked={isTaskSelected}
                    onChange={() => handleSelectTask(task)}
                    className="h-4 w-4"
                  />
                </div>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {task.date ? (
                <span>{task.date} · {task.startTime} - {task.endTime}</span>
              ) : (
                <span>Check-out: {task.checkoutTime} · Check-in: {task.checkinTime}</span>
              )}
            </div>
            {task.comments && (
              <div className="mt-1 text-sm italic text-muted-foreground">
                "{task.comments}"
              </div>
            )}
          </div>
          
          {!labelsDialogOpen && (
            <div className="flex items-center gap-2">
              {task.status === 'todo' && (
                <>
                  <Button size="sm" variant="ghost" className="px-2" onClick={() => openDetailsDialog(task)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" className="py-1 px-2 h-8" onClick={() => handleStartCleaning(task)}>
                    Commencer
                  </Button>
                </>
              )}
              {task.status === 'inProgress' && (
                <>
                  <Button size="sm" variant="ghost" className="px-2" onClick={() => openDetailsDialog(task)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" className="py-1 px-2 h-8" onClick={() => handleCompleteCleaning(task)}>
                    Terminer
                  </Button>
                </>
              )}
              {(task.status === 'completed' || task.status === 'scheduled') && (
                <Button size="sm" variant="ghost" className="px-2" onClick={() => openDetailsDialog(task)}>
                  <Eye className="h-4 w-4" />
                </Button>
              )}
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="px-2"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3 pt-3 border-t">
                  {task.cleaningAgent && (
                    <div className="flex items-center gap-2 mb-3">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{task.cleaningAgent.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">Agent: {task.cleaningAgent}</span>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    {task.items?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-1">Linge à prévoir:</p>
                        <div className="flex flex-wrap gap-2">
                          {task.items.map((item: string, i: number) => (
                            <Badge key={i} variant="outline" className="rounded-full">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {task.bedding?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-1">Housses et taies:</p>
                        <div className="flex flex-wrap gap-2">
                          {task.bedding.map((item: string, i: number) => (
                            <Badge key={i} variant="outline" className="rounded-full bg-blue-50">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {task.consumables?.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-1">Consommables:</p>
                        <div className="flex flex-wrap gap-2">
                          {task.consumables.map((item: string, i: number) => (
                            <Badge key={i} variant="outline" className="rounded-full bg-green-50">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    {task.status === 'todo' && !task.cleaningAgent && (
                      <Button size="sm" variant="outline" className="py-1 px-2 h-8" onClick={() => openAssignDialog(task)}>
                        Assigner
                      </Button>
                    )}
                    {task.status === 'todo' && task.cleaningAgent && (
                      <Button size="sm" variant="outline" className="py-1 px-2 h-8" onClick={() => openAssignDialog(task)}>
                        Changer
                      </Button>
                    )}
                    {task.status === 'inProgress' && (
                      <Button size="sm" variant="outline" className="py-1 px-2 h-8" onClick={() => openProblemDialog(task)}>
                        Problème
                      </Button>
                    )}
                    {/* Bouton de suppression pour toutes les tâches */}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="py-1 px-2 h-8 text-destructive hover:bg-destructive/10" 
                      onClick={() => openDeleteDialog(task)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}
        </div>
      </Card>
    );
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
