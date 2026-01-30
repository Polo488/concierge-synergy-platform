import { cn } from '@/lib/utils';
import { MapPin, TrendingUp, Eye, Layers } from 'lucide-react';

const mockProperties = [
  { id: 1, name: 'Apt. Bellecour', x: 45, y: 35, occupation: 94, revenue: 4250 },
  { id: 2, name: 'Studio Confluence', x: 32, y: 55, occupation: 82, revenue: 2150 },
  { id: 3, name: 'Loft Croix-Rousse', x: 55, y: 25, occupation: 88, revenue: 3200 },
  { id: 4, name: 'T3 Part-Dieu', x: 65, y: 45, occupation: 91, revenue: 3800 },
  { id: 5, name: 'Studio Vieux Lyon', x: 40, y: 50, occupation: 79, revenue: 1950 },
  { id: 6, name: 'Apt. Tête d\'Or', x: 70, y: 30, occupation: 96, revenue: 5100 },
];

const heatmapZones = [
  { x: 42, y: 40, size: 120, intensity: 0.9 },
  { x: 60, y: 35, size: 90, intensity: 0.7 },
  { x: 35, y: 52, size: 70, intensity: 0.5 },
];

const filters = [
  { label: 'Lyon', active: true },
  { label: 'Presqu\'île', active: false },
  { label: 'Croix-Rousse', active: false },
];

const visualModes = [
  { id: 'markers', icon: MapPin, label: 'Marqueurs', active: true },
  { id: 'heatmap', icon: Layers, label: 'Heatmap', active: false },
];

export function GeoPreview({ className }: { className?: string }) {
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
          <span className="text-xs text-muted-foreground">app.noe-conciergerie.com/stats/geo</span>
        </div>
      </div>

      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground text-sm">Analyse géographique</h3>
            <p className="text-xs text-muted-foreground">Visualisez votre parc par zone</p>
          </div>
          
          {/* Visual mode toggle */}
          <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
            {visualModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded text-2xs font-medium transition-colors",
                    mode.active ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="w-3 h-3" />
                  {mode.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-2 border-b border-border/30 flex items-center gap-2">
        <span className="text-2xs text-muted-foreground">Filtres :</span>
        {filters.map((filter) => (
          <button
            key={filter.label}
            className={cn(
              "px-2 py-0.5 rounded text-2xs font-medium transition-colors",
              filter.active 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Map Container */}
      <div className="relative h-64 bg-gradient-to-br from-muted/50 to-muted/30 overflow-hidden">
        {/* Simulated map background */}
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Streets */}
            <line x1="0" y1="40" x2="100" y2="40" stroke="currentColor" strokeWidth="0.3" className="text-border" />
            <line x1="0" y1="60" x2="100" y2="60" stroke="currentColor" strokeWidth="0.3" className="text-border" />
            <line x1="30" y1="0" x2="30" y2="100" stroke="currentColor" strokeWidth="0.3" className="text-border" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.3" className="text-border" />
            <line x1="70" y1="0" x2="70" y2="100" stroke="currentColor" strokeWidth="0.3" className="text-border" />
            {/* River */}
            <path d="M20,20 Q40,35 35,55 T40,80" stroke="hsl(var(--status-info))" strokeWidth="1.5" fill="none" opacity="0.3" />
          </svg>
        </div>

        {/* Heatmap zones */}
        {heatmapZones.map((zone, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-xl animate-pulse"
            style={{
              left: `${zone.x}%`,
              top: `${zone.y}%`,
              width: zone.size,
              height: zone.size,
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(circle, hsl(var(--status-success) / ${zone.intensity * 0.5}) 0%, transparent 70%)`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}

        {/* Property markers */}
        {mockProperties.map((property) => (
          <div
            key={property.id}
            className="absolute group cursor-pointer"
            style={{ 
              left: `${property.x}%`, 
              top: `${property.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {/* Marker */}
            <div className={cn(
              "w-6 h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center transition-transform group-hover:scale-125",
              property.occupation >= 90 ? "bg-status-success" : 
              property.occupation >= 80 ? "bg-status-warning" : "bg-status-info"
            )}>
              <span className="text-2xs font-bold text-white">{property.occupation}</span>
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <div className="bg-card rounded-lg shadow-elevated border border-border/50 px-3 py-2 whitespace-nowrap">
                <p className="text-xs font-medium text-foreground">{property.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xs text-status-success font-medium">{property.revenue}€</span>
                  <span className="text-2xs text-muted-foreground">{property.occupation}% occ.</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Viewport KPIs */}
      <div className="p-4 bg-muted/20">
        <div className="flex items-center gap-2 mb-3">
          <Eye className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">KPIs de la zone visible</span>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-xl p-3 border border-border/30">
            <p className="text-lg font-bold text-foreground">6</p>
            <p className="text-2xs text-muted-foreground">Biens affichés</p>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border/30">
            <div className="flex items-center gap-1">
              <p className="text-lg font-bold text-foreground">88%</p>
              <TrendingUp className="w-3 h-3 text-status-success" />
            </div>
            <p className="text-2xs text-muted-foreground">Occupation moy.</p>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border/30">
            <p className="text-lg font-bold text-status-success">20 450€</p>
            <p className="text-2xs text-muted-foreground">Revenus zone</p>
          </div>
        </div>

        {/* Insight message */}
        <div className="mt-3 p-2.5 bg-status-success/10 rounded-lg border border-status-success/20">
          <p className="text-xs text-foreground">
            <span className="font-medium">💡 Insight :</span> La Presqu'île concentre 60% de vos revenus avec seulement 3 biens.
          </p>
        </div>
      </div>
    </div>
  );
}
