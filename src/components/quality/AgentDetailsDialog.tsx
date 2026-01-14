
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AgentProfile, CleaningTaskExtended, QualityTag } from '@/types/quality';
import { Star, TrendingUp, TrendingDown, Clock, AlertTriangle, Building, Camera, CheckCircle, User } from 'lucide-react';
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface PropertyPerformance {
  property_id: string;
  property_name: string;
  average_rating: number;
  rework_rate: number;
  on_time_rate: number;
  tasks_count: number;
}

interface AgentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: AgentProfile | undefined;
  tasks: CleaningTaskExtended[];
  propertyPerformance: PropertyPerformance[];
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

const RATING_COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];

export function AgentDetailsDialog({
  open,
  onOpenChange,
  profile,
  tasks,
  propertyPerformance,
}: AgentDetailsDialogProps) {
  if (!profile) return null;

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-500';
    if (rating >= 4) return 'text-lime-500';
    if (rating >= 3.5) return 'text-yellow-500';
    if (rating >= 3) return 'text-orange-500';
    return 'text-red-500';
  };

  // Calculate rating distribution for this agent
  const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
    rating: rating.toString(),
    count: tasks.filter(t => t.manager_rating === rating).length,
    fill: RATING_COLORS[rating - 1],
  }));

  // Calculate tag frequency for this agent
  const tagFrequency: Record<string, number> = {};
  tasks.forEach(task => {
    task.quality_tags.forEach(tag => {
      tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
    });
  });
  const sortedTags = Object.entries(tagFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Prepare rating trend data for this agent
  const ratingTrendData = tasks
    .filter(t => t.manager_rating)
    .sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date))
    .map(t => ({
      date: format(parseISO(t.scheduled_date), 'dd/MM', { locale: fr }),
      rating: t.manager_rating,
    }));

  const initials = profile.agent_name.split(' ').map(n => n[0]).join('');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{profile.agent_name}</div>
              <div className="text-sm text-muted-foreground font-normal">
                {profile.tasks_completed_total} missions complétées
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-6 pr-4">
            {/* KPIs Section */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Star className={cn("h-5 w-5", getRatingColor(profile.average_rating_overall))} />
                    <span className={cn("text-2xl font-bold", getRatingColor(profile.average_rating_overall))}>
                      {profile.average_rating_overall.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Note globale</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Star className={cn("h-5 w-5", getRatingColor(profile.average_rating_last_30_days))} />
                    <span className={cn("text-2xl font-bold", getRatingColor(profile.average_rating_last_30_days))}>
                      {profile.average_rating_last_30_days.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Note 30j</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={cn("h-5 w-5", profile.rework_rate > 10 ? "text-red-500" : "text-green-500")} />
                    <span className="text-2xl font-bold">{profile.rework_rate.toFixed(1)}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Reprises</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Clock className={cn("h-5 w-5", profile.on_time_rate >= 90 ? "text-green-500" : "text-orange-500")} />
                    <span className="text-2xl font-bold">{profile.on_time_rate.toFixed(0)}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Ponctualité</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Camera className={cn("h-5 w-5", profile.photo_compliance_rate >= 80 ? "text-green-500" : "text-orange-500")} />
                    <span className="text-2xl font-bold">{profile.photo_compliance_rate.toFixed(0)}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Photos</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="properties">Par propriété</TabsTrigger>
                <TabsTrigger value="history">Historique</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Rating distribution */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Distribution des notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={ratingDistribution}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="rating" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count">
                              {ratingDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Rating trend */}
                  {ratingTrendData.length > 0 && (
                    <Card>
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
                </div>

                {/* Common issues */}
                {sortedTags.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Points d'amélioration les plus fréquents
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {sortedTags.map(([tag, count]) => (
                          <Badge key={tag} variant="outline" className="gap-1">
                            {TAG_LABELS[tag as QualityTag] || tag}
                            <span className="text-muted-foreground">({count})</span>
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="properties" className="mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Performance par propriété
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Propriété</TableHead>
                          <TableHead className="text-center">Note moyenne</TableHead>
                          <TableHead className="text-center">Reprises</TableHead>
                          <TableHead className="text-center">Ponctualité</TableHead>
                          <TableHead className="text-center">Missions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {propertyPerformance.map(prop => (
                          <TableRow key={prop.property_id}>
                            <TableCell className="font-medium">{prop.property_name}</TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Star className={cn("h-4 w-4", getRatingColor(prop.average_rating))} />
                                <span className={cn("font-semibold", getRatingColor(prop.average_rating))}>
                                  {prop.average_rating.toFixed(1)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant={prop.rework_rate > 15 ? 'destructive' : 'default'}>
                                {prop.rework_rate.toFixed(1)}%
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className={cn(
                                "text-sm font-medium",
                                prop.on_time_rate >= 90 ? "text-green-500" : "text-orange-500"
                              )}>
                                {prop.on_time_rate.toFixed(0)}%
                              </span>
                            </TableCell>
                            <TableCell className="text-center text-muted-foreground">
                              {prop.tasks_count}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Dernières missions ({Math.min(tasks.length, 20)} affichées)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Propriété</TableHead>
                          <TableHead className="text-center">Note</TableHead>
                          <TableHead>Tags</TableHead>
                          <TableHead className="text-center">Reprise</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tasks.slice(0, 20).map(task => (
                          <TableRow key={task.id}>
                            <TableCell className="text-sm">
                              {format(parseISO(task.scheduled_date), 'dd/MM/yyyy', { locale: fr })}
                            </TableCell>
                            <TableCell className="text-sm">{task.property_name}</TableCell>
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
                            <TableCell className="text-center">
                              {task.rework_required ? (
                                <Badge variant="destructive" className="text-xs">Oui</Badge>
                              ) : (
                                <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
