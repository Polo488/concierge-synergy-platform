
import { OnboardingFilters as FiltersType } from '@/types/onboarding';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface OnboardingFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
  cities: string[];
}

export function OnboardingFilters({ filters, onFiltersChange, cities }: OnboardingFiltersProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher un bien, propriétaire..."
          value={filters.search}
          onChange={e => onFiltersChange({ ...filters, search: e.target.value })}
          className="pl-9"
        />
      </div>
      <Select value={filters.status} onValueChange={v => onFiltersChange({ ...filters, status: v as any })}>
        <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          <SelectItem value="in_progress">En cours</SelectItem>
          <SelectItem value="completed">Terminés</SelectItem>
          <SelectItem value="blocked">Bloqués</SelectItem>
        </SelectContent>
      </Select>
      {cities.length > 1 && (
        <Select value={filters.city || 'all'} onValueChange={v => onFiltersChange({ ...filters, city: v === 'all' ? '' : v })}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les villes</SelectItem>
            {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
