
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowUp, ChevronLeft, ChevronRight, Phone, Info,
  Zap, StickyNote, Paperclip, MessageCircle,
  Sparkles, Bot, Image as ImageIcon,
  Key, CheckCircle, FileText, Clock, Star, AlertTriangle,
  Calendar, Copy, Mail, Wrench, X, Users
} from 'lucide-react';
import { 
  Conversation, 
  Message,
  QuickReplyTemplate,
  ConversationStatus,
  ConversationTag,
  TAG_LABELS,
} from '@/types/messaging';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

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

const CHANNEL_LABELS: Record<string, { label: string; color: string }> = {
  airbnb: { label: 'Airbnb', color: '#FF385C' },
  booking: { label: 'Booking', color: '#003580' },
  direct: { label: 'Direct', color: '#16A34A' },
};

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function getNights(checkIn: Date, checkOut: Date): number {
  return Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
}

const QUICK_REPLY_TEMPLATES = [
  {
    id: 'access-code',
    icon: '🔑',
    title: 'Code d\'accès',
    content: 'Le code d\'accès est le [CODE]. La boîte à clés se trouve [EMPLACEMENT].',
  },
  {
    id: 'welcome',
    icon: '✅',
    title: 'Bienvenue',
    content: 'Bonjour [PRÉNOM], bienvenue dans votre logement ! N\'hésitez pas si vous avez des questions.',
  },
  {
    id: 'response-time',
    icon: '🕐',
    title: 'Temps de réponse',
    content: 'Bonjour, je reviens vers vous dans les plus brefs délais.',
  },
  {
    id: 'review',
    icon: '⭐',
    title: 'Demande d\'avis',
    content: 'Nous espérons que votre séjour s\'est bien passé ! Pourriez-vous laisser un avis ?',
  },
  {
    id: 'issue',
    icon: '🔧',
    title: 'Signalement',
    content: 'Je prends note du problème et je reviens vers vous rapidement avec une solution.',
  },
  {
    id: 'checkout',
    icon: '🧹',
    title: 'Instructions départ',
    content: 'Pour votre départ, merci de laisser les clés sur la table et de refermer la porte.',
  },
];

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
  const { toast } = useToast();
  const [messageText, setMessageText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [showInfoSheet, setShowInfoSheet] = useState(false);
  const [showQuickRepliesSheet, setShowQuickRepliesSheet] = useState(false);
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

  const insertQuickReply = (template: { content: string }) => {
    if (!conversation) return;
    let content = template.content;
    content = content.replace('[PRÉNOM]', conversation.guest.firstName);
    content = content.replace('[CODE]', conversation.reservation.accessCode || '****');
    content = content.replace('[EMPLACEMENT]', 'à gauche de la porte');
    setMessageText(content);
    setShowQuickRepliesSheet(false);
    textareaRef.current?.focus();
  };

  const insertLegacyQuickReply = (template: QuickReplyTemplate) => {
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

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copié', description: `${label} copié dans le presse-papier` });
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
  const channelInfo = CHANNEL_LABELS[conversation.reservation.channel];
  const nights = getNights(conversation.reservation.checkIn, conversation.reservation.checkOut);

  return (
    <div className="flex flex-col h-full" style={{ background: '#FFFFFF' }}>
      {/* ===== HEADER ===== */}
      <div className="sticky top-0 z-20" style={{ background: '#FFFFFF', borderBottom: '1px solid #F0F0F0' }}>
        {/* Line 1: Nav + Identity */}
        <div className="flex items-center gap-2.5" style={{ padding: '10px 16px' }}>
          {isMobile && onBack && (
            <button onClick={onBack} className="flex items-center gap-0.5 flex-shrink-0" style={{ color: '#FF5C1A', background: 'none', border: 'none', cursor: 'pointer', minHeight: 44, padding: 0 }}>
              <ChevronLeft size={22} />
              <span style={{ fontSize: 16 }}>Retour</span>
            </button>
          )}

          <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 38, height: 38, background: avatarColor }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>{getInitials(conversation.guest.name)}</span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="truncate" style={{ fontSize: 15, fontWeight: 700, color: '#1A1A2E' }}>{conversation.guest.name}</p>
            <p className="truncate" style={{ fontSize: 12, color: '#8E8E93' }}>{conversation.reservation.propertyName}</p>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={() => setShowInfoSheet(true)} className="flex items-center justify-center rounded-full" style={{ width: 36, height: 36, background: '#F2F2F7', border: 'none', cursor: 'pointer' }}>
              <Info size={18} style={{ color: '#FF5C1A' }} />
            </button>
            <button className="flex items-center justify-center rounded-full" style={{ width: 36, height: 36, background: '#F2F2F7', border: 'none', cursor: 'pointer' }}>
              <Phone size={18} style={{ color: '#1A1A2E' }} />
            </button>
          </div>
        </div>

        {/* Line 2: Status badges */}
        <div className="flex gap-1.5 overflow-x-auto" style={{ padding: '0 16px 10px 64px', scrollbarWidth: 'none' }}>
          <span className="flex items-center gap-1 rounded-full flex-shrink-0 whitespace-nowrap" style={{ padding: '3px 8px', fontSize: 10, fontWeight: 600, background: '#F0FDF4', color: '#15803D' }}>
            <Calendar size={10} />
            Check-in: {format(conversation.reservation.checkIn, 'd MMM', { locale: fr })}
          </span>
          {conversation.tags.slice(0, 2).map(tag => (
            <span key={tag} className="rounded-full flex-shrink-0 whitespace-nowrap" style={{
              padding: '3px 8px', fontSize: 10, fontWeight: 600,
              background: tag === 'urgent' || tag.includes('issue') ? '#FFF0F0' : '#F5F3FF',
              color: tag === 'urgent' || tag.includes('issue') ? '#DC2626' : '#7C3AED',
            }}>
              {TAG_LABELS[tag]}
            </span>
          ))}
        </div>
      </div>

      {/* ===== PROPERTY INFO BANNER ===== */}
      <button onClick={() => setShowInfoSheet(true)} className="flex items-center gap-3 w-full text-left" style={{
        background: '#F8F8F8', borderBottom: '1px solid #F0F0F0', padding: '10px 16px', cursor: 'pointer', border: 'none',
        borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: '#F0F0F0',
      }}>
        <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 40, height: 40, background: '#E5E7EB' }}>
          <MessageCircle size={18} style={{ color: '#9CA3AF' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate" style={{ fontSize: 13, fontWeight: 600, color: '#1A1A2E' }}>{conversation.reservation.propertyName}</span>
            {channelInfo && (
              <span className="rounded-full flex-shrink-0" style={{ padding: '1px 6px', fontSize: 10, fontWeight: 600, background: channelInfo.color + '20', color: channelInfo.color }}>
                {channelInfo.label}
              </span>
            )}
          </div>
          <div className="flex gap-3" style={{ fontSize: 11, color: '#8E8E93', marginTop: 2 }}>
            <span>📅 {format(conversation.reservation.checkIn, 'd MMM', { locale: fr })} → {format(conversation.reservation.checkOut, 'd MMM', { locale: fr })}</span>
            <span>🌙 {nights} nuits</span>
            <span>👤 {conversation.reservation.guests} pers.</span>
          </div>
        </div>
        <ChevronRight size={16} style={{ color: '#C7C7CC', flexShrink: 0 }} />
      </button>

      {/* ===== MESSAGES ZONE ===== */}
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

      {/* ===== QUICK ACTIONS BAR ===== */}
      {isMobile && (
        <div className="flex gap-2 overflow-x-auto" style={{
          background: '#FFFFFF', borderTop: '1px solid #F0F0F0',
          padding: '8px 16px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
        }}>
          {[
            { icon: Key, label: 'Code d\'accès', color: '#FF5C1A', action: () => toast({ title: '🔑 Code d\'accès', description: conversation.reservation.accessCode || '4729' }) },
            { icon: CheckCircle, label: 'Check-in OK', color: '#16A34A', action: () => toast({ title: '✅ Check-in confirmé' }) },
            { icon: FileText, label: 'Instructions', color: '#4F46E5', action: () => setShowInfoSheet(true) },
            { icon: Clock, label: 'Prolonger', color: '#EA580C', action: () => toast({ title: '🕐 Demande de prolongation envoyée' }) },
            { icon: Star, label: 'Demander avis', color: '#F59E0B', action: () => { setMessageText('Nous espérons que votre séjour s\'est bien passé ! Pourriez-vous laisser un avis ?'); textareaRef.current?.focus(); } },
            { icon: AlertTriangle, label: 'Signaler', color: '#DC2626', action: () => toast({ title: '🔧 Signalement ouvert' }) },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="flex items-center gap-1.5 rounded-full flex-shrink-0 whitespace-nowrap"
              style={{
                height: 32, padding: '0 12px', border: '1px solid #EEEEEE',
                background: '#FFFFFF', cursor: 'pointer', fontSize: 12, color: '#1A1A2E',
              }}
            >
              <item.icon size={12} style={{ color: item.color }} />
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* ===== INPUT ZONE ===== */}
      <div style={{
        background: '#FFFFFF', borderTop: '1px solid #F0F0F0',
        padding: '8px 16px',
        paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))',
      }}>
        {isInternalNote && (
          <div className="flex items-center gap-2 mb-2 rounded-lg" style={{ padding: '6px 10px', background: '#FFF7ED', border: '1px solid #FDE68A' }}>
            <StickyNote size={14} style={{ color: '#D97706' }} />
            <span style={{ fontSize: 12, color: '#92400E', fontWeight: 500 }}>Note interne (non visible par le voyageur)</span>
          </div>
        )}

        <div className="flex items-end gap-2">
          {/* Action buttons */}
          <div className="flex gap-1 flex-shrink-0">
            <button onClick={() => setIsInternalNote(!isInternalNote)} className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: '50%', background: '#F2F2F7', border: 'none', cursor: 'pointer' }}>
              <StickyNote size={16} style={{ color: isInternalNote ? '#D97706' : '#8E8E93' }} />
            </button>
            <button className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: '50%', background: '#F2F2F7', border: 'none', cursor: 'pointer' }}>
              <Paperclip size={16} style={{ color: '#8E8E93' }} />
            </button>
            <button onClick={() => setShowQuickRepliesSheet(true)} className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: '50%', background: '#F2F2F7', border: 'none', cursor: 'pointer' }}>
              <Zap size={16} style={{ color: '#F59E0B' }} />
            </button>
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isInternalNote ? 'Note interne...' : 'Message...'}
            rows={1}
            className="flex-1 outline-none resize-none"
            style={{
              minHeight: 36, maxHeight: 100,
              borderRadius: 18, background: '#F2F2F7', border: 'none',
              padding: '8px 14px', fontSize: 14, color: '#1A1A2E', lineHeight: '20px',
            }}
          />

          {/* Send */}
          <button
            onClick={handleSend}
            disabled={!messageText.trim()}
            className="flex items-center justify-center rounded-full flex-shrink-0"
            style={{
              width: 36, height: 36,
              background: messageText.trim() ? '#FF5C1A' : '#F2F2F7',
              border: 'none', cursor: messageText.trim() ? 'pointer' : 'default',
            }}
          >
            <ArrowUp size={18} color={messageText.trim() ? 'white' : '#C7C7CC'} />
          </button>
        </div>
      </div>

      {/* ===== BOTTOM SHEET: INFOS LOGEMENT ===== */}
      <Sheet open={showInfoSheet} onOpenChange={setShowInfoSheet}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-[20px] p-0 overflow-y-auto">
          <div className="flex justify-center pt-3 pb-2">
            <div style={{ width: 40, height: 4, borderRadius: 99, background: '#E5E5EA' }} />
          </div>

          {/* Guest info */}
          <div style={{ padding: 16, borderBottom: '1px solid #F5F5F5' }}>
            <p className="uppercase" style={{ fontSize: 11, fontWeight: 600, color: '#8E8E93', letterSpacing: 0.5, marginBottom: 10 }}>Voyageur</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-full" style={{ width: 52, height: 52, background: avatarColor }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#FFF' }}>{getInitials(conversation.guest.name)}</span>
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#1A1A2E' }}>{conversation.guest.name}</p>
                <p style={{ fontSize: 13, color: '#8E8E93' }}>{conversation.guest.email}</p>
                {channelInfo && (
                  <span className="inline-block rounded-full mt-1" style={{ padding: '2px 8px', fontSize: 10, fontWeight: 600, background: channelInfo.color + '20', color: channelInfo.color }}>
                    {channelInfo.label}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Reservation */}
          <div style={{ padding: 16, borderBottom: '1px solid #F5F5F5' }}>
            <p className="uppercase" style={{ fontSize: 11, fontWeight: 600, color: '#8E8E93', letterSpacing: 0.5, marginBottom: 10 }}>Réservation</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span style={{ fontSize: 13, color: '#8E8E93' }}>Check-in</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1A2E' }}>{format(conversation.reservation.checkIn, 'd MMM yyyy', { locale: fr })}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ fontSize: 13, color: '#8E8E93' }}>Check-out</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1A2E' }}>{format(conversation.reservation.checkOut, 'd MMM yyyy', { locale: fr })}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ fontSize: 13, color: '#8E8E93' }}>Durée</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1A2E' }}>{nights} nuits</span>
              </div>
              <div className="flex justify-between">
                <span style={{ fontSize: 13, color: '#8E8E93' }}>Voyageurs</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1A2E' }}>{conversation.reservation.guests} personnes</span>
              </div>
              <div className="flex justify-between">
                <span style={{ fontSize: 13, color: '#8E8E93' }}>Montant</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1A2E' }}>{conversation.reservation.totalAmount}€</span>
              </div>
              <div className="flex justify-between">
                <span style={{ fontSize: 13, color: '#8E8E93' }}>Réservation</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1A2E' }}>#{conversation.reservation.id.slice(0, 8)}</span>
              </div>
            </div>
          </div>

          {/* Property */}
          <div style={{ padding: 16, borderBottom: '1px solid #F5F5F5' }}>
            <p className="uppercase" style={{ fontSize: 11, fontWeight: 600, color: '#8E8E93', letterSpacing: 0.5, marginBottom: 10 }}>Logement</p>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#1A1A2E', marginBottom: 4 }}>{conversation.reservation.propertyName}</p>
            <p style={{ fontSize: 13, color: '#8E8E93', marginBottom: 12 }}>{conversation.reservation.propertyAddress}</p>
            
            {conversation.reservation.accessCode && (
              <div className="flex items-center justify-between rounded-lg mb-2" style={{ padding: '10px 12px', background: '#F8F8F8' }}>
                <div>
                  <p style={{ fontSize: 11, color: '#8E8E93' }}>Code d'accès</p>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#1A1A2E', letterSpacing: 2 }}>{conversation.reservation.accessCode}</p>
                </div>
                <button onClick={() => handleCopy(conversation.reservation.accessCode || '', 'Code d\'accès')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Copy size={18} style={{ color: '#FF5C1A' }} />
                </button>
              </div>
            )}
            {conversation.reservation.wifiNetwork && (
              <div className="flex items-center justify-between rounded-lg" style={{ padding: '10px 12px', background: '#F8F8F8' }}>
                <div>
                  <p style={{ fontSize: 11, color: '#8E8E93' }}>WiFi: {conversation.reservation.wifiNetwork}</p>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#1A1A2E' }}>{conversation.reservation.wifiPassword}</p>
                </div>
                <button onClick={() => handleCopy(conversation.reservation.wifiPassword || '', 'Mot de passe WiFi')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Copy size={18} style={{ color: '#FF5C1A' }} />
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ padding: 16 }}>
            <p className="uppercase" style={{ fontSize: 11, fontWeight: 600, color: '#8E8E93', letterSpacing: 0.5, marginBottom: 10 }}>Actions</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Phone, label: 'Appeler', color: '#16A34A' },
                { icon: Mail, label: 'Email', color: '#4F46E5' },
                { icon: Wrench, label: 'Problème', color: '#DC2626' },
              ].map(a => (
                <button key={a.label} className="flex flex-col items-center gap-1.5 rounded-xl" style={{ padding: '12px 8px', background: '#F8F8F8', border: 'none', cursor: 'pointer' }}>
                  <a.icon size={20} style={{ color: a.color }} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#1A1A2E' }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          <SheetHeader className="sr-only">
            <SheetTitle>Informations</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      {/* ===== BOTTOM SHEET: QUICK REPLIES ===== */}
      <Sheet open={showQuickRepliesSheet} onOpenChange={setShowQuickRepliesSheet}>
        <SheetContent side="bottom" className="h-[60vh] rounded-t-[20px] p-0 overflow-y-auto">
          <div className="flex justify-center pt-3 pb-2">
            <div style={{ width: 40, height: 4, borderRadius: 99, background: '#E5E5EA' }} />
          </div>
          <div style={{ padding: '0 16px 8px 16px' }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#1A1A2E' }}>Réponses rapides</p>
          </div>
          {QUICK_REPLY_TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => insertQuickReply(t)}
              className="w-full text-left"
              style={{ padding: '14px 16px', borderBottom: '1px solid #F5F5F5', background: '#FFFFFF', border: 'none', cursor: 'pointer', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: '#F5F5F5' }}
            >
              <p style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E' }}>{t.icon} {t.title}</p>
              <p className="truncate" style={{ fontSize: 13, color: '#8E8E93', marginTop: 2 }}>{t.content}</p>
            </button>
          ))}

          {/* Legacy quick replies */}
          {quickReplies.length > 0 && (
            <>
              <div style={{ padding: '12px 16px 8px' }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: 0.5 }}>Templates personnalisés</p>
              </div>
              {quickReplies.map(t => (
                <button
                  key={t.id}
                  onClick={() => insertLegacyQuickReply(t)}
                  className="w-full text-left"
                  style={{ padding: '14px 16px', background: '#FFFFFF', border: 'none', cursor: 'pointer', borderBottom: '1px solid #F5F5F5' }}
                >
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E' }}>{t.name}</p>
                  <p className="truncate" style={{ fontSize: 13, color: '#8E8E93', marginTop: 2 }}>{t.content.substring(0, 60)}...</p>
                </button>
              ))}
            </>
          )}

          <SheetHeader className="sr-only">
            <SheetTitle>Réponses rapides</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
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
          maxWidth: '75%', background: '#FFFBEB', border: '1px solid #FDE68A',
          borderRadius: '18px 18px 4px 18px',
        }}>
          <div className="flex items-center gap-1 mb-1">
            <StickyNote size={12} style={{ color: '#D97706' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#92400E' }}>{message.senderName}</span>
            <span style={{ fontSize: 11, color: '#B45309' }}>{format(message.timestamp, 'HH:mm', { locale: fr })}</span>
          </div>
          <p style={{ fontSize: 14, color: '#78350F', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex mb-1', isTeam ? 'justify-end' : 'justify-start')}>
      <div style={{
        maxWidth: '75%', padding: '10px 14px',
        background: isTeam ? '#FF5C1A' : '#FFFFFF',
        borderRadius: isTeam ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        boxShadow: isTeam ? 'none' : '0 1px 3px rgba(0,0,0,0.08)',
      }}>
        {!isTeam && (
          <div className="flex items-center gap-1.5 mb-0.5">
            <span style={{ fontSize: 11, fontWeight: 600, color: '#8E8E93' }}>{message.senderName}</span>
            <span style={{ fontSize: 11, color: '#C7C7CC' }}>{format(message.timestamp, 'HH:mm', { locale: fr })}</span>
          </div>
        )}
        <p style={{ fontSize: 14, color: isTeam ? '#FFFFFF' : '#1A1A2E', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{message.content}</p>
        {isTeam && (
          <p className="text-right mt-0.5" style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
            {format(message.timestamp, 'HH:mm', { locale: fr })}
            {message.isAutomated && (
              <span className="ml-1 inline-flex items-center gap-0.5"><Sparkles size={9} /> Auto</span>
            )}
          </p>
        )}
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
