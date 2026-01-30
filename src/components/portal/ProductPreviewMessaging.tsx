import { cn } from '@/lib/utils';
import { MessageCircle, Send, Paperclip } from 'lucide-react';

export function ProductPreviewMessaging({ className }: { className?: string }) {
  const messages = [
    { sender: 'guest', name: 'Sophie L.', text: 'Bonjour, à quelle heure puis-je arriver ?', time: '14:32' },
    { sender: 'host', name: 'Vous', text: 'Bonjour Sophie ! Le check-in est possible à partir de 15h. Je vous envoie le code d\'accès par message.', time: '14:35' },
    { sender: 'guest', name: 'Sophie L.', text: 'Parfait, merci beaucoup ! Nous arriverons vers 16h.', time: '14:38' },
  ];

  return (
    <div className={cn('bg-card rounded-xl border border-border/50 overflow-hidden shadow-lg flex flex-col', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">SL</span>
          </div>
          <div>
            <span className="text-sm font-semibold text-foreground">Sophie L.</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Studio Vieux-Port</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
              <span className="text-xs text-muted-foreground">Airbnb</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[hsl(152,50%,45%)]" />
          <span className="text-xs text-muted-foreground">En ligne</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-3 bg-muted/10">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              'flex gap-2 max-w-[85%]',
              msg.sender === 'host' && 'ml-auto flex-row-reverse'
            )}
          >
            <div className={cn(
              'px-3 py-2 rounded-xl',
              msg.sender === 'guest' 
                ? 'bg-card border border-border/50 rounded-tl-sm' 
                : 'bg-primary text-primary-foreground rounded-tr-sm'
            )}>
              <p className="text-sm">{msg.text}</p>
              <p className={cn(
                'text-[10px] mt-1',
                msg.sender === 'guest' ? 'text-muted-foreground' : 'text-primary-foreground/70'
              )}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border/50 bg-card">
        <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
          <Paperclip size={16} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Écrire un message..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            disabled
          />
          <Send size={16} className="text-primary" />
        </div>
      </div>
    </div>
  );
}
