
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  ChevronLeft, ChevronRight, CalendarDays, RefreshCw, Plus, Layers, Search, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import type { CalendarFilters, BookingChannel, BookingStatus } from '@/types/calendar';
import { CHANNEL_NAMES, STATUS_LABELS } from '@/types/calendar';

interface CalendarToolbarProps {
  currentDate: Date;
  filters: CalendarFilters;
  onFiltersChange: (filters: Partial<CalendarFilters>) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onGoToToday: () => void;
  onAddBooking: () => void;
  onSync: () => void;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  layers?: { showCleaning: boolean; showMaintenance: boolean };
  onLayersChange?: (layers: { showCleaning: boolean; showMaintenance: boolean }) => void;
}

export const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  currentDate, filters, onFiltersChange, onNavigate, onGoToToday,
  onAddBooking, onSync, isSyncing, lastSyncTime, layers, onLayersChange,
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    // Mobile: simplified toolbar — nav + layers + add only
    return (
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl p-0.5 bg-muted/50">
            <Button variant="ghost" size="icon" onClick={() => onNavigate('prev')} className="rounded-lg h-9 w-9 min-h-[44px] min-w-[44px]">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" onClick={onGoToToday} className="rounded-lg h-9 px-3 min-h-[44px]">
              <CalendarDays className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onNavigate('next')} className="rounded-lg h-9 w-9 min-h-[44px] min-w-[44px]">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-sm font-semibold capitalize text-foreground">
            {format(currentDate, 'MMM yyyy', { locale: fr })}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {layers && onLayersChange && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-xl border-border/50 bg-card/50 min-h-[44px]">
                  <Layers className="h-4 w-4" />
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
          </Button>
        </div>
      </div>
    );
  }

  // Desktop: full toolbar with search, filters, sync
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="flex items-center glass-subtle rounded-xl p-0.5">
            <Button variant="ghost" size="icon" onClick={() => onNavigate('prev')} className="rounded-lg h-9 w-9 min-h-[44px] min-w-[44px]">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" onClick={onGoToToday} className="rounded-lg h-9 px-3 min-h-[44px]">
              <CalendarDays className="h-4 w-4 mr-1" />
              Aujourd'hui
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onNavigate('next')} className="rounded-lg h-9 w-9 min-h-[44px] min-w-[44px]">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-lg font-semibold capitalize text-foreground">
            {format(currentDate, 'MMMM yyyy', { locale: fr })}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {layers && onLayersChange && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-xl border-border/50 bg-card/50 min-h-[44px]">
                  <Layers className="h-4 w-4" />
                  <span className="ml-1.5">Couches</span>
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

          <Button variant="outline" size="sm" onClick={onSync} disabled={isSyncing} className="rounded-xl border-border/50 bg-card/50 min-h-[44px]">
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="ml-1.5">{isSyncing ? 'Sync...' : 'Sync'}</span>
          </Button>

          <Button onClick={onAddBooking} className="rounded-xl shadow-sm min-h-[44px]" data-tutorial="calendar-add">
            <Plus className="h-4 w-4" />
            <span className="ml-1.5">Réservation</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[140px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={filters.propertySearch}
            onChange={(e) => onFiltersChange({ propertySearch: e.target.value })}
            className="pl-9 rounded-xl border-border/50 bg-card/50 h-10 text-sm"
          />
        </div>

        <Select value={filters.status} onValueChange={(v) => onFiltersChange({ status: v as BookingStatus | 'all' })}>
          <SelectTrigger className="w-[160px] rounded-xl border-border/50 bg-card/50 h-10">
            <Filter className="h-4 w-4 mr-1" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            {Object.entries(STATUS_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filters.channel} onValueChange={(v) => onFiltersChange({ channel: v as BookingChannel | 'all' })}>
          <SelectTrigger className="w-[160px] rounded-xl border-border/50 bg-card/50 h-10">
            <SelectValue placeholder="Canal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            {Object.entries(CHANNEL_NAMES).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
          </SelectContent>
        </Select>

        {lastSyncTime && (
          <Badge variant="secondary" className="ml-auto text-xs rounded-full px-3 py-1 bg-card/50 border-0">
            Sync: {format(lastSyncTime, 'HH:mm')}
          </Badge>
        )}
      </div>
    </div>
  );
};
