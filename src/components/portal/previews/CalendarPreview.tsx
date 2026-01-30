import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Plus, RefreshCw, Filter, LayoutGrid } from 'lucide-react';

interface PropertyRow {
  name: string;
  bookings: { start: number; end: number; channel: 'airbnb' | 'booking' | 'direct'; guest: string }[];
}

const mockProperties: PropertyRow[] = [
  {
    name: 'Appartement Bellecour',
    bookings: [
      { start: 0, end: 4, channel: 'airbnb', guest: 'Martin D.' },
      { start: 7, end: 11, channel: 'booking', guest: 'Sophie L.' },
    ],
  },
  {
    name: 'Studio Confluence',
    bookings: [
      { start: 2, end: 6, channel: 'direct', guest: 'Pierre M.' },
      { start: 10, end: 14, channel: 'airbnb', guest: 'Emma R.' },
    ],
  },
  {
    name: 'Villa Presqu\'île',
    bookings: [
      { start: 0, end: 3, channel: 'booking', guest: 'Lucas B.' },
      { start: 5, end: 9, channel: 'airbnb', guest: 'Marie K.' },
    ],
  },
  {
    name: 'Loft Part-Dieu',
    bookings: [
      { start: 3, end: 8, channel: 'airbnb', guest: 'Julie T.' },
      { start: 12, end: 14, channel: 'direct', guest: 'Antoine V.' },
    ],
  },
  {
    name: 'Appart Croix-Rousse',
    bookings: [
      { start: 1, end: 5, channel: 'booking', guest: 'Claire F.' },
      { start: 8, end: 12, channel: 'airbnb', guest: 'Thomas G.' },
    ],
  },
];

const days = ['Lun 15', 'Mar 16', 'Mer 17', 'Jeu 18', 'Ven 19', 'Sam 20', 'Dim 21', 'Lun 22', 'Mar 23', 'Mer 24', 'Jeu 25', 'Ven 26', 'Sam 27', 'Dim 28'];

export function CalendarPreview({ className }: { className?: string }) {
  return (
    <div className={cn("bg-card rounded-2xl border border-border/50 shadow-elevated overflow-hidden", className)}>
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-status-error/60" />
          <div className="w-3 h-3 rounded-full bg-status-warning/60" />
          <div className="w-3 h-3 rounded-full bg-status-success/60" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-xs text-muted-foreground">app.noe-conciergerie.com/calendar</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-background">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded hover:bg-muted transition-colors">
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg">
              Aujourd'hui
            </button>
            <button className="p-1.5 rounded hover:bg-muted transition-colors">
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <span className="text-sm font-semibold text-foreground">Janvier 2026</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted rounded-lg transition-colors">
            <Filter className="w-3.5 h-3.5" />
            Filtres
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted rounded-lg transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
            Sync
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg">
            <Plus className="w-3.5 h-3.5" />
            Réservation
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-3">
        {/* Day headers */}
        <div className="flex">
          <div className="w-36 flex-shrink-0" />
          <div className="flex-1 grid grid-cols-14 gap-0.5">
            {days.map((day, i) => (
              <div
                key={day}
                className={cn(
                  "text-2xs text-center py-1 font-medium",
                  i === 5 || i === 6 || i === 12 || i === 13 ? "text-muted-foreground" : "text-foreground"
                )}
              >
                {day.split(' ')[0]}
                <br />
                <span className="text-muted-foreground">{day.split(' ')[1]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Property rows */}
        <div className="space-y-1 mt-2">
          {mockProperties.map((property, rowIndex) => (
            <div key={property.name} className="flex items-center">
              <div className="w-36 flex-shrink-0 pr-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <LayoutGrid className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-xs font-medium text-foreground truncate">
                    {property.name}
                  </span>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-14 gap-0.5 relative h-10">
                {/* Day cells */}
                {Array.from({ length: 14 }).map((_, dayIndex) => (
                  <div
                    key={dayIndex}
                    className="h-full bg-muted/30 rounded-sm"
                  />
                ))}
                
                {/* Booking blocks */}
                {property.bookings.map((booking, bookingIndex) => {
                  const width = ((booking.end - booking.start) / 14) * 100;
                  const left = (booking.start / 14) * 100;
                  const bgColor = booking.channel === 'airbnb' 
                    ? 'bg-channel-airbnb' 
                    : booking.channel === 'booking' 
                      ? 'bg-channel-booking' 
                      : 'bg-primary';
                  
                  return (
                    <div
                      key={bookingIndex}
                      className={cn(
                        "absolute top-1 bottom-1 rounded-md flex items-center px-2 overflow-hidden",
                        bgColor
                      )}
                      style={{ left: `${left}%`, width: `${width}%` }}
                    >
                      <span className="text-2xs text-white font-medium truncate">
                        {booking.guest}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-channel-airbnb" />
            <span className="text-2xs text-muted-foreground">Airbnb</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-channel-booking" />
            <span className="text-2xs text-muted-foreground">Booking.com</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-primary" />
            <span className="text-2xs text-muted-foreground">Direct</span>
          </div>
        </div>
      </div>
    </div>
  );
}
