import { cn } from '@/lib/utils';
import { MessageCircle, Search, Star, Clock, Send, Paperclip, Smile, MoreHorizontal } from 'lucide-react';

interface Conversation {
  id: string;
  guest: string;
  property: string;
  channel: 'airbnb' | 'booking' | 'whatsapp';
  lastMessage: string;
  time: string;
  unread: boolean;
  priority: boolean;
}

interface Message {
  id: string;
  content: string;
  sender: 'guest' | 'host';
  time: string;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    guest: 'Martin Dupont',
    property: 'Apt. Bellecour',
    channel: 'airbnb',
    lastMessage: 'Parfait, merci pour les informations !',
    time: '10:32',
    unread: true,
    priority: true,
  },
  {
    id: '2',
    guest: 'Sophie Lambert',
    property: 'Studio Confluence',
    channel: 'booking',
    lastMessage: 'À quelle heure puis-je arriver ?',
    time: '09:15',
    unread: true,
    priority: false,
  },
  {
    id: '3',
    guest: 'Pierre Martin',
    property: 'Villa Presqu\'île',
    channel: 'whatsapp',
    lastMessage: 'Le code d\'entrée fonctionne bien.',
    time: 'Hier',
    unread: false,
    priority: false,
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Bonjour ! Je voulais confirmer mon arrivée pour demain à 15h, est-ce que ça vous convient ?',
    sender: 'guest',
    time: '10:28',
  },
  {
    id: '2',
    content: 'Bonjour Martin ! Oui, 15h c\'est parfait. Je vous envoie le code d\'accès par message séparé.',
    sender: 'host',
    time: '10:30',
  },
  {
    id: '3',
    content: 'Parfait, merci pour les informations !',
    sender: 'guest',
    time: '10:32',
  },
];

const channelColors = {
  airbnb: 'bg-channel-airbnb',
  booking: 'bg-channel-booking',
  whatsapp: 'bg-status-success',
};

export function MessagingPreview({ className }: { className?: string }) {
  return (
    <div className={cn("bg-card rounded-2xl border border-border/50 shadow-elevated overflow-hidden", className)}>
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-status-error/60" />
          <div className="w-3 h-3 rounded-full bg-status-warning/60" />
          <div className="w-3 h-3 rounded-full bg-status-success/60" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-xs text-muted-foreground">app.noe-conciergerie.com/messaging</span>
        </div>
      </div>

      <div className="flex h-[320px]">
        {/* Conversation list */}
        <div className="w-56 border-r border-border/50 flex flex-col">
          {/* Search */}
          <div className="p-2 border-b border-border/50">
            <div className="flex items-center gap-2 px-2 py-1.5 bg-muted/50 rounded-lg">
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-2xs text-muted-foreground">Rechercher...</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-around p-2 border-b border-border/50 bg-muted/30">
            <div className="text-center">
              <p className="text-sm font-bold text-foreground">12</p>
              <p className="text-2xs text-muted-foreground">Total</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-status-error">3</p>
              <p className="text-2xs text-muted-foreground">Non lus</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-status-warning">2</p>
              <p className="text-2xs text-muted-foreground">Priorité</p>
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-hidden">
            {mockConversations.map((conv, index) => (
              <div
                key={conv.id}
                className={cn(
                  "px-3 py-2.5 border-b border-border/30 cursor-pointer transition-colors",
                  index === 0 ? "bg-primary/5" : "hover:bg-muted/50"
                )}
              >
                <div className="flex items-start gap-2">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground">
                      {conv.guest.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className={cn("absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card", channelColors[conv.channel])} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-medium text-foreground truncate">{conv.guest}</span>
                      <span className="text-2xs text-muted-foreground">{conv.time}</span>
                    </div>
                    <p className="text-2xs text-muted-foreground truncate">{conv.property}</p>
                    <p className="text-2xs text-muted-foreground truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unread && (
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message thread */}
        <div className="flex-1 flex flex-col">
          {/* Thread header */}
          <div className="px-4 py-2.5 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-foreground">
                  MD
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card bg-channel-airbnb" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Martin Dupont</p>
                <p className="text-2xs text-muted-foreground">Apt. Bellecour • Check-in demain</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded hover:bg-muted transition-colors">
                <Star className="w-4 h-4 text-status-warning" />
              </button>
              <button className="p-1.5 rounded hover:bg-muted transition-colors">
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-hidden p-3 space-y-3 bg-muted/20">
            {mockMessages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.sender === 'host' ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] px-3 py-2 rounded-2xl",
                    msg.sender === 'host'
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-card border border-border/50 text-foreground rounded-bl-md"
                  )}
                >
                  <p className="text-xs">{msg.content}</p>
                  <p className={cn(
                    "text-2xs mt-1",
                    msg.sender === 'host' ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="px-3 py-2 border-t border-border/50">
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded hover:bg-muted transition-colors">
                <Paperclip className="w-4 h-4 text-muted-foreground" />
              </button>
              <div className="flex-1 px-3 py-1.5 bg-muted/50 rounded-full">
                <span className="text-xs text-muted-foreground">Écrire un message...</span>
              </div>
              <button className="p-1.5 rounded hover:bg-muted transition-colors">
                <Smile className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="p-1.5 rounded-full bg-primary text-primary-foreground">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
