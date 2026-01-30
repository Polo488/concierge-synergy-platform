import { cn } from '@/lib/utils';

export function ProductPreviewCalendar({ className }: { className?: string }) {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const dates = [27, 28, 29, 30, 31, 1, 2];
  const properties = [
    { name: 'Studio Vieux-Port', type: 'T1' },
    { name: 'Appartement Centre', type: 'T2' },
    { name: 'Maison Plage', type: 'T3' },
    { name: 'Loft Design', type: 'T2' },
  ];

  const bookings = [
    { property: 0, start: 0, duration: 3, guest: 'Martin D.', channel: 'airbnb', status: 'confirmed' },
    { property: 0, start: 5, duration: 2, guest: 'Sophie L.', channel: 'booking', status: 'pending' },
    { property: 1, start: 1, duration: 4, guest: 'Jean-Pierre M.', channel: 'airbnb', status: 'confirmed' },
    { property: 2, start: 0, duration: 2, guest: 'Claire B.', channel: 'direct', status: 'confirmed' },
    { property: 2, start: 3, duration: 4, guest: 'Thomas R.', channel: 'booking', status: 'confirmed' },
    { property: 3, start: 2, duration: 3, guest: 'Marie V.', channel: 'airbnb', status: 'confirmed' },
  ];

  const channelColors = {
    airbnb: 'bg-[hsl(0,84%,60%)]/15 border-[hsl(0,84%,60%)]/30 text-[hsl(0,84%,55%)]',
    booking: 'bg-[hsl(217,91%,60%)]/15 border-[hsl(217,91%,60%)]/30 text-[hsl(217,91%,50%)]',
    direct: 'bg-[hsl(152,50%,45%)]/15 border-[hsl(152,50%,45%)]/30 text-[hsl(152,50%,40%)]',
  };

  return (
    <div className={cn('bg-card rounded-xl border border-border/50 overflow-hidden shadow-lg', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-foreground">Janvier 2025</span>
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center cursor-pointer hover:bg-accent transition-colors">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-muted-foreground">
                <path d="M7.5 2.5L3.5 6L7.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center cursor-pointer hover:bg-accent transition-colors">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-muted-foreground">
                <path d="M4.5 2.5L8.5 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">4 biens</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-hidden">
        {/* Days header */}
        <div className="grid grid-cols-8 border-b border-border/30">
          <div className="p-2 text-[10px] text-muted-foreground font-medium bg-muted/20" />
          {days.map((day, i) => (
            <div
              key={day}
              className={cn(
                'p-2 text-center border-l border-border/20',
                i === 4 && 'bg-primary/5'
              )}
            >
              <div className="text-[10px] text-muted-foreground font-medium">{day}</div>
              <div className={cn(
                'text-xs font-semibold mt-0.5',
                i === 4 ? 'text-primary' : 'text-foreground'
              )}>
                {dates[i]}
              </div>
            </div>
          ))}
        </div>

        {/* Property rows */}
        {properties.map((property, propIndex) => (
          <div key={property.name} className="grid grid-cols-8 border-b border-border/20 last:border-b-0 hover:bg-muted/20 transition-colors">
            <div className="p-2 bg-muted/10 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <span className="text-[9px] font-bold text-primary">{property.type}</span>
              </div>
              <span className="text-[11px] text-foreground font-medium truncate">{property.name}</span>
            </div>
            <div className="col-span-7 relative h-12 border-l border-border/20">
              {/* Grid lines */}
              <div className="absolute inset-0 grid grid-cols-7">
                {days.map((_, i) => (
                  <div key={i} className={cn(
                    'border-l border-border/10',
                    i === 0 && 'border-l-0',
                    i === 4 && 'bg-primary/[0.03]'
                  )} />
                ))}
              </div>
              {/* Bookings */}
              {bookings
                .filter((b) => b.property === propIndex)
                .map((booking, i) => (
                  <div
                    key={i}
                    className={cn(
                      'absolute top-1.5 bottom-1.5 rounded-md border flex items-center px-2 gap-1.5 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md',
                      channelColors[booking.channel as keyof typeof channelColors]
                    )}
                    style={{
                      left: `${(booking.start / 7) * 100}%`,
                      width: `${(booking.duration / 7) * 100}%`,
                    }}
                  >
                    <span className="text-[10px] font-medium truncate">{booking.guest}</span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
