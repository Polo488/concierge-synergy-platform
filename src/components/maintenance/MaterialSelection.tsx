
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InventoryItem } from "@/types/maintenance";

interface MaterialSelectionProps {
  materials: InventoryItem[];
  selectedMaterials: InventoryItem[];
  materialQuantities: Record<number, number>;
  onToggleMaterial: (material: InventoryItem) => void;
  onUpdateQuantity: (materialId: number, quantity: number) => void;
}

export const MaterialSelection: React.FC<MaterialSelectionProps> = ({
  materials,
  selectedMaterials,
  materialQuantities,
  onToggleMaterial,
  onUpdateQuantity,
}) => {
  const [searchMaterial, setSearchMaterial] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  // Filter materials
  const categories = [...new Set(materials.map(item => item.category))];
  
  const filteredMaterials = materials.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchMaterial.toLowerCase());
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const isMaterialSelected = (id: number) => {
    return selectedMaterials.some(m => m.id === id);
  };

  const getQuantity = (id: number) => {
    return materialQuantities[id] || 1;
  };

  return (
    <div className="space-y-2">
      <Label>Matériel nécessaire</Label>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {selectedMaterials.map(material => (
          <Badge 
            key={material.id} 
            variant="outline" 
            className="rounded-full flex items-center gap-2 py-1.5 px-3"
          >
            <span>{material.name}</span>
            <div className="flex items-center gap-1 ml-1">
              <Button 
                type="button"
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 rounded-full"
                onClick={() => onUpdateQuantity(material.id, getQuantity(material.id) - 1)}
              >
                -
              </Button>
              <span className="w-5 text-center">{getQuantity(material.id)}</span>
              <Button 
                type="button"
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 rounded-full"
                onClick={() => onUpdateQuantity(material.id, getQuantity(material.id) + 1)}
              >
                +
              </Button>
            </div>
            <Button 
              type="button"
              variant="ghost" 
              size="icon" 
              className="h-5 w-5 ml-1 rounded-full"
              onClick={() => onToggleMaterial(material)}
            >
              ×
            </Button>
          </Badge>
        ))}
      </div>
      
      <div className="border rounded-md p-3">
        <div className="flex items-center gap-2 mb-3">
          <Input
            placeholder="Rechercher un matériel..."
            value={searchMaterial}
            onChange={(e) => setSearchMaterial(e.target.value)}
            className="h-8"
          />
          <Select
            value={selectedCategory || "all-categories"}
            onValueChange={(val) => setSelectedCategory(val === "all-categories" ? null : val)}
          >
            <SelectTrigger className="h-8 w-40">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-categories">Toutes</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="max-h-40 overflow-y-auto space-y-1">
          {filteredMaterials.map(material => (
            <div 
              key={material.id} 
              className="flex items-center justify-between border-b pb-1 last:border-0"
            >
              <div className="flex items-center gap-2">
                <Checkbox 
                  id={`material-${material.id}`} 
                  checked={isMaterialSelected(material.id)}
                  onCheckedChange={() => onToggleMaterial(material)}
                />
                <Label 
                  htmlFor={`material-${material.id}`}
                  className="flex flex-col cursor-pointer"
                >
                  <span>{material.name}</span>
                  <span className="text-xs text-muted-foreground">
                    En stock: {material.stock}
                  </span>
                </Label>
              </div>
              {isMaterialSelected(material.id) && (
                <div className="flex items-center gap-1">
                  <Button 
                    type="button"
                    variant="outline" 
                    size="icon" 
                    className="h-6 w-6 rounded-full"
                    onClick={() => onUpdateQuantity(material.id, getQuantity(material.id) - 1)}
                  >
                    -
                  </Button>
                  <span className="w-6 text-center">{getQuantity(material.id)}</span>
                  <Button 
                    type="button"
                    variant="outline" 
                    size="icon" 
                    className="h-6 w-6 rounded-full"
                    onClick={() => onUpdateQuantity(material.id, getQuantity(material.id) + 1)}
                  >
                    +
                  </Button>
                </div>
              )}
            </div>
          ))}
          {filteredMaterials.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-2">
              Aucun matériel trouvé
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
