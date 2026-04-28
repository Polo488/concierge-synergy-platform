
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, Clock, Pencil, ChevronDown, Filter,
  MessageCircle
} from 'lucide-react';
import { 
  Conversation, 
  MessagingFilters, 
  TAG_LABELS,
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

const CHANNEL_AVATAR_COLORS: Record<string, string> = {
  airbnb: '#FF385C',
  booking: '#003580',
  direct: '#16A34A',
  vrbo: '#6366F1',
  expedia: '#F59E0B',
  email: '#6366F1',
  sms: '#16A34A',
  whatsapp: '#25D366',
};

const CHANNEL_BADGE_LETTER: Record<string, string> = {
  airbnb: 'A',
  booking: 'B',
  direct: 'D',
  vrbo: 'V',
  expedia: 'E',
  email: 'E',
  sms: 'S',
  whatsapp: 'W',
};

const TAG_PILL_STYLES: Record<string, { bg: string; color: string }> = {
  'check-in-issue': { bg: '#FFF0F0', color: '#DC2626' },
  'check-out-issue': { bg: '#FFF0F0', color: '#DC2626' },
  'urgent': { bg: '#FFF0F0', color: '#DC2626' },
  'vip': { bg: '#F5F3FF', color: '#7C3AED' },
  'upsell': { bg: '#F0FDF4', color: '#16A34A' },
  'complaint': { bg: '#FFF0F0', color: '#DC2626' },
  'maintenance': { bg: '#FFF7ED', color: '#EA580C' },
  'cleaning': { bg: '#F0FDF4', color: '#16A34A' },
};

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function formatSLATime(minutes: number | null): string {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  return `${h}h`;
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
    'check-in-issue', 'check-out-issue', 'upsell', 'complaint',
    'maintenance', 'cleaning', 'urgent', 'vip',
  ];

  const toggleTagFilter = (tag: ConversationTag) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    onFiltersChange({ ...filters, tags: newTags });
  };

  const statusFilters: { key: ConversationStatus | 'all'; label: string; count: number }[] = [
    { key: 'all', label: 'Tous', count: stats.total },
    { key: 'open', label: 'Ouverts', count: stats.open },
    { key: 'pending', label: 'En attente', count: stats.pending },
  ];

  return (
    <div className="flex flex-col min-h-full md:h-full" style={{ background: '#FFFFFF', borderRight: '1px solid #F0F0F0' }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 0 16px', borderBottom: '1px solid #F0F0F0' }}>
        {/* Title row */}
        <div className="flex items-center justify-between mb-3">
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1A1A2E' }}>Messages</h2>
          <div className="flex items-center gap-2">
            <button className="flex items-center justify-center rounded-full" style={{ width: 36, height: 36, background: '#FF5C1A' }}>
              <Pencil size={16} color="white" />
            </button>
          </div>
        </div>

        {/* Status filter pills */}
        <div className="flex gap-1.5 pb-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {statusFilters.map(f => {
            const isActive = filters.status === f.key;
            return (
              <button
                key={f.key}
                onClick={() => onFiltersChange({ ...filters, status: f.key })}
                className="flex items-center gap-1.5 rounded-full whitespace-nowrap flex-shrink-0"
                style={{
                  height: 32,
                  padding: '0 14px',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  background: isActive ? '#1A1A2E' : '#F2F2F7',
                  color: isActive ? '#FFFFFF' : '#6B7280',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                {f.label}
                <span className="rounded-full" style={{
                  padding: '1px 6px',
                  fontSize: 11,
                  fontWeight: 700,
                  background: isActive ? 'rgba(255,255,255,0.25)' : '#E5E5EA',
                }}>
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search + filters */}
      <div style={{ padding: '10px 16px' }}>
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={16} style={{ color: '#8E8E93' }} />
          <input
            placeholder="Rechercher..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="w-full outline-none"
            style={{
              height: 36,
              borderRadius: 10,
              background: '#F2F2F7',
              border: 'none',
              padding: '0 12px 0 36px',
              fontSize: 14,
              color: '#1A1A2E',
            }}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filters.propertyId}
            onChange={(e) => onFiltersChange({ ...filters, propertyId: e.target.value })}
            className="flex-1 outline-none appearance-none cursor-pointer"
            style={{
              height: 32, borderRadius: 99, background: '#F2F2F7', border: 'none',
              padding: '0 12px', fontSize: 13, color: '#1A1A2E',
            }}
          >
            <option value="all">Toutes les propriétés</option>
            {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select
            value={filters.channel}
            onChange={(e) => onFiltersChange({ ...filters, channel: e.target.value as MessageChannel | 'all' })}
            className="outline-none appearance-none cursor-pointer"
            style={{
              height: 32, borderRadius: 99, background: '#F2F2F7', border: 'none',
              padding: '0 12px', fontSize: 13, color: '#1A1A2E', width: 100,
            }}
          >
            <option value="all">Canal</option>
            <option value="airbnb">Airbnb</option>
            <option value="booking">Booking</option>
            <option value="direct">Direct</option>
          </select>
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center justify-center rounded-full relative" style={{ width: 32, height: 32, background: '#F2F2F7', border: 'none', cursor: 'pointer' }}>
                <Filter size={14} style={{ color: '#8E8E93' }} />
                {filters.tags.length > 0 && (
                  <span className="absolute -top-1 -right-1 rounded-full flex items-center justify-center" style={{ width: 16, height: 16, background: '#FF5C1A', color: '#FFF', fontSize: 9, fontWeight: 700 }}>
                    {filters.tags.length}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="unread-only" 
                    checked={filters.unreadOnly}
                    onCheckedChange={(checked) => onFiltersChange({ ...filters, unreadOnly: checked as boolean })}
                  />
                  <Label htmlFor="unread-only" className="text-sm">Non lus uniquement</Label>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Tags</Label>
                  <div className="flex flex-wrap gap-1">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTagFilter(tag)}
                        className="rounded-full text-xs px-2 py-0.5 cursor-pointer border"
                        style={{
                          background: filters.tags.includes(tag) ? (TAG_PILL_STYLES[tag]?.bg || '#F2F2F7') : '#F2F2F7',
                          color: filters.tags.includes(tag) ? (TAG_PILL_STYLES[tag]?.color || '#6B7280') : '#6B7280',
                          borderColor: filters.tags.includes(tag) ? 'currentColor' : 'transparent',
                          fontWeight: filters.tags.includes(tag) ? 600 : 400,
                        }}
                      >
                        {TAG_LABELS[tag]}
                      </button>
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
        <div>
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <MessageCircle size={48} style={{ color: '#C7C7CC' }} />
              <p style={{ fontSize: 15, color: '#8E8E93', marginTop: 12 }}>Aucune conversation</p>
            </div>
          ) : (
            conversations.map((conversation, idx) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedConversationId === conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                isLast={idx === conversations.length - 1}
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
  isLast: boolean;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isSelected,
  onClick,
  isLast,
}) => {
  const { guest, reservation, lastMessagePreview, lastMessageAt, isUnread, tags } = conversation;
  const channel = reservation.channel;
  const avatarColor = CHANNEL_AVATAR_COLORS[channel] || '#6366F1';
  const badgeLetter = CHANNEL_BADGE_LETTER[channel] || 'X';

  const timeText = formatDistanceToNow(lastMessageAt, { addSuffix: false, locale: fr });

  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer transition-colors"
      style={{
        padding: '12px 16px',
        background: isSelected ? '#F2F2F7' : isUnread ? '#FFFBF8' : '#FFFFFF',
      }}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: 48, height: 48, background: avatarColor }}
          >
            <span style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>
              {getInitials(guest.name)}
            </span>
          </div>
          {/* Channel badge */}
          <div
            className="absolute flex items-center justify-center rounded-full"
            style={{
              width: 18, height: 18, bottom: 0, right: 0,
              background: avatarColor, border: '2px solid #FFFFFF',
            }}
          >
            <span style={{ fontSize: 8, fontWeight: 700, color: '#FFFFFF' }}>{badgeLetter}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Name + time */}
          <div className="flex items-baseline justify-between gap-2 mb-0.5">
            <span className="truncate flex-1 min-w-0" style={{ fontSize: 15, fontWeight: 600, color: '#1A1A2E' }}>
              {guest.name}
            </span>
            <span className="flex-shrink-0 whitespace-nowrap" style={{
              fontSize: 12,
              color: '#8E8E93',
            }}>
              {timeText}
            </span>
          </div>

          {/* Property */}
          <p className="truncate" style={{ fontSize: 12, color: '#8E8E93', marginBottom: 3 }}>
            {reservation.propertyName}
          </p>

          {/* Preview */}
          <p className="truncate" style={{
            fontSize: 14,
            color: isUnread ? '#1A1A2E' : '#8E8E93',
            fontWeight: isUnread ? 500 : 400,
          }}>
            {lastMessagePreview}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex gap-1 mt-1.5 overflow-hidden flex-nowrap">
              {tags.slice(0, 3).map(tag => {
                const style = TAG_PILL_STYLES[tag] || { bg: '#F2F2F7', color: '#6B7280' };
                return (
                  <span
                    key={tag}
                    className="rounded-full flex-shrink-0 whitespace-nowrap"
                    style={{ padding: '2px 8px', fontSize: 10, fontWeight: 600, background: style.bg, color: style.color }}
                  >
                    {TAG_LABELS[tag]}
                  </span>
                );
              })}
            </div>
          )}

        </div>

        {/* Unread dot */}
        {isUnread && (
          <div className="absolute flex-shrink-0" style={{
            width: 10, height: 10, borderRadius: '50%', background: '#FF5C1A',
            right: 16, top: '50%', transform: 'translateY(-50%)',
          }} />
        )}
      </div>

      {/* Separator */}
      {!isLast && (
        <div style={{ height: 1, background: '#F2F2F7', marginLeft: 76, marginTop: 12 }} />
      )}
    </div>
  );
};
