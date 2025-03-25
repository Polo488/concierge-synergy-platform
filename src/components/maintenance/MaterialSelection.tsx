
import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MinusCircle, PlusCircle } from "lucide-react";
import { InventoryItem } from "@/types/maintenance";
import { Checkbox } from "@/components/ui/checkbox";
import { FormMessage } from "@/components/ui/form";

interface MaterialSelectionProps {
  materials: InventoryItem[];
  selectedMaterials: InventoryItem[];
  materialQuantities: Record<number, number>;
  onToggleMaterial: (material: InventoryItem) => void;
  onUpdateQuantity: (materialId: number, quantity: number) => void;
  error?: string;
}

export const MaterialSelection: React.FC<MaterialSelectionProps> = ({
  materials,
  selectedMaterials,
  materialQuantities,
  onToggleMaterial,
  onUpdateQuantity,
  error
}) => {
  // Group materials by category
  const materialsByCategory: Record<string, InventoryItem[]> = {};
  materials.forEach(material => {
    if (!materialsByCategory[material.category]) {
      materialsByCategory[material.category] = [];
    }
    materialsByCategory[material.category].push(material);
  });

  return (
    <div className="space-y-4">
      <div>
        <Label>Matériaux nécessaires</Label>
        <p className="text-sm text-muted-foreground">
          Sélectionnez les matériaux nécessaires pour cette intervention
        </p>
      </div>

      {error && (
        <FormMessage>{error}</FormMessage>
      )}
      
      <div className="space-y-4">
        {Object.entries(materialsByCategory).map(([category, items]) => (
          <div key={category} className="space-y-2">
            <h4 className="font-medium">{category}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {items.map(material => {
                const isSelected = selectedMaterials.some(m => m.id === material.id);
                const quantity = materialQuantities[material.id] || 0;
                
                return (
                  <div key={material.id} className="flex items-start space-x-2 border p-2 rounded-md">
                    <Checkbox 
                      id={`material-${material.id}`}
                      checked={isSelected}
                      onCheckedChange={() => onToggleMaterial(material)}
                    />
                    <div className="space-y-1 flex-1">
                      <label htmlFor={`material-${material.id}`} className="font-medium cursor-pointer">
                        {material.name}
                      </label>
                      <div className="text-sm text-muted-foreground">
                        Stock: {material.stock} {material.status === 'low' && '(faible)'}
                      </div>
                      
                      {isSelected && (
                        <div className="flex items-center space-x-2 mt-2">
                          <Button 
                            type="button"
                            variant="outline" 
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => onUpdateQuantity(material.id, quantity - 1)}
                            disabled={quantity <= 1}
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{quantity}</span>
                          <Button 
                            type="button"
                            variant="outline" 
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => onUpdateQuantity(material.id, quantity + 1)}
                            disabled={quantity >= material.stock}
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
