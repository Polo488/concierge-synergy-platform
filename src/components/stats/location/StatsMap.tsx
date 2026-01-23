// Stats Map Component - Using native Leaflet (not react-leaflet)
import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocationProperty, ViewportBounds, HeatmapLayer, HeatmapPoint, PropertyGroup, VisualizationMode } from '@/types/location';
import { Card, CardContent } from '@/components/ui/card';
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
  visualizationMode: VisualizationMode;
  mainCity?: string;
}

// Create colored marker icon
function createMarkerIcon(color: string = '#3b82f6', isHeatmapMode: boolean = false): L.DivIcon {
  const opacity = isHeatmapMode ? 0.4 : 1;
  const size = isHeatmapMode ? 16 : 24;
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        opacity: ${opacity};
        transition: all 0.3s ease;
      "></div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
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

// Create popup content HTML
function createPopupContent(property: LocationProperty): string {
  const groupBadge = property.group 
    ? `<span style="background-color: ${property.group.color}20; color: ${property.group.color}; font-size: 10px; padding: 2px 6px; border-radius: 4px;">${property.group.name}</span>`
    : '';
  
  return `
    <div style="min-width: 200px; font-family: Inter, sans-serif;">
      <div style="display: flex; justify-content: space-between; align-items: start; gap: 8px; margin-bottom: 8px;">
        <div>
          <h4 style="margin: 0; font-size: 14px; font-weight: 600;">${property.name}</h4>
          <p style="margin: 2px 0 0; font-size: 12px; color: #6b7280;">${property.city}</p>
        </div>
        ${groupBadge}
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11px;">
        <div style="background: #f3f4f6; padding: 6px; border-radius: 4px;">
          <span style="color: #6b7280;">Occupation</span>
          <p style="margin: 2px 0 0; font-weight: 600;">${property.stats.occupancyRate}%</p>
        </div>
        <div style="background: #f3f4f6; padding: 6px; border-radius: 4px;">
          <span style="color: #6b7280;">CA</span>
          <p style="margin: 2px 0 0; font-weight: 600;">${property.stats.revenue.toLocaleString()}€</p>
        </div>
        <div style="background: #f3f4f6; padding: 6px; border-radius: 4px;">
          <span style="color: #6b7280;">Nuits</span>
          <p style="margin: 2px 0 0; font-weight: 600;">${property.stats.bookedNights}</p>
        </div>
        <div style="background: #f3f4f6; padding: 6px; border-radius: 4px;">
          <span style="color: #6b7280;">Note</span>
          <p style="margin: 2px 0 0; font-weight: 600;">${property.stats.avgRating}/5</p>
        </div>
      </div>
    </div>
  `;
}

// Heatmap legend component
function HeatmapLegend({ layer, mode }: { layer: HeatmapLayer; mode: VisualizationMode }) {
  if (mode !== 'heatmap') return null;

  const legendConfig: Record<string, { label: string; low: string; high: string }> = {
    'booked-nights': { label: 'Nuits réservées', low: 'Peu', high: 'Beaucoup' },
    'occupancy': { label: 'Taux d\'occupation', low: '0%', high: '100%' },
    'revenue': { label: 'Chiffre d\'affaires', low: 'Faible', high: 'Élevé' },
    'incidents': { label: 'Incidents', low: 'Peu', high: 'Beaucoup' },
    'repasse': { label: 'Taux de repasse', low: 'Faible', high: 'Élevé' },
  };

  const config = legendConfig[layer];
  if (!config) return null;

  const gradientColors: Record<string, string> = {
    'revenue': 'from-amber-100 via-amber-400 to-amber-600',
    'occupancy': 'from-emerald-100 via-emerald-400 to-emerald-600',
    'booked-nights': 'from-blue-100 via-blue-400 to-blue-600',
    'incidents': 'from-red-100 via-red-400 to-red-600',
    'repasse': 'from-red-100 via-red-400 to-red-600',
  };

  return (
    <Card className="absolute bottom-4 left-4 z-[1000] bg-card/95 backdrop-blur-sm border-border/30 shadow-lg">
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
  visualizationMode,
}: StatsMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const heatLayerRef = useRef<any>(null);
  const initialFitDoneRef = useRef(false);

  // Stable callback for viewport changes
  const handleViewportChange = useCallback(() => {
    if (!mapRef.current) return;
    const bounds = mapRef.current.getBounds();
    onViewportChange({
      north: bounds.getNorth(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      west: bounds.getWest(),
    });
  }, [onViewportChange]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Default center (France) - will be adjusted on first properties load
    const defaultCenter: L.LatLngExpression = [46.603354, 1.888334];
    const defaultZoom = 6;

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: defaultZoom,
      zoomControl: false,
    });

    // Add zoom control to top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Use a cleaner tile style
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    map.on('moveend', handleViewportChange);
    map.on('zoomend', handleViewportChange);

    return () => {
      map.remove();
      mapRef.current = null;
      initialFitDoneRef.current = false;
    };
  }, [handleViewportChange]);

  // Auto-fit bounds to properties on first load or when properties change significantly
  useEffect(() => {
    if (!mapRef.current || properties.length === 0) return;

    // Always fit bounds to current properties
    const bounds = L.latLngBounds(properties.map(p => [p.lat, p.lng] as [number, number]));
    
    if (!initialFitDoneRef.current) {
      // First load - fit immediately
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
      initialFitDoneRef.current = true;
    } else {
      // Subsequent filter changes - animate
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 12, animate: true, duration: 0.5 });
    }

    // Trigger viewport update after fit
    setTimeout(handleViewportChange, 100);
  }, [properties, handleViewportChange]);

  // Update markers
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    // Clear existing markers
    markersLayerRef.current.clearLayers();

    const isHeatmapMode = visualizationMode === 'heatmap';

    // Add property markers (faded in heatmap mode)
    properties.forEach(property => {
      const marker = L.marker([property.lat, property.lng], {
        icon: createMarkerIcon(property.group?.color, isHeatmapMode),
      });

      if (!isHeatmapMode) {
        marker.bindPopup(createPopupContent(property), {
          maxWidth: 280,
        });
      }

      markersLayerRef.current?.addLayer(marker);
    });
  }, [properties, visualizationMode]);

  // Update heatmap when data or mode changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing heat layer
    if (heatLayerRef.current) {
      mapRef.current.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    // Only show heatmap in heatmap mode
    if (visualizationMode !== 'heatmap' || heatmapData.length === 0) return;

    // Dynamic import of leaflet.heat
    import('leaflet.heat').then(() => {
      if (!mapRef.current) return;

      const heatData = heatmapData.map(point => [point.lat, point.lng, point.intensity] as [number, number, number]);
      
      // @ts-ignore - leaflet.heat adds this method
      heatLayerRef.current = L.heatLayer(heatData, {
        radius: 40,
        blur: 30,
        maxZoom: 14,
        max: 1,
        gradient: getGradientForLayer(activeLayer),
      }).addTo(mapRef.current);
    });
  }, [heatmapData, activeLayer, visualizationMode]);

  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden border border-border/20 shadow-sm">
      <div 
        ref={mapContainerRef} 
        className="h-full w-full"
        style={{ background: 'hsl(var(--muted))' }}
      />
      
      {/* Heatmap Legend */}
      <HeatmapLegend layer={activeLayer} mode={visualizationMode} />
    </div>
  );
}