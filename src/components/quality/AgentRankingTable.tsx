
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AgentProfile } from '@/types/quality';
import { Star, TrendingDown, TrendingUp, Eye, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentRankingTableProps {
  agents: AgentProfile[];
  onSelectAgent: (agentId: string) => void;
}

export function AgentRankingTable({ agents, onSelectAgent }: AgentRankingTableProps) {
  // Sort by rating ascending (worst first)
  const sortedAgents = [...agents].sort((a, b) => 
    a.average_rating_overall - b.average_rating_overall
  );

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-500';
    if (rating >= 4) return 'text-lime-500';
    if (rating >= 3.5) return 'text-yellow-500';
    if (rating >= 3) return 'text-orange-500';
    return 'text-red-500';
  };

  const getRepasseBadgeVariant = (rate: number): 'default' | 'secondary' | 'destructive' => {
    if (rate > 15) return 'destructive';
    if (rate > 5) return 'secondary';
    return 'default';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Agents par note (croissant)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead className="text-center">Note globale</TableHead>
                <TableHead className="text-center">Note 30j</TableHead>
                <TableHead className="text-center">Repasse</TableHead>
                <TableHead className="text-center">Tâches</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAgents.map((agent, index) => (
                <TableRow key={agent.agent_id} className="hover:bg-muted/50">
                  <TableCell className="font-medium text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {agent.agent_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{agent.agent_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className={cn("h-4 w-4", getRatingColor(agent.average_rating_overall))} />
                      <span className={cn("font-semibold", getRatingColor(agent.average_rating_overall))}>
                        {agent.average_rating_overall.toFixed(1)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      {agent.average_rating_last_30_days > agent.average_rating_overall ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className="text-sm">
                        {agent.average_rating_last_30_days.toFixed(1)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getRepasseBadgeVariant(agent.repasse_rate)}>
                      {agent.repasse_rate.toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-sm text-muted-foreground">
                    {agent.tasks_completed_total}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onSelectAgent(agent.agent_id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
