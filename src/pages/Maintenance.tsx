
import { useEffect, useState } from 'react';
import { 
  Wrench, PlusCircle, AlertTriangle, Clock, CheckCircle,
  ClipboardList, BadgeAlert, Calendar, Search, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatCard } from '@/components/dashboard/StatCard';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { MaintenanceTask, NewMaintenanceFormData, UrgencyLevel } from '@/types/maintenance';
import NewMaintenanceDialog from '@/components/maintenance/NewMaintenanceDialog';
import TechnicianAssignDialog from '@/components/maintenance/TechnicianAssignDialog';

// Mock data
const initialPendingMaintenance = [
  { 
    id: 1, 
    title: 'Fuite robinet salle de bain', 
    property: 'Appartement 12 Rue du Port',
    urgency: 'high' as UrgencyLevel,
    createdAt: '2023-11-20',
    description: 'Fuite importante sous le lavabo de la salle de bain principale',
    materials: ['Joint silicone', 'Clé à molette']
  },
  { 
    id: 2, 
    title: 'Serrure porte d\'entrée bloquée', 
    property: 'Studio 8 Avenue des Fleurs',
    urgency: 'critical' as UrgencyLevel,
    createdAt: '2023-11-21',
    description: 'Client ne peut pas entrer dans le logement, serrure bloquée',
    materials: ['Lubrifiant', 'Tournevis']
  },
  { 
    id: 3, 
    title: 'Ampoule salon grillée', 
    property: 'Maison 23 Rue de la Paix',
    urgency: 'low' as UrgencyLevel,
    createdAt: '2023-11-22',
    description: 'Remplacer l\'ampoule du plafonnier dans le salon',
    materials: ['Ampoule LED E27']
  },
];

const initialInProgressMaintenance = [
  { 
    id: 4, 
    title: 'Problème chauffage', 
    property: 'Appartement 45 Boulevard Central',
    urgency: 'medium' as UrgencyLevel,
    createdAt: '2023-11-19',
    technician: 'Martin Dupont',
    startedAt: '2023-11-20',
    description: 'Radiateur de la chambre ne chauffe pas correctement',
    materials: ['Clé de purge', 'Joint']
  },
  { 
    id: 5, 
    title: 'Volet roulant bloqué', 
    property: 'Loft 72 Rue des Arts',
    urgency: 'medium' as UrgencyLevel,
    createdAt: '2023-11-18',
    technician: 'Sophie Moreau',
    startedAt: '2023-11-20',
    description: 'Volet roulant de la chambre principale ne descend plus',
    materials: ['Lubrifiant', 'Tournevis']
  },
];

const initialCompletedMaintenance = [
  { 
    id: 6, 
    title: 'Remplacement chasse d\'eau', 
    property: 'Appartement 12 Rue du Port',
    urgency: 'high' as UrgencyLevel,
    createdAt: '2023-11-15',
    completedAt: '2023-11-16',
    technician: 'Martin Dupont',
    description: 'Remplacement complet du mécanisme de chasse d\'eau',
    materials: ['Mécanisme chasse d\'eau', 'Joint']
  },
  { 
    id: 7, 
    title: 'Installation étagère', 
    property: 'Studio 8 Avenue des Fleurs',
    urgency: 'low' as UrgencyLevel,
    createdAt: '2023-11-16',
    completedAt: '2023-11-17',
    technician: 'Sophie Moreau',
    description: 'Installation d\'une étagère dans la cuisine selon demande du propriétaire',
    materials: ['Étagère', 'Chevilles', 'Vis']
  },
];

