import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gauge, Share2, Activity, Target, Sparkles, Zap, Search, FileSpreadsheet, CalendarCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCockpitScore } from '@/data/cockpit-mock';
import { CockpitOverviewTab } from '@/components/cockpit/tabs/OverviewTab';
import { CockpitDiagnosticTab } from '@/components/cockpit/tabs/DiagnosticTab';
import { CockpitCleaningTab } from '@/components/cockpit/tabs/CleaningTab';
import { CockpitChargesTab } from '@/components/cockpit/tabs/ChargesTab';
import { CockpitAuditTab } from '@/components/cockpit/tabs/AuditTab';
import { ShareScoreModal } from '@/components/cockpit/ShareScoreModal';

type TabId = 'overview' | 'diagnostic' | 'cleaning' | 'charges' | 'audit';

const TABS: Array<{ id: TabId; label: string; icon: typeof Gauge; badge?: string }> = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: Gauge },
  { id: 'diagnostic', label: 'Diagnostic', icon: Search },
  { id: 'cleaning', label: 'Ménage', icon: Sparkles },
  { id: 'charges', label: 'Charges réelles', icon: FileSpreadsheet },
  { id: 'audit', label: 'Audit financier', icon: CalendarCheck, badge: 'Offert' },
];

const LEVEL_COLOR: Record<string, string> = {
  critique: 'hsl(0 75% 55%)',
  fragile: 'hsl(20 90% 55%)',
  acceptable: 'hsl(45 95% 55%)',
  solide: 'hsl(140 60% 45%)',
  excellent: 'hsl(160 70% 38%)',
};

export default function CockpitFinancier() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [shareOpen, setShareOpen] = useState(false);
  const [score, setScore] = useState(() => getCockpitScore());

  const onTabChange = (id: TabId) => setActiveTab(id);

  const refreshScore = () => setScore(getCockpitScore());

  return (
    <div className="min-h-screen pb-24">
      <ShareScoreModal open={shareOpen} onOpenChange={setShareOpen} score={score} />

      {/* HEADER */}
      <div className="px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-start gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #FF5C1A, #FF8C42)', boxShadow: '0 8px 24px rgba(255,92,26,0.25)' }}
            >
              <Gauge size={24} className="text-white" strokeWidth={2.4} />
            </div>
            <div>
              <h1 className="text-[22px] sm:text-[28px] font-bold tracking-tight text-[hsl(var(--label-1))]" style={{ fontFamily: '"Plus Jakarta Sans", Inter, sans-serif' }}>
                Cockpit Financier
              </h1>
              <p className="text-[13px] sm:text-[14px] text-[hsl(var(--label-2))]">Pilote la rentabilité de ta conciergerie</p>
            </div>
          </div>
          <button
            onClick={() => setShareOpen(true)}
            className="flex items-center gap-2 h-9 px-3.5 rounded-full bg-[hsl(var(--label-1)/0.06)] hover:bg-[hsl(var(--label-1)/0.10)] text-[13px] font-medium text-[hsl(var(--label-1))] transition-colors"
          >
            <Share2 size={14} /> Partager mon Score
          </button>
        </div>

        {/* Score banner */}
        <div className="rounded-2xl p-4 sm:p-5 mb-4 glass-thin border border-[hsl(var(--hairline))]">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-[12px] uppercase tracking-wider font-semibold text-[hsl(var(--label-2))]">Score Cockpit</span>
              <span className="text-[32px] sm:text-[40px] font-bold tabular-nums leading-none" style={{ color: LEVEL_COLOR[score.level] }}>
                {score.score}
                <span className="text-[16px] text-[hsl(var(--label-3))] font-medium"> / 100</span>
              </span>
              <span
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-white"
                style={{ background: LEVEL_COLOR[score.level] }}
              >
                Niveau {score.levelLabel}
              </span>
            </div>
            <p className="text-[12px] text-[hsl(var(--label-2))]">
              Tu fais mieux que <strong className="text-[hsl(var(--label-1))]">{score.percentile} %</strong> des conciergeries Noé
            </p>
          </div>
          <div className="mt-3 h-2 rounded-full bg-[hsl(var(--label-1)/0.06)] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score.score}%` }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${LEVEL_COLOR[score.level]}, ${LEVEL_COLOR[score.level]}aa)` }}
            />
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="sticky top-0 z-20 bg-[hsl(var(--bg-app))]/85 backdrop-blur-xl border-b border-[hsl(var(--hairline))]">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto scrollbar-none -mx-1 px-1 py-2.5" style={{ scrollbarWidth: 'none' }}>
            {TABS.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-3 sm:px-4 h-9 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all',
                    isActive
                      ? 'text-white shadow-[0_4px_12px_rgba(255,92,26,0.25)]'
                      : 'text-[hsl(var(--label-2))] hover:text-[hsl(var(--label-1))] hover:bg-[hsl(var(--label-1)/0.05)]'
                  )}
                  style={isActive ? { background: '#FF5C1A' } : undefined}
                >
                  {isActive && (
                    <span className="w-4 h-4 rounded-full bg-white/95 flex items-center justify-center text-[10px] font-bold" style={{ color: '#FF5C1A' }}>
                      n
                    </span>
                  )}
                  {!isActive && <tab.icon size={14} />}
                  {tab.label}
                  {tab.badge && (
                    <span
                      className={cn(
                        'px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider',
                        isActive ? 'bg-white/20 text-white' : 'bg-[#FF5C1A]/10 text-[#FF5C1A]'
                      )}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-4 sm:px-6 lg:px-8 pt-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === 'overview' && <CockpitOverviewTab onGoToDiagnostic={() => onTabChange('diagnostic')} />}
            {activeTab === 'diagnostic' && <CockpitDiagnosticTab onGoToCleaning={() => onTabChange('cleaning')} onGoToAudit={() => onTabChange('audit')} onScoreChange={refreshScore} />}
            {activeTab === 'cleaning' && <CockpitCleaningTab onGoToAudit={() => onTabChange('audit')} />}
            {activeTab === 'charges' && <CockpitChargesTab onGoToAudit={() => onTabChange('audit')} onGoToCleaning={() => onTabChange('cleaning')} />}
            {activeTab === 'audit' && <CockpitAuditTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
