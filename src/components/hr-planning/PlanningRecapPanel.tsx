
import { X, Download } from 'lucide-react';
import { HREmployee, EmployeeMonthlySummary, PLANNING_STATUSES } from '@/types/hrPlanning';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface PlanningRecapPanelProps {
  employees: HREmployee[];
  getEmployeeSummary: (employeeId: string) => EmployeeMonthlySummary;
  onClose: () => void;
}

export function PlanningRecapPanel({
  employees,
  getEmployeeSummary,
  onClose,
}: PlanningRecapPanelProps) {
  const formatOvertime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h${mins}`;
  };

  const handleExportCSV = () => {
    const headers = ['Employé', 'P', 'R', 'C', 'S', 'TR', 'TT', 'Heures supp.'];
    const rows = employees.map(emp => {
      const summary = getEmployeeSummary(emp.id);
      return [
        emp.displayName,
        summary.presentDays,
        summary.restDays,
        summary.paidLeaveDays,
        summary.sickDays,
        summary.trainingDays,
        summary.remoteDays,
        formatOvertime(summary.totalOvertimeMinutes),
      ].join(',');
    });
    
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'recap-planning.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-80 border-l bg-card flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-sm">Récapitulatif mensuel</h3>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleExportCSV}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="p-3 border-b">
        <div className="flex flex-wrap gap-2">
          {Object.values(PLANNING_STATUSES).filter(s => s.code !== 'UNK').map(status => (
            <div 
              key={status.code}
              className="flex items-center gap-1 text-[10px]"
            >
              <span 
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: status.color }}
              />
              <span className="text-muted-foreground">{status.code}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2 font-medium text-muted-foreground">Employé</th>
                <th className="text-center py-2 px-1 font-medium" style={{ color: PLANNING_STATUSES.P.color }}>P</th>
                <th className="text-center py-2 px-1 font-medium" style={{ color: PLANNING_STATUSES.R.color }}>R</th>
                <th className="text-center py-2 px-1 font-medium" style={{ color: PLANNING_STATUSES.C.color }}>C</th>
                <th className="text-center py-2 px-1 font-medium" style={{ color: PLANNING_STATUSES.S.color }}>S</th>
                <th className="text-center py-2 px-1 font-medium text-amber-600">H+</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => {
                const summary = getEmployeeSummary(emp.id);
                return (
                  <tr key={emp.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-2 px-2 truncate max-w-24">{emp.displayName}</td>
                    <td className="text-center py-2 px-1">{summary.presentDays}</td>
                    <td className="text-center py-2 px-1">{summary.restDays}</td>
                    <td className="text-center py-2 px-1">{summary.paidLeaveDays}</td>
                    <td className="text-center py-2 px-1">{summary.sickDays}</td>
                    <td className="text-center py-2 px-1 text-amber-600">
                      {summary.totalOvertimeMinutes > 0 ? formatOvertime(summary.totalOvertimeMinutes) : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ScrollArea>
    </div>
  );
}
