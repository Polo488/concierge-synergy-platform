
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
    <div className="space-y-3">
      <div className="flex items-center gap-2 w-full">
        <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <Input 
          placeholder="Rechercher une intervention..." 
          className="h-9 w-full" 
          onChange={handleSearchChange}
        />
      </div>
      
      <div 
        className="flex gap-2 overflow-x-auto pb-1"
        style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
      >
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-shrink-0 gap-1.5 whitespace-nowrap text-[13px] h-8 rounded-lg"
          onClick={onFilterByDate}
        >
          <Calendar className="h-3.5 w-3.5" />
          Date
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-shrink-0 gap-1.5 whitespace-nowrap text-[13px] h-8 rounded-lg"
          onClick={onFilterByTechnician}
        >
          <User className="h-3.5 w-3.5" />
          Technicien
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-shrink-0 gap-1.5 whitespace-nowrap text-[13px] h-8 rounded-lg"
          onClick={onFilterByUrgency}
        >
          <BadgeAlert className="h-3.5 w-3.5" />
          Urgence
        </Button>
      </div>
    </div>
  );
};
