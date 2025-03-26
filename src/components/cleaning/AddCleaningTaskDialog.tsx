
import { BookingForm, SelectOption } from "../moyenne-duree/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NewCleaningTask } from "@/types/cleaning";

interface AddCleaningTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newTask: NewCleaningTask;
  setNewTask: (task: NewCleaningTask) => void;
  cleaningAgents: string[];
  onAddTask: () => void;
}

export const AddCleaningTaskDialog = ({
  open,
  onOpenChange,
  newTask,
  setNewTask,
  cleaningAgents,
  onAddTask
}: AddCleaningTaskDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Ajouter un ménage</DialogTitle>
          <DialogDescription>
            Complétez les informations pour ajouter un nouveau ménage
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Propriété</label>
              <Input
                value={newTask.property}
                onChange={(e) => setNewTask({...newTask, property: e.target.value})}
                placeholder="Nom de l'appartement"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Check-out</label>
                <Input
                  type="time"
                  value={newTask.checkoutTime}
                  onChange={(e) => setNewTask({...newTask, checkoutTime: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Check-in</label>
                <Input
                  type="time"
                  value={newTask.checkinTime}
                  onChange={(e) => setNewTask({...newTask, checkinTime: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={newTask.date}
                onChange={(e) => setNewTask({...newTask, date: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select 
                value={newTask.status} 
                onValueChange={(value: any) => setNewTask({...newTask, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">À faire</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Agent de ménage</label>
              <Select 
                value={newTask.cleaningAgent} 
                onValueChange={(value: string) => setNewTask({...newTask, cleaningAgent: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="non_assigne">Non assigné</SelectItem>
                  {cleaningAgents.map((agent) => (
                    <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Linge à prévoir</label>
              <Input
                value={newTask.items.join(', ')}
                onChange={(e) => setNewTask({...newTask, items: e.target.value.split(', ')})}
                placeholder="Serviettes bain x2, Serviettes main x2"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Housses et taies</label>
              <Input
                value={newTask.bedding.join(', ')}
                onChange={(e) => setNewTask({...newTask, bedding: e.target.value.split(', ')})}
                placeholder="Housse de couette queen x1, Taies d'oreiller x2"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Consommables</label>
              <Input
                value={newTask.consumables.join(', ')}
                onChange={(e) => setNewTask({...newTask, consumables: e.target.value.split(', ')})}
                placeholder="Capsules café x4, Sachets thé x2"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Commentaires</label>
              <Input
                value={newTask.comments}
                onChange={(e) => setNewTask({...newTask, comments: e.target.value})}
                placeholder="Instructions spéciales..."
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={onAddTask}>Ajouter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
