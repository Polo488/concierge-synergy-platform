
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
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex items-center gap-2 max-w-sm flex-1">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Rechercher par numéro, adresse ou propriétaire..." 
          className="h-9" 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Select value={filterType} onValueChange={onFilterChange}>
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="Type de bien" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="Appartement">Appartement</SelectItem>
            <SelectItem value="Studio">Studio</SelectItem>
            <SelectItem value="Loft">Loft</SelectItem>
            <SelectItem value="Maison">Maison</SelectItem>
            <SelectItem value="Villa">Villa</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="gap-1">
          <SlidersHorizontal className="h-4 w-4" />
          Filtres avancés
        </Button>
      </div>
    </div>
  );
};
