
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RotateCcw, Check } from "lucide-react";
import { toast } from "sonner";
import { Lease } from "../types";
import { useLeases } from "../hooks/useLeases";

interface LeaseVersionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lease: Lease | null;
  formatter: {
    date: (date: string) => string;
    currency: (amount: number) => string;
  };
}

export const LeaseVersionsDialog = ({
  open,
  onOpenChange,
  lease,
  formatter,
}: LeaseVersionsDialogProps) => {
  const { restoreVersion } = useLeases();

  if (!lease) return null;

  const handleRestore = (versionNumber: number) => {
    restoreVersion(lease.id, versionNumber);
    toast.success(`Version ${versionNumber} restaurée`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Historique des versions</DialogTitle>
          <DialogDescription>
            {lease.versions.length} version(s) enregistrée(s)
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-4">
            {lease.versions
              .slice()
              .reverse()
              .map((version) => (
                <div
                  key={version.id}
                  className={`p-4 border rounded-lg ${
                    version.version === lease.currentVersion
                      ? "border-primary bg-primary/5"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Version {version.version}</span>
                      {version.version === lease.currentVersion && (
                        <Badge variant="secondary">
                          <Check className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      )}
                    </div>
                    {version.version !== lease.currentVersion && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestore(version.version)}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Restaurer
                      </Button>
                    )}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p>Créée le {formatter.date(version.createdAt)} par {version.createdBy}</p>
                    {version.notes && (
                      <p className="mt-1 italic">"{version.notes}"</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
