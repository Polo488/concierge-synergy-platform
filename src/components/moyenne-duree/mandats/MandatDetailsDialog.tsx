
import { Mandat, MandatStatus, StatusInfo } from "../types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface MandatDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mandat: Mandat | null;
  formatter: {
    date: (date: string) => string;
  };
  statusInfo: StatusInfo<MandatStatus>;
  isDeleteConfirm?: boolean;
  onConfirmDelete?: () => void;
}

export const MandatDetailsDialog = ({
  open,
  onOpenChange,
  mandat,
  formatter,
  statusInfo,
  isDeleteConfirm = false,
  onConfirmDelete
}: MandatDetailsDialogProps) => {
  if (!mandat) return null;

  // If this is a delete confirmation dialog
  if (isDeleteConfirm) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Vous êtes sur le point de supprimer le mandat pour <strong>{mandat.property}</strong>. 
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmDelete} className="bg-red-500 text-white hover:bg-red-600">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // If this is a regular details dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Détails du mandat</DialogTitle>
          <DialogDescription>
            Informations complètes sur le mandat
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">ID Mandat</p>
              <p>{mandat.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Statut</p>
              <div className={`inline-block px-2 py-1 mt-1 rounded-full text-xs font-medium ${statusInfo.getColor(mandat.status)}`}>
                {statusInfo.getLabel(mandat.status)}
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Bien immobilier</p>
            <p className="text-lg font-medium">{mandat.property}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Propriétaire</p>
            <p>{mandat.owner}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date de début</p>
              <p>{formatter.date(mandat.startDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date de fin</p>
              <p>{formatter.date(mandat.endDate)}</p>
            </div>
          </div>
          
          {mandat.notes && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Notes</p>
              <p className="whitespace-pre-line">{mandat.notes}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
