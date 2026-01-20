import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isToday,
  isSameDay 
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AgendaEntry } from '@/types/agenda';

interface Property {
  id: string;
  name: string;
}

interface AgendaMonthViewProps {
  date: Date;
  entries: AgendaEntry[];
  properties: Property[];
  onEntryClick: (entry: AgendaEntry) => void;
  onAddClick: (date: Date) => void;
  onDayClick: (date: Date) => void;
}

export const AgendaMonthView = ({
  date,
  entries,
  properties,
  onEntryClick,
  onAddClick,
  onDayClick,
}: AgendaMonthViewProps) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let currentDay = calendarStart;
  while (currentDay <= calendarEnd) {
    days.push(currentDay);
    currentDay = addDays(currentDay, 1);
  }

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const getEntriesForDay = (day: Date) => {
    return entries.filter(entry => {
      const start = new Date(entry.startDate);
      const end = new Date(entry.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      const targetDay = new Date(day);
      targetDay.setHours(12, 0, 0, 0);
      return targetDay >= start && targetDay <= end;
    });
  };

  const weekDayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        {format(date, "MMMM yyyy", { locale: fr })}
      </h2>

      <div className="border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-7 bg-muted">
          {weekDayNames.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 border-t">
            {week.map((day) => {
              const dayEntries = getEntriesForDay(day);
              const isCurrentMonth = isSameMonth(day, date);
              const isCurrentDay = isToday(day);

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "min-h-[100px] p-1 border-r last:border-r-0",
                    !isCurrentMonth && "bg-muted/30",
                    isCurrentDay && "bg-primary/5"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <button
                      onClick={() => onDayClick(day)}
                      className={cn(
                        "w-7 h-7 rounded-full text-sm font-medium flex items-center justify-center",
                        "hover:bg-accent transition-colors",
                        isCurrentDay && "bg-primary text-primary-foreground hover:bg-primary/90",
                        !isCurrentMonth && "text-muted-foreground"
                      )}
                    >
                      {format(day, "d")}
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 opacity-0 hover:opacity-100 transition-opacity"
                      onClick={() => onAddClick(day)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="space-y-0.5">
                    {dayEntries.slice(0, 2).map(entry => (
                      <button
                        key={entry.id}
                        onClick={() => onEntryClick(entry)}
                        className={cn(
                          "w-full text-left text-xs p-1 rounded truncate",
                          "bg-primary/10 hover:bg-primary/20 transition-colors"
                        )}
                      >
                        {entry.startTime && (
                          <span className="text-muted-foreground mr-1">
                            {entry.startTime}
                          </span>
                        )}
                        {entry.title}
                      </button>
                    ))}
                    {dayEntries.length > 2 && (
                      <button
                        onClick={() => onDayClick(day)}
                        className="text-xs text-primary hover:underline"
                      >
                        +{dayEntries.length - 2} autres
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
