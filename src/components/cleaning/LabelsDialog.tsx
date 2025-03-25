
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Printer } from "lucide-react";
import { CleaningTask } from "@/types/cleaning";
import { CleaningTaskList } from "./CleaningTaskList";

interface LabelsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  labelType: "standard" | "detailed" | "qrcode";
  setLabelType: (type: "standard" | "detailed" | "qrcode") => void;
  selectedTasks: CleaningTask[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  todayCleaningTasks: CleaningTask[];
  tomorrowCleaningTasks: CleaningTask[];
  completedCleaningTasks: CleaningTask[];
  onSelectTask: (task: CleaningTask) => void;
  onStartCleaning: (task: CleaningTask) => void;
  onCompleteCleaning: (task: CleaningTask) => void;
  onOpenDetails: (task: CleaningTask) => void;
  onAssign: (task: CleaningTask) => void;
  onReportProblem: (task: CleaningTask) => void;
  onDelete: (task: CleaningTask) => void;
  onPrintLabels: () => void;
}

export const LabelsDialog = ({
  open,
  onOpenChange,
  labelType,
  setLabelType,
  selectedTasks,
  activeTab,
  setActiveTab,
  todayCleaningTasks,
  tomorrowCleaningTasks,
  completedCleaningTasks,
  onSelectTask,
  onStartCleaning,
  onCompleteCleaning,
  onOpenDetails,
  onAssign,
  onReportProblem,
  onDelete,
  onPrintLabels
}: LabelsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Générer des étiquettes</DialogTitle>
          <DialogDescription>
            Sélectionnez les ménages pour lesquels vous souhaitez générer des étiquettes
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Type d'étiquette</label>
            <Select value={labelType} onValueChange={(value: any) => setLabelType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="detailed">Détaillée</SelectItem>
                <SelectItem value="qrcode">QR Code</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Ménages</label>
              <span className="text-xs text-muted-foreground">
                {selectedTasks.length} sélectionné(s)
              </span>
            </div>
            
            <div className="border rounded-md h-64 overflow-y-auto p-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
                  <TabsTrigger value="tomorrow">Demain</TabsTrigger>
                  <TabsTrigger value="completed">Complétés</TabsTrigger>
                </TabsList>
                
                <TabsContent value="today" className="mt-2 space-y-2">
                  <CleaningTaskList
                    tasks={todayCleaningTasks}
                    emptyMessage="Aucun ménage prévu pour aujourd'hui"
                    labelsDialogOpen={true}
                    selectedTasks={selectedTasks}
                    onSelectTask={onSelectTask}
                    onStartCleaning={onStartCleaning}
                    onCompleteCleaning={onCompleteCleaning}
                    onOpenDetails={onOpenDetails}
                    onAssign={onAssign}
                    onReportProblem={onReportProblem}
                    onDelete={onDelete}
                  />
                </TabsContent>
                
                <TabsContent value="tomorrow" className="mt-2 space-y-2">
                  <CleaningTaskList
                    tasks={tomorrowCleaningTasks}
                    emptyMessage="Aucun ménage prévu pour demain"
                    labelsDialogOpen={true}
                    selectedTasks={selectedTasks}
                    onSelectTask={onSelectTask}
                    onStartCleaning={onStartCleaning}
                    onCompleteCleaning={onCompleteCleaning}
                    onOpenDetails={onOpenDetails}
                    onAssign={onAssign}
                    onReportProblem={onReportProblem}
                    onDelete={onDelete}
                  />
                </TabsContent>
                
                <TabsContent value="completed" className="mt-2 space-y-2">
                  <CleaningTaskList
                    tasks={completedCleaningTasks}
                    emptyMessage="Aucun ménage complété"
                    labelsDialogOpen={true}
                    selectedTasks={selectedTasks}
                    onSelectTask={onSelectTask}
                    onStartCleaning={onStartCleaning}
                    onCompleteCleaning={onCompleteCleaning}
                    onOpenDetails={onOpenDetails}
                    onAssign={onAssign}
                    onReportProblem={onReportProblem}
                    onDelete={onDelete}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={onPrintLabels} className="gap-1">
            <Printer className="h-4 w-4" />
            Imprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
