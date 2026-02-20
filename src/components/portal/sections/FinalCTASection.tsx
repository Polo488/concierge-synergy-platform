import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FinalCTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [30, -20]);

  return (
    <section ref={ref} className="relative py-28 lg:py-40 overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div style={{ y }}>
          <motion.h2
            className="text-3xl sm:text-[2.5rem] font-semibold text-foreground leading-[1.12] tracking-tight"
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={isInView ? { clipPath: 'inset(0 0% 0 0)' } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            Ce n'est pas un logiciel bon marché.
            <br />
            <span className="text-muted-foreground">C'est une infrastructure optimisée.</span>
          </motion.h2>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Button size="lg" className="text-[15px] px-8 h-12 rounded-xl" asChild>
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
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {['Sans engagement', 'Démo 30 min', 'Setup 48h'].map((t, i) => (
              <motion.div
                key={t}
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.7 + i * 0.1 }}
              >
                <div className="w-1 h-1 rounded-full bg-primary/30" />
                {t}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
