
import { useState } from "react";
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  MoreHorizontal,
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { LeaseTemplate, LeaseTemplateType, LEASE_TEMPLATE_VARIABLES } from "../types";
import { useLeaseTemplates, getLeaseTypeLabel } from "../hooks/useLeases";

export const LeaseTemplatesManager = () => {
  const {
    templates,
    selectedTemplate,
    setSelectedTemplate,
    isEditing,
    setIsEditing,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    setDefaultTemplate,
  } = useLeaseTemplates();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    type: LeaseTemplateType;
    content: string;
  }>({
    name: "",
    type: "furnished",
    content: "",
  });

  const openNewDialog = () => {
    setFormData({
      name: "",
      type: "furnished",
      content: "",
    });
    setIsEditing(false);
    setDialogOpen(true);
  };

  const openEditDialog = (template: LeaseTemplate) => {
    setFormData({
      name: template.name,
      type: template.type,
      content: template.content,
    });
    setSelectedTemplate(template);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("Veuillez saisir un nom pour le modèle");
      return;
    }

    if (isEditing && selectedTemplate) {
      updateTemplate(selectedTemplate.id, formData);
      toast.success("Modèle mis à jour");
    } else {
      createTemplate({
        ...formData,
        isDefault: templates.length === 0,
      });
      toast.success("Modèle créé");
    }
    setDialogOpen(false);
  };

  const handleDelete = (template: LeaseTemplate) => {
    if (template.isDefault) {
      toast.error("Impossible de supprimer le modèle par défaut");
      return;
    }
    deleteTemplate(template.id);
    toast.success("Modèle supprimé");
  };

  const handleSetDefault = (template: LeaseTemplate) => {
    setDefaultTemplate(template.id);
    toast.success(`"${template.name}" est maintenant le modèle par défaut`);
  };

  const handleDuplicate = (template: LeaseTemplate) => {
    createTemplate({
      name: `${template.name} (copie)`,
      type: template.type,
      content: template.content,
      isDefault: false,
    });
    toast.success("Modèle dupliqué");
  };

  const insertVariable = (variable: string) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content + `{{${variable}}}`,
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg">Modèles de baux</CardTitle>
            <CardDescription>
              Gérez vos modèles de contrats de location
            </CardDescription>
          </div>
          <Button onClick={openNewDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau modèle
          </Button>
        </CardHeader>
        <CardContent>
          {templates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun modèle de bail</p>
              <p className="text-sm mt-1">
                Créez votre premier modèle pour pouvoir générer des baux
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{template.name}</span>
                        {template.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Par défaut
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {getLeaseTypeLabel(template.type)} • Modifié le{" "}
                        {new Date(template.updatedAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(template)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(template)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Dupliquer
                      </DropdownMenuItem>
                      {!template.isDefault && (
                        <DropdownMenuItem onClick={() => handleSetDefault(template)}>
                          <Star className="h-4 w-4 mr-2" />
                          Définir par défaut
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      {!template.isDefault && (
                        <DropdownMenuItem
                          onClick={() => handleDelete(template)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Template Editor Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Modifier le modèle" : "Nouveau modèle de bail"}
            </DialogTitle>
            <DialogDescription>
              Utilisez les variables entre doubles accolades pour personnaliser
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du modèle</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Ex: Bail meublé standard"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type de bail</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: LeaseTemplateType) =>
                    setFormData((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="furnished">Meublé</SelectItem>
                    <SelectItem value="mobility">Mobilité</SelectItem>
                    <SelectItem value="classic">Classique</SelectItem>
                    <SelectItem value="seasonal">Saisonnier</SelectItem>
                    <SelectItem value="custom">Personnalisé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Variables disponibles</Label>
              <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-muted/50">
                {LEASE_TEMPLATE_VARIABLES.map((variable) => (
                  <Button
                    key={variable.key}
                    variant="outline"
                    size="sm"
                    onClick={() => insertVariable(variable.key)}
                    className="text-xs"
                  >
                    {variable.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenu du modèle</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                className="min-h-[300px] font-mono text-sm"
                placeholder="Saisissez le contenu du bail ici...

Utilisez {{nom_de_variable}} pour insérer des données dynamiques.
Exemple: Le locataire {{tenant_name}} habitera au {{property_address}}..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              {isEditing ? "Enregistrer" : "Créer le modèle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
