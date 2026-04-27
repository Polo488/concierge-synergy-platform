import { AgentProfile } from '@/types/quality';
import { Star, TrendingDown, TrendingUp, Users, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentRankingTableProps {
  agents: AgentProfile[];
  onSelectAgent: (agentId: string) => void;
}

function ratingClass(rating: number) {
  if (rating >= 4) return 'text-[hsl(var(--status-success))]';
  if (rating >= 3) return 'text-[hsl(var(--status-warning))]';
  return 'text-[hsl(var(--status-error))]';
}

function repasseChip(rate: number) {
  if (rate > 15)
    return 'bg-[hsl(var(--status-error)/0.12)] text-[hsl(var(--status-error))]';
  if (rate > 5)
    return 'bg-[hsl(var(--status-warning)/0.12)] text-[hsl(var(--status-warning))]';
  return 'bg-[hsl(var(--status-success)/0.12)] text-[hsl(var(--status-success))]';
}

export function AgentRankingTable({ agents, onSelectAgent }: AgentRankingTableProps) {
  const sortedAgents = [...agents].sort((a, b) => a.average_rating_overall - b.average_rating_overall);

  return (
    <div className="glass-surface rounded-2xl p-4 md:p-5">
      <div className="flex items-center gap-2 mb-3 md:mb-4">
        <div className="h-7 w-7 rounded-full bg-[hsl(var(--ios-orange)/0.10)] flex items-center justify-center">
          <Users className="h-3.5 w-3.5 text-[hsl(var(--ios-orange))]" strokeWidth={2.2} />
        </div>
        <div>
          <h3 className="text-[15px] md:text-[16px] font-semibold tracking-[-0.015em] text-[hsl(var(--label-1))]">
            Agents par note
          </h3>
          <p className="text-[11px] text-[hsl(240_6%_25%/0.6)] tracking-[-0.005em]">
            Triés par ordre croissant
          </p>
        </div>
      </div>

      <ul className="divide-y divide-[hsl(var(--separator))]">
        {sortedAgents.map((agent, index) => {
          const trendUp = agent.average_rating_last_30_days > agent.average_rating_overall;
          const initials = agent.agent_name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();
          return (
            <li key={agent.agent_id}>
              <button
                onClick={() => onSelectAgent(agent.agent_id)}
                className="w-full flex items-center gap-3 py-3 text-left transition-colors duration-200 hover:bg-[hsl(var(--ios-orange)/0.04)] active:bg-[hsl(var(--ios-orange)/0.08)] rounded-xl px-2 -mx-2"
              >
                <div className="relative h-9 w-9 rounded-full bg-gradient-to-br from-[hsl(var(--ios-orange)/0.18)] to-[hsl(var(--ios-orange)/0.06)] flex items-center justify-center flex-shrink-0 ring-1 ring-[hsl(var(--ios-orange)/0.18)]">
                  <span className="text-[11px] font-semibold text-[hsl(var(--ios-orange))] tracking-tight">
                    {initials}
                  </span>
                  <span className="absolute -top-0.5 -left-0.5 h-4 w-4 rounded-full bg-[hsl(var(--card))] flex items-center justify-center text-[9px] font-semibold text-[hsl(240_6%_25%/0.7)] tabular-nums shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
                    {index + 1}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-[hsl(var(--label-1))] tracking-[-0.01em] truncate">
                    {agent.agent_name}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="inline-flex items-center gap-1 text-[12px] text-[hsl(240_6%_25%/0.6)]">
                      {trendUp ? (
                        <TrendingUp className="h-3 w-3 text-[hsl(var(--status-success))]" strokeWidth={2.2} />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-[hsl(var(--status-error))]" strokeWidth={2.2} />
                      )}
                      <span className="tabular-nums">
                        {agent.average_rating_last_30_days.toFixed(1)} sur 30 j
                      </span>
                    </span>
                    <span className="text-[12px] text-[hsl(240_6%_25%/0.5)] tabular-nums">
                      {agent.tasks_completed_total} tâches
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={cn(
                      'inline-flex items-center gap-0.5 text-[15px] font-semibold tabular-nums tracking-[-0.01em]',
                      ratingClass(agent.average_rating_overall)
                    )}
                  >
                    <Star className="h-3.5 w-3.5 fill-current" strokeWidth={0} />
                    {agent.average_rating_overall.toFixed(1)}
                  </span>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums',
                      repasseChip(agent.repasse_rate)
                    )}
                  >
                    {agent.repasse_rate.toFixed(0)}%
                  </span>
                  <ChevronRight className="h-4 w-4 text-[hsl(240_6%_25%/0.35)]" strokeWidth={2} />
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
