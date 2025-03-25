
import { useState } from "react";
import { NewMaintenanceFormData, InventoryItem } from "@/types/maintenance";
import { toast } from "sonner";

export const useMaintenanceFormValidation = (inventoryItems: InventoryItem[]) => {
  const [formErrors, setFormErrors] = useState<{
    title?: string;
    property?: string;
    description?: string;
    materials?: string;
  }>({});

  const validateForm = (data: NewMaintenanceFormData): boolean => {
    const errors: Record<string, string> = {};
    
    // Validate required fields
    if (!data.title.trim()) {
      errors.title = "Le titre est obligatoire";
    }
    
    if (!data.property) {
      errors.property = "Le logement est obligatoire";
    }
    
    if (!data.description.trim()) {
      errors.description = "La description est obligatoire";
    }
    
    // Verify material stock availability
    const stockIssues = data.materials.filter(
      m => data.materialQuantities[m.id] > m.stock
    );
    
    if (stockIssues.length > 0) {
      errors.materials = `Stock insuffisant pour: ${stockIssues.map(m => m.name).join(', ')}`;
    }
    
    setFormErrors(errors);
    
    // Form is valid if errors object is empty
    const isValid = Object.keys(errors).length === 0;
    
    // Show toast for errors
    if (!isValid) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
    }
    
    return isValid;
  };

  const clearErrors = () => {
    setFormErrors({});
  };

  return {
    formErrors,
    validateForm,
    clearErrors
  };
};
