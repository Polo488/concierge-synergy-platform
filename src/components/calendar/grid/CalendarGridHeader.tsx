
import React, { useMemo } from 'react';
import { format, isSameDay, getMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarGridHeaderProps {
  days: Date[];
  dailyPrices?: Map<string, number>;
  onDayClick?: (date: Date) => void;
  propColWidth?: number;
  dayCellWidth?: number;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const CalendarGridHeader: React.FC<CalendarGridHeaderProps> = ({
  days,
  dailyPrices,
  onDayClick,
  propColWidth = 130,
  dayCellWidth = 48,
  collapsed = false,
  onToggleCollapse,
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
        groups.push({ month: format(day, 'MMM', { locale: fr }), year, count: 1 });
        currentMonth = month;
        currentYear = year;
      } else {
        groups[groups.length - 1].count++;
      }
    });
    return groups;
  }, [days]);

  return (
    <div style={{ minWidth: propColWidth + days.length * dayCellWidth }}>
      {/* Month row — 18px */}
      <div className="flex" style={{ height: 18 }}>
        <div style={{ width: propColWidth, minWidth: propColWidth }} className="flex-shrink-0" />
        <div className="flex">
          {monthGroups.map((group, idx) => (
            <div
              key={`${group.month}-${group.year}-${idx}`}
              style={{
                width: group.count * dayCellWidth,
                minWidth: group.count * dayCellWidth,
                fontSize: 10,
                fontWeight: 600,
                color: '#9A9AAF',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 8,
              }}
            >
              {group.month} {group.year}
            </div>
          ))}
        </div>
      </div>

      {/* Days row — 36px */}
      <div className="flex" style={{ height: 36 }}>
        {/* Property col header with collapse toggle */}
        <div
          style={{ width: propColWidth, minWidth: propColWidth, cursor: 'pointer' }}
          className="flex-shrink-0 flex items-center justify-end pr-2"
          onClick={onToggleCollapse}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" style={{ color: '#9A9AAF' }} />
          ) : (
            <ChevronLeft className="w-4 h-4" style={{ color: '#9A9AAF' }} />
          )}
        </div>
        <div className="flex">
          {days.map((day, idx) => {
            const isToday = isSameDay(day, today);

            return (
              <div
                key={idx}
                onClick={() => onDayClick?.(day)}
                style={{
                  width: dayCellWidth,
                  minWidth: dayCellWidth,
                  maxWidth: dayCellWidth,
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  background: isToday ? 'rgba(255,92,26,0.08)' : undefined,
                }}
              >
                <span style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: isToday ? '#FF5C1A' : '#1A1A2E',
                  lineHeight: 1,
                }}>
                  {format(day, 'd')}
                </span>
                <span style={{
                  fontSize: 10,
                  color: isToday ? '#FF5C1A' : '#9A9AAF',
                  lineHeight: 1,
                  marginTop: 2,
                  textTransform: 'uppercase',
                }}>
                  {format(day, 'EEE', { locale: fr })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
