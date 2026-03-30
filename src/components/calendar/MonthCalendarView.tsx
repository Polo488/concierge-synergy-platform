
import React from 'react';
import { cn } from '@/lib/utils';
import { format, isSameDay, isWithinInterval, addDays } from 'date-fns';

interface MonthCalendarViewProps {
  days: Date[];
  filteredBookings: any[];
  showBookingDetails: (booking: any) => void;
  properties: any[];
  onDateClick?: (date: Date) => void;
}

export const MonthCalendarView = ({
  days,
  filteredBookings,
  showBookingDetails,
  properties,
  onDateClick
}: MonthCalendarViewProps) => {
  return (
    <div className="mt-6">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, idx) => (
          <div key={idx} className="text-center font-medium text-sm py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: new Date(days[0]).getDay() === 0 ? 6 : new Date(days[0]).getDay() - 1 }).map((_, idx) => (
          <div key={`empty-${idx}`} className="h-24 bg-gray-50 rounded-md"></div>
        ))}
        
        {days.map((day, idx) => {
          // Trouver les réservations pour ce jour
          const dayBookings = filteredBookings.filter(booking => 
            isWithinInterval(day, { start: booking.checkIn, end: addDays(booking.checkOut, -1) })
          );
          
          const hasBookings = dayBookings.length > 0;
          
          return (
            <div 
              key={idx}
              className={cn(
                "h-24 border border-border/40 rounded-md p-1 overflow-hidden transition-colors",
                isSameDay(day, new Date()) ? "bg-blue-50" : "bg-card",
                !hasBookings && onDateClick ? "cursor-pointer hover:bg-blue-50/50" : ""
              )}
              onClick={() => {
                if (!hasBookings && onDateClick) {
                  onDateClick(day);
                }
              }}
            >
              <div className="text-right text-xs font-medium mb-1">
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayBookings.map((booking) => {
                  const property = properties.find(p => p.id === booking.propertyId);
                  const isCheckIn = isSameDay(day, booking.checkIn);
                  const isCheckOut = isSameDay(day, booking.checkOut);
                  const channelColors: Record<string, string> = {
                    airbnb: '#FF385C', booking: '#003580', vrbo: '#3D67B1',
                    direct: '#16A34A', other: '#6366F1',
                  };
                  const bgColor = channelColors[booking.channel] || booking.color || '#6366F1';
                  
                  return (
                    <div 
                      key={booking.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        showBookingDetails(booking);
                      }}
                      className="text-xs p-1 rounded-md cursor-pointer truncate overflow-hidden"
                      style={{ 
                        backgroundColor: bgColor,
                        color: '#FFFFFF',
                        fontWeight: 600,
                        fontSize: 11,
                        borderLeft: isCheckIn ? '3px solid rgba(0,0,0,0.3)' : undefined,
                        borderRight: isCheckOut ? '3px solid rgba(0,0,0,0.3)' : undefined
                      }}
                    >
                      {property?.name} - {booking.guestName}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
