import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { X, MapPin, Building2, AlertTriangle, ChevronRight } from 'lucide-react';
import { PropertyGroup, LocationFilters, HeatmapLayer, VisualizationMode } from '@/types/location';
import { VisualizationModeSwitch } from './VisualizationModeSwitch';
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
  visualizationMode: VisualizationMode;
  onVisualizationModeChange: (mode: VisualizationMode) => void;
}

export function LocationFiltersBar({
  filters,
  onFiltersChange,
  groups,
  availableCities,
  availableAreas,
  activeLayer,
  onLayerChange,
  nonGeolocatedCount,
  visualizationMode,
  onVisualizationModeChange,
}: LocationFiltersBarProps) {
  const toggleGroup = (groupId: string) => {
    const newGroups = filters.groups.includes(groupId)
      ? filters.groups.filter(g => g !== groupId)
      : [...filters.groups, groupId];
    // Clear cities and areas when group changes (cascade reset)
    onFiltersChange({ groups: newGroups, cities: [], areas: [] });
  };

  const toggleCity = (city: string) => {
    const newCities = filters.cities.includes(city)
      ? filters.cities.filter(c => c !== city)
      : [...filters.cities, city];
    // Clear areas when city changes (cascade reset)
    onFiltersChange({ cities: newCities, areas: [] });
  };

  const toggleArea = (area: string) => {
    const newAreas = filters.areas.includes(area)
      ? filters.areas.filter(a => a !== area)
      : [...filters.areas, area];
    onFiltersChange({ areas: newAreas });
  };

  const clearAllFilters = () => {
    onFiltersChange({ groups: [], cities: [], areas: [] });
  };

  const hasActiveFilters = filters.groups.length > 0 || filters.cities.length > 0 || filters.areas.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-3 p-3 bg-card/80 backdrop-blur-sm border border-border/20 rounded-xl shadow-sm">
      {/* Filter Hierarchy: Group → City → Area */}
      <div className="flex items-center gap-1">
        {/* Groups Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant={filters.groups.length > 0 ? "default" : "outline"} 
              size="sm" 
              className="h-8 gap-2"
            >
              <Building2 className="h-3.5 w-3.5" />
              {filters.groups.length > 0 ? (
                <span className="font-medium">
                  {filters.groups.length === 1 
                    ? groups.find(g => g.id === filters.groups[0])?.name 
                    : `${filters.groups.length} groupes`}
                </span>
              ) : (
                'Tous les groupes'
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
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: group.color || '#6b7280' }}
                  />
                  <span className="text-sm truncate">{group.name}</span>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />

        {/* Cities Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant={filters.cities.length > 0 ? "default" : "outline"} 
              size="sm" 
              className="h-8 gap-2"
            >
              <MapPin className="h-3.5 w-3.5" />
              {filters.cities.length > 0 ? (
                <span className="font-medium">
                  {filters.cities.length === 1 
                    ? filters.cities[0] 
                    : `${filters.cities.length} villes`}
                </span>
              ) : (
                'Toutes les villes'
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="start">
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {availableCities.length === 0 ? (
                <p className="text-xs text-muted-foreground p-2">Aucune ville disponible</p>
              ) : (
                availableCities.map(city => (
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
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>

        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />

        {/* Areas Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant={filters.areas.length > 0 ? "default" : "outline"} 
              size="sm" 
              className="h-8 gap-2"
              disabled={availableAreas.length === 0}
            >
              {filters.areas.length > 0 ? (
                <span className="font-medium">
                  {filters.areas.length === 1 
                    ? filters.areas[0] 
                    : `${filters.areas.length} quartiers`}
                </span>
              ) : (
                'Tous les quartiers'
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="start">
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {availableAreas.length === 0 ? (
                <p className="text-xs text-muted-foreground p-2">Sélectionnez une ville d'abord</p>
              ) : (
                availableAreas.map(area => (
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
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="h-8 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5 mr-1" />
          Réinitialiser
        </Button>
      )}

      {/* Separator */}
      <div className="h-6 w-px bg-border/50 mx-1" />

      {/* Visualization Mode Switch */}
      <VisualizationModeSwitch
        mode={visualizationMode}
        onModeChange={onVisualizationModeChange}
        activeLayer={activeLayer}
        onLayerChange={onLayerChange}
      />

      {/* Non-geolocated warning */}
      {nonGeolocatedCount > 0 && (
        <div className="ml-auto flex items-center gap-1.5 text-xs text-amber-600 bg-amber-500/10 px-2.5 py-1.5 rounded-full">
          <AlertTriangle className="h-3 w-3" />
          {nonGeolocatedCount} non géolocalisée{nonGeolocatedCount > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}