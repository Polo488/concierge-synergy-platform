import { useNavigate } from 'react-router-dom';
import { DashboardStats } from '@/hooks/useDashboardData';
import { cn } from '@/lib/utils';

interface DailyKPICardsProps {
  stats: DashboardStats;
}

interface KPICardProps {
  title: string;
  value: number;
  onClick: () => void;
  borderColor: string;
  labelColor: string;
}

const KPICard = ({ title, value, onClick, borderColor, labelColor }: KPICardProps) => (
  <div 
    className={cn(
      "bg-card rounded-2xl cursor-pointer transition-all duration-200",
      "hover:shadow-md shadow-card",
      "p-6 max-md:p-4",
    )}
    style={{ 
      borderLeft: `4px solid ${borderColor}`,
    }}
    onClick={onClick}
  >
    <div className="space-y-1.5">
      <p 
        className="text-[11px] uppercase font-semibold tracking-[0.08em]" 
        style={{ color: labelColor }}
      >
        {title}
      </p>
      <p className="text-[36px] max-md:text-2xl font-extrabold text-foreground font-heading">{value}</p>
    </div>
  </div>
);

export const DailyKPICards = ({ stats }: DailyKPICardsProps) => {
  const navigate = useNavigate();

  const kpiCards = [
    {
      title: "Check-ins",
      value: stats.checkInsToday,
      onClick: () => navigate('/app/calendar'),
      borderColor: '#FF5C1A',
      labelColor: 'rgba(255,92,26,0.7)',
    },
    {
      title: "Check-outs",
      value: stats.checkOutsToday,
      onClick: () => navigate('/app/calendar'),
      borderColor: '#F5C842',
      labelColor: 'rgba(180,145,0,0.7)',
    },
    {
      title: "Messages",
      value: stats.scheduledMessages,
      onClick: () => navigate('/app/guest-experience'),
      borderColor: '#6B7AE8',
      labelColor: 'rgba(107,122,232,0.7)',
    },
    {
      title: "Tâches",
      value: stats.unassignedTasks,
      onClick: () => navigate('/app/cleaning'),
      borderColor: 'hsl(var(--foreground))',
      labelColor: 'hsl(var(--muted-foreground))',
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
