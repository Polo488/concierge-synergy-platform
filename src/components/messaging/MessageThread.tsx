
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { 
  ArrowUp, ChevronLeft, Phone, Video, Info,
  Zap, StickyNote, Paperclip, MessageCircle,
  Sparkles, Bot, Image as ImageIcon
} from 'lucide-react';
import { 
  Conversation, 
  Message,
  QuickReplyTemplate,
  ConversationStatus,
  ConversationTag,
  TAG_LABELS,
  TAG_COLORS,
} from '@/types/messaging';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

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

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

interface MessageThreadProps {
  conversation: Conversation | null;
  quickReplies: QuickReplyTemplate[];
  onSendMessage: (conversationId: string, content: string, isInternal: boolean) => void;
  onUpdateStatus: (conversationId: string, status: ConversationStatus) => void;
  onToggleTag: (conversationId: string, tag: ConversationTag) => void;
  onTogglePriority: (conversationId: string) => void;
  onBack?: () => void;
  isMobile?: boolean;
}

export const MessageThread: React.FC<MessageThreadProps> = ({
  conversation,
  quickReplies,
  onSendMessage,
  onUpdateStatus,
  onToggleTag,
  onTogglePriority,
  onBack,
  isMobile,
}) => {
  const [messageText, setMessageText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const handleSend = () => {
    if (!conversation || !messageText.trim()) return;
    onSendMessage(conversation.id, messageText, isInternalNote);
    setMessageText('');
    setIsInternalNote(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertQuickReply = (template: QuickReplyTemplate) => {
    if (!conversation) return;
    let content = template.content;
    content = content.replace('{{guest_first_name}}', conversation.guest.firstName);
    content = content.replace('{{property_address}}', conversation.reservation.propertyAddress);
    content = content.replace('{{access_code}}', conversation.reservation.accessCode || 'N/A');
    content = content.replace('{{wifi_network}}', conversation.reservation.wifiNetwork || 'N/A');
    content = content.replace('{{wifi_password}}', conversation.reservation.wifiPassword || 'N/A');
    setMessageText(content);
    textareaRef.current?.focus();
  };

  // Empty state
  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full" style={{ background: '#F2F2F7' }}>
        <MessageCircle size={48} style={{ color: '#C7C7CC' }} />
        <p style={{ fontSize: 15, color: '#8E8E93', marginTop: 12 }}>Sélectionnez une conversation</p>
      </div>
    );
  }

  const avatarColor = CHANNEL_AVATAR_COLORS[conversation.reservation.channel] || '#6366F1';

  return (
    <div className="flex flex-col h-full" style={{ background: '#FFFFFF' }}>
      {/* Header */}
      <div className="flex items-center gap-3 sticky top-0 z-10" style={{
        background: '#FFFFFF', borderBottom: '1px solid #F0F0F0', padding: '12px 16px',
      }}>
        {/* Back button (mobile) */}
        {isMobile && onBack && (
          <button onClick={onBack} className="flex items-center gap-0.5 flex-shrink-0" style={{ color: '#FF5C1A', background: 'none', border: 'none', cursor: 'pointer' }}>
            <ChevronLeft size={24} />
            <span style={{ fontSize: 16 }}>Retour</span>
          </button>
        )}

        {/* Avatar */}
        <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 40, height: 40, background: avatarColor }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>{getInitials(conversation.guest.name)}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="truncate" style={{ fontSize: 15, fontWeight: 600, color: '#1A1A2E' }}>{conversation.guest.name}</p>
          <p className="truncate" style={{ fontSize: 12, color: '#8E8E93' }}>{conversation.reservation.propertyName}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-5 flex-shrink-0">
          <Phone size={22} style={{ color: '#FF5C1A', cursor: 'pointer' }} />
          {!isMobile && <Video size={22} style={{ color: '#FF5C1A', cursor: 'pointer' }} />}
          <Info size={22} style={{ color: '#FF5C1A', cursor: 'pointer' }} />
        </div>
      </div>

      {/* Messages zone */}
      <ScrollArea className="flex-1" style={{ background: '#F2F2F7' }}>
        <div className="flex flex-col gap-1 p-4">
          {conversation.messages.map((message, idx) => {
            const prevMsg = idx > 0 ? conversation.messages[idx - 1] : null;
            const showTimestamp = !prevMsg || 
              (message.timestamp.getTime() - prevMsg.timestamp.getTime() > 10 * 60 * 1000);

            return (
              <React.Fragment key={message.id}>
                {showTimestamp && (
                  <p className="text-center my-2" style={{ fontSize: 11, color: '#8E8E93' }}>
                    {format(message.timestamp, "d MMM 'à' HH:mm", { locale: fr })}
                  </p>
                )}
                <MessageBubble message={message} />
              </React.Fragment>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input zone */}
      <div style={{
        background: '#FFFFFF', borderTop: '1px solid #F0F0F0',
        padding: '10px 16px', paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 0px))',
      }}>
        {isInternalNote && (
          <div className="flex items-center gap-2 mb-2 rounded-lg" style={{ padding: '6px 10px', background: '#FFF7ED', border: '1px solid #FDE68A' }}>
            <StickyNote size={14} style={{ color: '#D97706' }} />
            <span style={{ fontSize: 12, color: '#92400E', fontWeight: 500 }}>Note interne (non visible par le voyageur)</span>
          </div>
        )}

        <div className="flex items-end gap-2">
          {/* Quick actions */}
          <div className="flex gap-1 flex-shrink-0">
            <button onClick={() => setIsInternalNote(!isInternalNote)} className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: '50%', background: 'none', border: 'none', cursor: 'pointer' }}>
              <StickyNote size={20} style={{ color: isInternalNote ? '#D97706' : '#8E8E93' }} />
            </button>
            <button className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: '50%', background: 'none', border: 'none', cursor: 'pointer' }}>
              <Paperclip size={20} style={{ color: '#8E8E93' }} />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: '50%', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Zap size={20} style={{ color: '#8E8E93' }} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Réponses rapides</div>
                {quickReplies.map(template => (
                  <DropdownMenuItem key={template.id} onClick={() => insertQuickReply(template)}>
                    <div>
                      <p className="font-medium text-sm">{template.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{template.content.substring(0, 50)}...</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Text input */}
          <textarea
            ref={textareaRef}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isInternalNote ? "Note interne..." : "Message..."}
            rows={1}
            className="flex-1 outline-none resize-none"
            style={{
              minHeight: 36, maxHeight: 120,
              borderRadius: 18, background: '#F2F2F7', border: 'none',
              padding: '8px 14px', fontSize: 14, color: '#1A1A2E',
              lineHeight: '20px',
            }}
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!messageText.trim()}
            className="flex items-center justify-center rounded-full flex-shrink-0 transition-opacity"
            style={{
              width: 36, height: 36,
              background: messageText.trim() ? '#FF5C1A' : '#C7C7CC',
              border: 'none', cursor: messageText.trim() ? 'pointer' : 'default',
            }}
          >
            <ArrowUp size={18} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Message bubble component
const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isTeam = message.sender === 'team' || message.sender === 'system';
  const isSystem = message.sender === 'system';
  const isInternal = message.isInternal;

  if (isSystem) {
    return (
      <div className="flex justify-center my-1">
        <div className="rounded-full px-3 py-1 flex items-center gap-1" style={{ background: '#E5E5EA' }}>
          <Bot size={12} style={{ color: '#8E8E93' }} />
          <span style={{ fontSize: 12, color: '#8E8E93' }}>{message.content}</span>
        </div>
      </div>
    );
  }

  if (isInternal) {
    return (
      <div className="flex justify-end mb-1">
        <div className="rounded-2xl px-3.5 py-2.5" style={{
          maxWidth: '75%',
          background: '#FFFBEB', border: '1px solid #FDE68A',
          borderRadius: '18px 18px 4px 18px',
        }}>
          <div className="flex items-center gap-1 mb-1">
            <StickyNote size={12} style={{ color: '#D97706' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#92400E' }}>{message.senderName}</span>
            <span style={{ fontSize: 11, color: '#B45309' }}>
              {format(message.timestamp, 'HH:mm', { locale: fr })}
            </span>
          </div>
          <p style={{ fontSize: 14, color: '#78350F', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex mb-1', isTeam ? 'justify-end' : 'justify-start')}>
      <div style={{
        maxWidth: '75%',
        padding: '10px 14px',
        background: isTeam ? '#FF5C1A' : '#FFFFFF',
        borderRadius: isTeam ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        boxShadow: isTeam ? 'none' : '0 1px 3px rgba(0,0,0,0.08)',
      }}>
        {/* Sender name for guest messages */}
        {!isTeam && (
          <div className="flex items-center gap-1.5 mb-0.5">
            <span style={{ fontSize: 11, fontWeight: 600, color: '#8E8E93' }}>{message.senderName}</span>
            <span style={{ fontSize: 11, color: '#C7C7CC' }}>
              {format(message.timestamp, 'HH:mm', { locale: fr })}
            </span>
          </div>
        )}

        <p style={{
          fontSize: 14,
          color: isTeam ? '#FFFFFF' : '#1A1A2E',
          lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
        }}>
          {message.content}
        </p>

        {/* Time for team messages */}
        {isTeam && (
          <p className="text-right mt-0.5" style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
            {format(message.timestamp, 'HH:mm', { locale: fr })}
            {message.isAutomated && (
              <span className="ml-1 inline-flex items-center gap-0.5">
                <Sparkles size={9} /> Auto
              </span>
            )}
          </p>
        )}

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {message.attachments.map(att => (
              <div key={att.id} className="flex items-center gap-1 rounded-lg px-2 py-1" style={{ background: isTeam ? 'rgba(255,255,255,0.2)' : '#F2F2F7', fontSize: 12 }}>
                {att.type === 'image' ? <ImageIcon size={12} /> : <Paperclip size={12} />}
                <span style={{ color: isTeam ? '#FFFFFF' : '#1A1A2E' }}>{att.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
