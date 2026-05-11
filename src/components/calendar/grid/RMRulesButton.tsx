import React from 'react';
import { Sparkles, Zap, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';

export interface RMRulesState {
  defaultMinStay: number;
  gapFillEnabled: boolean;
  releaseEnabled: boolean;
  releaseDaysBefore: number;
  releaseTarget: number;
}

interface Props {
  value: RMRulesState;
  onChange: (next: RMRulesState) => void;
}

export const RMRulesButton: React.FC<Props> = ({ value, onChange }) => {
  const isMobile = useIsMobile();
  const activeCount = (value.gapFillEnabled ? 1 : 0) + (value.releaseEnabled ? 1 : 0);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl border-border/50 bg-card/50 min-h-[44px] relative"
        >
          <Settings2 className="h-4 w-4" />
          {!isMobile && <span className="ml-1.5">Règles RM</span>}
          {activeCount > 0 && (
            <Badge className="ml-1.5 h-4 min-w-[16px] px-1 text-[10px] bg-primary text-primary-foreground">
              {activeCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[320px] p-4 space-y-5">
        <div>
          <h4 className="text-sm font-semibold">Règles Revenue Management</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Optimise le remplissage en assouplissant temporairement le min stay.
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Min stay par défaut</Label>
          <Input
            type="number"
            min={1}
            max={14}
            value={value.defaultMinStay}
            onChange={(e) => onChange({ ...value, defaultMinStay: Math.max(1, Number(e.target.value) || 1) })}
            className="h-9 rounded-lg"
          />
        </div>

        <div className="rounded-lg border border-border/50 p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <Label className="text-sm font-medium">Gap Fill</Label>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Réduit le min stay sur un trou plus court entre deux résas.
              </p>
            </div>
            <Switch
              checked={value.gapFillEnabled}
              onCheckedChange={(v) => onChange({ ...value, gapFillEnabled: v })}
            />
          </div>
        </div>

        <div className="rounded-lg border border-border/50 p-3 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                <Label className="text-sm font-medium">Relâche min stay</Label>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Abaisse automatiquement le min stay à l'approche de l'arrivée.
              </p>
            </div>
            <Switch
              checked={value.releaseEnabled}
              onCheckedChange={(v) => onChange({ ...value, releaseEnabled: v })}
            />
          </div>

          {value.releaseEnabled && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <Label className="text-[11px] text-muted-foreground">À J-</Label>
                <Input
                  type="number"
                  min={1}
                  max={30}
                  value={value.releaseDaysBefore}
                  onChange={(e) => onChange({ ...value, releaseDaysBefore: Math.max(1, Number(e.target.value) || 1) })}
                  className="h-8 rounded-lg text-sm"
                />
              </div>
              <div>
                <Label className="text-[11px] text-muted-foreground">Min stay cible</Label>
                <Input
                  type="number"
                  min={1}
                  max={7}
                  value={value.releaseTarget}
                  onChange={(e) => onChange({ ...value, releaseTarget: Math.max(1, Number(e.target.value) || 1) })}
                  className="h-8 rounded-lg text-sm"
                />
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
