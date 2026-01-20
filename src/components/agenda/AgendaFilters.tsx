import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AgendaFilters as AgendaFiltersType } from '@/types/agenda';

interface Property {
  id: string;
  name: string;
}

interface AgendaFiltersProps {
  filters: AgendaFiltersType;
  onFiltersChange: (filters: AgendaFiltersType) => void;
  properties: Property[];
  allTags: string[];
}

export const AgendaFilters = ({
  filters,
  onFiltersChange,
  properties,
  allTags,
}: AgendaFiltersProps) => {
  const hasActiveFilters = 
    filters.propertyIds.length > 0 || 
    filters.tags.length > 0;

  const clearFilters = () => {
    onFiltersChange({
      ...filters,
      propertyIds: [],
      tags: [],
    });
  };

  const toggleProperty = (propertyId: string) => {
    const newPropertyIds = filters.propertyIds.includes(propertyId)
      ? filters.propertyIds.filter(id => id !== propertyId)
      : [...filters.propertyIds, propertyId];
    onFiltersChange({ ...filters, propertyIds: newPropertyIds });
  };

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    onFiltersChange({ ...filters, tags: newTags });
  };

  return (
    <div className="flex items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une note..."
          value={filters.searchQuery}
          onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
          className="pl-9"
        />
      </div>

      {/* Filters popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtres
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                {filters.propertyIds.length + filters.tags.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filtres</h4>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Réinitialiser
                </Button>
              )}
            </div>

            <Separator />

            {/* Properties filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Propriétés</Label>
              <div className="max-h-32 overflow-y-auto space-y-2">
                {properties.map(property => (
                  <div key={property.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`filter-${property.id}`}
                      checked={filters.propertyIds.includes(property.id)}
                      onCheckedChange={() => toggleProperty(property.id)}
                    />
                    <label
                      htmlFor={`filter-${property.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {property.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Tags filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tags</Label>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={filters.tags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
                {allTags.length === 0 && (
                  <p className="text-sm text-muted-foreground">Aucun tag disponible</p>
                )}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Active filter badges */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          {filters.propertyIds.map(id => {
            const property = properties.find(p => p.id === id);
            return property ? (
              <Badge key={id} variant="secondary" className="gap-1">
                {property.name}
                <button onClick={() => toggleProperty(id)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ) : null;
          })}
          {filters.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <button onClick={() => toggleTag(tag)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
