import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, MessageSquare, AlertCircle } from 'lucide-react';
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
  borderColor: string;
}

const KPICard = ({ title, value, onClick, borderColor }: KPICardProps) => (
  <div 
    className={cn(
      "bg-white rounded-[14px] cursor-pointer transition-all duration-200",
      "hover:shadow-md",
      "p-5 max-md:p-3",
      "border-l-4"
    )}
    style={{ 
      border: '1px solid rgba(0,0,0,0.06)',
      borderLeft: `4px solid ${borderColor}`,
    }}
    onClick={onClick}
  >
    <div className="space-y-1">
      <p className="text-[13px] uppercase font-medium tracking-wide" style={{ color: 'rgba(26,26,46,0.5)', fontFamily: 'Inter' }}>{title}</p>
      <p className="text-[32px] max-md:text-xl font-extrabold" style={{ color: '#1A1A2E', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{value}</p>
    </div>
  </div>
);

export const DailyKPICards = ({ stats }: DailyKPICardsProps) => {
  const navigate = useNavigate();

  const kpiCards = [
    {
      title: "Check-ins",
      value: stats.checkInsToday,
      icon: <LogIn className="h-5 w-5" />,
      onClick: () => navigate('/app/calendar'),
      borderColor: '#FF5C1A',
    },
    {
      title: "Check-outs",
      value: stats.checkOutsToday,
      icon: <LogOut className="h-5 w-5" />,
      onClick: () => navigate('/app/calendar'),
      borderColor: '#F5C842',
    },
    {
      title: "Messages",
      value: stats.scheduledMessages,
      icon: <MessageSquare className="h-5 w-5" />,
      onClick: () => navigate('/app/guest-experience'),
      borderColor: '#4B6BFF',
    },
    {
      title: "Tâches",
      value: stats.unassignedTasks,
      icon: <AlertCircle className="h-5 w-5" />,
      onClick: () => navigate('/app/cleaning'),
      borderColor: '#1A1A2E',
    }
  ];

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {kpiCards.map((kpi) => (
        <KPICard
          key={kpi.title}
          {...kpi}
        />
      ))}
    </div>
  );
};
