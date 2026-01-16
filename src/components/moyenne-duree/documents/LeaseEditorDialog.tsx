
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, X } from "lucide-react";
import { toast } from "sonner";
import { Booking, Lease } from "../types";
import { useLeases } from "../hooks/useLeases";

interface LeaseEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lease: Lease | null;
  booking: Booking;
}

export const LeaseEditorDialog = ({
  open,
  onOpenChange,
  lease,
  booking,
}: LeaseEditorDialogProps) => {
  const { updateLeaseContent } = useLeases();
  const [content, setContent] = useState("");
  const [versionNotes, setVersionNotes] = useState("");

  useEffect(() => {
    if (lease) {
      setContent(lease.content);
      setVersionNotes("");
    }
  }, [lease, open]);

  if (!lease) return null;

  const hasChanges = content !== lease.content;

  const handleSave = () => {
    if (!hasChanges) {
      onOpenChange(false);
      return;
    }

    updateLeaseContent(lease.id, content, versionNotes || undefined);
    toast.success("Bail mis à jour - Version " + (lease.currentVersion + 1));
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirm = window.confirm("Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?");
      if (!confirm) return;
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Édition du bail</DialogTitle>
          <DialogDescription>
            {booking.property} - {booking.tenant}
            {hasChanges && (
              <span className="ml-2 text-yellow-600">(modifications non sauvegardées)</span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="content">Contenu du bail</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
              placeholder="Contenu du bail..."
            />
          </div>

          {hasChanges && (
            <div className="space-y-2">
              <Label htmlFor="notes">Notes de version (optionnel)</Label>
              <Input
                id="notes"
                value={versionNotes}
                onChange={(e) => setVersionNotes(e.target.value)}
                placeholder="Ex: Ajout clause animaux, modification loyer..."
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            Enregistrer (v{lease.currentVersion + 1})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
