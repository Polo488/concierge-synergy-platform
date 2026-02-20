import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Calendar } from 'lucide-react';

// IMPORTANT: Replace with your real calendar link
const CALENDAR_URL = 'https://calendly.com/your-url';

export function DemoBookingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="py-28 lg:py-40">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Private demo
          </p>
          <h2 className="text-3xl sm:text-[2.4rem] font-semibold text-foreground leading-[1.12] tracking-tight">
            Book a Private Walkthrough
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-lg">
            See the infrastructure in action. We'll walk through your specific use case in a 30-minute session.
          </p>
        </motion.div>

        <motion.div
          className="bg-card rounded-2xl border border-border/50 overflow-hidden"
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.12 }}
        >
          {CALENDAR_URL.includes('your-url') ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-14 h-14 rounded-xl bg-primary/8 flex items-center justify-center mb-5">
                <Calendar className="w-7 h-7 text-primary" />
              </div>
              <p className="text-muted-foreground text-[15px]">
                Calendar embed will appear here once configured.
              </p>
              <p className="text-xs text-muted-foreground/60 mt-2">
                Update <code className="font-mono bg-muted px-1.5 py-0.5 rounded">CALENDAR_URL</code> in DemoBookingSection.tsx
              </p>
            </div>
          ) : (
            <iframe
              src={CALENDAR_URL}
              width="100%"
              height="650"
              frameBorder="0"
              title="Book a demo"
              className="w-full"
            />
          )}
        </motion.div>
      </div>
    </section>
  );
}
