
import { StatCard } from '@/components/dashboard/StatCard';
import { Clock, Sparkles, Calendar as CalendarIcon, CheckCircle } from 'lucide-react';
import { useCleaning } from '@/contexts/CleaningContext';

export const CleaningStats = () => {
  const { 
    todayCleaningTasks, 
    tomorrowCleaningTasks, 
    completedCleaningTasks 
  } = useCleaning();

  return (
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
  );
};
