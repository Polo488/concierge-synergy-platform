
import { useState } from 'react';
import { isToday, isWeekend } from 'date-fns';
import { PlanningDay, PlanningStatusCode, PLANNING_STATUSES } from '@/types/hrPlanning';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface PlanningCellProps {
  date: Date;
  planning: PlanningDay | undefined;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onUpdate: (updates: Partial<PlanningDay>) => void;
}

export function PlanningCell({
  date,
  planning,
  isSelected,
  onMouseDown,
  onMouseEnter,
  onUpdate,
}: PlanningCellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editStatus, setEditStatus] = useState<PlanningStatusCode>(planning?.status || 'UNK');
  const [editOvertime, setEditOvertime] = useState<string>(
    planning?.overtimeMinutes ? (planning.overtimeMinutes / 60).toString() : ''
  );
  const [editNote, setEditNote] = useState(planning?.note || '');
  const [editStartTime, setEditStartTime] = useState(planning?.startTime || '');
  const [editEndTime, setEditEndTime] = useState(planning?.endTime || '');

  const status = planning?.status || 'UNK';
  const statusConfig = PLANNING_STATUSES[status];
  const isWeekendDay = isWeekend(date);
  const isTodayDay = isToday(date);

  const formatOvertime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `+${mins}m`;
    return `+${hours}h`;
  };

  const handleSave = () => {
    const overtimeMinutes = editOvertime ? Math.round(parseFloat(editOvertime) * 60) : undefined;
    onUpdate({
      status: editStatus,
      overtimeMinutes,
      note: editNote || undefined,
      startTime: editStartTime || undefined,
      endTime: editEndTime || undefined,
    });
    setIsOpen(false);
  };

  const handleStatusChange = (newStatus: PlanningStatusCode) => {
    setEditStatus(newStatus);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "w-10 min-w-10 h-10 border-r flex flex-col items-center justify-center cursor-pointer transition-all relative",
            statusConfig.bgColor,
            isWeekendDay && "opacity-80",
            isTodayDay && "ring-1 ring-primary/30 ring-inset",
            isSelected && "ring-2 ring-primary ring-inset",
            "hover:brightness-95"
          )}
          onMouseDown={onMouseDown}
          onMouseEnter={onMouseEnter}
        >
          <span 
            className="text-xs font-medium"
            style={{ color: statusConfig.color }}
          >
            {status !== 'UNK' ? status : ''}
          </span>
          {planning?.overtimeMinutes && planning.overtimeMinutes > 0 && (
            <span className="absolute bottom-0.5 right-0.5 text-[8px] text-amber-600 font-medium">
              {formatOvertime(planning.overtimeMinutes)}
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-72 p-4 bg-popover border shadow-lg z-50" 
        align="start"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Statut</Label>
            <Select value={editStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="h-9 bg-background">
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
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs">Heure début</Label>
              <Input
                type="time"
                value={editStartTime}
                onChange={(e) => setEditStartTime(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Heure fin</Label>
              <Input
                type="time"
                value={editEndTime}
                onChange={(e) => setEditEndTime(e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Heures supplémentaires</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="0.5"
                min="0"
                value={editOvertime}
                onChange={(e) => setEditOvertime(e.target.value)}
                placeholder="0"
                className="h-9"
              />
              <span className="text-sm text-muted-foreground">heures</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Note</Label>
            <Textarea
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
              placeholder="Ajouter une note..."
              className="h-20 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Annuler
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
            >
              Enregistrer
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
