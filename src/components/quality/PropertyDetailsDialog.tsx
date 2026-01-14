
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PropertyQualityStats, CleaningTaskExtended, QualityTag } from '@/types/quality';
import { Star, TrendingUp, TrendingDown, Clock, AlertTriangle, User, Calendar, Building } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

interface AgentPerformanceOnProperty {
  agent_id: string;
  agent_name: string;
  average_rating: number;
  rework_rate: number;
  on_time_rate: number;
  tasks_count: number;
}

interface PropertyDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stats: PropertyQualityStats | undefined;
  tasks: CleaningTaskExtended[];
  agentPerformance: AgentPerformanceOnProperty[];
  portfolioAverageRating: number;
}

const TAG_LABELS: Record<QualityTag, string> = {
  dust: 'Poussière',
  bathroom: 'Salle de bain',
  linen: 'Linge',
  kitchen: 'Cuisine',
  smell: 'Odeur',
  floors: 'Sols',
  missing_items: 'Objets manquants',
  windows: 'Vitres',
  appliances: 'Électroménager',
  general: 'Général',
};

export function PropertyDetailsDialog({
  open,
  onOpenChange,
  stats,
  tasks,
  agentPerformance,
  portfolioAverageRating,
}: PropertyDetailsDialogProps) {
  if (!stats) return null;

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-500';
    if (rating >= 4) return 'text-lime-500';
    if (rating >= 3.5) return 'text-yellow-500';
    if (rating >= 3) return 'text-orange-500';
    return 'text-red-500';
  };

  // Calculate tag frequency for this property
  const tagFrequency: Record<string, number> = {};
  tasks.forEach(task => {
    task.quality_tags.forEach(tag => {
      tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
    });
  });
  const sortedTags = Object.entries(tagFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Prepare rating trend data for this property
  const ratingTrendData = tasks
    .filter(t => t.manager_rating)
    .sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date))
    .map(t => ({
      date: format(parseISO(t.scheduled_date), 'dd/MM', { locale: fr }),
      rating: t.manager_rating,
    }));

  const benchmarkDiff = stats.average_cleaning_rating_overall - portfolioAverageRating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            {stats.property_name}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-6 pr-4">
            {/* KPIs Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Star className={cn("h-5 w-5", getRatingColor(stats.average_cleaning_rating_overall))} />
                    <span className={cn("text-2xl font-bold", getRatingColor(stats.average_cleaning_rating_overall))}>
                      {stats.average_cleaning_rating_overall.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Note globale</p>
                  <div className="flex items-center gap-1 mt-1">
                    {benchmarkDiff >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={cn("text-xs", benchmarkDiff >= 0 ? "text-green-500" : "text-red-500")}>
                      {benchmarkDiff >= 0 ? '+' : ''}{benchmarkDiff.toFixed(2)} vs portfolio
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Star className={cn("h-5 w-5", getRatingColor(stats.average_cleaning_rating_last_30_days))} />
                    <span className={cn("text-2xl font-bold", getRatingColor(stats.average_cleaning_rating_last_30_days))}>
                      {stats.average_cleaning_rating_last_30_days.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Note 30 derniers jours</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={cn("h-5 w-5", stats.rework_rate > 10 ? "text-red-500" : "text-green-500")} />
                    <span className="text-2xl font-bold">{stats.rework_rate.toFixed(1)}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Taux de reprise</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Clock className={cn("h-5 w-5", stats.on_time_rate >= 90 ? "text-green-500" : "text-orange-500")} />
                    <span className="text-2xl font-bold">{stats.on_time_rate.toFixed(0)}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Ponctualité</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="history" className="w-full">
              <TabsList>
                <TabsTrigger value="history">Historique</TabsTrigger>
                <TabsTrigger value="agents">Performance agents</TabsTrigger>
                <TabsTrigger value="issues">Problèmes fréquents</TabsTrigger>
              </TabsList>

              <TabsContent value="history" className="mt-4">
                {/* Rating trend chart */}
                {ratingTrendData.length > 0 && (
                  <Card className="mb-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Évolution des notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={ratingTrendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" fontSize={10} />
                            <YAxis domain={[1, 5]} fontSize={10} />
                            <Tooltip />
                            <Line 
                              type="monotone" 
                              dataKey="rating" 
                              stroke="hsl(var(--primary))" 
                              strokeWidth={2}
                              dot={{ fill: 'hsl(var(--primary))' }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Tasks history table */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Historique des missions ({tasks.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Agent</TableHead>
                          <TableHead className="text-center">Note</TableHead>
                          <TableHead>Tags</TableHead>
                          <TableHead>Commentaire</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tasks.slice(0, 20).map(task => (
                          <TableRow key={task.id}>
                            <TableCell className="text-sm">
                              {format(parseISO(task.scheduled_date), 'dd/MM/yyyy', { locale: fr })}
                            </TableCell>
                            <TableCell className="text-sm">{task.assigned_agent_name}</TableCell>
                            <TableCell className="text-center">
                              {task.manager_rating && (
                                <div className="flex items-center justify-center gap-1">
                                  <Star className={cn("h-3 w-3", getRatingColor(task.manager_rating))} />
                                  <span className={cn("text-sm font-medium", getRatingColor(task.manager_rating))}>
                                    {task.manager_rating}
                                  </span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {task.quality_tags.slice(0, 2).map(tag => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {TAG_LABELS[tag]}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground max-w-32 truncate">
                              {task.rating_comment || '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="agents" className="mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Performance des agents sur cette propriété
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Agent</TableHead>
                          <TableHead className="text-center">Note moyenne</TableHead>
                          <TableHead className="text-center">Reprises</TableHead>
                          <TableHead className="text-center">Ponctualité</TableHead>
                          <TableHead className="text-center">Missions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {agentPerformance.map(agent => (
                          <TableRow key={agent.agent_id}>
                            <TableCell className="font-medium">{agent.agent_name}</TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Star className={cn("h-4 w-4", getRatingColor(agent.average_rating))} />
                                <span className={cn("font-semibold", getRatingColor(agent.average_rating))}>
                                  {agent.average_rating.toFixed(1)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant={agent.rework_rate > 15 ? 'destructive' : 'default'}>
                                {agent.rework_rate.toFixed(1)}%
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className={cn(
                                "text-sm font-medium",
                                agent.on_time_rate >= 90 ? "text-green-500" : "text-orange-500"
                              )}>
                                {agent.on_time_rate.toFixed(0)}%
                              </span>
                            </TableCell>
                            <TableCell className="text-center text-muted-foreground">
                              {agent.tasks_count}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="issues" className="mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Problèmes les plus fréquents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {sortedTags.length > 0 ? (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart 
                            data={sortedTags.map(([tag, count]) => ({
                              name: TAG_LABELS[tag as QualityTag] || tag,
                              count,
                            }))}
                            layout="vertical"
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={100} fontSize={12} />
                            <Tooltip />
                            <Bar dataKey="count" fill="hsl(var(--destructive))" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        Aucun problème signalé pour cette propriété
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
