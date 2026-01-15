import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  User, CheckCircle, Clock, AlertTriangle, XCircle, 
  Sparkles, Image, Calendar, ChevronRight, Filter,
  ExternalLink, FileWarning, Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CleaningTask, CleaningIssue, CleaningIssueType, CleaningStatus } from '@/types/cleaning';

// Repasse event combines task and issue data
export interface RepasseEvent {
  task: CleaningTask;
  issue?: CleaningIssue;
  originalTask?: CleaningTask;
}

interface PropertyRepasseTabProps {
  propertyId: string;
  repasseEvents: RepasseEvent[];
  onViewTask?: (task: CleaningTask) => void;
  onViewIssue?: (issue: CleaningIssue) => void;
}

const issueTypeLabels: Record<CleaningIssueType, string> = {
  dust: 'Poussière',
  bathroom: 'Salle de bain',
  linen: 'Linge',
  kitchen: 'Cuisine',
  smell: 'Odeur',
  floors: 'Sols',
  missing_items: 'Éléments manquants',
  windows: 'Fenêtres',
  appliances: 'Électroménager',
  damage: 'Dégâts',
  guest_complaint: 'Réclamation client',
  other: 'Autre',
};

const statusConfig: Record<CleaningStatus, { label: string; icon: React.ReactNode; color: string }> = {
  scheduled: { label: 'Planifié', icon: <Calendar className="h-4 w-4" />, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  todo: { label: 'À faire', icon: <AlertTriangle className="h-4 w-4" />, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  inProgress: { label: 'En cours', icon: <Clock className="h-4 w-4" />, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  completed: { label: 'Terminé', icon: <CheckCircle className="h-4 w-4" />, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
};

export const PropertyRepasseTab: React.FC<PropertyRepasseTabProps> = ({
  propertyId,
  repasseEvents,
  onViewTask,
  onViewIssue,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [agentFilter, setAgentFilter] = useState<string>('all');
  const [issueTypeFilter, setIssueTypeFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<RepasseEvent | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Get unique agents from repasse events
  const uniqueAgents = Array.from(
    new Set(repasseEvents.map(e => e.task.cleaningAgent).filter(Boolean))
  ) as string[];

  // Get unique issue types
  const uniqueIssueTypes = Array.from(
    new Set(repasseEvents.flatMap(e => e.issue?.issueType ? [e.issue.issueType] : []))
  );

  // Filter events
  const filteredEvents = repasseEvents.filter(event => {
    // Status filter
    if (statusFilter !== 'all' && event.task.status !== statusFilter) return false;
    
    // Agent filter
    if (agentFilter !== 'all' && event.task.cleaningAgent !== agentFilter) return false;
    
    // Issue type filter
    if (issueTypeFilter !== 'all' && event.issue?.issueType !== issueTypeFilter) return false;
    
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesDescription = event.issue?.description?.toLowerCase().includes(query);
      const matchesAgent = event.task.cleaningAgent?.toLowerCase().includes(query);
      const matchesProperty = event.task.property?.toLowerCase().includes(query);
      if (!matchesDescription && !matchesAgent && !matchesProperty) return false;
    }
    
    return true;
  });

  // Sort by date, most recent first
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateA = a.task.date ? new Date(a.task.date).getTime() : 0;
    const dateB = b.task.date ? new Date(b.task.date).getTime() : 0;
    return dateB - dateA;
  });

  const handleEventClick = (event: RepasseEvent) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  const generateRepasseTitle = (event: RepasseEvent): string => {
    if (event.issue) {
      const issueLabel = issueTypeLabels[event.issue.issueType] || 'Problème';
      return `Repasse – ${issueLabel}`;
    }
    return 'Repasse';
  };

  return (
    <TabsContent value="repasse" className="space-y-4 mt-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Historique des repasses
            </h3>
            <Badge variant="outline" className="gap-1">
              {repasseEvents.length} repasse{repasseEvents.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-9"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="scheduled">Planifié</SelectItem>
                <SelectItem value="todo">À faire</SelectItem>
                <SelectItem value="inProgress">En cours</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
              </SelectContent>
            </Select>

            {uniqueAgents.length > 0 && (
              <Select value={agentFilter} onValueChange={setAgentFilter}>
                <SelectTrigger className="w-[160px] h-9">
                  <SelectValue placeholder="Agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous agents</SelectItem>
                  {uniqueAgents.map(agent => (
                    <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {uniqueIssueTypes.length > 0 && (
              <Select value={issueTypeFilter} onValueChange={setIssueTypeFilter}>
                <SelectTrigger className="w-[160px] h-9">
                  <SelectValue placeholder="Type problème" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous types</SelectItem>
                  {uniqueIssueTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {issueTypeLabels[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Repasse list */}
          {sortedEvents.length > 0 ? (
            <div className="space-y-3">
              {sortedEvents.map((event) => {
                const status = statusConfig[event.task.status];
                const hasPhotos = event.issue?.photos && event.issue.photos.length > 0;
                
                return (
                  <div
                    key={event.task.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0 space-y-2">
                        {/* Title and status */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
                          <h4 className="font-medium truncate">{generateRepasseTitle(event)}</h4>
                          <Badge className={cn('rounded-full gap-1', status.color)}>
                            {status.icon}
                            {status.label}
                          </Badge>
                          {event.issue && (
                            <Badge variant="outline" className="rounded-full">
                              {issueTypeLabels[event.issue.issueType]}
                            </Badge>
                          )}
                        </div>
                        
                        {/* Description snippet */}
                        {event.issue?.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {event.issue.description}
                          </p>
                        )}
                        
                        {/* Meta info */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {event.task.cleaningAgent && (
                            <div className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5" />
                              <span>{event.task.cleaningAgent}</span>
                            </div>
                          )}
                          {event.task.date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{new Date(event.task.date).toLocaleDateString('fr-FR')}</span>
                            </div>
                          )}
                          {hasPhotos && (
                            <div className="flex items-center gap-1 text-primary">
                              <Image className="h-3.5 w-3.5" />
                              <span>{event.issue?.photos.length} photo{event.issue!.photos.length > 1 ? 's' : ''}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Arrow */}
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Aucune repasse</p>
              <p className="text-sm">Aucun historique de repasse pour ce logement.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Repasse Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {selectedEvent && generateRepasseTitle(selectedEvent)}
            </DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6">
                {/* Status and meta */}
                <div className="flex flex-wrap gap-2">
                  <Badge className={cn('rounded-full gap-1', statusConfig[selectedEvent.task.status].color)}>
                    {statusConfig[selectedEvent.task.status].icon}
                    {statusConfig[selectedEvent.task.status].label}
                  </Badge>
                  {selectedEvent.issue && (
                    <Badge variant="outline" className="rounded-full">
                      {issueTypeLabels[selectedEvent.issue.issueType]}
                    </Badge>
                  )}
                </div>

                {/* Task details */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Détails de la repasse
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Agent assigné</span>
                      <p className="font-medium flex items-center gap-1 mt-0.5">
                        <User className="h-4 w-4" />
                        {selectedEvent.task.cleaningAgent || 'Non assigné'}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date planifiée</span>
                      <p className="font-medium flex items-center gap-1 mt-0.5">
                        <Calendar className="h-4 w-4" />
                        {selectedEvent.task.date 
                          ? new Date(selectedEvent.task.date).toLocaleDateString('fr-FR')
                          : 'Non définie'}
                      </p>
                    </div>
                    {selectedEvent.task.startTime && selectedEvent.task.endTime && (
                      <div>
                        <span className="text-muted-foreground">Créneau horaire</span>
                        <p className="font-medium mt-0.5">
                          {selectedEvent.task.startTime} - {selectedEvent.task.endTime}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Issue details */}
                {selectedEvent.issue && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                      <FileWarning className="h-4 w-4" />
                      Problème signalé
                    </h4>
                    <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                      <p className="text-sm">{selectedEvent.issue.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Signalé le {new Date(selectedEvent.issue.createdAt).toLocaleDateString('fr-FR')}</span>
                        <span>par {selectedEvent.issue.createdBy}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Photos */}
                {selectedEvent.issue?.photos && selectedEvent.issue.photos.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      Photos ({selectedEvent.issue.photos.length})
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedEvent.issue.photos.map((photo, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                          <img 
                            src={photo} 
                            alt={`Photo ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links to original task and issue */}
                <div className="space-y-2 pt-4 border-t">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Éléments liés
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.originalTask && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onViewTask?.(selectedEvent.originalTask!)}
                        className="gap-1"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Tâche originale
                      </Button>
                    )}
                    {selectedEvent.issue && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onViewIssue?.(selectedEvent.issue!)}
                        className="gap-1"
                      >
                        <FileWarning className="h-3.5 w-3.5" />
                        Voir le problème
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </TabsContent>
  );
};
