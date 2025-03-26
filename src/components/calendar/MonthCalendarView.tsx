
import React from 'react';
import { cn } from '@/lib/utils';
import { format, isSameDay, isWithinInterval, addDays } from 'date-fns';

interface MonthCalendarViewProps {
  days: Date[];
  filteredBookings: any[];
  showBookingDetails: (booking: any) => void;
  properties: any[];
}

export const MonthCalendarView = ({
  days,
  filteredBookings,
  showBookingDetails,
  properties
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
          
          return (
            <div 
              key={idx}
              className={cn(
                "h-24 border border-border/40 rounded-md p-1 overflow-hidden transition-colors",
                isSameDay(day, new Date()) ? "bg-blue-50" : "bg-card"
              )}
            >
              <div className="text-right text-xs font-medium mb-1">
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayBookings.map((booking) => {
                  const property = properties.find(p => p.id === booking.propertyId);
                  const isCheckIn = isSameDay(day, booking.checkIn);
                  const isCheckOut = isSameDay(day, booking.checkOut);
                  
                  return (
                    <div 
                      key={booking.id}
                      onClick={() => showBookingDetails(booking)}
                      className="text-xs p-1 rounded cursor-pointer truncate text-white"
                      style={{ 
                        backgroundColor: booking.color,
                        borderLeft: isCheckIn ? '3px solid black' : undefined,
                        borderRight: isCheckOut ? '3px solid black' : undefined
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
