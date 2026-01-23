
import { useMemo, useState, useRef, useCallback } from 'react';
import { format, getDay, isToday, isWeekend } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { HRTeam, HREmployee, PlanningDay, PlanningStatusCode, PLANNING_STATUSES, CellSelection, EmployeeMonthlySummary } from '@/types/hrPlanning';
import { PlanningCell } from './PlanningCell';
import { cn } from '@/lib/utils';

interface PlanningGridProps {
  teams: HRTeam[];
  employeesByTeam: Record<string, HREmployee[]>;
  monthDays: Date[];
  getPlanningDay: (employeeId: string, date: string) => PlanningDay | undefined;
  updatePlanningDay: (employeeId: string, date: string, updates: Partial<PlanningDay>) => void;
  selectedCells: CellSelection[];
  toggleCellSelection: (employeeId: string, date: string) => void;
  selectRange: (employeeId: string, startDate: string, endDate: string) => void;
  collapsedTeams: string[];
  toggleTeamCollapse: (teamId: string) => void;
  getEmployeeSummary: (employeeId: string) => EmployeeMonthlySummary;
}

export function PlanningGrid({
  teams,
  employeesByTeam,
  monthDays,
  getPlanningDay,
  updatePlanningDay,
  selectedCells,
  toggleCellSelection,
  selectRange,
  collapsedTeams,
  toggleTeamCollapse,
  getEmployeeSummary,
}: PlanningGridProps) {
  const [dragStart, setDragStart] = useState<{ employeeId: string; date: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((employeeId: string, date: string, e: React.MouseEvent) => {
    if (e.shiftKey && dragStart) {
      selectRange(employeeId, dragStart.date, date);
    } else {
      setDragStart({ employeeId, date });
      setIsDragging(true);
      toggleCellSelection(employeeId, date);
    }
  }, [dragStart, selectRange, toggleCellSelection]);

  const handleMouseEnter = useCallback((employeeId: string, date: string) => {
    if (isDragging && dragStart && dragStart.employeeId === employeeId) {
      selectRange(employeeId, dragStart.date, date);
    }
  }, [isDragging, dragStart, selectRange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const isCellSelected = useCallback((employeeId: string, date: string) => {
    return selectedCells.some(c => c.employeeId === employeeId && c.date === date);
  }, [selectedCells]);

  const formatOvertime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `+${mins}m`;
    if (mins === 0) return `+${hours}h`;
    return `+${hours}h${mins}`;
  };

  return (
    <div 
      ref={gridRef}
      className="h-full overflow-auto"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="inline-block min-w-full">
        {/* Header */}
        <div className="flex sticky top-0 z-20 bg-card border-b">
          {/* Left sticky column header */}
          <div className="sticky left-0 z-30 w-56 min-w-56 bg-card border-r flex flex-col">
            <div className="h-8 border-b flex items-center px-3">
              <span className="text-xs font-medium text-muted-foreground">Employé</span>
            </div>
            <div className="h-8 flex items-center px-3">
              <span className="text-xs text-muted-foreground">Récap.</span>
            </div>
          </div>
          
          {/* Day headers */}
          <div className="flex">
            {monthDays.map((day, index) => {
              const dayOfWeek = format(day, 'EEE', { locale: fr });
              const dayNumber = format(day, 'd');
              const isWeekendDay = isWeekend(day);
              const isTodayDay = isToday(day);

              return (
                <div 
                  key={index}
                  className={cn(
                    "w-10 min-w-10 flex flex-col items-center border-r",
                    isWeekendDay && "bg-muted/30",
                    isTodayDay && "bg-primary/5"
                  )}
                >
                  <div className={cn(
                    "h-8 flex items-center justify-center w-full border-b",
                    isTodayDay && "text-primary font-medium"
                  )}>
                    <span className="text-[10px] uppercase text-muted-foreground">
                      {dayOfWeek.charAt(0)}
                    </span>
                  </div>
                  <div className={cn(
                    "h-8 flex items-center justify-center w-full",
                    isTodayDay && "text-primary font-semibold"
                  )}>
                    <span className="text-xs">{dayNumber}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div>
          {teams.map(team => {
            const teamEmployees = employeesByTeam[team.id] || [];
            if (teamEmployees.length === 0) return null;
            
            const isCollapsed = collapsedTeams.includes(team.id);

            return (
              <div key={team.id}>
                {/* Team header */}
                <div 
                  className="flex sticky top-16 z-10 bg-muted/50 border-y cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => toggleTeamCollapse(team.id)}
                >
                  <div 
                    className="sticky left-0 z-20 w-56 min-w-56 bg-muted/50 border-r flex items-center px-3 py-2 gap-2"
                    style={{ borderLeftColor: team.color, borderLeftWidth: 3 }}
                  >
                    {isCollapsed ? (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium">{team.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {teamEmployees.length} employé{teamEmployees.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex flex-1">
                    {monthDays.map((day, index) => (
                      <div 
                        key={index}
                        className={cn(
                          "w-10 min-w-10 h-8 border-r",
                          isWeekend(day) && "bg-muted/30",
                          isToday(day) && "bg-primary/5"
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Employee rows */}
                {!isCollapsed && teamEmployees.map(employee => {
                  const summary = getEmployeeSummary(employee.id);
                  
                  return (
                    <div key={employee.id} className="flex border-b hover:bg-muted/20 transition-colors">
                      {/* Employee info */}
                      <div className="sticky left-0 z-10 w-56 min-w-56 bg-card border-r flex items-center px-3 py-1.5 gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{employee.displayName}</p>
                          <div className="flex items-center gap-1.5">
                            {employee.role && (
                              <span className="text-[10px] text-muted-foreground truncate">
                                {employee.role}
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Mini summary badges */}
                        <div className="flex items-center gap-0.5 text-[9px]">
                          <span className="px-1 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
                            {summary.presentDays}P
                          </span>
                          {summary.paidLeaveDays > 0 && (
                            <span className="px-1 py-0.5 rounded bg-sky-100 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400">
                              {summary.paidLeaveDays}C
                            </span>
                          )}
                          {summary.totalOvertimeMinutes > 0 && (
                            <span className="px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400">
                              {formatOvertime(summary.totalOvertimeMinutes)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Day cells */}
                      <div className="flex">
                        {monthDays.map((day, index) => {
                          const dateStr = format(day, 'yyyy-MM-dd');
                          const planning = getPlanningDay(employee.id, dateStr);
                          const isSelected = isCellSelected(employee.id, dateStr);

                          return (
                            <PlanningCell
                              key={index}
                              date={day}
                              planning={planning}
                              isSelected={isSelected}
                              onMouseDown={(e) => handleMouseDown(employee.id, dateStr, e)}
                              onMouseEnter={() => handleMouseEnter(employee.id, dateStr)}
                              onUpdate={(updates) => updatePlanningDay(employee.id, dateStr, updates)}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
