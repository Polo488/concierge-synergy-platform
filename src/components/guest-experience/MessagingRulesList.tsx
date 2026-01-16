
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
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  MessagingRule, 
  TriggerType, 
  MessageChannel,
  CHANNEL_LABELS 
} from '@/types/guestExperience';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
      return <Clock className="h-4 w-4" />;
    case 'event-based':
      return <Zap className="h-4 w-4" />;
    case 'manual':
      return <Hand className="h-4 w-4" />;
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
    let relativeLabel = '';
    switch (relativeTo) {
      case 'checkin':
        relativeLabel = 'check-in';
        break;
      case 'checkout':
        relativeLabel = 'check-out';
        break;
      case 'booking_date':
        relativeLabel = 'réservation';
        break;
    }
    
    let dayLabel = '';
    if (dayOffset === 0) {
      dayLabel = 'Jour du';
    } else if (dayOffset < 0) {
      dayLabel = `${Math.abs(dayOffset)} jour${Math.abs(dayOffset) > 1 ? 's' : ''} avant`;
    } else {
      dayLabel = `${dayOffset} jour${dayOffset > 1 ? 's' : ''} après`;
    }
    
    return `${dayLabel} ${relativeLabel} à ${time}`;
  }
  
  if (rule.triggerType === 'event-based' && rule.eventTrigger) {
    return rule.eventTrigger.eventType.replace(/_/g, ' ');
  }
  
  return 'Déclenchement manuel';
};

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

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTrigger = filterTrigger === 'all' || rule.triggerType === filterTrigger;
    const matchesStatus = filterStatus === 'all' || rule.status === filterStatus;
    const matchesChannel = filterChannel === 'all' || rule.channels.includes(filterChannel as MessageChannel);
    
    return matchesSearch && matchesTrigger && matchesStatus && matchesChannel;
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Règles de messagerie</CardTitle>
        <Button onClick={onCreateRule}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle règle
        </Button>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une règle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterTrigger} onValueChange={setFilterTrigger}>
            <SelectTrigger className="w-[160px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="time-based">Programmé</SelectItem>
              <SelectItem value="event-based">Événement</SelectItem>
              <SelectItem value="manual">Manuel</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="inactive">Inactif</SelectItem>
              <SelectItem value="draft">Brouillon</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterChannel} onValueChange={setFilterChannel}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Canal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="airbnb">Airbnb</SelectItem>
              <SelectItem value="booking">Booking</SelectItem>
              <SelectItem value="direct">Direct</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Rules Table */}
        <div className="rounded-md border">
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
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
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
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        {getTriggerIcon(rule.triggerType)}
                        {getTriggerLabel(rule.triggerType)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{formatTriggerCondition(rule)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {rule.propertyScope === 'all' ? 'Toutes' : 
                         rule.propertyScope === 'selected' ? `${rule.selectedPropertyIds?.length || 0} sélectionnées` :
                         'Groupes'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {rule.channels.slice(0, 2).map(channel => (
                          <Badge key={channel} variant="outline" className="text-xs">
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
                          <p>{format(rule.lastExecutedAt, 'dd MMM yyyy', { locale: fr })}</p>
                          <p className="text-muted-foreground">{rule.executionCount} envois</p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Jamais</span>
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
