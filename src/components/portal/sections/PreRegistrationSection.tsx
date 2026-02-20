import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const pmsOptions = [
  'Beds24', 'Guesty', 'Lodgify', 'Hostaway', 'Smoobu',
  'eViivo', 'Avantio', 'Hospitable', 'Manuel / Tableurs', 'Autre',
];

const timelineOptions = [
  'Immédiatement', 'Sous 1 mois', '1–3 mois', '3–6 mois', '6+ mois',
];

interface FormState {
  company: string;
  properties: string;
  pms: string;
  timeline: string;
  country: string;
  email: string;
  phone: string;
}

const initial: FormState = {
  company: '', properties: '', pms: '', timeline: '', country: '', email: '', phone: '',
};

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-[15px]';

export function PreRegistrationSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [form, setForm] = useState<FormState>(initial);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isValid = form.company && form.properties && form.email;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setSubmitted(true);
  };

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  if (submitted) {
    return (
      <section id="pre-register" className="py-28 lg:py-40">
        <div className="max-w-lg mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="w-16 h-16 rounded-full bg-status-success/10 flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              <CheckCircle2 className="w-8 h-8 text-status-success" />
            </motion.div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">Demande reçue</h3>
            <p className="text-muted-foreground text-lg">
              Vos unités seront priorisées lors du déploiement.
              <br />
              Nous vous recontacterons rapidement.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="pre-register" ref={ref} className="py-28 lg:py-40 overflow-hidden">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <motion.p
            className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4"
            initial={{ opacity: 0, x: -16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            Pré-enregistrement
          </motion.p>
          <motion.h2
            className="text-3xl sm:text-[2.4rem] font-semibold text-foreground leading-[1.12] tracking-tight"
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={isInView ? { clipPath: 'inset(0 0% 0 0)' } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            Pré-enregistrez vos biens pour le lancement.
          </motion.h2>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-card rounded-2xl border border-border/50 p-6 sm:p-8 space-y-5"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Row 1 */}
          <div className="grid sm:grid-cols-2 gap-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-foreground mb-2">Nom de l'entreprise *</label>
              <input type="text" value={form.company} onChange={set('company')} placeholder="Acme Stays" className={inputClass} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.35 }}
            >
              <label className="block text-sm font-medium text-foreground mb-2">Nombre de biens *</label>
              <input type="text" value={form.properties} onChange={set('properties')} placeholder="ex. 45" className={inputClass} />
            </motion.div>
          </div>

          {/* Row 2 */}
          <div className="grid sm:grid-cols-2 gap-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-foreground mb-2">PMS / Channel Manager actuel</label>
              <select value={form.pms} onChange={set('pms')} className={inputClass}>
                <option value="">Sélectionner</option>
                {pmsOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.45 }}
            >
              <label className="block text-sm font-medium text-foreground mb-2">Calendrier de migration</label>
              <select value={form.timeline} onChange={set('timeline')} className={inputClass}>
                <option value="">Sélectionner</option>
                {timelineOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </motion.div>
          </div>

          {/* Country */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-medium text-foreground mb-2">Pays</label>
            <input type="text" value={form.country} onChange={set('country')} placeholder="France" className={inputClass} />
          </motion.div>

          {/* Contact */}
          <div className="grid sm:grid-cols-2 gap-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.55 }}
            >
              <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="vous@entreprise.com" className={inputClass} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm font-medium text-foreground mb-2">Téléphone</label>
              <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+33 6 12 34 56 78" className={inputClass} />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.65 }}
          >
            <Button
              type="submit"
              size="lg"
              className="w-full text-[15px] h-12 rounded-xl mt-2"
              disabled={!isValid || submitting}
            >
              {submitting ? 'Envoi en cours…' : 'Demander un accès anticipé'}
              {!submitting && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </motion.div>
        </motion.form>
      </div>
    </section>
  );
}
