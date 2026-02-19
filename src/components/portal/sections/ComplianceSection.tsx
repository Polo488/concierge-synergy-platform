import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Shield, AlertTriangle, CheckCircle2, MapPin } from 'lucide-react';

const complianceSteps = [
  { icon: MapPin, label: 'Géolocalisation', desc: 'Identification de la commune' },
  { icon: AlertTriangle, label: 'Analyse réglementaire', desc: 'Règles locales détectées' },
  { icon: Shield, label: 'Score de risque', desc: 'Évaluation en temps réel' },
  { icon: CheckCircle2, label: 'Conformité', desc: 'Statut vérifié' },
];

export function ComplianceSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-wide mb-6"
              style={{ background: 'hsla(270, 40%, 55%, 0.08)', color: 'hsl(var(--nav-experience))' }}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
            >
              CONFORMITÉ
            </motion.div>

            <motion.h2
              className="text-3xl sm:text-4xl font-semibold text-foreground leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Chaque logement,
              <br />
              <span className="text-muted-foreground">conforme et sécurisé.</span>
            </motion.h2>

            <motion.p
              className="text-muted-foreground mt-4 leading-relaxed max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Surveillance réglementaire automatique par commune.
              Score de risque dynamique et alertes proactives
              pour chaque bien du portefeuille.
            </motion.p>
          </div>

          {/* Shield build animation */}
          <div className="relative">
            {/* Shield layers */}
            <div className="flex flex-col gap-3">
              {complianceSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.label}
                    className="glass-panel rounded-xl p-4 flex items-center gap-4"
                    initial={{ opacity: 0, x: 30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: 'hsla(270, 40%, 55%, 0.08)' }}
                    >
                      <Icon className="w-5 h-5 text-[hsl(var(--nav-experience))]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{step.label}</p>
                      <p className="text-xs text-muted-foreground">{step.desc}</p>
                    </div>
                    <motion.div
                      className="w-2 h-2 rounded-full"
                      style={{ background: 'hsl(152, 50%, 45%)' }}
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ delay: 0.6 + i * 0.15, type: 'spring' }}
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* Connection lines between steps */}
            <div className="absolute left-7 top-16 bottom-16 w-px" style={{ background: 'hsla(270, 40%, 55%, 0.15)' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
