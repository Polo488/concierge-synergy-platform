import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, MessageSquare, CheckSquare, type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  label: string;
  value: number;
  Icon: LucideIcon;
  to: string;
  delay?: number;
}

function useCountUp(target: number, duration = 800) {
  const [v, setV] = useState(0);
  const startRef = useRef<number | null>(null);
  useEffect(() => {
    let raf = 0;
    const tick = (t: number) => {
      if (startRef.current == null) startRef.current = t;
      const p = Math.min(1, (t - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

function KpiCard({ label, value, Icon, to, delay = 0 }: KpiCardProps) {
  const navigate = useNavigate();
  const v = useCountUp(value);
  return (
    <motion.button
      type="button"
      onClick={() => navigate(to)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      className={cn(
        'dashboard-kpi-card dashboard-kpi-liquid-glass group relative w-full overflow-hidden text-left h-[124px] sm:h-[140px] rounded-2xl p-6',
        'transition-shadow',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5C1A]/50'
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-[13px] sm:text-[14px] font-semibold text-[#1A1A2E]/85 dark:text-white/90"
          style={{ textShadow: '0 1px 2px rgba(255,255,255,0.45)' }}
        >
          {label}
        </span>
        <Icon
          className="h-4 w-4 text-[#1A1A2E]/75 dark:text-white/80"
          strokeWidth={1.75}
          style={{ filter: 'drop-shadow(0 1px 1px rgba(255,255,255,0.35))' }}
        />
      </div>
      <div
        className="mt-3 sm:mt-4 text-[44px] sm:text-[56px] leading-none font-light tabular-nums tracking-[-0.02em] text-[#1A1A2E] dark:text-white"
        style={{
          fontFamily: "'Plus Jakarta Sans', -apple-system, system-ui, sans-serif",
          textShadow: '0 1px 2px rgba(255,255,255,0.4)',
        }}
      >
        {v}
      </div>
    </motion.button>
  );
}

export function DashboardKPIs({
  checkInsToday, checkOutsToday, unreadMessages, openTasks,
}: {
  checkInsToday: number; checkOutsToday: number; unreadMessages: number; openTasks: number;
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <KpiCard label="Check-ins" value={checkInsToday} Icon={LogIn} to="/app/calendar" delay={0} />
      <KpiCard label="Check-outs" value={checkOutsToday} Icon={LogOut} to="/app/calendar" delay={0.05} />
      <KpiCard label="Messages" value={unreadMessages} Icon={MessageSquare} to="/app/messaging" delay={0.1} />
      <KpiCard label="Tâches" value={openTasks} Icon={CheckSquare} to="/app/cleaning" delay={0.15} />
    </div>
  );
}
