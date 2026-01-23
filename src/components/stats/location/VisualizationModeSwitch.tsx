import { Button } from '@/components/ui/button';
import { MapPin, Flame } from 'lucide-react';
import { VisualizationMode, HeatmapLayer } from '@/types/location';
import { cn } from '@/lib/utils';

interface VisualizationModeSwitchProps {
  mode: VisualizationMode;
  onModeChange: (mode: VisualizationMode) => void;
  activeLayer: HeatmapLayer;
  onLayerChange: (layer: HeatmapLayer) => void;
}

const heatmapLayers: { value: HeatmapLayer; label: string }[] = [
  { value: 'occupancy', label: 'Occupation' },
  { value: 'booked-nights', label: 'Nuits' },
  { value: 'revenue', label: 'Revenus' },
];

export function VisualizationModeSwitch({
  mode,
  onModeChange,
  activeLayer,
  onLayerChange,
}: VisualizationModeSwitchProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Mode Toggle */}
      <div className="flex items-center bg-muted/50 rounded-lg p-1">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-7 px-3 gap-1.5 text-xs font-medium rounded-md transition-all",
            mode === 'markers' && "bg-background shadow-sm"
          )}
          onClick={() => onModeChange('markers')}
        >
          <MapPin className="h-3.5 w-3.5" />
          Marqueurs
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-7 px-3 gap-1.5 text-xs font-medium rounded-md transition-all",
            mode === 'heatmap' && "bg-background shadow-sm"
          )}
          onClick={() => onModeChange('heatmap')}
        >
          <Flame className="h-3.5 w-3.5" />
          Heatmap
        </Button>
      </div>

      {/* Layer Selector (only in heatmap mode) */}
      {mode === 'heatmap' && (
        <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1">
          {heatmapLayers.map((layer) => (
            <Button
              key={layer.value}
              variant="ghost"
              size="sm"
              className={cn(
                "h-6 px-2 text-[11px] rounded-md transition-all",
                activeLayer === layer.value && "bg-primary text-primary-foreground"
              )}
              onClick={() => onLayerChange(layer.value)}
            >
              {layer.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}