import { cn } from '@/lib/utils';

export function MockDashboard() {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const properties = ['Studio Centre', 'Apt Vieux Port', 'Maison Plage'];
  
  const bookings = [
    { property: 0, start: 0, duration: 3, color: 'bg-emerald-500/80' },
    { property: 0, start: 5, duration: 2, color: 'bg-blue-500/80' },
    { property: 1, start: 1, duration: 4, color: 'bg-amber-500/80' },
    { property: 2, start: 0, duration: 2, color: 'bg-emerald-500/80' },
    { property: 2, start: 3, duration: 4, color: 'bg-rose-500/80' },
  ];

  return (
    <div className="relative glass-panel rounded-2xl p-4 sm:p-6 shadow-float">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Taux d'occupation" value="87%" trend="+12%" />
        <StatCard label="Arrivées aujourd'hui" value="4" />
        <StatCard label="Ménages à faire" value="6" />
      </div>

      {/* Calendar Grid */}
      <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-8 border-b border-border/50">
          <div className="p-2 text-xs text-muted-foreground font-medium" />
          {days.map((day) => (
            <div
              key={day}
              className="p-2 text-xs text-center text-muted-foreground font-medium border-l border-border/30"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Rows */}
        {properties.map((property, propIndex) => (
          <div key={property} className="grid grid-cols-8 border-b border-border/30 last:border-b-0">
            <div className="p-2 text-xs text-foreground font-medium truncate">
              {property}
            </div>
            <div className="col-span-7 relative h-10 border-l border-border/30">
              {/* Grid lines */}
              <div className="absolute inset-0 grid grid-cols-7">
                {days.map((_, i) => (
                  <div key={i} className={cn('border-l border-border/20', i === 0 && 'border-l-0')} />
                ))}
              </div>
              {/* Bookings */}
              {bookings
                .filter((b) => b.property === propIndex)
                .map((booking, i) => (
                  <div
                    key={i}
                    className={cn(
                      'absolute top-1 bottom-1 rounded-md',
                      booking.color
                    )}
                    style={{
                      left: `${(booking.start / 7) * 100}%`,
                      width: `${(booking.duration / 7) * 100}%`,
                    }}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>3 biens actifs</span>
        <span>Semaine 5</span>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend?: string;
}) {
  return (
    <div className="bg-card rounded-xl border border-border/50 p-3">
      <p className="text-xs text-muted-foreground truncate">{label}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-lg font-semibold text-foreground">{value}</span>
        {trend && (
          <span className="text-xs text-emerald-600 font-medium">{trend}</span>
        )}
      </div>
    </div>
  );
}
