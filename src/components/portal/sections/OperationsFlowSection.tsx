import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, Wrench, FileText, MessageSquare } from 'lucide-react';

const operations = [
  {
    icon: Calendar,
    title: 'Planification ménages',
    description: 'Attribution automatique des tâches de nettoyage selon les check-in/check-out.',
    simulation: ['Check-out 11h → T2 Bellecour', 'Assignation → Marie L.', 'Durée estimée → 1h30', 'Check-in 16h confirmé'],
  },
  {
    icon: Wrench,
    title: 'Routage maintenance',
    description: 'Incidents signalés, qualifiés et routés vers le bon technicien.',
    simulation: ['Signalement → Fuite robinet', 'Priorité → Moyenne', 'Assignation → Tech. Plomberie', 'Intervention → J+1'],
  },
  {
    icon: FileText,
    title: 'Génération factures',
    description: 'Facturation automatique à partir des données de réservation.',
    simulation: ['Réservation #2847', 'Montant → 892,00€', 'Commission → 178,40€', 'Facture générée ✓'],
  },
  {
    icon: MessageSquare,
    title: 'Workflows messaging',
    description: 'Messages automatiques déclenchés par les événements opérationnels.',
    simulation: ['Réservation confirmée', '→ Message bienvenue J-3', '→ Instructions check-in J-1', '→ Avis check-out J+1'],
  },
];

function OperationCard({ op, index, isVisible }: { op: typeof operations[0]; index: number; isVisible: boolean }) {
  const Icon = op.icon;

  return (
    <motion.div
      className="glass-panel rounded-2xl p-6 group cursor-default relative overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.15 * index, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'hsla(220, 70%, 50%, 0.08)' }}
        >
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-sm">{op.title}</h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{op.description}</p>
        </div>
      </div>

      {/* Simulation terminal */}
      <div className="mt-4 rounded-lg p-3 space-y-1" style={{ background: 'hsla(220, 20%, 8%, 0.04)' }}>
        {op.simulation.map((line, i) => (
          <motion.div
            key={i}
            className="text-[11px] font-mono text-muted-foreground"
            initial={{ opacity: 0, x: -8 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.15 + i * 0.12 }}
          >
            {line}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export function OperationsFlowSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-wide mb-6"
            style={{ background: 'hsla(152, 45%, 45%, 0.08)', color: 'hsl(var(--status-success))' }}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
          >
            FLUX OPÉRATIONNELS
          </motion.div>

          <motion.h2
            className="text-3xl sm:text-4xl font-semibold text-foreground leading-tight tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Chaque opération,
            <br />
            <span className="text-muted-foreground">automatisée et tracée.</span>
          </motion.h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {operations.map((op, i) => (
            <OperationCard key={op.title} op={op} index={i} isVisible={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
