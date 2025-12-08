
import React, { useMemo } from 'react';
import { format, isSameDay, isSameMonth, getMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface CalendarGridHeaderProps {
  days: Date[];
  dailyPrices?: Map<string, number>;
  onDayClick?: (date: Date) => void;
}

export const CalendarGridHeader: React.FC<CalendarGridHeaderProps> = ({
  days,
  dailyPrices,
  onDayClick,
}) => {
  const today = new Date();

  // Group days by month for the month header row
  const monthGroups = useMemo(() => {
    const groups: { month: string; year: number; count: number; startIndex: number }[] = [];
    let currentMonth = -1;
    let currentYear = -1;

    days.forEach((day, index) => {
      const month = getMonth(day);
      const year = day.getFullYear();
      
      if (month !== currentMonth || year !== currentYear) {
        groups.push({
          month: format(day, 'MMMM', { locale: fr }),
          year,
          count: 1,
          startIndex: index,
        });
        currentMonth = month;
        currentYear = year;
      } else {
        groups[groups.length - 1].count++;
      }
    });

    return groups;
  }, [days]);

  return (
    <div className="sticky top-0 z-20 bg-background border-b border-border">
      {/* Month row */}
      <div className="flex border-b border-border">
        <div className="w-[220px] min-w-[220px] bg-muted/50 border-r border-border" />
        <div className="flex">
          {monthGroups.map((group, idx) => (
            <div
              key={`${group.month}-${group.year}-${idx}`}
              className="text-sm font-semibold text-foreground capitalize bg-muted/30 border-r border-border px-2 py-1.5 flex items-center"
              style={{ width: `${group.count * 40}px`, minWidth: `${group.count * 40}px` }}
            >
              {group.month} {group.year}
            </div>
          ))}
        </div>
      </div>

      {/* Days row */}
      <div className="flex">
        <div className="w-[220px] min-w-[220px] bg-muted/50 border-r border-border flex items-center px-4 py-2">
          <span className="text-sm font-medium text-muted-foreground">Logements</span>
        </div>
        <div className="flex">
          {days.map((day, idx) => {
            const isToday = isSameDay(day, today);
            const isPast = day < today && !isToday;
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;
            const priceKey = format(day, 'yyyy-MM-dd');
            const price = dailyPrices?.get(priceKey);

            return (
              <div
                key={idx}
                onClick={() => onDayClick?.(day)}
                className={cn(
                  "w-10 min-w-[40px] flex flex-col items-center justify-center py-1.5 border-r border-border cursor-pointer transition-colors",
                  isToday && "bg-primary/10 border-primary",
                  isPast && "opacity-60",
                  isWeekend && !isToday && "bg-muted/30",
                  !isToday && "hover:bg-accent/50"
                )}
              >
                <span className={cn(
                  "text-[10px] uppercase font-medium",
                  isToday ? "text-primary" : "text-muted-foreground"
                )}>
                  {format(day, 'EEE', { locale: fr })}
                </span>
                <span className={cn(
                  "text-sm font-semibold",
                  isToday ? "text-primary" : "text-foreground"
                )}>
                  {format(day, 'd')}
                </span>
                {price && (
                  <span className="text-[9px] text-muted-foreground">
                    {price}€
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
