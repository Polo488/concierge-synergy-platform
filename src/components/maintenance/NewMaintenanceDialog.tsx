
import { useState, useEffect } from "react";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { NewMaintenanceFormData, UrgencyLevel, InventoryItem } from "@/types/maintenance";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

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

  const [searchMaterial, setSearchMaterial] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Mock properties list for dropdown
  const properties = [
    "Appartement 12 Rue du Port",
    "Studio 8 Avenue des Fleurs",
    "Maison 23 Rue de la Paix",
    "Appartement 45 Boulevard Central",
    "Loft 72 Rue des Arts",
  ];

  // Filter materials
  const categories = [...new Set(inventoryItems.map(item => item.category))];
  
  const filteredMaterials = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchMaterial.toLowerCase());
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleChange = (field: keyof Omit<NewMaintenanceFormData, 'materials' | 'materialQuantities'>, value: string) => {
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

  const isMaterialSelected = (id: number) => {
    return formData.materials.some(m => m.id === id);
  };

  const getQuantity = (id: number) => {
    return formData.materialQuantities[id] || 1;
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
      m => getQuantity(m.id) > m.stock
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
            <Label>Matériel nécessaire</Label>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.materials.map(material => (
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
                      onClick={() => updateQuantity(material.id, getQuantity(material.id) - 1)}
                    >
                      -
                    </Button>
                    <span className="w-5 text-center">{getQuantity(material.id)}</span>
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 rounded-full"
                      onClick={() => updateQuantity(material.id, getQuantity(material.id) + 1)}
                    >
                      +
                    </Button>
                  </div>
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 ml-1 rounded-full"
                    onClick={() => toggleMaterial(material)}
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
                        onCheckedChange={() => toggleMaterial(material)}
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
                          onClick={() => updateQuantity(material.id, getQuantity(material.id) - 1)}
                        >
                          -
                        </Button>
                        <span className="w-6 text-center">{getQuantity(material.id)}</span>
                        <Button 
                          type="button"
                          variant="outline" 
                          size="icon" 
                          className="h-6 w-6 rounded-full"
                          onClick={() => updateQuantity(material.id, getQuantity(material.id) + 1)}
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
