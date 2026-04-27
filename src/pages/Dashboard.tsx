import { useEffect } from 'react';

import { 
  Package, Wrench, Sparkles, Clock
} from 'lucide-react';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { DailyKPICards } from '@/components/dashboard/DailyKPICards';
import { DailyActivityTabs } from '@/components/dashboard/DailyActivityTabs';
import { AgendaPreviewWidget } from '@/components/dashboard/AgendaPreviewWidget';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAgenda } from '@/hooks/useAgenda';
import { TutorialTrigger } from '@/components/tutorial/TutorialTrigger';
import { TutorialButton } from '@/components/tutorial/TutorialButton';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { Button } from '@/components/ui/button';

const overviewData = [
  { name: 'Jan', value: 3500 },
  { name: 'Fév', value: 3000 },
  { name: 'Mar', value: 4500 },
  { name: 'Avr', value: 3800 },
  { name: 'Mai', value: 5000 },
  { name: 'Jun', value: 4800 },
  { name: 'Jul', value: 6000 },
];

const propertiesData = [
  { name: 'Lun', occupied: 12, vacant: 3 },
  { name: 'Mar', occupied: 13, vacant: 2 },
  { name: 'Mer', occupied: 15, vacant: 0 },
  { name: 'Jeu', occupied: 14, vacant: 1 },
  { name: 'Ven', occupied: 10, vacant: 5 },
  { name: 'Sam', occupied: 8, vacant: 7 },
  { name: 'Dim', occupied: 9, vacant: 6 },
];

const Dashboard = () => {
  const { checkIns, checkOuts, tasks, stats } = useDashboardData();
  const { todayEntries, tomorrowEntries, properties } = useAgenda();

  useEffect(() => {
    document.title = 'Tableau de bord - GESTION BNB LYON';
  }, []);

  return (
    <div className="space-y-8">
      
      <TutorialTrigger moduleId="dashboard" />
      <div data-tutorial="dashboard-header" className="flex items-center justify-between">
        <div>
          <h1
            className="text-[32px] font-bold tracking-[-0.02em] text-[hsl(var(--label-1))]"
            style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif" }}
          >
            Tableau de bord
          </h1>
          <p className="text-[15px] mt-1 text-[hsl(var(--label-2))]">
            Vue opérationnelle de votre activité du jour
          </p>
        </div>
        <TutorialButton moduleId="dashboard" />
      </div>
      
      <div data-tutorial="dashboard-kpi">
        <DailyKPICards stats={stats} />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-[1fr_380px]" data-tutorial="dashboard-activity">
        <DailyActivityTabs 
          checkIns={checkIns} 
          checkOuts={checkOuts} 
          tasks={tasks} 
        />
        <AgendaPreviewWidget 
          todayEntries={todayEntries}
          tomorrowEntries={tomorrowEntries}
          properties={properties}
        />
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <DashboardCard 
          title="Vue d'ensemble (revenus € )"
          actions={<Button variant="ghost" size="sm" className="text-[13px] font-medium text-primary">Voir tout</Button>}
          className="stagger-1"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overviewData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-muted-foreground" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis className="text-muted-foreground" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '10px', color: 'hsl(var(--foreground))' }}
                  labelStyle={{ fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#6B7AE8" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: 'hsl(var(--card))', stroke: '#6B7AE8' }}
                  activeDot={{ r: 7, strokeWidth: 0, fill: '#6B7AE8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Occupation des logements"
          actions={<Button variant="ghost" size="sm" className="text-[13px] font-medium text-primary">Détails</Button>}
          className="stagger-2"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={propertiesData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-muted-foreground" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis className="text-muted-foreground" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '10px', color: 'hsl(var(--foreground))' }}
                  labelStyle={{ fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                />
                <Bar dataKey="occupied" name="Occupés" fill="hsl(var(--foreground))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="vacant" name="Libres" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard 
          title="Maintenance" 
          actions={<Button variant="ghost" size="sm" className="text-[13px] font-medium text-primary">Voir tout</Button>}
          className="stagger-1"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold font-heading text-foreground">Interventions récentes</p>
                <p className="text-[13px] text-muted-foreground">7 interventions en cours</p>
              </div>
              <Wrench className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="space-y-2">
              {['Fuite robinet', 'Serrure bloquée', 'Ampoule à changer'].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-[10px] bg-muted/50 hover:bg-muted">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-status-warning-light text-status-warning">
                    En cours
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Entrepôt" 
          actions={<Button variant="ghost" size="sm" className="text-[13px] font-medium text-primary">Voir tout</Button>}
          className="stagger-2"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold font-heading text-foreground">État du stock</p>
                <p className="text-[13px] text-muted-foreground">4 articles en alerte</p>
              </div>
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="space-y-2">
              {[
                { name: 'Papier toilette', stock: '15%' },
                { name: 'Savon liquide', stock: '23%' },
                { name: 'Housses couette', stock: '18%' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-[10px] bg-muted/50">
                  <span className="text-sm text-foreground">{item.name}</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-status-error-light text-status-error">
                    {item.stock}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Ménage" 
          actions={<Button variant="ghost" size="sm" className="text-[13px] font-medium text-primary">Voir tout</Button>}
          className="stagger-3"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold font-heading text-foreground">Planification aujourd'hui</p>
                <p className="text-[13px] text-muted-foreground">12 ménages planifiés</p>
              </div>
              <Sparkles className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="space-y-2">
              {[
                { address: '12 Rue du Port', time: '11:00' },
                { address: '8 Avenue des Fleurs', time: '14:30' },
                { address: '23 Rue de la Paix', time: '16:00' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-[10px] bg-muted/50">
                  <span className="text-sm text-foreground">{item.address}</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-status-info-light text-status-info">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default Dashboard;
