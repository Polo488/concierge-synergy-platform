
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, User, BadgeAlert, Search } from 'lucide-react';

interface MaintenanceSearchFiltersProps {
  onSearch?: (term: string) => void;
  onFilterByDate?: () => void;
  onFilterByTechnician?: () => void;
  onFilterByUrgency?: () => void;
}

export const MaintenanceSearchFilters = ({
  onSearch,
  onFilterByDate,
  onFilterByTechnician,
  onFilterByUrgency
}: MaintenanceSearchFiltersProps) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex items-center gap-2 max-w-sm flex-1">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Rechercher une intervention..." 
          className="h-9" 
          onChange={handleSearchChange}
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1"
          onClick={onFilterByDate}
        >
          <Calendar className="h-4 w-4" />
          Date
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1"
          onClick={onFilterByTechnician}
        >
          <User className="h-4 w-4" />
          Technicien
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1"
          onClick={onFilterByUrgency}
        >
          <BadgeAlert className="h-4 w-4" />
          Urgence
        </Button>
      </div>
    </div>
  );
};
