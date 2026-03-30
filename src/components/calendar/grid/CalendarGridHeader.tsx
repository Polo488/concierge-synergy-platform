
import React, { useMemo } from 'react';
import { format, isSameDay, getMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface CalendarGridHeaderProps {
  days: Date[];
  dailyPrices?: Map<string, number>;
  onDayClick?: (date: Date) => void;
  propColWidth?: number;
  dayCellWidth?: number;
}

export const CalendarGridHeader: React.FC<CalendarGridHeaderProps> = ({
  days,
  dailyPrices,
  onDayClick,
  propColWidth = 220,
  dayCellWidth = 40,
}) => {
  const today = new Date();

  const monthGroups = useMemo(() => {
    const groups: { month: string; year: number; count: number }[] = [];
    let currentMonth = -1;
    let currentYear = -1;

    days.forEach((day) => {
      const month = getMonth(day);
      const year = day.getFullYear();
      
      if (month !== currentMonth || year !== currentYear) {
        groups.push({
          month: format(day, 'MMM', { locale: fr }),
          year,
          count: 1,
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
    <div className="sticky top-0 z-20 bg-card/95 backdrop-blur-sm border-b border-border/30">
      {/* Month row */}
      <div className="flex" style={{ height: 28 }}>
        <div style={{ width: propColWidth, minWidth: propColWidth }} className="flex-shrink-0" />
        <div className="flex">
          {monthGroups.map((group, idx) => (
            <div
              key={`${group.month}-${group.year}-${idx}`}
              className="text-[11px] font-semibold text-muted-foreground uppercase px-2 flex items-center"
              style={{ width: group.count * dayCellWidth, minWidth: group.count * dayCellWidth }}
            >
              {group.month} {group.year}
            </div>
          ))}
        </div>
      </div>

      {/* Days row */}
      <div className="flex" style={{ height: 44 }}>
        <div 
          style={{ width: propColWidth, minWidth: propColWidth }}
          className="flex-shrink-0 flex items-center px-3"
        >
          <span className="text-xs font-medium text-muted-foreground truncate">Logements</span>
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
                  "flex flex-col items-center justify-center cursor-pointer transition-colors relative",
                  "border-r border-border/35",
                  isPast && "opacity-50",
                  isWeekend && !isToday && "bg-muted/[0.04]",
                  !isToday && "hover:bg-accent/10"
                )}
                style={{ width: dayCellWidth, minWidth: dayCellWidth }}
              >
                {isToday && (
                  <div className="absolute inset-0 bg-primary/[0.06] pointer-events-none" />
                )}
                <span className={cn(
                  "text-[10px] uppercase font-medium relative z-10",
                  isToday ? "text-primary font-semibold" : "text-muted-foreground"
                )}>
                  {format(day, 'EEE', { locale: fr })}
                </span>
                <span className={cn(
                  "text-sm font-semibold relative z-10",
                  isToday ? "text-primary" : "text-foreground"
                )}>
                  {format(day, 'd')}
                </span>
                {price && (
                  <span className="text-[9px] text-muted-foreground relative z-10">
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
