
import { useState } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Eye, Trash2 } from 'lucide-react';
import { CleaningTask, CleaningStatus } from '@/types/cleaning';
import { getStatusLabel, getStatusBadgeClass } from '@/utils/cleaningUtils';

interface CleaningTaskCardProps {
  task: CleaningTask;
  labelsDialogOpen: boolean;
  isTaskSelected: boolean;
  onSelectTask: (task: CleaningTask) => void;
  onStartCleaning: (task: CleaningTask) => void;
  onCompleteCleaning: (task: CleaningTask) => void;
  onOpenDetails: (task: CleaningTask) => void;
  onAssign: (task: CleaningTask) => void;
  onReportProblem: (task: CleaningTask) => void;
  onDelete: (task: CleaningTask) => void;
}

export const CleaningTaskCard = ({
  task,
  labelsDialogOpen,
  isTaskSelected,
  onSelectTask,
  onStartCleaning,
  onCompleteCleaning,
  onOpenDetails,
  onAssign,
  onReportProblem,
  onDelete
}: CleaningTaskCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getStatusBadge = (status: CleaningStatus) => {
    switch(status) {
      case 'todo':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-full">À faire</Badge>;
      case 'inProgress':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 rounded-full">En cours</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 rounded-full">Terminé</Badge>;
      case 'scheduled':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 rounded-full">Planifié</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <Card className={`p-3 mb-2 animate-slide-up card-hover border border-border/40 ${labelsDialogOpen && isTaskSelected ? 'ring-2 ring-primary' : ''}`}>
      <div className="flex justify-between items-center">
        <div 
          className={`flex-1 ${labelsDialogOpen ? "cursor-pointer" : ""}`} 
          onClick={labelsDialogOpen ? () => onSelectTask(task) : undefined}
        >
          <div className="flex items-center gap-2">
            {getStatusBadge(task.status)}
            <h3 className="font-semibold">{task.property}</h3>
            {labelsDialogOpen && (
              <div className="ml-auto">
                <input 
                  type="checkbox" 
                  checked={isTaskSelected}
                  onChange={() => onSelectTask(task)}
                  className="h-4 w-4"
                />
              </div>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {task.date ? (
              <span>{task.date} · {task.startTime} - {task.endTime}</span>
            ) : (
              <span>Check-out: {task.checkoutTime} · Check-in: {task.checkinTime}</span>
            )}
          </div>
          {task.comments && (
            <div className="mt-1 text-sm italic text-muted-foreground">
              "{task.comments}"
            </div>
          )}
        </div>
        
        {!labelsDialogOpen && (
          <div className="flex items-center gap-2">
            {task.status === 'todo' && (
              <>
                <Button size="sm" variant="ghost" className="px-2" onClick={() => onOpenDetails(task)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" className="py-1 px-2 h-8" onClick={() => onStartCleaning(task)}>
                  Commencer
                </Button>
              </>
            )}
            {task.status === 'inProgress' && (
              <>
                <Button size="sm" variant="ghost" className="px-2" onClick={() => onOpenDetails(task)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" className="py-1 px-2 h-8" onClick={() => onCompleteCleaning(task)}>
                  Terminer
                </Button>
              </>
            )}
            {(task.status === 'completed' || task.status === 'scheduled') && (
              <Button size="sm" variant="ghost" className="px-2" onClick={() => onOpenDetails(task)}>
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="px-2"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 pt-3 border-t">
                {task.cleaningAgent && (
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{task.cleaningAgent.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">Agent: {task.cleaningAgent}</span>
                  </div>
                )}
                
                <div className="space-y-2">
                  {task.items?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1">Linge à prévoir:</p>
                      <div className="flex flex-wrap gap-2">
                        {task.items.map((item: string, i: number) => (
                          <Badge key={i} variant="outline" className="rounded-full">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {task.bedding?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1">Housses et taies:</p>
                      <div className="flex flex-wrap gap-2">
                        {task.bedding.map((item: string, i: number) => (
                          <Badge key={i} variant="outline" className="rounded-full bg-blue-50">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {task.consumables?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1">Consommables:</p>
                      <div className="flex flex-wrap gap-2">
                        {task.consumables.map((item: string, i: number) => (
                          <Badge key={i} variant="outline" className="rounded-full bg-green-50">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 mt-4">
                  {task.status === 'todo' && !task.cleaningAgent && (
                    <Button size="sm" variant="outline" className="py-1 px-2 h-8" onClick={() => onAssign(task)}>
                      Assigner
                    </Button>
                  )}
                  {task.status === 'todo' && task.cleaningAgent && (
                    <Button size="sm" variant="outline" className="py-1 px-2 h-8" onClick={() => onAssign(task)}>
                      Changer
                    </Button>
                  )}
                  {task.status === 'inProgress' && (
                    <Button size="sm" variant="outline" className="py-1 px-2 h-8" onClick={() => onReportProblem(task)}>
                      Problème
                    </Button>
                  )}
                  {/* Bouton de suppression pour toutes les tâches */}
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="py-1 px-2 h-8 text-destructive hover:bg-destructive/10" 
                    onClick={() => onDelete(task)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Supprimer
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </div>
    </Card>
  );
};
