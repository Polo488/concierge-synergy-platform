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

// Mock data
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
          <h1 className="text-[28px] font-extrabold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1A1A2E' }}>Tableau de bord</h1>
          <p className="text-[14px] mt-1" style={{ color: 'rgba(26,26,46,0.5)', fontFamily: 'Inter' }}>
            Vue opérationnelle de votre activité du jour
          </p>
        </div>
        <TutorialButton moduleId="dashboard" />
      </div>
      
      {/* Daily KPI Cards */}
      <div data-tutorial="dashboard-kpi">
        <DailyKPICards stats={stats} />
      </div>

      {/* Daily Activity: Tabs and Agenda preview side by side */}
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
      
      {/* Charts */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <DashboardCard 
          title="Vue d'ensemble (revenus € )"
          actions={<Button variant="ghost" size="sm" className="text-[13px] font-medium" style={{ color: '#6B7AE8' }}>Voir tout</Button>}
          className="stagger-1"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overviewData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" stroke="rgba(26,26,46,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(26,26,46,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px' }}
                  labelStyle={{ fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#6B7AE8" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#6B7AE8' }}
                  activeDot={{ r: 7, strokeWidth: 0, fill: '#6B7AE8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Occupation des logements"
          actions={<Button variant="ghost" size="sm" className="text-[13px] font-medium" style={{ color: '#6B7AE8' }}>Détails</Button>}
          className="stagger-2"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={propertiesData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" stroke="rgba(26,26,46,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(26,26,46,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px' }}
                  labelStyle={{ fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                />
                <Bar dataKey="occupied" name="Occupés" fill="#1A1A2E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="vacant" name="Libres" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>
      
      {/* Module previews */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard 
          title="Maintenance" 
          actions={<Button variant="ghost" size="sm" className="text-noe-orange hover:text-noe-orange text-[13px] font-medium">Voir tout</Button>}
          className="stagger-1"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1A1A2E' }}>Interventions récentes</p>
                <p className="text-[13px]" style={{ color: 'rgba(26,26,46,0.5)' }}>7 interventions en cours</p>
              </div>
              <Wrench className="h-5 w-5" style={{ color: 'rgba(26,26,46,0.4)' }} />
            </div>
            
            <div className="space-y-2">
              {['Fuite robinet', 'Serrure bloquée', 'Ampoule à changer'].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-[10px] hover:bg-[#F8F8F8]" style={{ background: '#F8F8F8' }}>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" style={{ color: 'rgba(26,26,46,0.4)' }} />
                    <span className="text-sm" style={{ color: '#1A1A2E' }}>{item}</span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(245,200,66,0.15)', color: '#B45309' }}>
                    En cours
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Entrepôt" 
          actions={<Button variant="ghost" size="sm" className="text-noe-orange hover:text-noe-orange text-[13px] font-medium">Voir tout</Button>}
          className="stagger-2"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1A1A2E' }}>État du stock</p>
                <p className="text-[13px]" style={{ color: 'rgba(26,26,46,0.5)' }}>4 articles en alerte</p>
              </div>
              <Package className="h-5 w-5" style={{ color: 'rgba(26,26,46,0.4)' }} />
            </div>
            
            <div className="space-y-2">
              {[
                { name: 'Papier toilette', stock: '15%' },
                { name: 'Savon liquide', stock: '23%' },
                { name: 'Housses couette', stock: '18%' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-[10px]" style={{ background: '#F8F8F8' }}>
                  <span className="text-sm" style={{ color: '#1A1A2E' }}>{item.name}</span>
                  <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(239,68,68,0.1)', color: '#DC2626' }}>
                    {item.stock}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Ménage" 
          actions={<Button variant="ghost" size="sm" className="text-noe-orange hover:text-noe-orange text-[13px] font-medium">Voir tout</Button>}
          className="stagger-3"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1A1A2E' }}>Planification aujourd'hui</p>
                <p className="text-[13px]" style={{ color: 'rgba(26,26,46,0.5)' }}>12 ménages planifiés</p>
              </div>
              <Sparkles className="h-5 w-5" style={{ color: 'rgba(26,26,46,0.4)' }} />
            </div>
            
            <div className="space-y-2">
              {[
                { address: '12 Rue du Port', time: '11:00' },
                { address: '8 Avenue des Fleurs', time: '14:30' },
                { address: '23 Rue de la Paix', time: '16:00' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-[10px]" style={{ background: '#F8F8F8' }}>
                  <span className="text-sm" style={{ color: '#1A1A2E' }}>{item.address}</span>
                  <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(75,107,255,0.1)', color: '#4B6BFF' }}>
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
