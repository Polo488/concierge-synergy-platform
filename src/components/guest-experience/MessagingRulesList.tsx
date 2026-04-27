
import { useState } from 'react';
import {
  Play,
  Pause,
  Edit,
  Copy,
  Trash2,
  Plus,
  Clock,
  Zap,
  Hand,
  Search,
  Filter,
  MoreHorizontal,
  ChevronRight,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ButtonIOS, FilterChip } from '@/components/ui/ios';
import {
  MessagingRule,
  TriggerType,
  MessageChannel,
  CHANNEL_LABELS,
} from '@/types/guestExperience';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface MessagingRulesListProps {
  rules: MessagingRule[];
  onCreateRule: () => void;
  onEditRule: (rule: MessagingRule) => void;
  onDeleteRule: (id: string) => void;
  onDuplicateRule: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const getTriggerIcon = (type: TriggerType) => {
  switch (type) {
    case 'time-based':
      return <Clock className="h-3.5 w-3.5" />;
    case 'event-based':
      return <Zap className="h-3.5 w-3.5" />;
    case 'manual':
      return <Hand className="h-3.5 w-3.5" />;
  }
};

const getTriggerLabel = (type: TriggerType) => {
  switch (type) {
    case 'time-based':
      return 'Programmé';
    case 'event-based':
      return 'Événement';
    case 'manual':
      return 'Manuel';
  }
};

const formatTriggerCondition = (rule: MessagingRule) => {
  if (rule.triggerType === 'time-based' && rule.timeTrigger) {
    const { relativeTo, dayOffset, time } = rule.timeTrigger;
    const relativeLabel =
      relativeTo === 'checkin'
        ? 'check-in'
        : relativeTo === 'checkout'
          ? 'check-out'
          : 'réservation';
    let dayLabel = '';
    if (dayOffset === 0) dayLabel = 'Jour du';
    else if (dayOffset < 0)
      dayLabel = `${Math.abs(dayOffset)} j avant`;
    else dayLabel = `${dayOffset} j après`;
    return `${dayLabel} ${relativeLabel} à ${time}`;
  }
  if (rule.triggerType === 'event-based' && rule.eventTrigger) {
    return rule.eventTrigger.eventType.replace(/_/g, ' ');
  }
  return 'Déclenchement manuel';
};

const TRIGGER_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'Tous types' },
  { value: 'time-based', label: 'Programmé' },
  { value: 'event-based', label: 'Événement' },
  { value: 'manual', label: 'Manuel' },
];

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'Tous statuts' },
  { value: 'active', label: 'Actif' },
  { value: 'inactive', label: 'Inactif' },
  { value: 'draft', label: 'Brouillon' },
];

const CHANNEL_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'Tous canaux' },
  { value: 'airbnb', label: 'Airbnb' },
  { value: 'booking', label: 'Booking' },
  { value: 'direct', label: 'Direct' },
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'whatsapp', label: 'WhatsApp' },
];

