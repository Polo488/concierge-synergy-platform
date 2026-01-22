import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Layers, MapPin, Building2, AlertTriangle } from 'lucide-react';
import { PropertyGroup, LocationFilters, HeatmapLayer } from '@/types/location';
import { cn } from '@/lib/utils';

interface LocationFiltersBarProps {
  filters: LocationFilters;
  onFiltersChange: (filters: Partial<LocationFilters>) => void;
  groups: PropertyGroup[];
  availableCities: string[];
  availableAreas: string[];
  activeLayer: HeatmapLayer;
  onLayerChange: (layer: HeatmapLayer) => void;
  nonGeolocatedCount: number;
}

const layerOptions: { value: HeatmapLayer; label: string; description: string }[] = [
  { value: 'properties', label: 'Marqueurs', description: 'Afficher les propriétés' },
  { value: 'booked-nights', label: 'Nuits réservées', description: 'Heatmap des nuits' },
  { value: 'occupancy', label: 'Taux d\'occupation', description: 'Heatmap occupation' },
  { value: 'revenue', label: 'Chiffre d\'affaires', description: 'Heatmap revenus' },
  { value: 'incidents', label: 'Incidents', description: 'Heatmap incidents' },
  { value: 'repasse', label: 'Taux de repasse', description: 'Heatmap repasses' },
];

export function LocationFiltersBar({
  filters,
  onFiltersChange,
  groups,
  availableCities,
  availableAreas,
  activeLayer,
  onLayerChange,
  nonGeolocatedCount,
}: LocationFiltersBarProps) {
  const toggleGroup = (groupId: string) => {
    const newGroups = filters.groups.includes(groupId)
      ? filters.groups.filter(g => g !== groupId)
      : [...filters.groups, groupId];
    onFiltersChange({ groups: newGroups });
  };

  const toggleCity = (city: string) => {
    const newCities = filters.cities.includes(city)
      ? filters.cities.filter(c => c !== city)
      : [...filters.cities, city];
    onFiltersChange({ cities: newCities });
  };

  const toggleArea = (area: string) => {
    const newAreas = filters.areas.includes(area)
      ? filters.areas.filter(a => a !== area)
      : [...filters.areas, area];
    onFiltersChange({ areas: newAreas });
  };

  const clearFilters = () => {
    onFiltersChange({
      groups: [],
      cities: [],
      areas: [],
    });
  };

  const hasActiveFilters = filters.groups.length > 0 || filters.cities.length > 0 || filters.areas.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-3 p-3 bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl">
      {/* Groups Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-2">
            <Building2 className="h-3.5 w-3.5" />
            Groupes
            {filters.groups.length > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                {filters.groups.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2" align="start">
          <div className="space-y-1">
            {groups.map(group => (
              <div
                key={group.id}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-muted transition-colors",
                  filters.groups.includes(group.id) && "bg-primary/10"
                )}
                onClick={() => toggleGroup(group.id)}
              >
                <Checkbox checked={filters.groups.includes(group.id)} />
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: group.color || '#6b7280' }}
                />
                <span className="text-sm">{group.name}</span>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Cities Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-2">
            <MapPin className="h-3.5 w-3.5" />
            Villes
            {filters.cities.length > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                {filters.cities.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2" align="start">
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {availableCities.map(city => (
              <div
                key={city}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-muted transition-colors",
                  filters.cities.includes(city) && "bg-primary/10"
                )}
                onClick={() => toggleCity(city)}
              >
                <Checkbox checked={filters.cities.includes(city)} />
                <span className="text-sm">{city}</span>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Areas Filter */}
      {availableAreas.length > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-2">
              Quartiers
              {filters.areas.length > 0 && (
                <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                  {filters.areas.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="start">
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {availableAreas.map(area => (
                <div
                  key={area}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-muted transition-colors",
                    filters.areas.includes(area) && "bg-primary/10"
                  )}
                  onClick={() => toggleArea(area)}
                >
                  <Checkbox checked={filters.areas.includes(area)} />
                  <span className="text-sm">{area}</span>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Layer Selector */}
      <div className="h-6 w-px bg-border mx-1" />
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-2">
            <Layers className="h-3.5 w-3.5" />
            {layerOptions.find(l => l.value === activeLayer)?.label || 'Couche'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2" align="start">
          <div className="space-y-1">
            {layerOptions.map(layer => (
              <div
                key={layer.value}
                className={cn(
                  "flex flex-col p-2 rounded-lg cursor-pointer hover:bg-muted transition-colors",
                  activeLayer === layer.value && "bg-primary/10"
                )}
                onClick={() => onLayerChange(layer.value)}
              >
                <span className="text-sm font-medium">{layer.label}</span>
                <span className="text-xs text-muted-foreground">{layer.description}</span>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-8 text-muted-foreground"
        >
          <X className="h-3.5 w-3.5 mr-1" />
          Effacer
        </Button>
      )}

      {/* Non-geolocated warning */}
      {nonGeolocatedCount > 0 && (
        <div className="ml-auto flex items-center gap-1.5 text-xs text-amber-600 bg-amber-500/10 px-2 py-1 rounded-full">
          <AlertTriangle className="h-3 w-3" />
          {nonGeolocatedCount} non géolocalisée{nonGeolocatedCount > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
