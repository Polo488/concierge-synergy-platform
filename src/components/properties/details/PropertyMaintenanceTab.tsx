
import { Card, CardContent } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { MaintenanceTask } from '@/types/maintenance';
import { User, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getUrgencyBadge } from '@/utils/propertyUtils';

interface PropertyMaintenanceTabProps {
  maintenance: MaintenanceTask[];
}

export const PropertyMaintenanceTab = ({ maintenance }: PropertyMaintenanceTabProps) => {
  // Function to get status icon for maintenance tasks
  const getStatusIcon = (task: MaintenanceTask) => {
    if (task.completedAt) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (task.startedAt) {
      return <Clock className="h-4 w-4 text-amber-500" />;
    } else {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  // Function to get status text for maintenance tasks
  const getStatusText = (task: MaintenanceTask) => {
    if (task.completedAt) {
      return <span className="text-green-600">Terminée</span>;
    } else if (task.startedAt) {
      return <span className="text-amber-600">En cours</span>;
    } else {
      return <span className="text-red-600">En attente</span>;
    }
  };

  return (
    <TabsContent value="maintenance" className="space-y-4 mt-4">
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium text-lg mb-4">Historique de maintenance</h3>
          {maintenance.length > 0 ? (
            <div className="space-y-4">
              {maintenance.map((task) => (
                <div key={task.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(task)}
                        <h4 className="font-medium">{task.title}</h4>
                        <Badge className={`${getUrgencyBadge(task.urgency).color} rounded-full`}>
                          {getUrgencyBadge(task.urgency).text}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {task.description}
                      </p>
                    </div>
                    <div className="text-right text-sm space-y-1">
                      <div>{getStatusText(task)}</div>
                      <div className="text-muted-foreground">Créé le {task.createdAt}</div>
                      {task.completedAt && <div className="text-green-600">Terminé le {task.completedAt}</div>}
                    </div>
                  </div>
                  {task.technician && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>Technicien: <span className="font-medium">{task.technician}</span></span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Aucun historique de maintenance pour ce logement.</p>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};
