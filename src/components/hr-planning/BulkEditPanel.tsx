
import { useState, useMemo } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { CellSelection, PlanningStatusCode, PLANNING_STATUSES, BulkEditPayload } from '@/types/hrPlanning';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface BulkEditPanelProps {
  selectedCells: CellSelection[];
  onBulkUpdate: (payload: BulkEditPayload) => void;
  onClearSelection: () => void;
}

export function BulkEditPanel({
  selectedCells,
  onBulkUpdate,
  onClearSelection,
}: BulkEditPanelProps) {
  const [status, setStatus] = useState<PlanningStatusCode>('P');
  const [overtime, setOvertime] = useState<string>('');

  // Group cells by employee
  const selectionsByEmployee = useMemo(() => {
    const grouped: Record<string, string[]> = {};
    selectedCells.forEach(cell => {
      if (!grouped[cell.employeeId]) {
        grouped[cell.employeeId] = [];
      }
      grouped[cell.employeeId].push(cell.date);
    });
    return grouped;
  }, [selectedCells]);

  const employeeCount = Object.keys(selectionsByEmployee).length;
  const dateCount = selectedCells.length;

  const handleApply = () => {
    const overtimeMinutes = overtime ? Math.round(parseFloat(overtime) * 60) : undefined;
    
    Object.entries(selectionsByEmployee).forEach(([employeeId, dates]) => {
      onBulkUpdate({
        employeeId,
        dates,
        status,
        overtimeMinutes,
      });
    });
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-4 px-6 py-3 bg-card border rounded-2xl shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {dateCount} jour{dateCount > 1 ? 's' : ''} sélectionné{dateCount > 1 ? 's' : ''}
          </span>
          {employeeCount > 1 && (
            <span className="text-xs text-muted-foreground">
              ({employeeCount} employés)
            </span>
          )}
        </div>

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center gap-3">
          <Select value={status} onValueChange={(v) => setStatus(v as PlanningStatusCode)}>
            <SelectTrigger className="w-40 h-9 bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border shadow-lg z-[60]">
              {Object.values(PLANNING_STATUSES).map(s => (
                <SelectItem key={s.code} value={s.code}>
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: s.color }}
                    />
                    <span>{s.code} - {s.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Input
              type="number"
              step="0.5"
              min="0"
              value={overtime}
              onChange={(e) => setOvertime(e.target.value)}
              placeholder="H+"
              className="w-20 h-9"
            />
            <span className="text-xs text-muted-foreground">h</span>
          </div>
        </div>

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleApply}
            className="h-9"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Appliquer
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearSelection}
            className="h-9 w-9"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
