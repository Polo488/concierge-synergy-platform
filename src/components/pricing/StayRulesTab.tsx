
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { StayRule, SEASON_LABELS, CHANNEL_LABELS } from '@/types/pricing';
import { StayRuleDialog } from './StayRuleDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface StayRulesTabProps {
  stayRules: StayRule[];
  addStayRule: (rule: Omit<StayRule, 'id' | 'createdAt' | 'updatedAt'>) => StayRule;
  updateStayRule: (id: string, updates: Partial<StayRule>) => void;
  deleteStayRule: (id: string) => void;
  toggleStayRule: (id: string) => void;
}

export function StayRulesTab({
  stayRules,
  addStayRule,
  updateStayRule,
  deleteStayRule,
  toggleStayRule,
}: StayRulesTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<StayRule | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAdd = () => {
    setEditingRule(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (rule: StayRule) => {
    setEditingRule(rule);
    setIsDialogOpen(true);
  };

  const handleSave = (data: Omit<StayRule, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingRule) {
      updateStayRule(editingRule.id, data);
    } else {
      addStayRule(data);
    }
    setIsDialogOpen(false);
    setEditingRule(null);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteStayRule(deleteId);
      setDeleteId(null);
    }
  };

  const sortedRules = [...stayRules].sort((a, b) => a.priority - b.priority);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Configuration Min/Max Séjour</CardTitle>
            <CardDescription>
              Définissez les durées de séjour minimales et maximales par propriété, saison et canal
            </CardDescription>
          </div>
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle règle
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {sortedRules.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Aucune règle de séjour configurée</p>
            <Button variant="outline" className="mt-4" onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Créer une règle
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Priorité</TableHead>
                <TableHead>Propriété</TableHead>
                <TableHead>Canal</TableHead>
                <TableHead>Saison</TableHead>
                <TableHead>Min. nuits</TableHead>
                <TableHead>Max. nuits</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRules.map((rule) => (
                <TableRow key={rule.id} className={!rule.isActive ? 'opacity-50' : ''}>
                  <TableCell>
                    <Badge variant="outline">{rule.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    {rule.propertyId === 'all' ? (
                      <Badge variant="secondary">Toutes</Badge>
                    ) : (
                      rule.propertyName || `#${rule.propertyId}`
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={rule.channel === 'all' ? 'secondary' : 'default'}
                      className={
                        rule.channel === 'airbnb' ? 'bg-[#FF5A5F] hover:bg-[#FF5A5F]/80' :
                        rule.channel === 'booking' ? 'bg-[#003580] hover:bg-[#003580]/80' :
                        rule.channel === 'vrbo' ? 'bg-[#3D67B1] hover:bg-[#3D67B1]/80' :
                        ''
                      }
                    >
                      {CHANNEL_LABELS[rule.channel]}
                    </Badge>
                  </TableCell>
                  <TableCell>{SEASON_LABELS[rule.season]}</TableCell>
                  <TableCell className="font-medium">{rule.minNights} nuits</TableCell>
                  <TableCell className="font-medium">{rule.maxNights} nuits</TableCell>
                  <TableCell>
                    <Switch
                      checked={rule.isActive}
                      onCheckedChange={() => toggleStayRule(rule.id)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(rule)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(rule.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <StayRuleDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        rule={editingRule}
        onSave={handleSave}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette règle ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La règle sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
