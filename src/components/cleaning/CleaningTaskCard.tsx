import { useState } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Eye, Trash2, AlertTriangle, MoreHorizontal, Play, CheckCircle, UserPlus } from 'lucide-react';
import { CleaningTask, CleaningStatus } from '@/types/cleaning';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CleaningTaskCardProps {
  task: CleaningTask;
  labelsDialogOpen: boolean;
  isTaskSelected: boolean;
  onSelectTask?: (task: CleaningTask) => void;
  onStartCleaning: (task: CleaningTask) => void;
  onCompleteCleaning: (task: CleaningTask) => void;
  onOpenDetails: (task: CleaningTask) => void;
  onAssign?: (task: CleaningTask) => void;
  onReportProblem: (task: CleaningTask) => void;
  onReportIssue?: (task: CleaningTask) => void;
  onDelete?: (task: CleaningTask) => void;
  isCleaningAgent?: boolean;
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
  onReportIssue,
  onDelete,
  isCleaningAgent = false
}: CleaningTaskCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getStatusBadge = (status: CleaningStatus) => {
    switch(status) {
      case 'todo':
        return <Badge variant="info">À faire</Badge>;
      case 'inProgress':
        return <Badge variant="warning">En cours</Badge>;
      case 'completed':
        return <Badge variant="success">Terminé</Badge>;
      case 'scheduled':
        return <Badge variant="pending">Planifié</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <Card className={`p-4 mb-3 transition-all duration-150 ${labelsDialogOpen && isTaskSelected ? 'ring-2 ring-primary' : ''} ${isExpanded ? 'shadow-card' : ''}`}>
      <div className="flex justify-between items-start gap-4">
        <div 
          className={`flex-1 min-w-0 ${labelsDialogOpen ? "cursor-pointer" : ""}`} 
          onClick={labelsDialogOpen ? () => onSelectTask(task) : undefined}
        >
          <div className="flex items-center gap-2 flex-wrap">
            {getStatusBadge(task.status)}
            <h3 className="font-medium text-foreground truncate">{task.property}</h3>
            {labelsDialogOpen && (
              <div className="ml-auto">
                <input 
                  type="checkbox" 
                  checked={isTaskSelected}
                  onChange={() => onSelectTask(task)}
                  className="h-4 w-4 rounded"
                />
              </div>
            )}
          </div>
          <div className="text-sm text-muted-foreground mt-1.5">
            {task.date ? (
              <span>{task.date} · {task.startTime} - {task.endTime}</span>
            ) : (
              <span>Check-out: {task.checkoutTime} · Check-in: {task.checkinTime}</span>
            )}
          </div>
          {task.cleaningAgent && (
            <div className="flex items-center gap-2 mt-2">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-2xs bg-muted text-muted-foreground">
                  {task.cleaningAgent.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">{task.cleaningAgent}</span>
            </div>
          )}
          {task.comments && (
            <div className="mt-2 text-sm text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
              {task.comments}
            </div>
          )}
        </div>
        
        {!labelsDialogOpen && (
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {task.status === 'todo' && (
              <Button 
                size="sm" 
                className="h-8 px-3 text-sm"
                onClick={() => onStartCleaning(task)}
              >
                <Play className="h-3.5 w-3.5 mr-1.5" />
                Commencer
              </Button>
            )}
            {task.status === 'inProgress' && (
              <Button 
                size="sm" 
                className="h-8 px-3 text-sm"
                onClick={() => onCompleteCleaning(task)}
              >
                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                Terminer
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => onOpenDetails(task)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Détails
                </DropdownMenuItem>
                {task.status === 'todo' && !task.cleaningAgent && (
                  <DropdownMenuItem onClick={() => onAssign?.(task)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assigner
                  </DropdownMenuItem>
                )}
                {task.status === 'todo' && task.cleaningAgent && (
                  <DropdownMenuItem onClick={() => onAssign?.(task)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Réassigner
                  </DropdownMenuItem>
                )}
                {task.status === 'inProgress' && (
                  <DropdownMenuItem onClick={() => onReportProblem(task)}>
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Problème
                  </DropdownMenuItem>
                )}
                {task.status === 'completed' && onReportIssue && (
                  <DropdownMenuItem 
                    onClick={() => onReportIssue(task)}
                    className="text-status-error focus:text-status-error"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Signaler problème
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={() => onDelete?.(task)}
                  className="text-status-error focus:text-status-error"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      
      {/* Expandable details for linens and consumables */}
      {(task.linens?.length > 0 || task.consumables?.length > 0) && (
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-1 mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              {isExpanded ? 'Masquer les détails' : 'Voir les détails'}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 pt-3 border-t border-border/50 space-y-3">
            {task.linens?.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Linge et literie</p>
                <div className="flex flex-wrap gap-1.5">
                  {task.linens.map((item: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {task.consumables?.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Consommables</p>
                <div className="flex flex-wrap gap-1.5">
                  {task.consumables.map((item: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      )}
    </Card>
  );
};
