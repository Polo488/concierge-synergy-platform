import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { MessageCircle, Send, Bot } from 'lucide-react';

const existingMessages = [
  { sender: 'guest', name: 'Sophie L.', text: 'Bonjour, à quelle heure puis-je arriver ?', time: '14:32' },
  { sender: 'host', name: 'Noé', text: 'Bonjour Sophie ! Le check-in est possible à partir de 15h. Je vous envoie le code d\'accès par message.', time: '14:32', auto: true },
];

const autoMessages = [
  { trigger: 'Réservation confirmée', delay: 2200, text: 'Bienvenue ! Votre séjour au Studio Vieux-Port est confirmé du 3 au 7 février. Vous recevrez vos instructions d\'accès 24h avant l\'arrivée.', recipient: 'Sophie L.' },
  { trigger: 'Check-in J-1', delay: 4000, text: 'Bonjour Sophie, votre logement est prêt ! Code d\'accès : 4827#. Bonne arrivée demain.', recipient: 'Sophie L.' },
];

export function MessagingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const cardY = useTransform(scrollYProgress, [0, 1], [40, -30]);

  const [visibleAuto, setVisibleAuto] = useState<number[]>([]);

  useEffect(() => {
    if (!isInView) return;
    const timers = autoMessages.map((msg, i) =>
      setTimeout(() => setVisibleAuto(prev => [...prev, i]), msg.delay)
    );
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
              Communications automatisées déclenchées par les événements de réservation.
              Messages de bienvenue, instructions d'accès et suivi post-séjour sans intervention manuelle.
            </motion.p>

            <motion.div
              className="mt-6 space-y-2"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              {['Déclenchement par événement', 'Templates personnalisables', 'Multi-canal unifié'].map((item, i) => (
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

          {/* Messaging UI */}
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
              <span className="text-[10px] text-muted-foreground mx-auto">messagerie · Sophie L. · Studio Vieux-Port</span>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-3 min-h-[240px]">
              {existingMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  className={`flex gap-2 max-w-[85%] ${msg.sender === 'host' ? 'ml-auto flex-row-reverse' : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.15 }}
                >
                  <div className={`px-3 py-2 rounded-xl text-sm ${
                    msg.sender === 'guest'
                      ? 'bg-muted/50 border border-border/30 rounded-tl-sm text-foreground'
                      : 'bg-primary text-primary-foreground rounded-tr-sm'
                  }`}>
                    {msg.auto && (
                      <span className="flex items-center gap-1 text-[9px] opacity-70 mb-1">
                        <Bot size={9} /> Réponse automatique
                      </span>
                    )}
                    <p>{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${msg.sender === 'guest' ? 'text-muted-foreground' : 'text-primary-foreground/60'}`}>
                      {msg.time}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Auto-triggered messages */}
              {autoMessages.map((msg, i) => (
                <motion.div
                  key={`auto-${i}`}
                  initial={{ opacity: 0, y: 16, scale: 0.95 }}
                  animate={visibleAuto.includes(i) ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Event trigger badge */}
                  <div className="flex justify-center mb-2">
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/8 text-primary font-medium flex items-center gap-1">
                      <Bot size={9} />
                      {msg.trigger} → Message automatique
                    </span>
                  </div>
                  <div className="flex gap-2 max-w-[85%] ml-auto flex-row-reverse">
                    <div className="px-3 py-2 rounded-xl rounded-tr-sm bg-primary text-primary-foreground text-sm">
                      <p>{msg.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input bar */}
            <div className="p-3 border-t border-border/30 bg-muted/20">
              <div className="flex items-center gap-2 bg-background rounded-lg px-3 py-2 border border-border/30">
                <MessageCircle size={14} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground flex-1">Écrire un message...</span>
                <Send size={14} className="text-primary/40" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
