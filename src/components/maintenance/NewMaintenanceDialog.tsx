
import { useState } from "react";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { NewMaintenanceFormData, UrgencyLevel } from "@/types/maintenance";
import { toast } from "sonner";

interface NewMaintenanceDialogProps {
  onSubmit: (data: NewMaintenanceFormData) => void;
  onCancel: () => void;
}

const NewMaintenanceDialog = ({ onSubmit, onCancel }: NewMaintenanceDialogProps) => {
  const [formData, setFormData] = useState<NewMaintenanceFormData>({
    title: "",
    property: "",
    urgency: "medium",
    description: "",
    materials: "",
  });

  // Mock properties list for dropdown
  const properties = [
    "Appartement 12 Rue du Port",
    "Studio 8 Avenue des Fleurs",
    "Maison 23 Rue de la Paix",
    "Appartement 45 Boulevard Central",
    "Loft 72 Rue des Arts",
  ];

  const handleChange = (field: keyof NewMaintenanceFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.property || !formData.description) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <DialogContent className="sm:max-w-md">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Nouvelle intervention</DialogTitle>
          <DialogDescription>
            Créer une nouvelle demande d'intervention technique
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre de l'intervention*</Label>
            <Input
              id="title"
              placeholder="Ex: Fuite robinet salle de bain"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="property">Logement*</Label>
            <Select 
              value={formData.property} 
              onValueChange={(value) => handleChange("property", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un logement" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property} value={property}>
                    {property}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="urgency">Niveau d'urgence</Label>
            <Select 
              value={formData.urgency} 
              onValueChange={(value) => handleChange("urgency", value as UrgencyLevel)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un niveau d'urgence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Faible</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="high">Élevée</SelectItem>
                <SelectItem value="critical">Critique</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description*</Label>
            <Textarea
              id="description"
              placeholder="Décrivez le problème en détail..."
              className="min-h-[80px]"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="materials">Matériel nécessaire (séparé par des virgules)</Label>
            <Input
              id="materials"
              placeholder="Ex: Joint silicone, Clé à molette"
              value={formData.materials}
              onChange={(e) => handleChange("materials", e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">Créer intervention</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default NewMaintenanceDialog;
