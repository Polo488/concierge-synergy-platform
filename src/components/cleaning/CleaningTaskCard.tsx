import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  ChevronDown,
  ChevronRight,
  Eye,
  Trash2,
  AlertTriangle,
  MoreHorizontal,
  Play,
  CheckCircle,
  UserPlus,
  Camera,
  ImageOff,
  Flame,
  Zap,
  Hand,
  KeyRound,
  MapPin,
  LogOut,
  LogIn,
  Moon,
  Users,
} from 'lucide-react';
import { CleaningTask, CleaningStatus } from '@/types/cleaning';
import { CleaningPhotoLightbox } from './CleaningPhotoLightbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

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

const statusPill = (status: CleaningStatus) => {
  switch (status) {
    case 'todo':
      return (
        <Badge className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap bg-[hsl(30,100%,94%)] text-[hsl(21,100%,45%)] border-0 hover:bg-[hsl(30,100%,94%)]">
          À faire
        </Badge>
      );
    case 'inProgress':
      return (
        <Badge className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap bg-[hsl(210,100%,94%)] text-[hsl(213,84%,24%)] border-0 hover:bg-[hsl(210,100%,94%)]">
          En cours
        </Badge>
      );
    case 'completed':
      return (
        <Badge className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap bg-[hsl(120,39%,93%)] text-[hsl(120,30%,34%)] border-0 hover:bg-[hsl(120,39%,93%)]">
          Terminé
        </Badge>
      );
    case 'scheduled':
      return (
        <Badge className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap bg-muted text-muted-foreground border-0 hover:bg-muted">
          Planifié
        </Badge>
      );
    default:
      return null;
  }
};

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
  isCleaningAgent = false,
}: CleaningTaskCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const photos = task.photos || [];
  const isCompleted = task.status === 'completed';
  const initials = (task.cleaningAgent || task.agency || '?').slice(0, 1).toUpperCase();

  const showStartBtn = task.status === 'todo' && isCleaningAgent;
  const showCompleteBtn = task.status === 'inProgress' && isCleaningAgent;

  return (
    <>
      <div
        className={`bg-card rounded-2xl border p-4 shadow-sm transition-all ${
          task.isSameDayCheckin && task.status !== 'completed'
            ? 'border-border'
            : 'border-border'
        } ${labelsDialogOpen && isTaskSelected ? 'ring-2 ring-primary' : ''}`}
      >
        {/* Top row: pills (left) + actions (right) */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            {statusPill(task.status)}
            {task.isSameDayCheckin && task.status !== 'completed' && (
              <Badge className="rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap bg-primary text-primary-foreground border-0 hover:bg-primary inline-flex items-center gap-1">
                <Flame className="h-2.5 w-2.5" />
                CHECK-IN J
              </Badge>
            )}
            {task.assignedVia && task.cleaningAgent && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                  task.assignedVia === 'auto'
                    ? 'bg-[hsl(210,100%,96%)] text-[hsl(213,84%,32%)] border-[hsl(210,100%,88%)]'
                    : 'bg-muted text-muted-foreground border-border'
                }`}
              >
                {task.assignedVia === 'auto' ? <Zap className="h-2.5 w-2.5" /> : <Hand className="h-2.5 w-2.5" />}
                {task.assignedVia === 'auto' ? 'Auto' : 'Manuel'}
              </span>
            )}
          </div>

          {!labelsDialogOpen && (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Button
                size="sm"
                variant="outline"
                className="h-8 rounded-lg px-2.5 text-[12px] font-medium gap-1.5"
                onClick={() => toast.info("Infos d'accès envoyées")}
              >
                <KeyRound className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Infos d'accès</span>
              </Button>
              {showStartBtn && (
                <Button
                  size="sm"
                  className="h-8 rounded-full px-3 text-[12px] font-semibold gap-1.5 bg-primary hover:bg-primary/90"
                  onClick={() => onStartCleaning(task)}
                >
                  <Play className="h-3.5 w-3.5" />
                  Commencer
                </Button>
              )}
              {showCompleteBtn && (
                <Button
                  size="sm"
                  className="h-8 rounded-full px-3 text-[12px] font-semibold gap-1.5 bg-[hsl(142,76%,36%)] hover:bg-[hsl(142,76%,30%)]"
                  onClick={() => onCompleteCleaning(task)}
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  Terminer
                </Button>
              )}
              {!isCleaningAgent && task.status === 'todo' && (
                <Button
                  size="sm"
                  className="h-8 rounded-full px-3 text-[12px] font-semibold gap-1.5 bg-primary hover:bg-primary/90"
                  onClick={() => toast.info('Action prestataire uniquement')}
                >
                  <Play className="h-3.5 w-3.5" />
                  Commencer
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg bg-muted/40 text-muted-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onClick={() => onOpenDetails(task)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Détails
                  </DropdownMenuItem>
                  {task.status === 'todo' && (
                    <DropdownMenuItem onClick={() => onAssign?.(task)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      {task.cleaningAgent ? 'Réassigner' : 'Assigner'}
                    </DropdownMenuItem>
                  )}
                  {task.status === 'inProgress' && (
                    <DropdownMenuItem onClick={() => onReportProblem(task)}>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Problème
                    </DropdownMenuItem>
                  )}
                  {task.status === 'completed' && onReportIssue && (
                    <DropdownMenuItem onClick={() => onReportIssue(task)} className="text-destructive focus:text-destructive">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Signaler problème
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem onClick={() => onDelete(task)} className="text-destructive focus:text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Title + #id + chevron */}
        <div className="flex items-center gap-1.5 mt-3">
          <h3 className="text-[16px] font-bold text-foreground truncate">{task.property}</h3>
          {task.displayId && (
            <span className="text-[12px] font-semibold text-muted-foreground tabular-nums">{task.displayId}</span>
          )}
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 flex-shrink-0" />
        </div>

        {/* Address */}
        {task.address && (
          <div className="flex items-center gap-1 mt-1 min-w-0">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-[12px] text-muted-foreground truncate">{task.address}</span>
          </div>
        )}

        {/* Meta row: départ • arrivée • nights • guests */}
        <div className="flex items-center gap-x-4 gap-y-1 mt-2 flex-wrap">
          {task.checkoutDateLabel && (
            <div className="inline-flex items-center gap-1 text-[12px] text-muted-foreground">
              <LogOut className="h-3.5 w-3.5" />
              <span>Départ</span>
              <span className="font-semibold text-foreground">{task.checkoutDateLabel}</span>
            </div>
          )}
          {task.checkinDateLabel && (
            <div className="inline-flex items-center gap-1 text-[12px] text-muted-foreground">
              <LogIn className="h-3.5 w-3.5" />
              <span>Arrivée</span>
              <span className="font-semibold text-foreground">{task.checkinDateLabel}</span>
            </div>
          )}
          {typeof task.nights === 'number' && (
            <div className="inline-flex items-center gap-1 text-[12px] text-muted-foreground">
              <Moon className="h-3.5 w-3.5" />
              <span className="font-semibold text-foreground">{task.nights}</span>
              <span>{task.nights > 1 ? 'nuits' : 'nuit'}</span>
            </div>
          )}
          {typeof task.guests === 'number' && (
            <div className="inline-flex items-center gap-1 text-[12px] text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span className="font-semibold text-foreground">{task.guests}</span>
              <span>voyageurs</span>
            </div>
          )}
        </div>

        {/* Agent / agency */}
        {(task.cleaningAgent || task.agency) && (
          <div className="flex items-center gap-2 mt-2.5">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-[10px] bg-muted text-foreground font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-[12px] text-muted-foreground">
              {task.agency || task.cleaningAgent}
              {task.cleaningAgent && task.agency && task.cleaningAgent !== task.agency && (
                <span className="text-muted-foreground/70"> · {task.cleaningAgent}</span>
              )}
            </span>
          </div>
        )}

        {/* Comments */}
        {task.comments && (
          <div className="mt-2.5 bg-[hsl(30,100%,97%)] border-l-[3px] border-l-primary rounded-r-lg px-3 py-2">
            <p className="text-[12px] text-muted-foreground leading-relaxed break-words">{task.comments}</p>
          </div>
        )}

        {/* Photos preview for completed */}
        {isCompleted && !isExpanded && photos.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {photos.slice(0, 4).map((photo, i) => (
              <div
                key={photo.id}
                className="aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer relative group"
                onClick={() => setLightboxIndex(i)}
              >
                <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                {i === 3 && photos.length > 4 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-base font-bold text-white">+{photos.length - 4}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Voir les détails */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-1 mt-2.5 text-[12px] text-primary font-medium hover:text-primary/80 transition-colors">
              <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              {isExpanded ? 'Masquer les détails' : 'Voir les détails'}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 pt-3 border-t border-border/50 space-y-3">
            {isCompleted && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Camera className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Photos du ménage
                  </span>
                </div>
                {photos.length > 0 ? (
                  <div className="grid grid-cols-4 gap-1.5">
                    {photos.map((photo, i) => (
                      <div
                        key={photo.id}
                        className="aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer"
                        onClick={() => setLightboxIndex(i)}
                      >
                        <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
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
            {!isCompleted && task.linens?.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Linge et literie</p>
                <div className="flex flex-wrap gap-1.5">
                  {task.linens.map((item, i) => (
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
                  {task.consumables.map((item, i) => (
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

      {lightboxIndex !== null && photos.length > 0 && (
        <CleaningPhotoLightbox photos={photos} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </>
  );
};