const Maintenance = () => {
  useEffect(() => {
    document.title = 'Maintenance - Concierge Synergy Platform';
  }, []);

  // State for tasks
  const [pendingTasks, setPendingTasks] = useState<MaintenanceTask[]>(initialPendingMaintenance);
  const [inProgressTasks, setInProgressTasks] = useState<MaintenanceTask[]>(initialInProgressMaintenance);
  const [completedTasks, setCompletedTasks] = useState<MaintenanceTask[]>(initialCompletedMaintenance);
  
  // State for dialogs
  const [newMaintenanceOpen, setNewMaintenanceOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | number | null>(null);
  
  // Calculate statistics
  const stats = {
    pending: pendingTasks.length,
    inProgress: inProgressTasks.length,
    critical: pendingTasks.filter(task => task.urgency === 'critical').length,
    completedThisMonth: completedTasks.length
  };

  const getUrgencyBadge = (urgency: string) => {
    switch(urgency) {
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-full">Faible</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 rounded-full">Moyenne</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 rounded-full">Élevée</Badge>;
      case 'critical':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 rounded-full">Critique</Badge>;
      default:
        return null;
    }
  };

  // Handle task operations
  const handleNewMaintenance = (data: NewMaintenanceFormData) => {
    const newTask: MaintenanceTask = {
      id: Date.now(), // Generate a unique ID
      title: data.title,
      property: data.property,
      urgency: data.urgency,
      createdAt: new Date().toISOString().split('T')[0],
      description: data.description,
      materials: data.materials ? data.materials.split(',').map(item => item.trim()) : []
    };
    
    setPendingTasks(prev => [newTask, ...prev]);
    setNewMaintenanceOpen(false);
    toast.success("Nouvelle intervention créée avec succès");
  };

  const handleAssignTechnician = (taskId: string | number, technicianName: string) => {
    const task = pendingTasks.find(task => task.id === taskId);
    
    if (task) {
      // Remove from pending
      setPendingTasks(prev => prev.filter(task => task.id !== taskId));
      
      // Add to in-progress with technician and startedAt
      const updatedTask: MaintenanceTask = {
        ...task,
        technician: technicianName,
        startedAt: new Date().toISOString().split('T')[0]
      };
      
      setInProgressTasks(prev => [updatedTask, ...prev]);
      toast.success(`Intervention assignée à ${technicianName}`);
    }
    
    setAssignDialogOpen(false);
    setSelectedTaskId(null);
  };

  const handleCompleteTask = (taskId: string | number) => {
    const task = inProgressTasks.find(task => task.id === taskId);
    
    if (task) {
      // Remove from in-progress
      setInProgressTasks(prev => prev.filter(task => task.id !== taskId));
      
      // Add to completed with completedAt
      const updatedTask: MaintenanceTask = {
        ...task,
        completedAt: new Date().toISOString().split('T')[0]
      };
      
      setCompletedTasks(prev => [updatedTask, ...prev]);
      toast.success("Intervention marquée comme terminée");
    }
  };

  const MaintenanceTask = ({ 
    task, 
    type 
  }: { 
    task: MaintenanceTask, 
    type: 'pending' | 'inProgress' | 'completed' 
  }) => {
    return (
      <Card className="p-5 mb-4 animate-slide-up card-hover border border-border/40">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {getUrgencyBadge(task.urgency)}
              <span className="text-sm text-muted-foreground">
                {type === 'completed' 
                  ? `Terminé le ${task.completedAt}` 
                  : type === 'inProgress'
                    ? `Commencé le ${task.startedAt}`
                    : `Créé le ${task.createdAt}`
                }
              </span>
            </div>
            <h3 className="font-semibold text-lg">{task.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{task.property}</p>
            <p className="text-sm mb-3">{task.description}</p>
            
            {task.materials?.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-medium mb-1">Matériel nécessaire:</p>
                <div className="flex flex-wrap gap-2">
                  {task.materials.map((material, i) => (
                    <Badge key={i} variant="outline" className="rounded-full">
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {task.technician && (
              <div className="flex items-center gap-2 mt-3">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>{task.technician.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <span className="text-sm">Assigné à: {task.technician}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            {type === 'pending' && (
              <>
                <Dialog open={assignDialogOpen && selectedTaskId === task.id} onOpenChange={(open) => {
                  if (!open) setSelectedTaskId(null);
                  setAssignDialogOpen(open);
                }}>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        setSelectedTaskId(task.id);
                        setAssignDialogOpen(true);
                      }}
                    >
                      Assigner
                    </Button>
                  </DialogTrigger>
                  
                  {selectedTaskId === task.id && (
                    <TechnicianAssignDialog 
                      taskId={task.id}
                      onSubmit={handleAssignTechnician}
                      onCancel={() => {
                        setAssignDialogOpen(false);
                        setSelectedTaskId(null);
                      }}
                    />
                  )}
                </Dialog>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => toast.info("Fonctionnalité de modification à venir")}
                >
                  Modifier
                </Button>
              </>
            )}
            {type === 'inProgress' && (
              <>
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleCompleteTask(task.id)}
                >
                  Terminer
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => toast.info("Détails de l'intervention à venir")}
                >
                  Détails
                </Button>
              </>
            )}
            {type === 'completed' && (
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => toast.info("Détails de l'intervention à venir")}
              >
                Détails
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Maintenance</h1>
        <p className="text-muted-foreground mt-1">
          Gestion des interventions techniques dans les logements
        </p>
      </div>
      
      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="En attente" 
          value={stats.pending.toString()} 
          icon={<ClipboardList className="h-5 w-5" />}
          className="stagger-1"
        />
        <StatCard 
          title="En cours" 
          value={stats.inProgress.toString()} 
          icon={<Clock className="h-5 w-5" />}
          className="stagger-2"
        />
        <StatCard 
          title="Critiques" 
          value={stats.critical.toString()} 
          icon={<AlertTriangle className="h-5 w-5" />}
          change={{ value: 1, type: 'increase' }}
          className="stagger-3"
        />
        <StatCard 
          title="Terminées (mois)" 
          value={stats.completedThisMonth.toString()} 
          icon={<CheckCircle className="h-5 w-5" />}
          change={{ value: 5, type: 'increase' }}
          className="stagger-4"
        />
      </div>
      
      {/* Maintenance management */}
      <DashboardCard 
        title="Interventions"
        actions={
          <Dialog open={newMaintenanceOpen} onOpenChange={setNewMaintenanceOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Nouvelle intervention
              </Button>
            </DialogTrigger>
            <NewMaintenanceDialog 
              onSubmit={handleNewMaintenance} 
              onCancel={() => setNewMaintenanceOpen(false)} 
            />
          </Dialog>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 max-w-sm flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher une intervention..." className="h-9" />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Calendar className="h-4 w-4" />
                Date
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <User className="h-4 w-4" />
                Technicien
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <BadgeAlert className="h-4 w-4" />
                Urgence
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="pending">
            <TabsList className="w-full max-w-md grid grid-cols-3">
              <TabsTrigger value="pending">En attente ({stats.pending})</TabsTrigger>
              <TabsTrigger value="inProgress">En cours ({stats.inProgress})</TabsTrigger>
              <TabsTrigger value="completed">Terminées</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending" className="animate-slide-up">
              <div className="space-y-4 mt-4">
                {pendingTasks.map((task) => (
                  <MaintenanceTask key={task.id} task={task} type="pending" />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="inProgress" className="animate-slide-up">
              <div className="space-y-4 mt-4">
                {inProgressTasks.map((task) => (
                  <MaintenanceTask key={task.id} task={task} type="inProgress" />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="animate-slide-up">
              <div className="space-y-4 mt-4">
                {completedTasks.map((task) => (
                  <MaintenanceTask key={task.id} task={task} type="completed" />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardCard>
    </div>
  );
};

export default Maintenance;
