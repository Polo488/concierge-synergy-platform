
import React from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { ClipboardList, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface MaintenanceStatsProps {
  pendingCount: number;
  inProgressCount: number;
  criticalCount: number;
  completedCount: number;
}

export const MaintenanceStats = ({
  pendingCount,
  inProgressCount,
  criticalCount,
  completedCount
}: MaintenanceStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="En attente" 
        value={pendingCount.toString()} 
        icon={<ClipboardList className="h-5 w-5" />}
        className="stagger-1"
      />
      <StatCard 
        title="En cours" 
        value={inProgressCount.toString()} 
        icon={<Clock className="h-5 w-5" />}
        className="stagger-2"
      />
      <StatCard 
        title="Critiques" 
        value={criticalCount.toString()} 
        icon={<AlertTriangle className="h-5 w-5" />}
        change={{ value: 1, type: 'increase' }}
        className="stagger-3"
      />
      <StatCard 
        title="Terminées (mois)" 
        value={completedCount.toString()} 
        icon={<CheckCircle className="h-5 w-5" />}
        change={{ value: 5, type: 'increase' }}
        className="stagger-4"
      />
    </div>
  );
};
