
import React from 'react';
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
  const stats = [
    { label: "En attente", value: pendingCount, icon: ClipboardList, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "En cours", value: inProgressCount, icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Critiques", value: criticalCount, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
    { label: "Terminées", value: completedCount, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-card rounded-xl border border-border p-3 md:p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className={`p-1.5 rounded-lg ${stat.bg}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
          <p className="text-[12px] md:text-[13px] text-muted-foreground mt-0.5">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};
