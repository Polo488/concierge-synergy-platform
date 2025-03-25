
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UrgencyLevel } from "@/types/maintenance";
import { FormMessage } from "@/components/ui/form";

interface MaintenanceFormFieldsProps {
  title: string;
  property: string;
  urgency: UrgencyLevel;
  description: string;
  onFieldChange: (field: string, value: string) => void;
  properties: string[];
  errors?: {
    title?: string;
    property?: string;
    description?: string;
    materials?: string;
  };
}

export const MaintenanceFormFields: React.FC<MaintenanceFormFieldsProps> = ({
  title,
  property,
  urgency,
  description,
  onFieldChange,
  properties,
  errors = {},
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title" className={errors.title ? "text-destructive" : ""}>Titre de l'intervention*</Label>
        <Input
          id="title"
          placeholder="Ex: Fuite robinet salle de bain"
          value={title}
          onChange={(e) => onFieldChange("title", e.target.value)}
          className={errors.title ? "border-destructive" : ""}
          required
        />
        {errors.title && (
          <FormMessage>{errors.title}</FormMessage>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="property" className={errors.property ? "text-destructive" : ""}>Logement*</Label>
        <Select 
          value={property} 
          onValueChange={(value) => onFieldChange("property", value)}
        >
          <SelectTrigger className={errors.property ? "border-destructive" : ""}>
            <SelectValue placeholder="Sélectionner un logement" />
          </SelectTrigger>
          <SelectContent>
            {properties.map((propertyName) => (
              <SelectItem key={propertyName} value={propertyName}>
                {propertyName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.property && (
          <FormMessage>{errors.property}</FormMessage>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="urgency">Niveau d'urgence</Label>
        <Select 
          value={urgency} 
          onValueChange={(value) => onFieldChange("urgency", value as UrgencyLevel)}
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
        <Label htmlFor="description" className={errors.description ? "text-destructive" : ""}>Description*</Label>
        <Textarea
          id="description"
          placeholder="Décrivez le problème en détail..."
          className={`min-h-[80px] ${errors.description ? "border-destructive" : ""}`}
          value={description}
          onChange={(e) => onFieldChange("description", e.target.value)}
          required
        />
        {errors.description && (
          <FormMessage>{errors.description}</FormMessage>
        )}
      </div>
    </>
  );
};
