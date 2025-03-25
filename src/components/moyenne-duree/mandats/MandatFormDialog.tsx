
import { MandatForm } from "../types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MandatFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  mandatForm: MandatForm;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const MandatFormDialog = ({
  open,
  onOpenChange,
  isEditing,
  mandatForm,
  onInputChange,
  onSubmit,
  onCancel
}: MandatFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifier le mandat" : "Nouveau mandat"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Modifiez les informations du mandat" 
              : "Ajoutez les informations du nouveau mandat"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="property">Bien immobilier *</Label>
            <Input
              id="property"
              name="property"
              value={mandatForm.property}
              onChange={onInputChange}
              placeholder="Nom du bien immobilier"
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="owner">Propriétaire *</Label>
            <Input
              id="owner"
              name="owner"
              value={mandatForm.owner}
              onChange={onInputChange}
              placeholder="Nom du propriétaire"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="startDate">Date de début *</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={mandatForm.startDate}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="endDate">Date de fin *</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={mandatForm.endDate}
                onChange={onInputChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={mandatForm.notes}
              onChange={onInputChange}
              placeholder="Notes additionnelles"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" onClick={onSubmit}>
            {isEditing ? "Mettre à jour" : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
