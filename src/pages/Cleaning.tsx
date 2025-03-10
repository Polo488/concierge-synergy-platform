
import { useEffect } from 'react';
import { 
  Sparkles, CheckCircle, Clock, Calendar, 
  Search, Download, Filter, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatCard } from '@/components/dashboard/StatCard';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const todayCleaning = [
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
];

const tomorrowCleaning = [
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
];

const completedCleaning = [
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
];

const Cleaning = () => {
  useEffect(() => {
    document.title = 'Ménage - Concierge Synergy Platform';
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

  const CleaningTask = ({ task }: { task: any }) => {
    return (
      <Card className="p-5 mb-4 animate-slide-up card-hover border border-border/40">
        <div className="flex justify-between items-start">
          <div>
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
          
          <div className="flex flex-col gap-2">
            {task.status === 'todo' && (
              <>
                <Button size="sm" className="w-full">Commencer</Button>
                {!task.cleaningAgent && (
                  <Button size="sm" variant="outline" className="w-full">Assigner</Button>
                )}
              </>
            )}
            {task.status === 'inProgress' && (
              <>
                <Button size="sm" className="w-full">Terminer</Button>
                <Button size="sm" variant="outline" className="w-full">Problème</Button>
              </>
            )}
            {(task.status === 'completed' || task.status === 'scheduled') && (
              <Button size="sm" variant="outline" className="w-full">Détails</Button>
            )}
          </div>
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
      
      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Aujourd'hui" 
          value="3" 
          icon={<Clock className="h-5 w-5" />}
          className="stagger-1"
        />
        <StatCard 
          title="En cours" 
          value="1" 
          icon={<Sparkles className="h-5 w-5" />}
          className="stagger-2"
        />
        <StatCard 
          title="Demain" 
          value="5" 
          icon={<Calendar className="h-5 w-5" />}
          className="stagger-3"
        />
        <StatCard 
          title="Terminés (semaine)" 
          value="12" 
          icon={<CheckCircle className="h-5 w-5" />}
          change={{ value: 2, type: 'increase' }}
          className="stagger-4"
        />
      </div>
      
      {/* Cleaning management */}
      <DashboardCard 
        title="Planification des ménages"
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-1">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
            <Button size="sm" className="gap-1">
              <Calendar className="h-4 w-4" />
              Synchroniser
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 max-w-sm flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher un logement..." className="h-9" />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Calendar className="h-4 w-4" />
                Date
              </Button>
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
          
          <Tabs defaultValue="today">
            <TabsList className="w-full max-w-md grid grid-cols-3">
              <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
              <TabsTrigger value="tomorrow">Demain</TabsTrigger>
              <TabsTrigger value="completed">Terminés</TabsTrigger>
            </TabsList>
            
            <TabsContent value="today" className="animate-slide-up">
              <div className="space-y-4 mt-4">
                {todayCleaning.map((task) => (
                  <CleaningTask key={task.id} task={task} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="tomorrow" className="animate-slide-up">
              <div className="space-y-4 mt-4">
                {tomorrowCleaning.map((task) => (
                  <CleaningTask key={task.id} task={task} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="animate-slide-up">
              <div className="space-y-4 mt-4">
                {completedCleaning.map((task) => (
                  <CleaningTask key={task.id} task={task} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardCard>
    </div>
  );
};

export default Cleaning;
