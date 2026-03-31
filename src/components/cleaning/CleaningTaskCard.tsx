import { useState } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Eye, Trash2, AlertTriangle, MoreHorizontal, Play, CheckCircle, UserPlus, Clock, Camera, ImageOff } from 'lucide-react';
import { CleaningTask, CleaningStatus } from '@/types/cleaning';
import { CleaningPhotoLightbox } from './CleaningPhotoLightbox';
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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  const photos = task.photos || [];
  const isCompleted = task.status === 'completed';
  
  const getStatusBadge = (status: CleaningStatus) => {
    switch(status) {
      case 'todo':
        return <Badge className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap flex-shrink-0 bg-[hsl(30,100%,94%)] text-[hsl(21,100%,45%)] border-0 hover:bg-[hsl(30,100%,94%)]">À faire</Badge>;
      case 'inProgress':
        return <Badge className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap flex-shrink-0 bg-[hsl(210,100%,94%)] text-[hsl(213,84%,24%)] border-0 hover:bg-[hsl(210,100%,94%)]">En cours</Badge>;
      case 'completed':
        return <Badge className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap flex-shrink-0 bg-[hsl(120,39%,93%)] text-[hsl(120,30%,34%)] border-0 hover:bg-[hsl(120,39%,93%)]">Terminé</Badge>;
      case 'scheduled':
        return <Badge className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap flex-shrink-0 bg-muted text-muted-foreground border-0 hover:bg-muted">Planifié</Badge>;
      default:
        return null;
    }
  };

  const getActionButton = () => {
    if (task.status === 'todo') {
      return (
        <Button 
          size="sm" 
          className="h-9 rounded-full px-4 text-[13px] font-semibold whitespace-nowrap flex-shrink-0 bg-primary hover:bg-primary/90"
          onClick={() => onStartCleaning(task)}
        >
          <Play className="h-3.5 w-3.5 mr-1.5" />
          Commencer
        </Button>
      );
    }
    if (task.status === 'inProgress') {
      return (
        <Button 
          size="sm" 
          className="h-9 rounded-full px-4 text-[13px] font-semibold whitespace-nowrap flex-shrink-0 bg-[hsl(142,76%,36%)] hover:bg-[hsl(142,76%,30%)]"
          onClick={() => onCompleteCleaning(task)}
        >
          <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
          Terminer
        </Button>
      );
    }
    return null;
  };

  const getExpandLabel = () => {
    if (isCompleted) {
      if (photos.length === 0) return 'Ajouter des photos';
      return `Voir les photos (${photos.length})`;
    }
    return isExpanded ? 'Masquer les détails' : 'Voir les détails';
  };

  const getExpandIcon = () => {
    if (isCompleted) return <Camera className="h-3.5 w-3.5" />;
    return <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />;
  };
  
  return (
    <>
      <div className={`bg-card rounded-[14px] border border-border p-4 shadow-sm transition-all duration-150 ${labelsDialogOpen && isTaskSelected ? 'ring-2 ring-primary' : ''}`}>
        {/* Header: badge + action + menu */}
        <div className="flex items-center gap-2">
          {getStatusBadge(task.status)}
          {labelsDialogOpen && (
            <div className="ml-auto">
              <input 
                type="checkbox" 
                checked={isTaskSelected}
                onChange={() => onSelectTask?.(task)}
                className="h-4 w-4 rounded"
              />
            </div>
          )}
          {!labelsDialogOpen && (
            <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
              {getActionButton()}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg bg-muted/50 text-muted-foreground flex-shrink-0">
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
                      className="text-destructive focus:text-destructive"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Signaler problème
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={() => onDelete?.(task)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Property name */}
        <h3 className="text-[15px] font-bold text-foreground mt-2.5 truncate">{task.property}</h3>

        {/* Times - single line */}
        <div className="flex items-center gap-4 mt-1.5">
          {task.date ? (
            <span className="text-xs text-muted-foreground">{task.date} · {task.startTime} - {task.endTime}</span>
          ) : (
            <>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Départ</span>
                <span className="text-[13px] font-semibold text-foreground">{task.checkoutTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Arrivée</span>
                <span className="text-[13px] font-semibold text-foreground">{task.checkinTime}</span>
              </div>
            </>
          )}
        </div>

        {/* Agent */}
        {task.cleaningAgent && (
          <div className="flex items-center gap-2 mt-2">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-[11px] bg-muted-foreground text-primary-foreground">
                {task.cleaningAgent.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-[13px] text-foreground">{task.cleaningAgent}</span>
          </div>
        )}

        {/* Note / instruction */}
        {task.comments && (
          <div className="mt-2.5 bg-[hsl(30,100%,97%)] border-l-[3px] border-l-primary rounded-r-lg px-3 py-2.5">
            <p className="text-[13px] text-muted-foreground leading-relaxed break-words">{task.comments}</p>
          </div>
        )}

        {/* Photo preview for completed tasks */}
        {isCompleted && !isExpanded && photos.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Camera className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Photos du ménage</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {photos.slice(0, 4).map((photo, i) => (
                <div 
                  key={photo.id} 
                  className="aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer relative group"
                  onClick={() => setLightboxIndex(i)}
                >
                  <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-150" />
                  {i === 3 && photos.length > 4 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-base font-bold text-white">+{photos.length - 4}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Expandable section */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-1 mt-3 text-[13px] text-primary font-medium hover:text-primary/80 transition-colors">
              {getExpandIcon()}
              {getExpandLabel()}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 pt-3 border-t border-border/50 space-y-3">
            {/* Photos section for completed */}
            {isCompleted && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Camera className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Photos du ménage</span>
                </div>
                {photos.length > 0 ? (
                  <div className="grid grid-cols-4 gap-1.5">
                    {photos.map((photo, i) => (
                      <div 
                        key={photo.id} 
                        className="aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer relative group"
                        onClick={() => setLightboxIndex(i)}
                      >
                        <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-150" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-muted/50 rounded-[10px] py-4 text-center border border-dashed border-border">
                    <ImageOff className="h-6 w-6 text-muted-foreground/50 mx-auto" />
                    <p className="text-xs text-muted-foreground mt-1.5">Aucune photo ajoutée</p>
                  </div>
                )}
              </div>
            )}

            {/* Linens & consumables for non-completed */}
            {!isCompleted && task.linens?.length > 0 && (
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
            
            {!isCompleted && task.consumables?.length > 0 && (
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
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && photos.length > 0 && (
        <CleaningPhotoLightbox 
          photos={photos} 
          initialIndex={lightboxIndex} 
          onClose={() => setLightboxIndex(null)} 
        />
      )}
    </>
  );
};
