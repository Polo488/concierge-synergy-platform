
import React from 'react';
import { format, isToday, isSameDay, isWithinInterval, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { Booking, Property } from '@/hooks/calendar/types';

interface DailyCalendarProps {
  days: Date[];
  bookings: Booking[];
  properties?: Property[];
  onBookingClick: (booking: Booking) => void;
}

export const DailyCalendar: React.FC<DailyCalendarProps> = ({
  days,
  bookings,
  onBookingClick,
  properties = []
}) => {
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
          // Find bookings for this day
          const dayBookings = bookings.filter(booking => 
            isWithinInterval(day, { start: booking.checkIn, end: addDays(booking.checkOut, -1) })
          );
          
          return (
            <div 
              key={idx}
              className={cn(
                "h-24 border border-border/40 rounded-md p-1 overflow-hidden transition-colors",
                isToday(day) ? "bg-blue-50" : "bg-card"
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
                      onClick={() => onBookingClick(booking)}
                      className="text-xs p-1 rounded cursor-pointer truncate text-white"
                      style={{ 
                        backgroundColor: booking.color,
                        borderLeft: isCheckIn ? '3px solid black' : undefined,
                        borderRight: isCheckOut ? '3px solid black' : undefined
                      }}
                    >
                      {property?.name || 'Property'} - {booking.guestName}
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
