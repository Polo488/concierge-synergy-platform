import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, User, BadgeAlert, Search, X, Check } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { DateRange } from 'react-day-picker';

interface MaintenanceSearchFiltersProps {
  onSearch?: (term: string) => void;
  onFilterByDate?: (range?: DateRange) => void;
  onFilterByTechnician?: (techs: string[]) => void;
  onFilterByUrgency?: (urgency: string) => void;
}

const TECHNICIANS = ['Marc Dupont', 'Sophie Bernard', 'Lucas Petit', 'Julie Moreau', 'Thomas Roux'];
const URGENCIES = [
  { v: 'all', l: 'Toutes' },
  { v: 'low', l: 'Faible' },
  { v: 'med', l: 'Moyenne' },
  { v: 'high', l: 'Haute' },
  { v: 'crit', l: 'Critique' },
];

export const MaintenanceSearchFilters = ({
  onSearch,
  onFilterByDate,
  onFilterByTechnician,
  onFilterByUrgency,
}: MaintenanceSearchFiltersProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [techSearch, setTechSearch] = useState('');
  const [urgency, setUrgency] = useState<string>('all');

  const dateActive = !!(dateRange?.from || dateRange?.to);
  const techActive = selectedTechs.length > 0;
  const urgActive = urgency !== 'all';
  const hasAnyFilter = dateActive || techActive || urgActive;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value);
  };

  const toggleTech = (t: string) => {
    const next = selectedTechs.includes(t) ? selectedTechs.filter(x => x !== t) : [...selectedTechs, t];
    setSelectedTechs(next);
    onFilterByTechnician?.(next);
  };

  const clearAll = () => {
    setDateRange(undefined);
    setSelectedTechs([]);
    setUrgency('all');
    onFilterByDate?.(undefined);
    onFilterByTechnician?.([]);
    onFilterByUrgency?.('all');
  };

  const chipClass = (active: boolean) =>
    `flex-shrink-0 gap-1.5 whitespace-nowrap text-[13px] h-8 rounded-lg transition-colors ${
      active
        ? 'border-[#FF5C1A] text-[#FF5C1A] bg-[rgba(255,92,26,0.08)] hover:bg-[rgba(255,92,26,0.12)]'
        : ''
    }`;

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
        {/* Date */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className={chipClass(dateActive)}>
              <CalendarIcon className="h-3.5 w-3.5" />
              {dateActive
                ? `${dateRange?.from ? format(dateRange.from, 'd MMM', { locale: fr }) : ''}${dateRange?.to ? ' – ' + format(dateRange.to, 'd MMM', { locale: fr }) : ''}`
                : 'Date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={(r) => { setDateRange(r); onFilterByDate?.(r); }}
              locale={fr}
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        {/* Technicien */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className={chipClass(techActive)}>
              <User className="h-3.5 w-3.5" />
              Technicien{techActive ? ` (${selectedTechs.length})` : ''}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-64 p-2 space-y-2">
            <Input
              placeholder="Rechercher..."
              value={techSearch}
              onChange={(e) => setTechSearch(e.target.value)}
              className="h-8 text-xs"
            />
            <div className="max-h-60 overflow-y-auto">
              {TECHNICIANS.filter(t => t.toLowerCase().includes(techSearch.toLowerCase())).map(t => {
                const checked = selectedTechs.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTech(t)}
                    className="w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-md hover:bg-muted text-left"
                  >
                    <span>{t}</span>
                    {checked && <Check className="h-3.5 w-3.5 text-[#FF5C1A]" />}
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>

        {/* Urgence */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className={chipClass(urgActive)}>
              <BadgeAlert className="h-3.5 w-3.5" />
              Urgence{urgActive ? ` · ${URGENCIES.find(u => u.v === urgency)?.l}` : ''}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-48 p-1">
            {URGENCIES.map(u => (
              <button
                key={u.v}
                type="button"
                onClick={() => { setUrgency(u.v); onFilterByUrgency?.(u.v); }}
                className="w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-md hover:bg-muted text-left"
              >
                <span>{u.l}</span>
                {urgency === u.v && <Check className="h-3.5 w-3.5 text-[#FF5C1A]" />}
              </button>
            ))}
          </PopoverContent>
        </Popover>

        {hasAnyFilter && (
          <Button
            variant="ghost"
            size="sm"
            className="flex-shrink-0 gap-1 whitespace-nowrap text-[12px] h-8 text-muted-foreground"
            onClick={clearAll}
          >
            <X className="h-3 w-3" />
            Effacer
          </Button>
        )}
      </div>
    </div>
  );
};
