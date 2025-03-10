import { useEffect, useState } from 'react';
import { 
  Sparkles, CheckCircle, Clock, Calendar as CalendarIcon, 
  Search, Download, Filter, User, ChevronLeft, ChevronRight,
  Printer, Tag, Tags, QrCode
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addDays, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

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
      items: ['Draps king size x1', 'Serviettes bain x2', 'Serviettes main x2']
    },
    {
      id: 2,
      property: 'Studio 8 Avenue des Fleurs',
      checkoutTime: '10:00',
      checkinTime: '16:00',
      status: 'inProgress',
      cleaningAgent: 'Marie Lambert',
      startTime: '10:30',
      items: ['Draps simple x1', 'Serviettes bain x1', 'Serviettes main x1']
    },
    {
      id: 3,
      property: 'Loft 72 Rue des Arts',
      checkoutTime: '12:00',
      checkinTime: '17:00',
      status: 'todo',
      cleaningAgent: 'Lucas Martin',
      items: ['Draps queen x1', 'Serviettes bain x2', 'Serviettes main x2', 'Peignoirs x2']
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
      items: ['Draps king size x2', 'Serviettes bain x4', 'Serviettes main x4', 'Peignoirs x2']
    },
    {
      id: 5,
      property: 'Appartement 45 Boulevard Central',
      checkoutTime: '11:00',
      checkinTime: '14:00',
      status: 'scheduled',
      cleaningAgent: 'Marie Lambert',
      items: ['Draps queen x1', 'Serviettes bain x2', 'Serviettes main x2']
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
      items: ['Draps simple x1', 'Serviettes bain x1', 'Serviettes main x1']
    },
    {
      id: 7,
      property: 'Appartement 28 Avenue Victor Hugo',
      date: '2023-11-21',
      status: 'completed',
      cleaningAgent: 'Marie Lambert',
      startTime: '13:00',
      endTime: '14:30',
      items: ['Draps queen x1', 'Serviettes bain x2', 'Serviettes main x2']
    }
  ]);

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [problemDialogOpen, setProblemDialogOpen] = useState(false);
  const [calendarDialogOpen, setCalendarDialogOpen] = useState(false);
  const [labelsDialogOpen, setLabelsDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<any>(null);
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [problemDescription, setProblemDescription] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState("today");
  const [selectedTasks, setSelectedTasks] = useState<Array<any>>([]);
  const [labelType, setLabelType] = useState<"standard" | "detailed" | "qrcode">("standard");

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
              body { font-family: Arial, sans-serif; }
              .container { padding: 20px; }
              .label { 
                border: 1px solid #ccc; 
                padding: 15px; 
                margin-bottom: 20px; 
                page-break-inside: avoid;
                max-width: 400px;
              }
              .property { font-weight: bold; font-size: 16px; margin-bottom: 8px; }
              .details { font-size: 14px; margin-bottom: 8px; }
              .items { margin-top: 10px; }
              .item { margin-bottom: 4px; font-size: 12px; }
              .qrcode { 
                border: 1px solid #000; 
                width: 100px; 
                height: 100px; 
                margin-top: 10px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 12px;
              }
              @media print {
                @page { margin: 0.5cm; }
                .label { page-break-after: always; }
              }
            </style>
          </head>
          <body>
            <div class="container">
              ${selectedTasks.map(task => `
                <div class="label">
                  <div class="property">${task.property}</div>
                  ${labelType !== "standard" ? `
                    <div class="details">
                      ${task.date ? 
                        `Date: ${task.date}` : 
                        `Check-out: ${task.checkoutTime} · Check-in: ${task.checkinTime}`
                      }
                    </div>
                    ${task.cleaningAgent ? `<div class="details">Agent: ${task.cleaningAgent}</div>` : ''}
                  ` : ''}
                  ${labelType !== "standard" ? `
                    <div class="items">
                      <strong>Linge à prévoir:</strong>
                      ${task.items.map((item: string) => `
                        <div class="item">- ${item}</div>
                      `).join('')}
                    </div>
                  ` : ''}
                  ${labelType === "qrcode" ? `
                    <div class="qrcode">QR Code: ${task.id}</div>
                  ` : ''}
                </div>
              `).join('')}
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
    
    return (
      <Card className={`p-5 mb-4 animate-slide-up card-hover border border-border/40 ${labelsDialogOpen && isTaskSelected ? 'ring-2 ring-primary' : ''}`}>
        <div className="flex justify-between items-start">
          <div className={labelsDialogOpen ? "flex-1 cursor-pointer" : "flex-1"} onClick={labelsDialogOpen ? () => handleSelectTask(task) : undefined}>
            <div className="flex items-center gap-2 mb-1">
              {getStatusBadge(task.status)}
              {task.date ? (
                <span className="text-sm text-muted-foreground">
                  {task.date} · {task.startTime} - {task.endTime}
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Check-out: {task.checkoutTime} · Check-in: {task.checkinTime}
                </span>
              )}
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
            <h3 className="font-semibold text-lg">{task.property}</h3>
            
            {task.cleaningAgent && (
              <div className="flex items-center gap-2 mt-2 mb-3">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>{task.cleaningAgent.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <span className="text-sm">Agent: {task.cleaningAgent}</span>
              </div>
            )}
            
            {task.items?.length > 0 && (
              <div className="mt-3">
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
          </div>
          
          {!labelsDialogOpen && (
            <div className="flex flex-col gap-2">
              {task.status === 'todo' && (
                <>
                  <Button size="sm" className="w-full" onClick={() => handleStartCleaning(task)}>
                    Commencer
                  </Button>
                  {!task.cleaningAgent ? (
                    <Button size="sm" variant="outline" className="w-full" onClick={() => openAssignDialog(task)}>
                      Assigner
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="w-full" onClick={() => openAssignDialog(task)}>
                      Changer
                    </Button>
                  )}
                </>
              )}
              {task.status === 'inProgress' && (
                <>
                  <Button size="sm" className="w-full" onClick={() => handleCompleteCleaning(task)}>
                    Terminer
                  </Button>
                  <Button size="sm" variant="outline" className="w-full" onClick={() => openProblemDialog(task)}>
                    Problème
                  </Button>
                </>
              )}
              {(task.status === 'completed' || task.status === 'scheduled') && (
                <Button size="sm" variant="outline" className="w-full" onClick={() => openDetailsDialog(task)}>
                  Détails
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ménage</h1>
        <p className="text-muted-foreground mt-1">
          Planification et suivi des ménages
        </p>
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
            <Button size="sm" className="gap-1" onClick={handleSync}>
              <CalendarIcon className="h-4 w-4" />
              Synchroniser
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex items-center gap-2 max-w-sm flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher un logement..." className="h-9" />
            </div>
            
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    {format(selectedDate, 'dd MMM yyyy', { locale: fr })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateChange}
                    initialFocus
                    locale={fr}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              <Button variant="outline" size="sm" className="gap-1">
                <User className="h-4 w-4" />
                Agent
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                Statut
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full max-w-md grid grid-cols-3">
              <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
              <TabsTrigger value="tomorrow">Demain</TabsTrigger>
              <TabsTrigger value="completed">Terminés</TabsTrigger>
            </TabsList>
            
            <TabsContent value="today" className="animate-slide-up">
              <div className="space-y-4 mt-4">
                {todayCleaningTasks.map((task) => (
                  <CleaningTask key={task.id} task={task} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="tomorrow" className="animate-slide-up">
              <div className="space-y-4 mt-4">
                {tomorrowCleaningTasks.map((task) => (
                  <CleaningTask key={task.id} task={task} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="animate-slide-up">
              <div className="space-y-4 mt-4">
                {completedCleaningTasks.map((task) => (
                  <CleaningTask key={task.id} task={task} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardCard>

      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assigner un agent de ménage</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir un agent" />
              </SelectTrigger>
              <SelectContent>
                {cleaningAgents.map(agent => (
                  <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleAssignAgent} disabled={!selectedAgent}>Assigner</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Détails du ménage</DialogTitle>
          </DialogHeader>
          {currentTask && (
            <div className="py-4 space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{currentTask.property}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentTask.date ? (
                    <>Date: {currentTask.date}</>
                  ) : (
                    <>Check-out: {currentTask.checkoutTime} · Check-in: {currentTask.checkinTime}</>
                  )}
                </p>
              </div>
              
              <div>
                <p className="font-medium text-sm">Statut:</p>
                <div className="mt-1">{getStatusBadge(currentTask.status)}</div>
              </div>
              
              {currentTask.cleaningAgent && (
                <div>
                  <p className="font-medium text-sm">Agent assigné:</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{currentTask.cleaningAgent.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span>{currentTask.cleaningAgent}</span>
                  </div>
                </div>
              )}
              
              {currentTask.items?.length > 0 && (
                <div>
                  <p className="font-medium text-sm">Linge à prévoir:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {currentTask.items.map((item: string, i: number) => (
                      <Badge key={i} variant="outline" className="rounded-full">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {currentTask.status === 'completed' && (
                <div>
                  <p className="font-medium text-sm">Horaires:</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Début: {currentTask.startTime} · Fin: {currentTask.endTime}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDetailsDialogOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={problemDialogOpen} onOpenChange={setProblemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Signaler un problème</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <textarea 
              className="w-full min-h-[100px] p-2 border rounded-md"
              placeholder="Décrivez le problème rencontré..."
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProblemDialogOpen(false)}>Annuler</Button>
            <Button 
              variant="destructive" 
              onClick={handleReportProblem}
              disabled={problemDescription.trim().length === 0}
            >
              Signaler
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={calendarDialogOpen} onOpenChange={setCalendarDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Calendrier des ménages</DialogTitle>
          </DialogHeader>
          <div className="py-4 flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              className="rounded-md border pointer-events-auto"
              locale={fr}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCalendarDialogOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={labelsDialogOpen} onOpenChange={setLabelsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Générer des étiquettes</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <p className="text-sm mb-2">Type d'étiquette :</p>
              <div className="flex gap-2">
                <Button 
                  variant={labelType === "standard" ? "default" : "outline"} 
                  size="sm"
                  className="flex-1"
                  onClick={() => setLabelType("standard")}
                >
                  <Tag className="mr-2 h-4 w-4" />
                  Standard
                </Button>
                <Button 
                  variant={labelType === "detailed" ? "default" : "outline"} 
                  size="sm"
                  className="flex-1"
                  onClick={() => setLabelType("detailed")}
                >
                  <Tags className="mr-2 h-4 w-4" />
                  Détaillée
                </Button>
                <Button 
                  variant={labelType === "qrcode" ? "default" : "outline"} 
                  size="sm"
                  className="flex-1"
                  onClick={() => setLabelType("qrcode")}
                >
                  <QrCode className="mr-2 h-4 w-4" />
                  QR Code
                </Button>
              </div>
            </div>
            
            <div>
              <p className="text-sm mb-2">Sélectionnez les ménages :</p>
              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2">
                {[...todayCleaningTasks, ...tomorrowCleaningTasks].map((task) => (
                  <CleaningTask key={task.id} task={task} />
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedTasks([...todayCleaningTasks, ...tomorrowCleaningTasks])}
              >
                Tout sélectionner
              </Button>
              <span className="text-sm text-muted-foreground">
                {selectedTasks.length} ménage(s) sélectionné(s)
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLabelsDialogOpen(false)}>Annuler</Button>
            <Button 
              onClick={handlePrintLabels}
              className="gap-2"
              disabled={selectedTasks.length === 0}
            >
              <Printer className="h-4 w-4" />
              Imprimer ({selectedTasks.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cleaning;
