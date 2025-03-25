
import { Mandat, MandatStatus, StatusInfo } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit2, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface MandatsListProps {
  mandats: Mandat[];
  formatter: {
    date: (date: string) => string;
  };
  statusInfo: StatusInfo<MandatStatus>;
  onEdit: (mandat: Mandat) => void;
  onDelete: (id: string) => void;
  onViewDetails: (mandat: Mandat) => void;
  setDeleteMandatConfirmOpen: (open: boolean) => void;
}

export const MandatsList = ({ 
  mandats, 
  formatter, 
  statusInfo, 
  onEdit, 
  onDelete, 
  onViewDetails,
  setDeleteMandatConfirmOpen
}: MandatsListProps) => {
  if (mandats.length === 0) {
    return (
      <div className="text-center p-8 bg-muted rounded-lg">
        <p className="text-muted-foreground">Aucun mandat trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {mandats.map((mandat) => (
        <MandatCard
          key={mandat.id}
          mandat={mandat}
          formatter={formatter}
          statusInfo={statusInfo}
          onEdit={() => onEdit(mandat)}
          onDelete={() => onDelete(mandat.id)}
          onViewDetails={() => onViewDetails(mandat)}
        />
      ))}
    </div>
  );
};

// Mandat Card Component
interface MandatCardProps {
  mandat: Mandat;
  formatter: {
    date: (date: string) => string;
  };
  statusInfo: StatusInfo<MandatStatus>;
  onEdit: () => void;
  onDelete: () => void;
  onViewDetails: () => void;
}

const MandatCard = ({ mandat, formatter, statusInfo, onEdit, onDelete, onViewDetails }: MandatCardProps) => {
  return (
    <Card className="animate-fade-in cursor-pointer hover:shadow-card transition-shadow" onClick={onViewDetails}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{mandat.property}</CardTitle>
            <CardDescription>Propriétaire: {mandat.owner}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.getColor(mandat.status)}`}>
              {statusInfo.getLabel(mandat.status)}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-horizontal">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }} className="cursor-pointer">
                  <Edit2 className="mr-2 h-4 w-4" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }} className="cursor-pointer text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Période</p>
            <p>{formatter.date(mandat.startDate)} - {formatter.date(mandat.endDate)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">ID Mandat</p>
            <p className="font-medium">{mandat.id}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
