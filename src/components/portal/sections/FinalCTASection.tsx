import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FinalCTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-24 lg:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <motion.h2
          className="text-3xl sm:text-4xl font-semibold text-foreground tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Prêt à structurer
          <br />
          <span className="text-muted-foreground">vos opérations ?</span>
        </motion.h2>

        <motion.p
          className="text-muted-foreground mt-4 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          30 minutes pour comprendre comment Noé s'intègre
          à votre infrastructure existante.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Button size="lg" className="text-sm px-8 h-12 rounded-xl" asChild>
            <Link to="/contact">
              Demander un accès
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          className="mt-6 flex items-center gap-6 justify-center text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {['Sans engagement', 'Démo 30 min', 'Setup en 48h'].map((t) => (
            <div key={t} className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-[hsl(152,50%,45%)]" />
              <span>{t}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
