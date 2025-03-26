
import { useEffect } from 'react';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { 
  Badge, ShoppingCart, TrendingUp, ArrowUpRight, 
  Package, EuroIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/dashboard/StatCard';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

// Mock data for upsell products
const upsellProducts = [
  { name: 'Petit-déjeuner', value: 4200, percentage: 35 },
  { name: 'Transport aéroport', value: 3100, percentage: 26 },
  { name: 'Soins et massages', value: 2400, percentage: 20 },
  { name: 'Late check-out', value: 1500, percentage: 12 },
  { name: 'Autres', value: 800, percentage: 7 }
];

// Monthly revenue data
const monthlyData = [
  { name: 'Jan', value: 800 },
  { name: 'Fév', value: 1200 },
  { name: 'Mar', value: 900 },
  { name: 'Avr', value: 1500 },
  { name: 'Mai', value: 1800 },
  { name: 'Jun', value: 2200 },
  { name: 'Jul', value: 2500 },
];

// Properties with most upsell revenue
const topProperties = [
  { name: 'Appartement Bellecour', value: 1850, growth: 12 },
  { name: 'Loft Croix-Rousse', value: 1420, growth: 8 },
  { name: 'Villa Confluence', value: 1350, growth: -3 },
  { name: 'Studio Part-Dieu', value: 1150, growth: 15 },
  { name: 'Maison Vieux Lyon', value: 950, growth: 5 },
];

// Colors for the pie chart
const COLORS = ['#8B5CF6', '#EC4899', '#F97316', '#10B981', '#6B7280'];

const Upsell = () => {
  useEffect(() => {
    document.title = 'Upsell - GESTION BNB LYON';
  }, []);

  // Calculate total revenue
  const totalRevenue = upsellProducts.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upsell et Services</h1>
        <p className="text-muted-foreground mt-1">
          Suivi des ventes additionnelles et services proposés aux clients
        </p>
      </div>
      
      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Revenus totaux" 
          value={`${(totalRevenue / 100).toLocaleString('fr-FR')} €`}
          icon={<EuroIcon className="h-5 w-5" />}
          change={{ value: 18, type: 'increase' }}
          helpText="Depuis le début de l'année"
        />
        <StatCard 
          title="Service le plus vendu" 
          value="Petit-déjeuner"
          icon={<Package className="h-5 w-5" />}
          change={{ value: 35, type: 'increase', label: "des ventes" }}
        />
        <StatCard 
          title="Taux de conversion" 
          value="28%"
          icon={<ArrowUpRight className="h-5 w-5" />}
          change={{ value: 5, type: 'increase' }}
          helpText="Clients qui achètent au moins un service"
        />
        <StatCard 
          title="Panier moyen" 
          value="42 €"
          icon={<ShoppingCart className="h-5 w-5" />}
          change={{ value: 8, type: 'increase' }}
        />
      </div>
      
      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard 
          title="Évolution des revenus"
          actions={<Button variant="ghost" size="sm">Cette année</Button>}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value} €`} />
                <Tooltip 
                  formatter={(value) => [`${value} €`, 'Revenus']}
                  contentStyle={{ background: 'white', border: '1px solid #f0f0f0', borderRadius: '8px' }}
                  labelStyle={{ fontWeight: 500 }}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
        
        <DashboardCard 
          title="Répartition des ventes"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={upsellProducts}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {upsellProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${(value / 100).toLocaleString('fr-FR')} €`, 'Revenus']}
                  contentStyle={{ background: 'white', border: '1px solid #f0f0f0', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>
      
      {/* Top Properties */}
      <DashboardCard 
        title="Top 5 logements"
        icon={<TrendingUp className="h-5 w-5" />}
        actions={<Button variant="ghost" size="sm">Voir tous</Button>}
      >
        <div className="space-y-4">
          {topProperties.map((property, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg hover:bg-background/80 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary font-medium h-8 w-8 rounded-full flex items-center justify-center">
                  {index + 1}
                </div>
                <span>{property.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium">{(property.value / 100).toLocaleString('fr-FR')} €</span>
                <div className={`flex items-center text-xs px-2 py-1 rounded-full ${
                  property.growth > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {property.growth > 0 ? '+' : ''}{property.growth}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
};

export default Upsell;
