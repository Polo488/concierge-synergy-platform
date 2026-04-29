import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, LogOut, CheckSquare, ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TODAY_CHECKINS, TODAY_CHECKOUTS, TODAY_TASKS, type ActivityItem, type DashboardTask } from '@/mocks/dashboard';

type Tab = 'checkin' | 'checkout' | 'task';

const channelColors = {
  airbnb: { bg: 'rgba(255,90,95,0.18)', text: '#FF5A5F', label: 'Airbnb' },
  booking: { bg: 'rgba(0,53,128,0.28)', text: '#7FB3FF', label: 'Booking' },
  direct: { bg: 'rgba(107,122,232,0.22)', text: '#A5AFEF', label: 'Direct' },
} as const;

function ChannelChip({ channel }: { channel: keyof typeof channelColors }) {
  const c = channelColors[channel];
  return (
    <span className="text-[10px] font-semibold tracking-wide px-1.5 py-0.5 rounded-full" style={{ background: c.bg, color: c.text }}>
      {c.label.toUpperCase()}
    </span>
  );
}

function GuestRow({ item, kind }: { item: ActivityItem; kind: 'in' | 'out' }) {
  const Icon = kind === 'in' ? LogIn : LogOut;
  return (
    <button type="button" className="w-full text-left flex items-center gap-3 px-3 py-3 rounded-[12px] hover:bg-white/[0.04] transition-colors">
      <span className="h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,92,26,0.15)' }}>
        <Icon className="h-4 w-4" strokeWidth={1.5} style={{ color: '#FF5C1A' }} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[14px] font-medium text-white truncate">{item.guestName}</span>
          <ChannelChip channel={item.channel} />
        </div>
        <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-white/55 truncate">
          <Home className="h-3 w-3 flex-shrink-0" strokeWidth={1.5} />
          <span className="truncate">{item.property}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-[14px] tabular-nums font-medium text-white/85">{item.time}</span>
        <ChevronRight className="h-4 w-4 text-white/30" strokeWidth={1.5} />
      </div>
    </button>
  );
}

function TaskRow({ task }: { task: DashboardTask }) {
  return (
    <button type="button" className="w-full text-left flex items-center gap-3 px-3 py-3 rounded-[12px] hover:bg-white/[0.04] transition-colors">
      <span className="h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245,200,66,0.15)' }}>
        <CheckSquare className="h-4 w-4" strokeWidth={1.5} style={{ color: '#F5C842' }} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-medium text-white truncate">{task.title}</div>
        <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-white/55 truncate">
          <Home className="h-3 w-3 flex-shrink-0" strokeWidth={1.5} />
          <span className="truncate">{task.property}</span>
        </div>
      </div>
      <span className="text-[12px] text-white/65 flex-shrink-0">{task.due}</span>
    </button>
  );
}

const TABS: { key: Tab; label: string; count: number }[] = [
  { key: 'checkin', label: 'Check-ins', count: TODAY_CHECKINS.length },
  { key: 'checkout', label: 'Check-outs', count: TODAY_CHECKOUTS.length },
  { key: 'task', label: 'Tâches', count: TODAY_TASKS.length },
];

export function DashboardActivity() {
  const [tab, setTab] = useState<Tab>('checkin');
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div
      className="dashboard-frosted-card rounded-[20px] p-5 sm:p-6"
    >
      <div className="flex items-center justify-between mb-4 gap-2">
        <h3 className="text-[16px] sm:text-[18px] font-semibold text-white">Activité du jour</h3>
        <span className="text-[12px] sm:text-[13px] text-white/55 capitalize truncate">{today}</span>
      </div>

      {/* Segmented control */}
      <div
        className="relative inline-flex p-1 rounded-[14px] mb-4 max-w-full overflow-x-auto"
        style={{ background: 'rgba(255,255,255,0.04)' }}
      >
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'relative px-3 sm:px-4 py-1.5 text-[12.5px] sm:text-[13px] font-medium rounded-[10px] transition-colors whitespace-nowrap z-10',
              tab === t.key ? 'text-white' : 'text-white/50 hover:text-white/80'
            )}
          >
            {tab === t.key && (
              <motion.div
                layoutId="activity-tab-pill"
                className="absolute inset-0 rounded-[10px]"
                style={{ background: 'rgba(255,255,255,0.08)', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            )}
            <span className="relative">
              {t.label} <span className="tabular-nums opacity-60">({t.count})</span>
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-1">
        {tab === 'checkin' && TODAY_CHECKINS.map((it) => <GuestRow key={it.id} item={it} kind="in" />)}
        {tab === 'checkout' && TODAY_CHECKOUTS.map((it) => <GuestRow key={it.id} item={it} kind="out" />)}
        {tab === 'task' && TODAY_TASKS.map((t) => <TaskRow key={t.id} task={t} />)}
      </div>
    </div>
  );
}
