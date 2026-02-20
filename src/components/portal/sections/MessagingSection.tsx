import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Search, Filter, MessageCircle, Send, Bot, Flag, StickyNote, Zap, Paperclip, CheckCircle2, Clock, CircleDot, AlertTriangle, Timer, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ── Channel config matching real admin CHANNEL_ICONS / CHANNEL_COLORS ── */
const channelConfig = {
  airbnb: { icon: '🏠', color: 'bg-[hsl(0,72%,55%)]/10 border-[hsl(0,72%,55%)]/20', label: 'Airbnb' },
  booking: { icon: '🅱️', color: 'bg-[hsl(217,100%,25%)]/10 border-[hsl(217,100%,25%)]/20', label: 'Booking' },
  direct: { icon: '📧', color: 'bg-[hsl(152,40%,38%)]/10 border-[hsl(152,40%,38%)]/20', label: 'Direct' },
};

const tagConfig: Record<string, { label: string; color: string }> = {
  'check-in-issue': { label: 'Check-in', color: 'bg-[hsl(0,70%,55%)]/10 text-[hsl(0,70%,50%)] border-[hsl(0,70%,55%)]/20' },
  upsell: { label: 'Upsell', color: 'bg-[hsl(152,50%,45%)]/10 text-[hsl(152,50%,40%)] border-[hsl(152,50%,45%)]/20' },
  urgent: { label: 'Urgent', color: 'bg-[hsl(0,70%,55%)]/10 text-[hsl(0,70%,50%)] border-[hsl(0,70%,55%)]/20' },
  vip: { label: 'VIP', color: 'bg-[hsl(35,80%,50%)]/10 text-[hsl(35,80%,45%)] border-[hsl(35,80%,50%)]/20' },
};

/* ── Mock conversations matching ConversationList ── */
const conversations = [
  {
    id: '1',
    guest: 'Sophie Laurent',
    property: 'Studio Vieux-Port',
    channel: 'airbnb' as const,
    lastMessage: 'Bonjour, à quelle heure puis-je arriver ?',
    time: '2 min',
    isUnread: true,
    isPriority: false,
    tags: ['check-in-issue'],
    sla: { status: 'warning', minutes: 18 },
    status: 'open' as const,
  },
  {
    id: '2',
    guest: 'Thomas Renard',
    property: 'T2 Bellecour',
    channel: 'booking' as const,
    lastMessage: 'Le wifi ne fonctionne pas depuis ce matin.',
    time: '15 min',
    isUnread: true,
    isPriority: true,
    tags: ['urgent'],
    sla: { status: 'critical', minutes: 32 },
    status: 'open' as const,
  },
  {
    id: '3',
    guest: 'Marie Dubois',
    property: 'Loft Part-Dieu',
    channel: 'direct' as const,
    lastMessage: 'Merci pour le late check-out !',
    time: '1h',
    isUnread: false,
    isPriority: false,
    tags: ['vip', 'upsell'],
    sla: null,
    status: 'pending' as const,
  },
];

/* ── Mock messages matching MessageThread / MessageBubble ── */
const threadMessages = [
  {
    id: 'm1',
    sender: 'guest',
    senderName: 'Sophie Laurent',
    content: 'Bonjour, à quelle heure puis-je arriver ? Mon vol atterrit à 13h.',
    time: '14:32',
    isAutomated: false,
    isInternal: false,
  },
  {
    id: 'm2',
    sender: 'system',
    senderName: 'Noé',
    content: 'Bonjour Sophie ! Bienvenue au Studio Vieux-Port. Le check-in est possible à partir de 15h. Vous recevrez votre code d\'accès 1h avant l\'arrivée.',
    time: '14:32',
    isAutomated: true,
    automationRule: 'Réponse check-in',
    isInternal: false,
  },
  {
    id: 'm3',
    sender: 'team',
    senderName: 'Noé',
    content: 'Voyageuse VIP — proposer early check-in si dispo confirmée avec ménage.',
    time: '14:33',
    isAutomated: false,
    isInternal: true,
  },
];

