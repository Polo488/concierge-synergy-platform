
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calendar, ChevronDown, ChevronUp, Eye, House, FileText } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MaintenanceTask } from '@/types/maintenance';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
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
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="p-5 mb-4 animate-slide-up card-hover border border-border/40">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className={`rounded-full ${getUrgencyBadge(task.urgency)}`}>
              {getUrgencyLabel(task.urgency)}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {type === 'completed' 
                ? `Terminé le ${task.completedAt}` 
                : type === 'inProgress'
                  ? `Commencé le ${task.startedAt}`
                  : `Créé le ${task.createdAt}`
              }
            </span>
            {task.scheduledDate && (
              <Badge variant="outline" className="ml-2">
                <Calendar className="h-3 w-3 mr-1" />
                Planifié: {task.scheduledDate}
              </Badge>
            )}
          </div>
          <h3 className="font-semibold text-lg">{task.title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>{task.property}</span>
            {task.internalName && (
              <Badge variant="secondary" className="text-xs flex items-center gap-1">
                <House className="h-3 w-3" />
                {task.internalName}
              </Badge>
            )}
          </div>
          <p className="text-sm mb-3">{task.description}</p>
          
          {task.materials && task.materials.length > 0 && (
            <div className="mb-3">
              <p className="text-sm font-medium mb-1">Matériel nécessaire:</p>
              <div className="flex flex-wrap gap-2">
                {task.materials.map((material, i) => (
                  <Badge key={i} variant="outline" className="rounded-full">
                    {material.name} {task.materialQuantities && task.materialQuantities[material.id] > 1 ? 
                      `(${task.materialQuantities[material.id]})` : ''}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {task.technician && (
            <div className="flex items-center gap-2 mt-3">
              <Avatar className="h-6 w-6">
                <AvatarFallback>{task.technician.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <span className="text-sm">Assigné à: {task.technician}</span>
            </div>
          )}
          
          {task.notes && (
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <FileText className="h-3 w-3" />
              <span>Notes: {task.notes}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-2">
          {type === 'pending' && (
            <>
              <Button 
                size="sm" 
                className="w-full"
                onClick={() => onAssign && onAssign(task.id)}
              >
                Assigner
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => onViewDetails(task)}
              >
                Détails
              </Button>
            </>
          )}
          {type === 'inProgress' && (
            <>
              <Button 
                size="sm" 
                className="w-full"
                onClick={() => onComplete && onComplete(task.id)}
              >
                Terminer
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => onViewDetails(task)}
              >
                Détails
              </Button>
            </>
          )}
          {type === 'completed' && (
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full"
              onClick={() => onViewDetails(task)}
            >
              Détails
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
