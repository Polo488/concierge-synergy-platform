import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TutorialTrigger } from '@/components/tutorial/TutorialTrigger';
import { TutorialButton } from '@/components/tutorial/TutorialButton';
import { LiveMap } from '@/components/dashboard/LiveMap';
import { DashboardKPIs } from '@/components/dashboard/DashboardKPIs';
import { DashboardAgenda } from '@/components/dashboard/DashboardAgenda';
import { DashboardActivity } from '@/components/dashboard/DashboardActivity';
import { DashboardRevenue } from '@/components/dashboard/DashboardRevenue';
import { DASHBOARD_KPIS } from '@/mocks/dashboard';
import '@/styles/dashboard-light.css';

const Dashboard = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    document.title = 'Tableau de bord — Noé';
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div
      className="dashboard-noe min-h-full -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6"
      style={{
        background: 'transparent',
        color: '#fff',
      }}
    >
      <TutorialTrigger moduleId="dashboard" />

      {/* Header */}
      <div data-tutorial="dashboard-header" className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1
            className="text-[24px] sm:text-[32px] font-bold tracking-[-0.02em] text-white"
            style={{ fontFamily: "'Plus Jakarta Sans', -apple-system, system-ui, sans-serif" }}
          >
            Tableau de bord
          </h1>
          <p className="text-[13px] sm:text-[14px] mt-1 text-white/60">
            Vue opérationnelle de votre activité
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <span className="hidden sm:inline text-[14px] sm:text-[16px] text-white/70 capitalize">{dateStr}</span>
          <span
            className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(74,222,128,0.12)', color: '#4ADE80', border: '1px solid rgba(74,222,128,0.25)' }}
          >
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-[#4ADE80]"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1.8, ease: 'easeInOut' }}
            />
            En direct
          </span>
          <TutorialButton moduleId="dashboard" />
        </div>
      </div>

      {/* KPI cards */}
      <div data-tutorial="dashboard-kpi">
        <DashboardKPIs {...DASHBOARD_KPIS} />
      </div>

      {/* Live map + Agenda */}
      <div className="grid gap-4 sm:gap-5 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="h-[380px] sm:h-[420px] lg:h-[520px]">
          <LiveMap />
        </div>
        <div className="h-auto lg:h-[520px]">
          <DashboardAgenda />
        </div>
      </div>

      {/* Activité du jour */}
      <div data-tutorial="dashboard-activity">
        <DashboardActivity />
      </div>

      {/* Revenus mini-courbe */}
      <DashboardRevenue />
    </div>
  );
};

export default Dashboard;
