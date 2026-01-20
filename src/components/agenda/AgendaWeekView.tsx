import { format, startOfWeek, addDays, isSameDay, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AgendaEntry } from '@/types/agenda';
import { AgendaEntryCard } from './AgendaEntryCard';

interface Property {
  id: string;
  name: string;
}

interface AgendaWeekViewProps {
  date: Date;
  entries: AgendaEntry[];
  properties: Property[];
  onEntryClick: (entry: AgendaEntry) => void;
  onAddClick: (date: Date) => void;
  onDayClick: (date: Date) => void;
}

export const AgendaWeekView = ({
  date,
  entries,
  properties,
  onEntryClick,
  onAddClick,
  onDayClick,
}: AgendaWeekViewProps) => {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getEntriesForDay = (day: Date) => {
    return entries.filter(entry => {
      const start = new Date(entry.startDate);
      const end = new Date(entry.endDate);
      return day >= start && day <= end;
    }).sort((a, b) => {
      if (!a.startTime && !b.startTime) return 0;
      if (!a.startTime) return 1;
      if (!b.startTime) return -1;
      return a.startTime.localeCompare(b.startTime);
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Semaine du {format(weekStart, "d MMMM yyyy", { locale: fr })}
      </h2>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const dayEntries = getEntriesForDay(day);
          const isCurrentDay = isToday(day);

          return (
            <Card
              key={day.toISOString()}
              className={cn(
                "min-h-[200px] p-2 flex flex-col",
                isCurrentDay && "ring-2 ring-primary"
              )}
            >
              <div 
                className="flex items-center justify-between mb-2 cursor-pointer hover:opacity-70"
                onClick={() => onDayClick(day)}
              >
                <div className="text-center">
                  <p className="text-xs text-muted-foreground uppercase">
                    {format(day, "EEE", { locale: fr })}
                  </p>
                  <p className={cn(
                    "text-lg font-semibold",
                    isCurrentDay && "text-primary"
                  )}>
                    {format(day, "d")}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddClick(day);
                  }}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex-1 space-y-1 overflow-y-auto">
                {dayEntries.slice(0, 3).map(entry => (
                  <AgendaEntryCard
                    key={entry.id}
                    entry={entry}
                    properties={properties}
                    onClick={() => onEntryClick(entry)}
                    compact
                  />
                ))}
                {dayEntries.length > 3 && (
                  <button
                    onClick={() => onDayClick(day)}
                    className="text-xs text-primary hover:underline w-full text-center"
                  >
                    +{dayEntries.length - 3} autres
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
