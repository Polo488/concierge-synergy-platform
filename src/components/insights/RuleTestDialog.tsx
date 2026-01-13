import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AlertRule, RuleTestResult, METRIC_LABELS } from '@/types/alertRules';
import { properties } from '@/hooks/calendar/mockData';
import { Play, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

interface RuleTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule: AlertRule | null;
  onTest: (ruleId: string, propertyIds?: number[]) => RuleTestResult[];
}

export function RuleTestDialog({
  open,
  onOpenChange,
  rule,
  onTest,
}: RuleTestDialogProps) {
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<number[]>([]);
  const [testResults, setTestResults] = useState<RuleTestResult[] | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const toggleProperty = (propertyId: number) => {
    setSelectedPropertyIds(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const selectAll = () => {
    if (selectedPropertyIds.length === properties.length) {
      setSelectedPropertyIds([]);
    } else {
      setSelectedPropertyIds(properties.map(p => p.id));
    }
  };

  const runTest = async () => {
    if (!rule) return;
    
    setIsRunning(true);
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const results = onTest(
      rule.id, 
      selectedPropertyIds.length > 0 ? selectedPropertyIds : undefined
    );
    setTestResults(results);
    setIsRunning(false);
  };

  const getSeverityIcon = (severity: 'info' | 'warning' | 'critical', wouldTrigger: boolean) => {
    if (!wouldTrigger) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    switch (severity) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const triggeredCount = testResults?.filter(r => r.wouldTrigger).length || 0;

  if (!rule) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            Tester la règle: {rule.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Property selection */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-medium">Sélectionner les biens à tester</h4>
                <p className="text-xs text-muted-foreground">
                  Laissez vide pour tester tous les biens
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={selectAll}>
                {selectedPropertyIds.length === properties.length ? 'Désélectionner tout' : 'Tout sélectionner'}
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
              {properties.map((property) => (
                <div key={property.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`test-property-${property.id}`}
                    checked={selectedPropertyIds.includes(property.id)}
                    onCheckedChange={() => toggleProperty(property.id)}
                  />
                  <label 
                    htmlFor={`test-property-${property.id}`}
                    className="text-sm cursor-pointer truncate"
                  >
                    {property.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Run test button */}
          <div className="flex justify-center">
            <Button onClick={runTest} disabled={isRunning} className="gap-2">
              <Play className="h-4 w-4" />
              {isRunning ? 'Exécution...' : 'Exécuter le test'}
            </Button>
          </div>

          {/* Results */}
          {testResults && (
            <div className="border rounded-lg overflow-hidden">
              <div className="p-3 bg-muted/50 flex items-center justify-between">
                <h4 className="font-medium">Résultats du test</h4>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground">
                    {testResults.length} bien(s) analysé(s)
                  </span>
                  {triggeredCount > 0 ? (
                    <Badge variant="destructive">
                      {triggeredCount} alerte(s) déclenchée(s)
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Aucune alerte
                    </Badge>
                  )}
                </div>
              </div>

              <ScrollArea className="max-h-80">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Statut</TableHead>
                      <TableHead>Bien</TableHead>
                      <TableHead>{METRIC_LABELS[rule.metric]}</TableHead>
                      <TableHead>Référence</TableHead>
                      <TableHead>Écart</TableHead>
                      <TableHead>Sévérité</TableHead>
                      <TableHead>Période</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testResults.map((result) => (
                      <TableRow 
                        key={result.propertyId}
                        className={result.wouldTrigger ? 'bg-red-50/50' : ''}
                      >
                        <TableCell>
                          {getSeverityIcon(result.severity, result.wouldTrigger)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {result.propertyName}
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-muted px-1.5 py-0.5 rounded">
                            {result.metricValue}
                            {rule.metric === 'occupancy_rate' ? '%' : ''}
                          </code>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-muted px-1.5 py-0.5 rounded">
                            {result.baselineValue}
                            {rule.metric === 'occupancy_rate' ? '%' : ''}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={result.delta < 0 ? "destructive" : "secondary"}
                          >
                            {result.delta > 0 ? '+' : ''}{result.deltaPercent}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {result.wouldTrigger && (
                            <Badge
                              variant="outline"
                              className={
                                result.severity === 'critical' 
                                  ? 'bg-red-100 text-red-700 border-red-200'
                                  : result.severity === 'warning'
                                  ? 'bg-amber-100 text-amber-700 border-amber-200'
                                  : 'bg-blue-100 text-blue-700 border-blue-200'
                              }
                            >
                              {result.severity === 'critical' ? 'Critique' :
                               result.severity === 'warning' ? 'Attention' : 'Info'}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {result.period}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}

          {/* Explanation */}
          <div className="p-3 bg-muted/30 rounded-lg text-sm text-muted-foreground">
            <p>
              <strong>Note:</strong> Ce test simule l'exécution de la règle avec des données de démonstration.
              En production, les métriques réelles seront utilisées.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
