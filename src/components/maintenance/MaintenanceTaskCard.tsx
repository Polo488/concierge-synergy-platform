
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, House, FileText, MoreHorizontal, Eye, UserPlus, CheckCircle } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MaintenanceTask } from '@/types/maintenance';
import { getUrgencyBadge, getUrgencyLabel } from '@/utils/maintenanceUtils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MaintenanceTaskCardProps {
  task: MaintenanceTask;
  type: 'pending' | 'inProgress' | 'completed';
  onAssign?: (taskId: string | number) => void;
  onComplete?: (taskId: string | number) => void;
  onViewDetails: (task: MaintenanceTask) => void;
}

export const MaintenanceTaskCard = ({ 
  task, 
  type,
  onAssign,
  onComplete,
  onViewDetails
}: MaintenanceTaskCardProps) => {
  return (
    <Card className="p-4 mb-3 transition-all duration-150">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <Badge className={`${getUrgencyBadge(task.urgency)}`}>
              {getUrgencyLabel(task.urgency)}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {type === 'completed' 
                ? `Terminé le ${task.completedAt}` 
                : type === 'inProgress'
                  ? `Commencé le ${task.startedAt}`
                  : `Créé le ${task.createdAt}`
              }
            </span>
            {task.scheduledDate && (
              <Badge variant="outline" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                {task.scheduledDate}
              </Badge>
            )}
          </div>
          
          <h3 className="font-medium text-foreground mb-1">{task.title}</h3>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>{task.property}</span>
            {task.internalName && (
              <Badge variant="secondary" className="text-xs">
                <House className="h-3 w-3 mr-1" />
                {task.internalName}
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
          
          {task.materials && task.materials.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Matériel</p>
              <div className="flex flex-wrap gap-1.5">
                {task.materials.map((material, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {material.name} {task.materialQuantities && task.materialQuantities[material.id] > 1 ? 
                      `(${task.materialQuantities[material.id]})` : ''}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {task.technician && (
            <div className="flex items-center gap-2 mt-3">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-2xs bg-muted text-muted-foreground">
                  {task.technician.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">{task.technician}</span>
            </div>
          )}
          
          {task.notes && (
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <FileText className="h-3 w-3" />
              <span>{task.notes}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {type === 'pending' && (
            <Button 
              size="sm" 
              className="h-8 px-3 text-sm"
              onClick={() => onAssign && onAssign(task.id)}
            >
              <UserPlus className="h-3.5 w-3.5 mr-1.5" />
              Assigner
            </Button>
          )}
          {type === 'inProgress' && (
            <Button 
              size="sm" 
              className="h-8 px-3 text-sm"
              onClick={() => onComplete && onComplete(task.id)}
            >
              <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
              Terminer
            </Button>
          )}
          
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8"
            onClick={() => onViewDetails(task)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
