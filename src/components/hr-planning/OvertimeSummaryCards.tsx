
import { Users, Clock, TrendingUp } from 'lucide-react';
import { HRTeam, TeamMonthlySummary } from '@/types/hrPlanning';
import { cn } from '@/lib/utils';

interface OvertimeSummaryCardsProps {
  globalSummary: {
    totalEmployees: number;
    totalOvertimeMinutes: number;
    totalOvertimeHours: number;
    remainingMinutes: number;
  };
  teams: HRTeam[];
  getTeamSummary: (teamId: string) => TeamMonthlySummary;
}

export function OvertimeSummaryCards({
  globalSummary,
  teams,
  getTeamSummary,
}: OvertimeSummaryCardsProps) {
  const formatOvertime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h${mins}`;
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b bg-muted/20 overflow-x-auto">
      {/* Global summary */}
      <div className="flex items-center gap-3 px-4 py-2 bg-card rounded-xl border shadow-sm min-w-fit">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Users className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Total employés</p>
          <p className="text-lg font-semibold">{globalSummary.totalEmployees}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-2 bg-card rounded-xl border shadow-sm min-w-fit">
        <div className="p-2 bg-amber-500/10 rounded-lg">
          <Clock className="h-4 w-4 text-amber-600" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Heures supp. totales</p>
          <p className="text-lg font-semibold">
            {formatOvertime(globalSummary.totalOvertimeMinutes)}
          </p>
        </div>
      </div>

      <div className="h-8 w-px bg-border mx-2" />

      {/* Team summaries */}
      {teams.map(team => {
        const summary = getTeamSummary(team.id);
        return (
          <div 
            key={team.id}
            className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border shadow-sm min-w-fit"
          >
            <span 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: team.color }}
            />
            <div>
              <p className="text-xs text-muted-foreground">{team.name}</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{summary.employeeCount}</span>
                {summary.totalOvertimeMinutes > 0 && (
                  <span className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded">
                    +{formatOvertime(summary.totalOvertimeMinutes)}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
