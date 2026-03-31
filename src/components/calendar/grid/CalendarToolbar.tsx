
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  ChevronLeft, ChevronRight, CalendarDays, Plus, Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';

interface CalendarToolbarProps {
  currentDate: Date;
  onNavigate: (direction: 'prev' | 'next') => void;
  onGoToToday: () => void;
  onAddBooking: () => void;
  layers?: { showCleaning: boolean; showMaintenance: boolean };
  onLayersChange?: (layers: { showCleaning: boolean; showMaintenance: boolean }) => void;
}

export const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  currentDate, onNavigate, onGoToToday,
  onAddBooking, layers, onLayersChange,
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center justify-between gap-2">
      {/* Navigation */}
      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-xl p-0.5 bg-muted/50">
          <Button variant="ghost" size="icon" onClick={() => onNavigate('prev')} className="rounded-lg h-9 w-9 min-h-[44px] min-w-[44px]">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" onClick={onGoToToday} className="rounded-lg h-9 px-3 min-h-[44px]">
            <CalendarDays className="h-4 w-4 mr-1" />
            {!isMobile && "Aujourd'hui"}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onNavigate('next')} className="rounded-lg h-9 w-9 min-h-[44px] min-w-[44px]">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm md:text-lg font-semibold capitalize text-foreground">
          {format(currentDate, isMobile ? 'MMM yyyy' : 'MMMM yyyy', { locale: fr })}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        {layers && onLayersChange && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-xl border-border/50 bg-card/50 min-h-[44px]">
                <Layers className="h-4 w-4" />
                {!isMobile && <span className="ml-1.5">Couches</span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-muted-foreground">Afficher</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked={layers.showCleaning} onCheckedChange={(c) => onLayersChange({ ...layers, showCleaning: c })}>
                Tâches ménage
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={layers.showMaintenance} onCheckedChange={(c) => onLayersChange({ ...layers, showMaintenance: c })}>
                Maintenance
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button onClick={onAddBooking} className="rounded-xl shadow-sm min-h-[44px]" data-tutorial="calendar-add">
          <Plus className="h-4 w-4" />
          {!isMobile && <span className="ml-1.5">Réservation</span>}
        </Button>
      </div>
    </div>
  );
};
