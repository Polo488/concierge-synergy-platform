
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface CalendarFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedProperty: string;
  setSelectedProperty: (property: string) => void;
  currentView: 'month' | 'property';
  setCurrentView: (view: 'month' | 'property') => void;
  properties: any[];
}

export const CalendarFilters = ({
  searchQuery,
  setSearchQuery,
  selectedProperty,
  setSelectedProperty,
  currentView,
  setCurrentView,
  properties
}: CalendarFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-3 items-center justify-between">
      <div className="flex items-center gap-2 max-w-sm flex-1">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Rechercher un logement ou client..." 
          className="h-9" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex items-center gap-2 flex-wrap">
        <Select value={selectedProperty} onValueChange={setSelectedProperty}>
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="Tous les logements" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les logements</SelectItem>
            {properties.map(property => (
              <SelectItem key={property.id} value={property.id.toString()}>
                {property.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="flex items-center gap-1 bg-muted rounded-md p-1">
          <Button 
            size="sm" 
            variant={currentView === 'month' ? 'default' : 'ghost'} 
            className="h-7"
            onClick={() => setCurrentView('month')}
          >
            Mois
          </Button>
          <Button 
            size="sm" 
            variant={currentView === 'property' ? 'default' : 'ghost'} 
            className="h-7"
            onClick={() => setCurrentView('property')}
          >
            Logements
          </Button>
        </div>
      </div>
    </div>
  );
};
