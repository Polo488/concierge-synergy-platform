
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
}

export const DeleteConfirmDialog = ({
  open,
  onOpenChange,
  onDelete
}: DeleteConfirmDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer ce ménage ? Cette action ne peut pas être annulée.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button variant="destructive" onClick={onDelete}>Supprimer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
