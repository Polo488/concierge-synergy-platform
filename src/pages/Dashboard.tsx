import { useEffect } from 'react';
import { 
  LayoutDashboard, Package, Wrench, Sparkles, 
  Home, Receipt, BarChart3, Clock
} from 'lucide-react';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { StatCard } from '@/components/dashboard/StatCard';
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
  useEffect(() => {
    document.title = 'Tableau de bord - Concierge Synergy Platform';
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground mt-1">
          Bienvenue sur votre plateforme de gestion de conciergerie
        </p>
      </div>
      
      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Logements" 
          value="15" 
          icon={<Home className="h-5 w-5" />}
          change={{ value: 12, type: 'increase' }}
          className="stagger-1"
        />
        <StatCard 
          title="Interventions en cours" 
          value="7" 
          icon={<Wrench className="h-5 w-5" />}
          change={{ value: 3, type: 'decrease' }}
          className="stagger-2"
        />
        <StatCard 
          title="Ménages planifiés" 
          value="12" 
          icon={<Sparkles className="h-5 w-5" />}
          className="stagger-3"
        />
        <StatCard 
          title="Alertes stock" 
          value="4" 
          icon={<Package className="h-5 w-5" />}
          change={{ value: 2, type: 'increase' }}
          className="stagger-4"
        />
      </div>
      
      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard 
          title="Vue d'ensemble (revenus € )"
          actions={<Button variant="ghost" size="sm">Voir tout</Button>}
          className="stagger-1"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overviewData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'white', border: '1px solid #f0f0f0', borderRadius: '8px' }}
                  labelStyle={{ fontWeight: 500 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 7, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Occupation des logements"
          actions={<Button variant="ghost" size="sm">Détails</Button>}
          className="stagger-2"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={propertiesData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'white', border: '1px solid #f0f0f0', borderRadius: '8px' }}
                  labelStyle={{ fontWeight: 500 }}
                />
                <Bar dataKey="occupied" name="Occupés" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="vacant" name="Libres" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>
      
      {/* Module previews */}
      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard 
          title="Maintenance" 
          actions={<Button variant="ghost" size="sm">Voir tout</Button>}
          className="stagger-1"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">Interventions récentes</p>
                <p className="text-sm text-muted-foreground">7 interventions en cours</p>
              </div>
              <Wrench className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="space-y-2">
              {['Fuite robinet', 'Serrure bloquée', 'Ampoule à changer'].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{item}</span>
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                    En cours
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Entrepôt" 
          actions={<Button variant="ghost" size="sm">Voir tout</Button>}
          className="stagger-2"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">État du stock</p>
                <p className="text-sm text-muted-foreground">4 articles en alerte</p>
              </div>
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="space-y-2">
              {[
                { name: 'Papier toilette', stock: '15%' },
                { name: 'Savon liquide', stock: '23%' },
                { name: 'Housses couette', stock: '18%' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <span className="text-sm">{item.name}</span>
                  <div className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                    {item.stock}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Ménage" 
          actions={<Button variant="ghost" size="sm">Voir tout</Button>}
          className="stagger-3"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">Planification aujourd'hui</p>
                <p className="text-sm text-muted-foreground">12 ménages planifiés</p>
              </div>
              <Spray className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="space-y-2">
              {[
                { address: '12 Rue du Port', time: '11:00' },
                { address: '8 Avenue des Fleurs', time: '14:30' },
                { address: '23 Rue de la Paix', time: '16:00' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <span className="text-sm">{item.address}</span>
                  <div className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                    {item.time}
                  </div>
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
