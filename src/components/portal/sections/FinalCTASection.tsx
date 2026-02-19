import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FinalCTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative py-28 lg:py-40">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.h2
          className="text-3xl sm:text-[2.6rem] font-semibold text-foreground leading-[1.15] tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Ce n'est pas un logiciel bon marché.
          <br />
          <span className="text-muted-foreground">C'est une infrastructure optimisée.</span>
        </motion.h2>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <Button size="lg" className="text-base px-8 h-12 rounded-xl" asChild>
            <Link to="/contact">
              Demander un accès
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-[13px] text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
        >
          {['Sans engagement', 'Démo 30 min', 'Setup 48h'].map((t) => (
            <div key={t} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-primary/40" />
              {t}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
