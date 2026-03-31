import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface PropertySearchFiltersProps {
  searchTerm: string;
  filterType: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
}

export const PropertySearchFilters = ({ 
  searchTerm, 
  filterType, 
  onSearchChange, 
  onFilterChange 
}: PropertySearchFiltersProps) => {
  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Rechercher par numéro, adresse..." 
          className="h-11 pl-9 rounded-xl bg-muted/50 border-border"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      {/* Filters row */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
        <Select value={filterType} onValueChange={onFilterChange}>
          <SelectTrigger className="h-9 w-auto min-w-[140px] shrink-0 rounded-lg text-xs">
            <SelectValue placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="T1">T1</SelectItem>
            <SelectItem value="T2">T2</SelectItem>
            <SelectItem value="T3">T3</SelectItem>
            <SelectItem value="T4">T4</SelectItem>
            <SelectItem value="T5">T5</SelectItem>
            <SelectItem value="T6+">T6+</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="h-9 gap-1 text-xs shrink-0 whitespace-nowrap">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filtres avancés
        </Button>
      </div>
    </div>
  );
};
