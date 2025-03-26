
import React from 'react';
import { cn } from '@/lib/utils';
import { format, isSameDay, isWithinInterval, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PropertyCalendarViewProps {
  days: Date[];
  properties: any[];
  filteredBookings: any[];
  selectedProperty: string;
  showBookingDetails: (booking: any) => void;
  onCellClick?: (date: Date, propertyId: number) => void;
}

export const PropertyCalendarView = ({
  days,
  properties,
  filteredBookings,
  selectedProperty,
  showBookingDetails,
  onCellClick
}: PropertyCalendarViewProps) => {
  const filteredProperties = selectedProperty === "all" 
    ? properties 
    : properties.filter(p => p.id === parseInt(selectedProperty));
  
  return (
    <div className="mt-6 overflow-x-auto">
      <div className="min-w-max">
        <div className="grid" style={{ gridTemplateColumns: `200px repeat(${days.length}, minmax(30px, 1fr))` }}>
          {/* En-têtes des jours */}
          <div className="bg-muted font-medium py-2 px-4 border-b">Logement</div>
          {days.map((day, idx) => (
            <div key={idx} className={cn(
              "text-center text-xs font-medium py-2 border-b",
              isSameDay(day, new Date()) ? "bg-blue-50" : "bg-muted"
            )}>
              {format(day, 'E dd', { locale: fr })}
            </div>
          ))}
          
          {/* Lignes par propriété */}
          {filteredProperties.map(property => {
            return (
              <React.Fragment key={property.id}>
                <div className="py-2 px-4 border-b font-medium truncate">
                  {property.name}
                </div>
                
                {days.map((day, idx) => {
                  const dayBookings = filteredBookings.filter(booking => 
                    booking.propertyId === property.id && 
                    isWithinInterval(day, { start: booking.checkIn, end: addDays(booking.checkOut, -1) })
                  );
                  
                  const isCheckIn = dayBookings.some(b => isSameDay(day, b.checkIn));
                  const isCheckOut = dayBookings.some(b => isSameDay(day, b.checkOut));
                  const hasBooking = dayBookings.length > 0;
                  
                  return (
                    <div 
                      key={idx}
                      className={cn(
                        "border-b min-h-[40px] relative",
                        isSameDay(day, new Date()) ? "bg-blue-50" : "",
                        hasBooking ? "cursor-pointer" : "",
                        !hasBooking && onCellClick ? "cursor-pointer hover:bg-blue-50/50" : ""
                      )}
                      onClick={(e) => {
                        if (hasBooking) {
                          showBookingDetails(dayBookings[0]);
                        } else if (onCellClick) {
                          onCellClick(day, property.id);
                        }
                      }}
                    >
                      {hasBooking && (
                        <div 
                          className="absolute inset-0 flex items-center justify-center text-white text-xs"
                          style={{ 
                            backgroundColor: dayBookings[0].color,
                            borderLeft: isCheckIn ? '3px solid black' : undefined,
                            borderRight: isCheckOut ? '3px solid black' : undefined
                          }}
                        >
                          {dayBookings[0].guestName}
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
