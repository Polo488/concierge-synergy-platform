
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CalendarIcon, X, Download, FileSpreadsheet, Users, Building } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { QualityFilters as FiltersType, CleaningTaskExtended, AgentProfile, PropertyQualityStats } from '@/types/quality';
import { cn } from '@/lib/utils';
import { exportTasksToCSV, exportAgentSummaryToCSV, exportPropertySummaryToCSV } from '@/utils/qualityExport';
import { toast } from 'sonner';

interface QualityFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: Partial<FiltersType>) => void;
  availableProperties: { id: string; name: string }[];
  availableAgents: { id: string; name: string }[];
  availableChannels: string[];
  tasks: CleaningTaskExtended[];
  agentProfiles: AgentProfile[];
  propertyStats: PropertyQualityStats[];
}

export function QualityFilters({
  filters,
  onFiltersChange,
  availableProperties,
  availableAgents,
  availableChannels,
  tasks,
  agentProfiles,
  propertyStats,
}: QualityFiltersProps) {
  const presetRanges = [
    { label: '7 jours', days: 7 },
    { label: '14 jours', days: 14 },
    { label: '30 jours', days: 30 },
    { label: '60 jours', days: 60 },
  ];

  const handleDateRangePreset = (days: number) => {
    onFiltersChange({
      dateRange: {
        start: subDays(new Date(), days),
        end: new Date(),
      },
    });
  };

  const toggleProperty = (propertyId: string) => {
    const newProperties = filters.properties.includes(propertyId)
      ? filters.properties.filter(p => p !== propertyId)
      : [...filters.properties, propertyId];
    onFiltersChange({ properties: newProperties });
  };

  const toggleAgent = (agentId: string) => {
    const newAgents = filters.agents.includes(agentId)
      ? filters.agents.filter(a => a !== agentId)
      : [...filters.agents, agentId];
    onFiltersChange({ agents: newAgents });
  };

  const clearFilters = () => {
    onFiltersChange({
      properties: [],
      agents: [],
      ratingSource: 'all',
      status: 'completed',
      channel: 'all',
    });
  };

  const handleExportTasks = () => {
    if (tasks.length === 0) {
      toast.error('Aucune tâche à exporter');
      return;
    }
    exportTasksToCSV(tasks);
    toast.success(`${tasks.length} tâches exportées`);
  };

  const handleExportAgents = () => {
    if (agentProfiles.length === 0) {
      toast.error('Aucun agent à exporter');
      return;
    }
    exportAgentSummaryToCSV(agentProfiles);
    toast.success(`${agentProfiles.length} agents exportés`);
  };

  const handleExportProperties = () => {
    if (propertyStats.length === 0) {
      toast.error('Aucune propriété à exporter');
      return;
    }
    exportPropertySummaryToCSV(propertyStats);
    toast.success(`${propertyStats.length} propriétés exportées`);
  };

  const hasActiveFilters = filters.properties.length > 0 || 
    filters.agents.length > 0 || 
    filters.ratingSource !== 'all' ||
    filters.channel !== 'all';

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border border-border/50">
      {/* Date Range */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Période:</span>
        {presetRanges.map(preset => (
          <Button
            key={preset.days}
            variant="outline"
            size="sm"
            onClick={() => handleDateRangePreset(preset.days)}
            className={cn(
              "h-8",
              Math.round((filters.dateRange.end.getTime() - filters.dateRange.start.getTime()) / (1000 * 60 * 60 * 24)) === preset.days
                && "bg-primary text-primary-foreground"
            )}
          >
            {preset.label}
          </Button>
        ))}
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <CalendarIcon className="h-4 w-4 mr-2" />
              {format(filters.dateRange.start, 'dd MMM', { locale: fr })} - {format(filters.dateRange.end, 'dd MMM', { locale: fr })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={{ from: filters.dateRange.start, to: filters.dateRange.end }}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  onFiltersChange({ dateRange: { start: range.from, end: range.to } });
                }
              }}
              locale={fr}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Property & Agent Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              Propriétés
              {filters.properties.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                  {filters.properties.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2" align="start">
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableProperties.map(prop => (
                <div 
                  key={prop.id}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-muted",
                    filters.properties.includes(prop.id) && "bg-primary/10"
                  )}
                  onClick={() => toggleProperty(prop.id)}
                >
                  <div className={cn(
                    "w-4 h-4 rounded border flex items-center justify-center",
                    filters.properties.includes(prop.id) ? "bg-primary border-primary" : "border-muted-foreground"
                  )}>
                    {filters.properties.includes(prop.id) && (
                      <span className="text-primary-foreground text-xs">✓</span>
                    )}
                  </div>
                  <span className="text-sm truncate">{prop.name}</span>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              Agents
              {filters.agents.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                  {filters.agents.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2" align="start">
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableAgents.map(agent => (
                <div 
                  key={agent.id}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-muted",
                    filters.agents.includes(agent.id) && "bg-primary/10"
                  )}
                  onClick={() => toggleAgent(agent.id)}
                >
                  <div className={cn(
                    "w-4 h-4 rounded border flex items-center justify-center",
                    filters.agents.includes(agent.id) ? "bg-primary border-primary" : "border-muted-foreground"
                  )}>
                    {filters.agents.includes(agent.id) && (
                      <span className="text-primary-foreground text-xs">✓</span>
                    )}
                  </div>
                  <span className="text-sm truncate">{agent.name}</span>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Select 
          value={filters.channel} 
          onValueChange={(value) => onFiltersChange({ channel: value as typeof filters.channel })}
        >
          <SelectTrigger className="w-[140px] h-8">
            <SelectValue placeholder="Canal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les canaux</SelectItem>
            {availableChannels.map(channel => (
              <SelectItem key={channel} value={channel}>{channel}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={filters.ratingSource} 
          onValueChange={(value) => onFiltersChange({ ratingSource: value as typeof filters.ratingSource })}
        >
          <SelectTrigger className="w-[140px] h-8">
            <SelectValue placeholder="Source note" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes sources</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="owner">Propriétaire</SelectItem>
            <SelectItem value="guest">Client</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Switch
            id="include-repasse"
            checked={filters.includeRepasseFollowups}
            onCheckedChange={(checked) => onFiltersChange({ includeRepasseFollowups: checked })}
          />
          <Label htmlFor="include-repasse" className="text-sm">Inclure repasses</Label>
        </div>

        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="h-8 text-muted-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Effacer
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 ml-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExportTasks}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Tâches + notes ({tasks.length})
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportAgents}>
              <Users className="h-4 w-4 mr-2" />
              Résumé agents ({agentProfiles.length})
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportProperties}>
              <Building className="h-4 w-4 mr-2" />
              Résumé propriétés ({propertyStats.length})
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
