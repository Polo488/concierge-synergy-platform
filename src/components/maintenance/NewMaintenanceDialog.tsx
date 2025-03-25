
import { useState } from "react";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { NewMaintenanceFormData, UrgencyLevel, InventoryItem } from "@/types/maintenance";
import { toast } from "sonner";
import { MaintenanceFormFields } from "./MaintenanceFormFields";
import { MaterialSelection } from "./MaterialSelection";

interface NewMaintenanceDialogProps {
  onSubmit: (data: NewMaintenanceFormData) => void;
  onCancel: () => void;
  inventoryItems: InventoryItem[];
}

const NewMaintenanceDialog = ({ onSubmit, onCancel, inventoryItems }: NewMaintenanceDialogProps) => {
  const [formData, setFormData] = useState<NewMaintenanceFormData>({
    title: "",
    property: "",
    urgency: "medium",
    description: "",
    materials: [],
    materialQuantities: {},
  });

  // Mock properties list for dropdown
  const properties = [
    "Appartement 12 Rue du Port",
    "Studio 8 Avenue des Fleurs",
    "Maison 23 Rue de la Paix",
    "Appartement 45 Boulevard Central",
    "Loft 72 Rue des Arts",
  ];

  const handleFieldChange = (field: keyof Omit<NewMaintenanceFormData, 'materials' | 'materialQuantities'>, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleMaterial = (material: InventoryItem) => {
    const existingMaterials = [...formData.materials];
    const existingIndex = existingMaterials.findIndex(m => m.id === material.id);
    
    if (existingIndex >= 0) {
      // Remove material
      existingMaterials.splice(existingIndex, 1);
      
      // Remove from quantities
      const newQuantities = {...formData.materialQuantities};
      delete newQuantities[material.id];
      
      setFormData(prev => ({
        ...prev,
        materials: existingMaterials,
        materialQuantities: newQuantities
      }));
    } else {
      // Add material with default quantity of 1
      setFormData(prev => ({
        ...prev,
        materials: [...prev.materials, material],
        materialQuantities: {
          ...prev.materialQuantities,
          [material.id]: 1
        }
      }));
    }
  };

  const updateQuantity = (materialId: number, quantity: number) => {
    if (quantity < 1) return;
    
    const material = inventoryItems.find(m => m.id === materialId);
    if (material && quantity > material.stock) {
      toast.error(`Stock insuffisant pour ${material.name}. Maximum: ${material.stock}`);
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      materialQuantities: {
        ...prev.materialQuantities,
        [materialId]: quantity
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.property || !formData.description) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    // Verify material stock availability
    const stockIssues = formData.materials.filter(
      m => formData.materialQuantities[m.id] > m.stock
    );
    
    if (stockIssues.length > 0) {
      toast.error(`Stock insuffisant pour: ${stockIssues.map(m => m.name).join(', ')}`);
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Nouvelle intervention</DialogTitle>
          <DialogDescription>
            Créer une nouvelle demande d'intervention technique
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <MaintenanceFormFields
            title={formData.title}
            property={formData.property}
            urgency={formData.urgency}
            description={formData.description}
            onFieldChange={handleFieldChange}
            properties={properties}
          />
          
          <MaterialSelection
            materials={inventoryItems}
            selectedMaterials={formData.materials}
            materialQuantities={formData.materialQuantities}
            onToggleMaterial={toggleMaterial}
            onUpdateQuantity={updateQuantity}
          />
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