export function MessagingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const cardY = useTransform(scrollYProgress, [0, 1], [40, -30]);

  const [selectedConv, setSelectedConv] = useState('1');
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [autoReply, setAutoReply] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    const timers = [
      setTimeout(() => setVisibleMessages(1), 800),
      setTimeout(() => setVisibleMessages(2), 2000),
      setTimeout(() => setVisibleMessages(3), 3500),
      setTimeout(() => setAutoReply(true), 5000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  return (
    <section ref={ref} className="relative py-28 lg:py-40 overflow-hidden" id="messaging">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Text */}
          <div className="order-2 lg:order-1">
            <motion.p
              className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-5"
              initial={{ opacity: 0, x: -16 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              Messagerie
            </motion.p>

            <motion.h2
              className="text-3xl sm:text-[2.5rem] font-semibold text-foreground leading-[1.12] tracking-tight"
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              animate={isInView ? { clipPath: 'inset(0 0% 0 0)' } : {}}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              Le voyageur écrit.
              <br />
              <span className="text-muted-foreground">L'infrastructure répond.</span>
            </motion.h2>

            <motion.p
              className="text-muted-foreground mt-5 leading-relaxed max-w-md text-[15px]"
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Boîte de réception unifiée multi-canal avec SLA en temps réel,
              notes internes, tags contextuels et réponses automatisées.
              Chaque conversation est tracée et qualifiée.
            </motion.p>

            <motion.div
              className="mt-6 space-y-2"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              {['SLA temps réel par conversation', 'Notes internes d\'équipe', 'Réponses automatiques contextuelles'].map((item, i) => (
                <motion.div
                  key={item}
                  className="flex items-center gap-2.5 text-sm text-muted-foreground"
                  initial={{ opacity: 0, x: -12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.55 + i * 0.08 }}
                >
                  <div className="w-1 h-1 rounded-full bg-primary/40" />
                  {item}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Real Messaging UI - Split panel */}
          <motion.div
            className="order-1 lg:order-2 border border-border/40 rounded-2xl overflow-hidden bg-card flex flex-col"
            initial={{ opacity: 0, x: 30, scale: 0.97 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ y: cardY }}
            whileHover={{ boxShadow: '0 20px 60px -15px hsl(var(--primary) / 0.12)' }}
          >
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/30 bg-muted/30">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[hsl(0,70%,55%)]/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-[hsl(35,80%,50%)]/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-[hsl(152,50%,45%)]/50" />
              </div>
              <span className="text-[10px] text-muted-foreground mx-auto">app.noe-conciergerie.com/messaging</span>
            </div>

            <div className="flex min-h-[420px]">
              {/* Conversation list sidebar - matching ConversationList */}
              <div className="w-[200px] border-r border-border/30 flex flex-col bg-background">
                {/* Header */}
                <div className="p-2.5 border-b border-border/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-foreground">Conversations</span>
                    <div className="flex items-center gap-1">
                      <motion.span
                        className="text-[8px] px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium flex items-center gap-0.5 animate-pulse"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.6 }}
                      >
                        <AlertTriangle size={7} /> 1 SLA
                      </motion.span>
                      <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-destructive text-destructive-foreground font-medium">2</span>
                    </div>
                  </div>

                  {/* SLA alert banner */}
                  <motion.div
                    className="flex items-center gap-1.5 p-1.5 rounded-md text-[8px] bg-destructive/10 text-destructive border border-destructive/20 mb-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={isInView ? { opacity: 1, height: 'auto' } : {}}
                    transition={{ delay: 0.8 }}
                  >
                    <Timer size={9} />
                    <span>1 message sans réponse +30 min</span>
                  </motion.div>

                  {/* Filter badges */}
                  <div className="flex gap-1 text-[8px]">
                    <span className="px-1.5 py-0.5 rounded bg-primary text-primary-foreground font-medium">Tous (3)</span>
                    <span className="px-1.5 py-0.5 rounded border border-border/30 text-muted-foreground">Ouverts (2)</span>
                  </div>
                </div>

                {/* Search */}
                <div className="px-2 py-1.5 border-b border-border/20">
                  <div className="flex items-center gap-1.5 bg-muted/30 rounded-md px-2 py-1">
                    <Search size={9} className="text-muted-foreground" />
                    <span className="text-[9px] text-muted-foreground">Rechercher...</span>
                  </div>
                </div>

                {/* Conversation items */}
                <div className="flex-1 overflow-y-auto divide-y divide-border/20">
                  {conversations.map((conv, i) => {
                    const ch = channelConfig[conv.channel];
                    return (
                      <motion.div
                        key={conv.id}
                        className={cn(
                          'p-2 cursor-pointer transition-colors text-left',
                          selectedConv === conv.id && 'bg-muted',
                          conv.isUnread && selectedConv !== conv.id && 'bg-primary/5',
                          conv.sla?.status === 'critical' && 'border-l-2 border-l-destructive bg-destructive/5'
                        )}
                        onClick={() => setSelectedConv(conv.id)}
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.4 + i * 0.1 }}
                      >
                        <div className="flex items-start gap-1.5">
                          {/* Channel icon with SLA ring */}
                          <div className={cn(
                            'w-6 h-6 rounded-full flex items-center justify-center text-[8px] border shrink-0',
                            ch.color,
                            conv.sla?.status === 'critical' && 'ring-1 ring-destructive ring-offset-1',
                            conv.sla?.status === 'warning' && 'ring-1 ring-[hsl(35,80%,50%)] ring-offset-1'
                          )}>
                            {ch.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <div className="flex items-center gap-1 min-w-0">
                                <span className={cn('text-[10px] truncate', conv.isUnread ? 'font-semibold text-foreground' : 'font-medium text-foreground')}>
                                  {conv.guest}
                                </span>
                                {conv.isPriority && <Flag size={8} className="text-destructive shrink-0" />}
                                {conv.isUnread && <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />}
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                {conv.sla?.status === 'critical' && (
                                  <span className="flex items-center gap-0.5 text-destructive animate-pulse">
                                    <AlertTriangle size={7} />
                                    <span className="text-[7px] font-medium">{conv.sla.minutes}min</span>
                                  </span>
                                )}
                                {conv.sla?.status === 'warning' && (
                                  <span className="flex items-center gap-0.5 text-[hsl(35,80%,50%)]">
                                    <Timer size={7} />
                                    <span className="text-[7px] font-medium">{conv.sla.minutes}min</span>
                                  </span>
                                )}
                                <span className="text-[8px] text-muted-foreground">{conv.time}</span>
                              </div>
                            </div>
                            <p className="text-[8px] text-muted-foreground truncate">{conv.property}</p>
                            <p className={cn('text-[9px] truncate mt-0.5', conv.isUnread ? 'text-foreground' : 'text-muted-foreground')}>
                              {conv.lastMessage}
                            </p>
                            {conv.tags.length > 0 && (
                              <div className="flex gap-0.5 mt-1">
                                {conv.tags.map(tag => (
                                  <span key={tag} className={cn('text-[7px] px-1 py-px rounded border', tagConfig[tag]?.color)}>
                                    {tagConfig[tag]?.label}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Message thread - matching MessageThread */}
              <div className="flex-1 flex flex-col bg-background">
                {/* Thread header */}
                <div className="px-3 py-2 border-b border-border/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px]">{channelConfig.airbnb.icon}</span>
                      <div>
                        <p className="text-[11px] font-semibold text-foreground">Sophie Laurent</p>
                        <p className="text-[8px] text-muted-foreground">Studio Vieux-Port</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {/* Status selector */}
                      <span className="text-[8px] px-2 py-0.5 rounded border border-border/30 bg-muted/30 text-muted-foreground flex items-center gap-1">
                        <CircleDot size={7} className="text-[hsl(152,50%,45%)]" /> Ouvert
                      </span>
                      <span className="w-5 h-5 rounded flex items-center justify-center border border-border/30 text-muted-foreground">
                        <Flag size={8} />
                      </span>
                      <span className="text-[8px] px-1.5 py-0.5 rounded border border-border/30 text-muted-foreground">
                        Tags
                      </span>
                    </div>
                  </div>
                  {/* Active tags */}
                  <div className="flex gap-0.5 mt-1.5">
                    <span className={cn('text-[7px] px-1 py-px rounded border', tagConfig['check-in-issue']?.color)}>
                      Check-in
                    </span>
                  </div>
                </div>

                {/* Messages - matching MessageBubble */}
                <div className="flex-1 p-3 space-y-2.5 overflow-y-auto">
                  {threadMessages.map((msg, i) => {
                    if (i >= visibleMessages) return null;
                    const isTeam = msg.sender === 'team' || msg.sender === 'system';
                    const isSystem = msg.sender === 'system';

                    return (
                      <motion.div
                        key={msg.id}
                        className={cn('flex', isTeam ? 'justify-end' : 'justify-start')}
                        initial={{ opacity: 0, y: 12, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className={cn(
                          'max-w-[80%] rounded-lg px-3 py-2',
                          msg.isInternal && 'border-2 border-[hsl(35,80%,50%)]/30 bg-[hsl(35,80%,50%)]/5',
                          !msg.isInternal && isSystem && 'bg-muted border border-dashed border-border/40',
                          !msg.isInternal && !isSystem && isTeam && 'bg-primary text-primary-foreground',
                          !msg.isInternal && !isSystem && !isTeam && 'bg-muted/60 border border-border/30'
                        )}>
                          {/* Header */}
                          <div className="flex items-center gap-1.5 mb-0.5">
                            {msg.isInternal && <StickyNote size={8} className="text-[hsl(35,80%,50%)]" />}
                            {isSystem && <Bot size={8} className="text-muted-foreground" />}
                            <span className={cn(
                              'text-[8px] font-medium',
                              msg.isInternal && 'text-[hsl(35,80%,45%)]',
                              !msg.isInternal && !isSystem && !isTeam && 'text-foreground'
                            )}>
                              {msg.senderName}
                            </span>
                            <span className={cn(
                              'text-[7px]',
                              isTeam && !msg.isInternal && !isSystem ? 'text-primary-foreground/60' : 'text-muted-foreground'
                            )}>
                              {msg.time}
                            </span>
                            {msg.isAutomated && (
                              <span className="text-[6px] px-1 py-px rounded border border-border/30 bg-muted/30 flex items-center gap-0.5 text-muted-foreground">
                                <Sparkles size={6} /> Auto
                              </span>
                            )}
                          </div>
                          <p className={cn(
                            'text-[10px] leading-relaxed',
                            msg.isInternal && 'text-[hsl(35,80%,35%)]',
                          )}>
                            {msg.content}
                          </p>
                          {msg.isAutomated && msg.automationRule && (
                            <p className="text-[7px] text-muted-foreground mt-1 italic">
                              Règle: {msg.automationRule}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Auto-triggered system message */}
                  {autoReply && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="flex justify-center mb-1.5">
                        <span className="text-[7px] px-2 py-0.5 rounded-full bg-primary/8 text-primary font-medium flex items-center gap-1">
                          <Bot size={7} /> Check-in J-1 → Message automatique
                        </span>
                      </div>
                      <div className="flex justify-end">
                        <div className="max-w-[80%] rounded-lg px-3 py-2 bg-primary text-primary-foreground border border-dashed border-primary-foreground/20">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <Bot size={8} className="text-primary-foreground/60" />
                            <span className="text-[8px] font-medium">Noé</span>
                            <span className="text-[6px] px-1 py-px rounded bg-primary-foreground/10 flex items-center gap-0.5">
                              <Sparkles size={6} /> Auto
                            </span>
                          </div>
                          <p className="text-[10px] leading-relaxed">
                            Bonjour Sophie, votre logement est prêt ! Code d'accès : 4827#. Wifi : VieuxPort_5G / mdp : bienvenue2026. Bonne arrivée demain !
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Message input - matching MessageThread input */}
                <div className="p-2 border-t border-border/20">
                  <div className="flex gap-1.5">
                    <div className="flex-1 relative">
                      <div className="min-h-[40px] rounded-md border border-border/30 bg-muted/10 px-2.5 py-2 flex items-center">
                        <span className="text-[9px] text-muted-foreground">Écrire un message...</span>
                        <div className="absolute bottom-1.5 right-1.5 flex gap-0.5">
                          <span className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors">
                            <StickyNote size={9} />
                          </span>
                          <span className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors">
                            <Paperclip size={9} />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="w-7 h-7 rounded-md border border-border/30 flex items-center justify-center text-muted-foreground">
                        <Zap size={10} />
                      </span>
                      <span className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground">
                        <Send size={10} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
