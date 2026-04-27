
import { useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CalendarIcon, Download, FileSpreadsheet, Users, Building, Filter, X, Check } from 'lucide-react';
import { format, subDays, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { QualityFilters as FiltersType, CleaningTaskExtended, AgentProfile, PropertyQualityStats } from '@/types/quality';
import { cn } from '@/lib/utils';
import { exportTasksToCSV, exportAgentSummaryToCSV, exportPropertySummaryToCSV } from '@/utils/qualityExport';
import { toast } from 'sonner';
import { SegmentedControl, FilterChip, ToggleIOS, ButtonIOS } from '@/components/ui/ios';

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

type PeriodValue = '7' | '14' | '30' | '60' | 'custom';

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
  const periodOptions: { value: PeriodValue; label: string }[] = [
    { value: '7', label: '7j' },
    { value: '14', label: '14j' },
    { value: '30', label: '30j' },
    { value: '60', label: '60j' },
    { value: 'custom', label: 'Perso.' },
  ];

  const currentPeriod: PeriodValue = useMemo(() => {
    const days = differenceInDays(filters.dateRange.end, filters.dateRange.start);
    if (days === 7) return '7';
    if (days === 14) return '14';
    if (days === 30) return '30';
    if (days === 60) return '60';
    return 'custom';
  }, [filters.dateRange]);

  const handlePeriodChange = (value: PeriodValue) => {
    if (value === 'custom') return;
    const days = parseInt(value, 10);
    onFiltersChange({
      dateRange: { start: subDays(new Date(), days), end: new Date() },
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

  const clearAllExtras = () => {
    onFiltersChange({
      ratingSource: 'all',
      channel: 'all',
    });
  };

  const handleExportTasks = () => {
    if (tasks.length === 0) { toast.error('Aucune tâche à exporter'); return; }
    exportTasksToCSV(tasks);
    toast.success(`${tasks.length} tâches exportées`);
  };
  const handleExportAgents = () => {
    if (agentProfiles.length === 0) { toast.error('Aucun agent à exporter'); return; }
    exportAgentSummaryToCSV(agentProfiles);
    toast.success(`${agentProfiles.length} agents exportés`);
  };
  const handleExportProperties = () => {
    if (propertyStats.length === 0) { toast.error('Aucune propriété à exporter'); return; }
    exportPropertySummaryToCSV(propertyStats);
    toast.success(`${propertyStats.length} propriétés exportées`);
  };

  const extrasCount =
    (filters.ratingSource !== 'all' ? 1 : 0) + (filters.channel !== 'all' ? 1 : 0);

  return (
    <div className="glass-surface p-5 rounded-[18px]">
      {/* LIGNE 1 — Période */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[hsl(240_6%_25%/_0.5)]">
            Période
          </span>
          <SegmentedControl<PeriodValue>
            options={periodOptions}
            value={currentPeriod}
            onChange={handlePeriodChange}
            size="sm"
          />
          <Popover>
            <PopoverTrigger asChild>
              <button className="ios-chip" data-active={currentPeriod === 'custom'}>
                <CalendarIcon size={14} strokeWidth={2} />
                <span>
                  {format(filters.dateRange.start, 'd MMM', { locale: fr })}
                  {' – '}
                  {format(filters.dateRange.end, 'd MMM', { locale: fr })}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2 ios-popover border-0 shadow-none" align="start">
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
      </div>

      {/* DIVIDER */}
      <div className="h-px bg-black/[0.06] my-4" />

      {/* LIGNE 2 — Filtres chips */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Propriétés */}
        <Popover>
          <PopoverTrigger asChild>
            <div>
              <FilterChip
                icon={<Building size={14} strokeWidth={2} />}
                label="Propriétés"
                count={filters.properties.length}
                active={filters.properties.length > 0}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-1 ios-popover border-0 shadow-none" align="start">
            <div className="max-h-64 overflow-y-auto">
              {availableProperties.map(prop => {
                const checked = filters.properties.includes(prop.id);
                return (
                  <button
                    key={prop.id}
                    type="button"
                    onClick={() => toggleProperty(prop.id)}
                    className="ios-popover-item w-full text-left"
                  >
                    <span className="flex-1 truncate">{prop.name}</span>
                    {checked && <Check size={14} strokeWidth={2.5} className="text-[hsl(var(--ios-orange))]" />}
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>

        {/* Agents */}
        <Popover>
          <PopoverTrigger asChild>
            <div>
              <FilterChip
                icon={<Users size={14} strokeWidth={2} />}
                label="Agents"
                count={filters.agents.length}
                active={filters.agents.length > 0}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-1 ios-popover border-0 shadow-none" align="start">
            <div className="max-h-64 overflow-y-auto">
              {availableAgents.map(agent => {
                const checked = filters.agents.includes(agent.id);
                return (
                  <button
                    key={agent.id}
                    type="button"
                    onClick={() => toggleAgent(agent.id)}
                    className="ios-popover-item w-full text-left"
                  >
                    <span className="flex-1 truncate">{agent.name}</span>
                    {checked && <Check size={14} strokeWidth={2.5} className="text-[hsl(var(--ios-orange))]" />}
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>

        {/* Plus (canal + source note) */}
        <Popover>
          <PopoverTrigger asChild>
            <div>
              <FilterChip
                icon={<Filter size={14} strokeWidth={2} />}
                label="Plus"
                count={extrasCount}
                active={extrasCount > 0}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3 ios-popover border-0 shadow-none" align="start">
            <div className="space-y-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.06em] font-semibold text-[hsl(240_6%_25%/_0.5)] mb-2">
                  Canal
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(['all', ...availableChannels] as string[]).map(c => (
                    <button
                      key={c}
                      onClick={() => onFiltersChange({ channel: c as typeof filters.channel })}
                      className="ios-chip"
                      data-active={filters.channel === c}
                    >
                      <span>{c === 'all' ? 'Tous' : c}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-px bg-black/[0.06]" />
              <div>
                <p className="text-[11px] uppercase tracking-[0.06em] font-semibold text-[hsl(240_6%_25%/_0.5)] mb-2">
                  Source note
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { v: 'all', l: 'Toutes' },
                    { v: 'manager', l: 'Manager' },
                    { v: 'owner', l: 'Propriétaire' },
                    { v: 'guest', l: 'Client' },
                  ].map(opt => (
                    <button
                      key={opt.v}
                      onClick={() => onFiltersChange({ ratingSource: opt.v as typeof filters.ratingSource })}
                      className="ios-chip"
                      data-active={filters.ratingSource === opt.v}
                    >
                      <span>{opt.l}</span>
                    </button>
                  ))}
                </div>
              </div>
              {extrasCount > 0 && (
                <button
                  onClick={clearAllExtras}
                  className="ios-btn-tertiary text-[13px] flex items-center gap-1"
                >
                  <X size={12} strokeWidth={2.5} />
                  Réinitialiser
                </button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* DIVIDER */}
      <div className="h-px bg-black/[0.06] my-4" />

      {/* LIGNE 3 — Toggle + export */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ToggleIOS
          id="include-repasse"
          checked={filters.includeRepasseFollowups}
          onChange={(v) => onFiltersChange({ includeRepasseFollowups: v })}
          label="Inclure repasses"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ButtonIOS variant="secondary" leftIcon={<Download size={14} strokeWidth={2} />}>
              Exporter
            </ButtonIOS>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="ios-popover border-0 shadow-none">
            <DropdownMenuItem onClick={handleExportTasks} className="ios-popover-item gap-2">
              <FileSpreadsheet size={14} strokeWidth={2} />
              Tâches + notes ({tasks.length})
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportAgents} className="ios-popover-item gap-2">
              <Users size={14} strokeWidth={2} />
              Résumé agents ({agentProfiles.length})
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportProperties} className="ios-popover-item gap-2">
              <Building size={14} strokeWidth={2} />
              Résumé propriétés ({propertyStats.length})
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Removed: cn import unused warning silencer */}
      {cn && null}
    </div>
  );
}
