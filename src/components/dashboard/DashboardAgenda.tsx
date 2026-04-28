import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight, FileText, Phone, Wrench, Clock, Home } from 'lucide-react';
import { AGENDA_TODAY, AGENDA_TOMORROW, type AgendaItem } from '@/mocks/dashboard';

const ICONS = { task: FileText, call: Phone, maintenance: Wrench } as const;

function ItemRow({ item }: { item: AgendaItem }) {
  const Icon = ICONS[item.type];
  return (
    <button
      type="button"
      className="w-full text-left flex items-center gap-3 px-2 py-2.5 rounded-[12px] hover:bg-white/[0.03] transition-colors"
    >
      <span
        className="h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.05)' }}
      >
        <Icon className="h-4 w-4 text-white/70" strokeWidth={1.5} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-medium text-white truncate">{item.title}</div>
        <div className="mt-0.5 flex items-center gap-2 text-[12px] text-white/55">
          <Clock className="h-3 w-3" strokeWidth={1.5} />
          <span className="tabular-nums">{item.time}</span>
          {item.propertyCount && (
            <>
              <span className="opacity-50">·</span>
              <Home className="h-3 w-3" strokeWidth={1.5} />
              <span>{item.propertyCount}</span>
            </>
          )}
        </div>
      </div>
    </button>
  );
}

export function DashboardAgenda() {
  const navigate = useNavigate();
  return (
    <div
      className="rounded-[20px] p-5 sm:p-6 h-full flex flex-col backdrop-blur-xl"
      style={{
        background: 'rgba(255,255,255,0.04)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 18px rgba(0,0,0,0.18)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-white/70" strokeWidth={1.5} />
          <h3 className="text-[16px] sm:text-[18px] font-semibold text-white">Agenda</h3>
        </div>
        <button
          onClick={() => navigate('/app/agenda')}
          className="flex items-center gap-0.5 text-[13px] font-medium text-[#FF5C1A] hover:text-[#ff7440] transition-colors"
        >
          Voir tout <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto -mx-2 pr-1">
        <div className="px-2">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#FF5C1A]">Aujourd'hui</span>
            <span className="text-[10.5px] font-bold tabular-nums px-1.5 py-0.5 rounded-full text-[#FF5C1A]" style={{ background: 'rgba(255,92,26,0.15)' }}>
              {AGENDA_TODAY.length}
            </span>
          </div>
          <div className="space-y-0.5">
            {AGENDA_TODAY.map((it) => <ItemRow key={it.id} item={it} />)}
          </div>
        </div>

        <div className="my-3 mx-2 h-px bg-white/[0.06]" />

        <div className="px-2 pb-2">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50">Demain</span>
            <span className="text-[10.5px] font-bold tabular-nums px-1.5 py-0.5 rounded-full text-white/60" style={{ background: 'rgba(255,255,255,0.06)' }}>
              {AGENDA_TOMORROW.length}
            </span>
          </div>
          <div className="space-y-0.5">
            {AGENDA_TOMORROW.map((it) => <ItemRow key={it.id} item={it} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
