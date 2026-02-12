import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Radar, Loader2, MapPin, Filter } from 'lucide-react';
import { LegalWatchProperty, LegalWatchFilters, RiskLevel } from '@/types/legalWatch';
import { cn } from '@/lib/utils';

interface Props {
  properties: LegalWatchProperty[];
  cityStats: Record<string, { count: number; avgScore: number; level: RiskLevel }>;
  availableCities: string[];
  filters: LegalWatchFilters;
  onFiltersChange: (f: LegalWatchFilters) => void;
  onLaunchAnalysis: (type: 'global' | 'city' | 'property', value?: string) => void;
  isAnalyzing: boolean;
}

const RISK_COLORS: Record<RiskLevel, string> = {
  low: '#10b981',
  moderate: '#f59e0b',
  high: '#f97316',
  critical: '#ef4444',
};

export function LegalWatchMap({
  properties,
  cityStats,
  availableCities,
  filters,
  onFiltersChange,
  onLaunchAnalysis,
  isAnalyzing,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedProperty, setSelectedProperty] = useState<LegalWatchProperty | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [46.603354, 1.888334],
      zoom: 6,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    mapInstance.current = map;
    markersRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !markersRef.current) return;
    markersRef.current.clearLayers();

    const displayProps = properties.slice(0, 200); // limit for perf

    for (const p of displayProps) {
      const color = RISK_COLORS[p.riskLevel];
      const icon = L.divIcon({
        className: 'custom-risk-marker',
        html: `<div style="width:12px;height:12px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });

      const marker = L.marker([p.lat, p.lng], { icon });
      marker.bindPopup(`
        <div style="min-width:180px;font-family:system-ui">
          <div style="font-weight:600;margin-bottom:4px;">${p.name}</div>
          <div style="font-size:12px;color:#666;margin-bottom:6px;">${p.city} · ${p.residenceType === 'principale' ? 'Rés. principale' : 'Rés. secondaire'}</div>
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
            <span style="font-size:18px;font-weight:700;color:${color}">${p.riskScore}</span>
            <span style="font-size:11px;color:#999">/100</span>
          </div>
          ${p.lastAnalysisDate ? `<div style="font-size:10px;color:#999">Dernière analyse : ${p.lastAnalysisDate}</div>` : ''}
        </div>
      `);
      marker.on('click', () => setSelectedProperty(p));
      markersRef.current!.addLayer(marker);
    }

    if (displayProps.length > 0) {
      const bounds = L.latLngBounds(displayProps.map((p) => [p.lat, p.lng]));
      mapInstance.current.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [properties]);

  const handleCityFilter = (city: string) => {
    setSelectedCity(city);
    if (city === 'all') {
      onFiltersChange({ ...filters, cities: [] });
    } else {
      onFiltersChange({ ...filters, cities: [city] });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Sidebar */}
      <div className="space-y-4 order-2 lg:order-1">
        {/* City filter */}
        <Card className="border border-border/50">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtrer par ville
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Select value={selectedCity || 'all'} onValueChange={handleCityFilter}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Toutes les villes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les villes</SelectItem>
                {availableCities.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* City risk summary */}
        <Card className="border border-border/50">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm">Score par ville</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-2">
            {Object.entries(cityStats)
              .sort(([, a], [, b]) => b.avgScore - a.avgScore)
              .map(([city, stats]) => (
                <div
                  key={city}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                    selectedCity === city && "bg-muted"
                  )}
                  onClick={() => handleCityFilter(city)}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{city}</span>
                    <span className="text-xs text-muted-foreground">({stats.count})</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn("text-xs", {
                      'border-emerald-300 text-emerald-700 dark:text-emerald-400': stats.level === 'low',
                      'border-amber-300 text-amber-700 dark:text-amber-400': stats.level === 'moderate',
                      'border-orange-300 text-orange-700 dark:text-orange-400': stats.level === 'high',
                      'border-red-300 text-red-700 dark:text-red-400': stats.level === 'critical',
                    })}
                  >
                    {stats.avgScore}/100
                  </Badge>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="space-y-2">
          {selectedCity && selectedCity !== 'all' && (
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={() => onLaunchAnalysis('city', selectedCity)}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Radar className="h-4 w-4" />}
              Veille : {selectedCity}
            </Button>
          )}
          {selectedProperty && (
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={() => onLaunchAnalysis('property', selectedProperty.id)}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Radar className="h-4 w-4" />}
              Veille : {selectedProperty.name}
            </Button>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="lg:col-span-3 order-1 lg:order-2">
        <Card className="border border-border/50 overflow-hidden">
          <div ref={mapRef} className="h-[500px] lg:h-[600px] w-full" />
        </Card>
      </div>
    </div>
  );
}
