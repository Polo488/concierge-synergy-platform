import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, MessageSquare, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { DashboardStats } from '@/hooks/useDashboardData';
import { cn } from '@/lib/utils';

interface DailyKPICardsProps {
  stats: DashboardStats;
}

interface KPICardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  onClick: () => void;
  colorClass: string;
  bgClass: string;
}

const KPICard = ({ title, value, icon, onClick, colorClass, bgClass }: KPICardProps) => (
  <Card 
    className={cn(
      "p-4 cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]",
      "border-l-4",
      colorClass
    )}
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
      <div className={cn("p-3 rounded-full", bgClass)}>
        {icon}
      </div>
    </div>
  </Card>
);

export const DailyKPICards = ({ stats }: DailyKPICardsProps) => {
  const navigate = useNavigate();

  const kpiCards = [
    {
      title: "Check-ins aujourd'hui",
      value: stats.checkInsToday,
      icon: <LogIn className="h-5 w-5 text-emerald-600" />,
      onClick: () => navigate('/calendar'),
      colorClass: 'border-l-emerald-500',
      bgClass: 'bg-emerald-100'
    },
    {
      title: "Check-outs aujourd'hui",
      value: stats.checkOutsToday,
      icon: <LogOut className="h-5 w-5 text-blue-600" />,
      onClick: () => navigate('/calendar'),
      colorClass: 'border-l-blue-500',
      bgClass: 'bg-blue-100'
    },
    {
      title: "Messages programmés",
      value: stats.scheduledMessages,
      icon: <MessageSquare className="h-5 w-5 text-purple-600" />,
      onClick: () => navigate('/guest-experience'),
      colorClass: 'border-l-purple-500',
      bgClass: 'bg-purple-100'
    },
    {
      title: "Tâches non assignées",
      value: stats.unassignedTasks,
      icon: <AlertCircle className="h-5 w-5 text-amber-600" />,
      onClick: () => navigate('/cleaning'),
      colorClass: 'border-l-amber-500',
      bgClass: 'bg-amber-100'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpiCards.map((kpi, index) => (
        <KPICard
          key={kpi.title}
          {...kpi}
        />
      ))}
    </div>
  );
};
