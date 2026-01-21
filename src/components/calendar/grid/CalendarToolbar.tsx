
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  ChevronLeft, 
  ChevronRight, 
  CalendarDays, 
  RefreshCw, 
  Plus, 
  Layers,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
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
  layers?: {
    showCleaning: boolean;
    showMaintenance: boolean;
  };
  onLayersChange?: (layers: { showCleaning: boolean; showMaintenance: boolean }) => void;
}

export const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  currentDate,
  filters,
  onFiltersChange,
  onNavigate,
  onGoToToday,
  onAddBooking,
  onSync,
  isSyncing,
  lastSyncTime,
  layers,
  onLayersChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Top row - Navigation and actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center glass-subtle rounded-xl p-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onNavigate('prev')}
              className="rounded-lg h-9 w-9"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              onClick={onGoToToday}
              className="rounded-lg h-9 px-4"
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Aujourd'hui
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onNavigate('next')}
              className="rounded-lg h-9 w-9"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-lg font-semibold ml-3 capitalize text-foreground">
            {format(currentDate, 'MMMM yyyy', { locale: fr })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {layers && onLayersChange && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-xl border-border/50 bg-card/50 backdrop-blur-sm">
                  <Layers className="h-4 w-4 mr-2" />
                  Couches
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-panel border-0">
                <DropdownMenuLabel className="text-muted-foreground">Afficher</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/30" />
                <DropdownMenuCheckboxItem
                  checked={layers.showCleaning}
                  onCheckedChange={(checked) => 
                    onLayersChange({ ...layers, showCleaning: checked })
                  }
                >
                  Tâches ménage
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={layers.showMaintenance}
                  onCheckedChange={(checked) => 
                    onLayersChange({ ...layers, showMaintenance: checked })
                  }
                >
                  Maintenance
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSync}
            disabled={isSyncing}
            className="rounded-xl border-border/50 bg-card/50 backdrop-blur-sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Sync...' : 'Synchroniser'}
          </Button>

          <Button onClick={onAddBooking} className="rounded-xl shadow-sm btn-press" data-tutorial="calendar-add">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une réservation
          </Button>
        </div>
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un logement..."
            value={filters.propertySearch}
            onChange={(e) => onFiltersChange({ propertySearch: e.target.value })}
            className="pl-10 rounded-xl border-border/50 bg-card/50 backdrop-blur-sm focus:bg-card"
          />
        </div>

        <Select
          value={filters.status}
          onValueChange={(value) => onFiltersChange({ status: value as BookingStatus | 'all' })}
        >
          <SelectTrigger className="w-[160px] rounded-xl border-border/50 bg-card/50 backdrop-blur-sm">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent className="glass-panel border-0">
            <SelectItem value="all">Tous les statuts</SelectItem>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.channel}
          onValueChange={(value) => onFiltersChange({ channel: value as BookingChannel | 'all' })}
        >
          <SelectTrigger className="w-[160px] rounded-xl border-border/50 bg-card/50 backdrop-blur-sm">
            <SelectValue placeholder="Canal" />
          </SelectTrigger>
          <SelectContent className="glass-panel border-0">
            <SelectItem value="all">Tous les canaux</SelectItem>
            {Object.entries(CHANNEL_NAMES).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {lastSyncTime && (
          <Badge variant="secondary" className="ml-auto text-xs rounded-full px-3 py-1 bg-card/50 backdrop-blur-sm border-0">
            Dernière sync: {format(lastSyncTime, 'HH:mm')}
          </Badge>
        )}
      </div>
    </div>
  );
};
