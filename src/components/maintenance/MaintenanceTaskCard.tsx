
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, House, FileText, Eye, UserPlus, CheckCircle } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MaintenanceTask } from '@/types/maintenance';
import { getUrgencyBadge, getUrgencyLabel } from '@/utils/maintenanceUtils';

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
    <Card className="p-3 md:p-4 mb-3 transition-all duration-150">
      <div className="space-y-2">
        {/* Header: badges + date */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={`${getUrgencyBadge(task.urgency)} text-[11px]`}>
            {getUrgencyLabel(task.urgency)}
          </Badge>
          <span className="text-[11px] text-muted-foreground">
            {type === 'completed' 
              ? `Terminé le ${task.completedAt}` 
              : type === 'inProgress'
                ? `Commencé le ${task.startedAt}`
                : `Créé le ${task.createdAt}`
            }
          </span>
          {task.scheduledDate && (
            <Badge variant="outline" className="text-[11px]">
              <Calendar className="h-3 w-3 mr-1" />
              {task.scheduledDate}
            </Badge>
          )}
        </div>
        
        {/* Title */}
        <h3 className="font-semibold text-[14px] text-foreground leading-tight">{task.title}</h3>
        
        {/* Property */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[13px] text-muted-foreground">{task.property}</span>
          {task.internalName && (
            <Badge variant="secondary" className="text-[11px]">
              <House className="h-3 w-3 mr-1" />
              {task.internalName}
            </Badge>
          )}
        </div>
        
        {/* Description */}
        <p className="text-[13px] text-muted-foreground leading-relaxed">{task.description}</p>
        
        {/* Materials */}
        {task.materials && task.materials.length > 0 && (
          <div>
            <p className="text-[11px] font-medium text-muted-foreground mb-1">Matériel</p>
            <div className="flex flex-wrap gap-1.5">
              {task.materials.map((material, i) => (
                <Badge key={i} variant="outline" className="text-[11px]">
                  {material.name} {task.materialQuantities && task.materialQuantities[material.id] > 1 ? 
                    `(${task.materialQuantities[material.id]})` : ''}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Technician */}
        {task.technician && (
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">
                {task.technician.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-[12px] text-muted-foreground">{task.technician}</span>
          </div>
        )}
        
        {/* Notes */}
        {task.notes && (
          <div className="flex items-start gap-2 text-[12px] text-muted-foreground bg-muted/50 rounded-lg p-2 border-l-2 border-orange-400">
            <FileText className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span className="break-words">{task.notes}</span>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          {type === 'pending' && onAssign && (
            <Button 
              size="sm" 
              className="h-8 px-3 text-[13px] rounded-lg gap-1.5 flex-1 md:flex-none"
              onClick={() => onAssign(task.id)}
            >
              <UserPlus className="h-3.5 w-3.5" />
              Assigner
            </Button>
          )}
          {type === 'inProgress' && onComplete && (
            <Button 
              size="sm" 
              className="h-8 px-3 text-[13px] rounded-lg gap-1.5 flex-1 md:flex-none"
              onClick={() => onComplete(task.id)}
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Terminer
            </Button>
          )}
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 px-3 text-[13px] rounded-lg gap-1.5"
            onClick={() => onViewDetails(task)}
          >
            <Eye className="h-3.5 w-3.5" />
            Détails
          </Button>
        </div>
      </div>
    </Card>
  );
};
