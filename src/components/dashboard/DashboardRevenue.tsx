import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, Tooltip, XAxis } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { REVENUE_7D, REVENUE_TOTAL, REVENUE_DELTA_PCT } from '@/mocks/dashboard';

export function DashboardRevenue() {
  const navigate = useNavigate();
  const positive = REVENUE_DELTA_PCT >= 0;
  const TrendIcon = positive ? TrendingUp : TrendingDown;

  return (
    <button
      type="button"
      onClick={() => navigate('/app/quality-stats')}
      className="dashboard-frosted-card w-full text-left rounded-[20px] p-5 sm:p-6 transition-shadow hover:shadow-lg"
    >
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex-shrink-0 min-w-0">
          <div className="text-[11px] uppercase tracking-[0.06em] font-semibold text-white/50">Revenus 7 derniers jours</div>
          <div
            className="mt-1.5 text-[26px] sm:text-[30px] leading-none font-light tabular-nums text-white"
            style={{ fontFamily: "'Plus Jakarta Sans', -apple-system, system-ui, sans-serif" }}
          >
            {REVENUE_TOTAL.toLocaleString('fr-FR')} €
          </div>
          <div className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium px-2 py-0.5 rounded-full"
               style={{ background: positive ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)', color: positive ? '#4ADE80' : '#F87171' }}>
            <TrendIcon className="h-3 w-3" strokeWidth={2} />
            {positive ? '+' : ''}{REVENUE_DELTA_PCT}%
          </div>
        </div>
        <div className="flex-1 h-[80px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={REVENUE_7D} margin={{ top: 6, right: 4, left: 4, bottom: 0 }}>
              <XAxis dataKey="day" hide />
              <Tooltip
                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                contentStyle={{
                  background: 'rgba(26,26,46,0.92)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 12,
                  fontSize: 12,
                  color: '#fff',
                }}
                labelStyle={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}
                formatter={(v: number) => [`${v.toLocaleString('fr-FR')} €`, 'Revenu']}
                labelFormatter={(_, items) => items?.[0]?.payload?.date ?? ''}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#6B7AE8"
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 4, fill: '#6B7AE8', stroke: '#fff', strokeWidth: 1 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </button>
  );
}
