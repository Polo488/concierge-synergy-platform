
import { useState } from 'react';
import { Copy, CalendarCheck } from 'lucide-react';
import { HREmployee, WorkPattern } from '@/types/hrPlanning';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface ApplyPatternDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: HREmployee[];
  patterns: WorkPattern[];
  onApplyPattern: (employeeIds: string[], pattern: WorkPattern) => void;
  onDuplicateFromPreviousMonth: (employeeIds: string[]) => void;
}

export function ApplyPatternDialog({
  open,
  onOpenChange,
  employees,
  patterns,
  onApplyPattern,
  onDuplicateFromPreviousMonth,
}: ApplyPatternDialogProps) {
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [selectedPattern, setSelectedPattern] = useState<string>(patterns[0]?.id || '');

  const toggleEmployee = (employeeId: string) => {
    setSelectedEmployees(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const selectAllEmployees = () => {
    setSelectedEmployees(employees.map(e => e.id));
  };

  const deselectAllEmployees = () => {
    setSelectedEmployees([]);
  };

  const handleApplyPattern = () => {
    const pattern = patterns.find(p => p.id === selectedPattern);
    if (pattern && selectedEmployees.length > 0) {
      onApplyPattern(selectedEmployees, pattern);
      onOpenChange(false);
      setSelectedEmployees([]);
    }
  };

  const handleDuplicate = () => {
    if (selectedEmployees.length > 0) {
      onDuplicateFromPreviousMonth(selectedEmployees);
      onOpenChange(false);
      setSelectedEmployees([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-background">
        <DialogHeader>
          <DialogTitle>Appliquer un modèle de planning</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="pattern" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pattern" className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4" />
              Modèle de semaine
            </TabsTrigger>
            <TabsTrigger value="duplicate" className="flex items-center gap-2">
              <Copy className="h-4 w-4" />
              Dupliquer mois précédent
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pattern" className="space-y-4 mt-4">
            {/* Pattern selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Choisir un modèle</Label>
              <RadioGroup 
                value={selectedPattern} 
                onValueChange={setSelectedPattern}
                className="grid grid-cols-2 gap-3"
              >
                {patterns.map(pattern => (
                  <div 
                    key={pattern.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                      selectedPattern === pattern.id 
                        ? "border-primary bg-primary/5" 
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => setSelectedPattern(pattern.id)}
                  >
                    <RadioGroupItem value={pattern.id} id={pattern.id} />
                    <div className="flex-1">
                      <Label 
                        htmlFor={pattern.id} 
                        className="text-sm font-medium cursor-pointer"
                      >
                        {pattern.name}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        {pattern.description}
                      </p>
                      <div className="flex gap-1 mt-2">
                        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
                          <span 
                            key={i}
                            className={cn(
                              "w-5 h-5 flex items-center justify-center text-[10px] rounded",
                              pattern.pattern[i] === 'P' 
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                                : "bg-slate-100 text-slate-500 dark:bg-slate-800/50 dark:text-slate-400"
                            )}
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </TabsContent>

          <TabsContent value="duplicate" className="mt-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Cette action copiera le planning du mois précédent pour les employés sélectionnés.
                Les statuts et heures supplémentaires seront reportés jour par jour.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Employee selection */}
        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Sélectionner les employés</Label>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={selectAllEmployees}>
                Tout sélectionner
              </Button>
              <Button variant="ghost" size="sm" onClick={deselectAllEmployees}>
                Tout désélectionner
              </Button>
            </div>
          </div>
          <ScrollArea className="h-48 border rounded-lg">
            <div className="p-2 space-y-1">
              {employees.map(employee => (
                <div
                  key={employee.id}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors",
                    selectedEmployees.includes(employee.id) 
                      ? "bg-primary/10" 
                      : "hover:bg-muted/50"
                  )}
                  onClick={() => toggleEmployee(employee.id)}
                >
                  <Checkbox 
                    checked={selectedEmployees.includes(employee.id)}
                    onCheckedChange={() => toggleEmployee(employee.id)}
                  />
                  <div>
                    <p className="text-sm font-medium">{employee.displayName}</p>
                    {employee.role && (
                      <p className="text-xs text-muted-foreground">{employee.role}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <p className="text-xs text-muted-foreground">
            {selectedEmployees.length} employé{selectedEmployees.length > 1 ? 's' : ''} sélectionné{selectedEmployees.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Tabs defaultValue="pattern">
            <TabsContent value="pattern" className="mt-0">
              <Button 
                onClick={handleApplyPattern}
                disabled={selectedEmployees.length === 0}
              >
                Appliquer le modèle
              </Button>
            </TabsContent>
            <TabsContent value="duplicate" className="mt-0">
              <Button 
                onClick={handleDuplicate}
                disabled={selectedEmployees.length === 0}
              >
                Dupliquer
              </Button>
            </TabsContent>
          </Tabs>
          <Button 
            onClick={handleApplyPattern}
            disabled={selectedEmployees.length === 0}
          >
            Appliquer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
