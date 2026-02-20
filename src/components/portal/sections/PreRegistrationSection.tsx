import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const pmsOptions = [
  'Beds24', 'Guesty', 'Lodgify', 'Hostaway', 'Smoobu',
  'eViivo', 'Avantio', 'Hospitable', 'Manual / Spreadsheets', 'Other',
];

const timelineOptions = [
  'Immediately', 'Within 1 month', '1–3 months', '3–6 months', '6+ months',
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
  'w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-[15px]';

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
    // Simulate network delay — replace with real submission later
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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 rounded-full bg-status-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-status-success" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">Application received</h3>
            <p className="text-muted-foreground text-lg">
              Your units will be prioritized during rollout.
              <br />
              We'll be in touch shortly.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="pre-register" ref={ref} className="py-28 lg:py-40">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Pre-registration
          </p>
          <h2 className="text-3xl sm:text-[2.4rem] font-semibold text-foreground leading-[1.12] tracking-tight">
            Pre-register your properties for launch.
          </h2>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-card rounded-2xl border border-border/50 p-6 sm:p-8 space-y-5"
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.12 }}
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Company name *</label>
              <input type="text" value={form.company} onChange={set('company')} placeholder="Acme Stays" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Number of properties *</label>
              <input type="text" value={form.properties} onChange={set('properties')} placeholder="e.g. 45" className={inputClass} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Current PMS / Channel Manager</label>
              <select value={form.pms} onChange={set('pms')} className={inputClass}>
                <option value="">Select</option>
                {pmsOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Migration timeline</label>
              <select value={form.timeline} onChange={set('timeline')} className={inputClass}>
                <option value="">Select</option>
                {timelineOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Country</label>
            <input type="text" value={form.country} onChange={set('country')} placeholder="France" className={inputClass} />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="you@company.com" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
              <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+33 6 12 34 56 78" className={inputClass} />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full text-[15px] h-12 rounded-xl mt-2"
            disabled={!isValid || submitting}
          >
            {submitting ? 'Submitting…' : 'Apply for Early Access'}
            {!submitting && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </motion.form>
      </div>
    </section>
  );
}
