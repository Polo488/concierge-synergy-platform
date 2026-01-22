import { useEffect, useRef, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocationProperty, ViewportBounds, HeatmapLayer, HeatmapPoint, PropertyGroup } from '@/types/location';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Calendar, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface StatsMapProps {
  properties: LocationProperty[];
  activeLayer: HeatmapLayer;
  heatmapData: HeatmapPoint[];
  onViewportChange: (bounds: ViewportBounds) => void;
  groups: PropertyGroup[];
}

// Create colored marker icon
function createMarkerIcon(color: string = '#3b82f6'): L.DivIcon {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
}

// Map events handler component
function MapEventHandler({ onViewportChange }: { onViewportChange: (bounds: ViewportBounds) => void }) {
  const map = useMapEvents({
    moveend: () => {
      const bounds = map.getBounds();
      onViewportChange({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      });
    },
    zoomend: () => {
      const bounds = map.getBounds();
      onViewportChange({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      });
    },
  });

  // Get initial bounds
  useEffect(() => {
    const bounds = map.getBounds();
    onViewportChange({
      north: bounds.getNorth(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      west: bounds.getWest(),
    });
  }, [map, onViewportChange]);

  return null;
}

// Heatmap layer component
function HeatmapLayerComponent({ data, layer }: { data: HeatmapPoint[]; layer: HeatmapLayer }) {
  const map = useMap();
  const heatLayerRef = useRef<any>(null);

  useEffect(() => {
    if (layer === 'properties' || data.length === 0) {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
      return;
    }

    // Dynamic import of leaflet.heat
    import('leaflet.heat').then(() => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
      }

      const heatData = data.map(point => [point.lat, point.lng, point.intensity] as [number, number, number]);
      
      // @ts-ignore - leaflet.heat adds this method
      heatLayerRef.current = L.heatLayer(heatData, {
        radius: 35,
        blur: 25,
        maxZoom: 12,
        max: 1,
        gradient: getGradientForLayer(layer),
      }).addTo(map);
    });

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
    };
  }, [map, data, layer]);

  return null;
}

function getGradientForLayer(layer: HeatmapLayer): Record<number, string> {
  switch (layer) {
    case 'revenue':
      return { 0.2: '#fef3c7', 0.5: '#fbbf24', 0.8: '#f59e0b', 1: '#d97706' };
    case 'occupancy':
      return { 0.2: '#d1fae5', 0.5: '#34d399', 0.8: '#10b981', 1: '#059669' };
    case 'booked-nights':
      return { 0.2: '#dbeafe', 0.5: '#60a5fa', 0.8: '#3b82f6', 1: '#2563eb' };
    case 'incidents':
    case 'repasse':
      return { 0.2: '#fecaca', 0.5: '#f87171', 0.8: '#ef4444', 1: '#dc2626' };
    default:
      return { 0.4: 'blue', 0.65: 'lime', 1: 'red' };
  }
}

// Property popup content
function PropertyPopup({ property }: { property: LocationProperty }) {
  return (
    <div className="min-w-[220px] p-1">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h4 className="font-semibold text-sm">{property.name}</h4>
          <p className="text-xs text-muted-foreground">{property.city}</p>
        </div>
        {property.group && (
          <Badge 
            variant="secondary" 
            className="text-[10px] shrink-0"
            style={{ backgroundColor: `${property.group.color}20`, color: property.group.color }}
          >
            {property.group.name}
          </Badge>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="bg-muted/50 rounded p-1.5">
          <span className="text-muted-foreground">Occupation</span>
          <p className="font-semibold">{property.stats.occupancyRate}%</p>
        </div>
        <div className="bg-muted/50 rounded p-1.5">
          <span className="text-muted-foreground">CA</span>
          <p className="font-semibold">{property.stats.revenue.toLocaleString()}€</p>
        </div>
        <div className="bg-muted/50 rounded p-1.5">
          <span className="text-muted-foreground">Nuits</span>
          <p className="font-semibold">{property.stats.bookedNights}</p>
        </div>
        <div className="bg-muted/50 rounded p-1.5">
          <span className="text-muted-foreground">Note</span>
          <p className="font-semibold">{property.stats.avgRating}/5</p>
        </div>
      </div>
      
      <div className="flex gap-1">
        <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">
          <ExternalLink className="h-3 w-3 mr-1" />
          Détails
        </Button>
        <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">
          <Calendar className="h-3 w-3 mr-1" />
          Calendrier
        </Button>
        <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">
          <BarChart3 className="h-3 w-3 mr-1" />
          Stats
        </Button>
      </div>
    </div>
  );
}

// Heatmap legend
function HeatmapLegend({ layer }: { layer: HeatmapLayer }) {
  if (layer === 'properties') return null;

  const legendConfig = {
    'booked-nights': { label: 'Nuits réservées', low: 'Peu', high: 'Beaucoup' },
    'occupancy': { label: 'Taux d\'occupation', low: '0%', high: '100%' },
    'revenue': { label: 'Chiffre d\'affaires', low: 'Faible', high: 'Élevé' },
    'incidents': { label: 'Incidents', low: 'Peu', high: 'Beaucoup' },
    'repasse': { label: 'Taux de repasse', low: 'Faible', high: 'Élevé' },
  };

  const config = legendConfig[layer];
  if (!config) return null;

  const gradientColors = {
    'revenue': 'from-amber-100 via-amber-400 to-amber-600',
    'occupancy': 'from-emerald-100 via-emerald-400 to-emerald-600',
    'booked-nights': 'from-blue-100 via-blue-400 to-blue-600',
    'incidents': 'from-red-100 via-red-400 to-red-600',
    'repasse': 'from-red-100 via-red-400 to-red-600',
  };

  return (
    <Card className="absolute bottom-4 left-4 z-[1000] bg-card/90 backdrop-blur-sm border-border/30">
      <CardContent className="p-3">
        <p className="text-xs font-medium mb-2">{config.label}</p>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">{config.low}</span>
          <div className={cn(
            "w-24 h-3 rounded-full bg-gradient-to-r",
            gradientColors[layer]
          )} />
          <span className="text-[10px] text-muted-foreground">{config.high}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsMap({ 
  properties, 
  activeLayer, 
  heatmapData, 
  onViewportChange,
  groups 
}: StatsMapProps) {
  // France center
  const defaultCenter: [number, number] = [46.603354, 1.888334];
  const defaultZoom = 6;

  // Calculate bounds to fit all properties
  const bounds = properties.length > 0
    ? L.latLngBounds(properties.map(p => [p.lat, p.lng] as [number, number]))
    : null;

  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden border border-border/30">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        bounds={bounds || undefined}
        className="h-full w-full"
        style={{ background: 'hsl(var(--muted))' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapEventHandler onViewportChange={onViewportChange} />
        
        {/* Heatmap layer */}
        <HeatmapLayerComponent data={heatmapData} layer={activeLayer} />
        
        {/* Property markers */}
        {activeLayer === 'properties' && properties.map(property => (
          <Marker
            key={property.id}
            position={[property.lat, property.lng]}
            icon={createMarkerIcon(property.group?.color)}
          >
            <Popup>
              <PropertyPopup property={property} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Heatmap Legend */}
      <HeatmapLegend layer={activeLayer} />
    </div>
  );
}