export function MessagingRulesList({
  rules,
  onCreateRule,
  onEditRule,
  onDeleteRule,
  onDuplicateRule,
  onToggleStatus,
}: MessagingRulesListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTrigger, setFilterTrigger] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterChannel, setFilterChannel] = useState<string>('all');

  const filteredRules = rules.filter((rule) => {
    const matchesSearch =
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTrigger =
      filterTrigger === 'all' || rule.triggerType === filterTrigger;
    const matchesStatus =
      filterStatus === 'all' || rule.status === filterStatus;
    const matchesChannel =
      filterChannel === 'all' ||
      rule.channels.includes(filterChannel as MessageChannel);
    return matchesSearch && matchesTrigger && matchesStatus && matchesChannel;
  });

  const activeFiltersCount =
    (filterTrigger !== 'all' ? 1 : 0) +
    (filterStatus !== 'all' ? 1 : 0) +
    (filterChannel !== 'all' ? 1 : 0);

  const filterTriggerLabel =
    TRIGGER_OPTIONS.find((o) => o.value === filterTrigger)?.label ?? 'Type';
  const filterStatusLabel =
    STATUS_OPTIONS.find((o) => o.value === filterStatus)?.label ?? 'Statut';
  const filterChannelLabel =
    CHANNEL_OPTIONS.find((o) => o.value === filterChannel)?.label ?? 'Canal';

  // Reusable filter popover (Apple-style) — chip qui s'élargit au texte
  const FilterPopover = ({
    label,
    value,
    options,
    onChange,
    icon,
  }: {
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (v: string) => void;
    icon?: React.ReactNode;
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="ios-chip whitespace-nowrap"
          data-active={value !== 'all'}
        >
          {icon}
          <span className="truncate max-w-[140px]">{label}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-56 p-1 ios-popover border-0 shadow-none"
        align="start"
      >
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'ios-popover-item w-full text-left flex items-center justify-between',
              value === opt.value && 'font-semibold text-[hsl(var(--ios-orange))]'
            )}
          >
            <span>{opt.label}</span>
            {value === opt.value && (
              <span className="text-[hsl(var(--ios-orange))] text-base leading-none">✓</span>
            )}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );

  return (
    <Card className="rounded-[22px] overflow-hidden">
      {/* Header — Apple style: stack mobile, ligne desktop. Le CTA ne dépasse plus. */}
      <CardHeader className="px-4 sm:px-6 pt-5 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 space-y-0">
        <CardTitle className="text-[20px] font-semibold tracking-tight">
          Règles de messagerie
        </CardTitle>
        <ButtonIOS
          variant="primary"
          onClick={onCreateRule}
          leftIcon={<Plus className="h-4 w-4" strokeWidth={2.5} />}
          className="w-full sm:w-auto justify-center"
        >
          Nouvelle règle
        </ButtonIOS>
      </CardHeader>

      <CardContent className="px-4 sm:px-6 pb-5 space-y-4">
        {/* Search bar pleine largeur — iOS standard */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Rechercher une règle…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-full bg-[hsl(var(--surface-2)/0.6)] border-[hsl(var(--hairline)/0.5)]"
          />
        </div>

        {/* Filter chips — scroll horizontal silencieux mobile */}
        <div
          className="flex items-center gap-2 overflow-x-auto -mx-1 px-1"
          style={{
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'none',
          }}
        >
          <FilterPopover
            label={filterTriggerLabel}
            value={filterTrigger}
            options={TRIGGER_OPTIONS}
            onChange={setFilterTrigger}
            icon={<Filter className="h-3.5 w-3.5" />}
          />
          <FilterPopover
            label={filterStatusLabel}
            value={filterStatus}
            options={STATUS_OPTIONS}
            onChange={setFilterStatus}
          />
          <FilterPopover
            label={filterChannelLabel}
            value={filterChannel}
            options={CHANNEL_OPTIONS}
            onChange={setFilterChannel}
          />
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={() => {
                setFilterTrigger('all');
                setFilterStatus('all');
                setFilterChannel('all');
              }}
              className="ios-btn-tertiary text-[13px] whitespace-nowrap"
            >
              Réinitialiser
            </button>
          )}
        </div>

        {/* ============ MOBILE — Liste de rows iOS (Settings-like) ============ */}
        <div className="md:hidden edge-safe">
          {filteredRules.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">
              Aucune règle trouvée
            </div>
          ) : (
            <ul className="divide-y divide-[hsl(var(--separator))]">
              {filteredRules.map((rule) => (
                <li
                  key={rule.id}
                  className="flex items-center gap-3 px-4 sm:px-6 py-3.5 active:bg-[hsl(var(--surface-2)/0.5)] transition-colors"
                >
                  {/* Switch */}
                  <Switch
                    checked={rule.status === 'active'}
                    onCheckedChange={() => onToggleStatus(rule.id)}
                    onClick={(e) => e.stopPropagation()}
                  />

                  {/* Contenu (tap = éditer) */}
                  <button
                    type="button"
                    onClick={() => onEditRule(rule)}
                    className="flex-1 min-w-0 text-left"
                  >
                    <p className="font-medium text-[15px] text-[hsl(var(--label-1))] truncate">
                      {rule.name}
                    </p>
                    <p className="text-[12px] text-[hsl(var(--label-2)/0.7)] truncate">
                      {formatTriggerCondition(rule)}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <Badge
                        variant="outline"
                        className="text-[10px] py-0 px-1.5 h-4 gap-1 font-normal"
                      >
                        {getTriggerIcon(rule.triggerType)}
                        {getTriggerLabel(rule.triggerType)}
                      </Badge>
                      {rule.channels.slice(0, 2).map((channel) => (
                        <Badge
                          key={channel}
                          variant="outline"
                          className="text-[10px] py-0 px-1.5 h-4 font-normal"
                        >
                          {CHANNEL_LABELS[channel]}
                        </Badge>
                      ))}
                      {rule.channels.length > 2 && (
                        <Badge
                          variant="outline"
                          className="text-[10px] py-0 px-1.5 h-4 font-normal"
                        >
                          +{rule.channels.length - 2}
                        </Badge>
                      )}
                    </div>
                  </button>

                  {/* Menu actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 rounded-full"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="ios-popover border-0 shadow-none"
                    >
                      <DropdownMenuItem onClick={() => onEditRule(rule)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDuplicateRule(rule.id)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Dupliquer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleStatus(rule.id)}>
                        {rule.status === 'active' ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Désactiver
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Activer
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDeleteRule(rule.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <ChevronRight
                    className="h-4 w-4 text-[hsl(var(--label-2)/0.4)] shrink-0"
                    strokeWidth={2.5}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ============ DESKTOP — Table classique ============ */}
        <div className="hidden md:block rounded-[14px] border border-[hsl(var(--hairline))] overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Actif</TableHead>
                <TableHead>Nom de la règle</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Propriétés</TableHead>
                <TableHead>Canaux</TableHead>
                <TableHead>Dernière exécution</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRules.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Aucune règle trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>
                      <Switch
                        checked={rule.status === 'active'}
                        onCheckedChange={() => onToggleStatus(rule.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{rule.name}</p>
                        {rule.description && (
                          <p className="text-sm text-muted-foreground truncate max-w-[250px]">
                            {rule.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 w-fit"
                      >
                        {getTriggerIcon(rule.triggerType)}
                        {getTriggerLabel(rule.triggerType)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {formatTriggerCondition(rule)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {rule.propertyScope === 'all'
                          ? 'Toutes'
                          : rule.propertyScope === 'selected'
                            ? `${rule.selectedPropertyIds?.length || 0} sélectionnées`
                            : 'Groupes'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {rule.channels.slice(0, 2).map((channel) => (
                          <Badge
                            key={channel}
                            variant="outline"
                            className="text-xs"
                          >
                            {CHANNEL_LABELS[channel]}
                          </Badge>
                        ))}
                        {rule.channels.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{rule.channels.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {rule.lastExecutedAt ? (
                        <div className="text-sm">
                          <p>
                            {format(rule.lastExecutedAt, 'dd MMM yyyy', {
                              locale: fr,
                            })}
                          </p>
                          <p className="text-muted-foreground">
                            {rule.executionCount} envois
                          </p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          Jamais
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEditRule(rule)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDuplicateRule(rule.id)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Dupliquer
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onToggleStatus(rule.id)}
                          >
                            {rule.status === 'active' ? (
                              <>
                                <Pause className="h-4 w-4 mr-2" />
                                Désactiver
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                Activer
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDeleteRule(rule.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
