
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Bell, 
  Clock,
  MessageCircle,
  AlertCircle,
  AlertTriangle,
  Timer
} from 'lucide-react';
import { 
  Conversation, 
  MessagingFilters, 
  CHANNEL_ICONS, 
  CHANNEL_COLORS,
  TAG_LABELS,
  TAG_COLORS,
  STATUS_COLORS,
  ConversationStatus,
  MessageChannel,
  ConversationTag
} from '@/types/messaging';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  filters: MessagingFilters;
  onFiltersChange: (filters: MessagingFilters) => void;
  properties: { id: string; name: string }[];
  stats: {
    total: number;
    unread: number;
    open: number;
    pending: number;
    resolved: number;
    priority: number;
    slaCritical?: number;
    slaWarning?: number;
  };
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  filters,
  onFiltersChange,
  properties,
  stats,
}) => {
  const allTags: ConversationTag[] = [
    'check-in-issue',
    'check-out-issue',
    'upsell',
    'complaint',
    'maintenance',
    'cleaning',
    'urgent',
    'vip',
  ];

  const toggleTagFilter = (tag: ConversationTag) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    onFiltersChange({ ...filters, tags: newTags });
  };

  return (
    <div className="flex flex-col h-full border-r bg-background">
      {/* Header with stats */}
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Conversations</h2>
          <div className="flex items-center gap-2">
            {(stats.slaCritical ?? 0) > 0 && (
              <Badge variant="destructive" className="rounded-full animate-pulse">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {stats.slaCritical} SLA
              </Badge>
            )}
            {stats.unread > 0 && (
              <Badge variant="destructive" className="rounded-full">
                {stats.unread}
              </Badge>
            )}
          </div>
        </div>

        {/* SLA Alert Banner */}
        {((stats.slaCritical ?? 0) > 0 || (stats.slaWarning ?? 0) > 0) && (
          <div className={cn(
            "flex items-center gap-2 p-2 rounded-lg text-xs",
            (stats.slaCritical ?? 0) > 0 
              ? "bg-destructive/10 text-destructive border border-destructive/20"
              : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
          )}>
            <Timer className="h-4 w-4" />
            <span>
              {(stats.slaCritical ?? 0) > 0 
                ? `${stats.slaCritical} message${(stats.slaCritical ?? 0) > 1 ? 's' : ''} sans réponse depuis +30 min`
                : `${stats.slaWarning} message${(stats.slaWarning ?? 0) > 1 ? 's' : ''} sans réponse depuis +15 min`
              }
            </span>
          </div>
        )}

        {/* Quick stats */}
        <div className="flex gap-2 text-xs">
          <Badge 
            variant={filters.status === 'all' ? 'default' : 'outline'} 
            className="cursor-pointer"
            onClick={() => onFiltersChange({ ...filters, status: 'all' })}
          >
            Tous ({stats.total})
          </Badge>
          <Badge 
            variant={filters.status === 'open' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => onFiltersChange({ ...filters, status: 'open' })}
          >
            Ouverts ({stats.open})
          </Badge>
          <Badge 
            variant={filters.status === 'pending' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => onFiltersChange({ ...filters, status: 'pending' })}
          >
            En attente ({stats.pending})
          </Badge>
        </div>
      </div>

      {/* Search and filters */}
      <div className="p-3 border-b space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-9 h-9"
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={filters.propertyId}
            onValueChange={(value) => onFiltersChange({ ...filters, propertyId: value })}
          >
            <SelectTrigger className="h-8 text-xs flex-1">
              <SelectValue placeholder="Propriété" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les propriétés</SelectItem>
              {properties.map((prop) => (
                <SelectItem key={prop.id} value={prop.id}>
                  {prop.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.channel}
            onValueChange={(value) => onFiltersChange({ ...filters, channel: value as MessageChannel | 'all' })}
          >
            <SelectTrigger className="h-8 text-xs w-28">
              <SelectValue placeholder="Canal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="airbnb">🏠 Airbnb</SelectItem>
              <SelectItem value="booking">🅱️ Booking</SelectItem>
              <SelectItem value="direct">📧 Direct</SelectItem>
              <SelectItem value="vrbo">🏡 VRBO</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 px-2">
                <Filter className="h-4 w-4" />
                {filters.tags.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                    {filters.tags.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="unread-only" 
                    checked={filters.unreadOnly}
                    onCheckedChange={(checked) => 
                      onFiltersChange({ ...filters, unreadOnly: checked as boolean })
                    }
                  />
                  <Label htmlFor="unread-only" className="text-sm">Non lus uniquement</Label>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Tags</Label>
                  <div className="flex flex-wrap gap-1">
                    {allTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={filters.tags.includes(tag) ? 'default' : 'outline'}
                        className="cursor-pointer text-xs"
                        onClick={() => toggleTagFilter(tag)}
                      >
                        {TAG_LABELS[tag]}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Conversation list */}
      <ScrollArea className="flex-1">
        <div className="divide-y">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Aucune conversation trouvée</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedConversationId === conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isSelected,
  onClick,
}) => {
  const { guest, reservation, lastMessagePreview, lastMessageAt, isUnread, isPriority, tags, sla } = conversation;

  const getSLAIndicator = () => {
    if (!sla?.isAwaitingResponse) return null;
    
    if (sla.status === 'critical') {
      return (
        <div className="flex items-center gap-1 text-destructive animate-pulse">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span className="text-[10px] font-medium">{sla.minutesSinceLastGuestMessage}min</span>
        </div>
      );
    }
    
    if (sla.status === 'warning') {
      return (
        <div className="flex items-center gap-1 text-amber-500">
          <Timer className="h-3.5 w-3.5" />
          <span className="text-[10px] font-medium">{sla.minutesSinceLastGuestMessage}min</span>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-3 cursor-pointer transition-colors hover:bg-muted/50',
        isSelected && 'bg-muted',
        isUnread && 'bg-primary/5',
        sla?.status === 'critical' && 'border-l-2 border-l-destructive bg-destructive/5',
        sla?.status === 'warning' && !sla?.status && 'border-l-2 border-l-amber-500 bg-amber-50/50'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Channel icon with SLA ring */}
        <div className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm border relative',
          CHANNEL_COLORS[reservation.channel],
          sla?.status === 'critical' && 'ring-2 ring-destructive ring-offset-1',
          sla?.status === 'warning' && 'ring-2 ring-amber-500 ring-offset-1'
        )}>
          {CHANNEL_ICONS[reservation.channel]}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          {/* Header row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className={cn(
                'font-medium truncate',
                isUnread && 'font-semibold'
              )}>
                {guest.name}
              </span>
              {isPriority && (
                <AlertCircle className="h-3.5 w-3.5 text-destructive flex-shrink-0" />
              )}
              {isUnread && (
                <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {getSLAIndicator()}
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(lastMessageAt, { addSuffix: false, locale: fr })}
              </span>
            </div>
          </div>

          {/* Property name */}
          <p className="text-xs text-muted-foreground truncate">
            {reservation.propertyName}
          </p>

          {/* Message preview */}
          <p className={cn(
            'text-sm truncate',
            isUnread ? 'text-foreground' : 'text-muted-foreground'
          )}>
            {lastMessagePreview}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className={cn('text-[10px] px-1.5 py-0', TAG_COLORS[tag])}
                >
                  {TAG_LABELS[tag]}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  +{tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
