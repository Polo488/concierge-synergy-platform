
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Property } from '@/utils/propertyUtils';
import { TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Save, X, Key, Lock, Wifi, Video, Home, StickyNote, FileText, ExternalLink, Plus, Trash } from 'lucide-react';
import { toast } from 'sonner';

interface PropertyAccessTabProps {
  property: Property;
}

export const PropertyAccessTab = ({ property }: PropertyAccessTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAccess, setEditedAccess] = useState({
    bacCode: property.bacCode || "",
    digicode: property.digicode || "",
    wifiCode: property.wifiCode || "",
    youtubeLink: property.youtubeLink || "",
    floor: property.floor || "",
    agentNotes: property.agentNotes || "",
    attachments: property.attachments ? [...property.attachments] : []
  });
  const [newAttachment, setNewAttachment] = useState({ name: '', url: '', type: 'document' });
  
  const handleSave = () => {
    toast.success("Informations d'accès mises à jour avec succès");
    setIsEditing(false);
    // En situation réelle, property serait mis à jour avec les valeurs de editedAccess
  };

  const handleCancel = () => {
    setEditedAccess({
      bacCode: property.bacCode || "",
      digicode: property.digicode || "",
      wifiCode: property.wifiCode || "",
      youtubeLink: property.youtubeLink || "",
      floor: property.floor || "",
      agentNotes: property.agentNotes || "",
      attachments: property.attachments ? [...property.attachments] : []
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedAccess({
      ...editedAccess,
      [field]: value
    });
  };

  const handleAttachmentChange = (field: string, value: string) => {
    setNewAttachment({
      ...newAttachment,
      [field]: value
    });
  };

  const addAttachment = () => {
    if (newAttachment.name.trim() && newAttachment.url.trim()) {
      setEditedAccess({
        ...editedAccess,
        attachments: [
          ...editedAccess.attachments, 
          { 
            id: Date.now(), 
            name: newAttachment.name.trim(), 
            url: newAttachment.url.trim(),
            type: newAttachment.type
          }
        ]
      });
      setNewAttachment({ name: '', url: '', type: 'document' });
    }
  };

  const removeAttachment = (id: number) => {
    setEditedAccess({
      ...editedAccess,
      attachments: editedAccess.attachments.filter(doc => doc.id !== id)
    });
  };

  return (
    <TabsContent value="access" className="space-y-4 mt-4">
      <div className="flex justify-end mb-2">
        {isEditing ? (
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCancel}
              className="h-8 px-2"
            >
              <X className="h-4 w-4 mr-1" />
              Annuler
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleSave}
              className="h-8 px-2"
            >
              <Save className="h-4 w-4 mr-1" />
              Sauvegarder
            </Button>
          </div>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(true)}
            className="h-8 px-2"
          >
            <Edit className="h-4 w-4 mr-1" />
            Modifier
          </Button>
        )}
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium text-lg mb-4">Informations d'accès</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Key className="h-5 w-5 text-primary mt-0.5" />
              <div className="w-full">
                <p className="font-medium">Code BAC</p>
                {isEditing ? (
                  <Input 
                    value={editedAccess.bacCode} 
                    onChange={(e) => handleInputChange('bacCode', e.target.value)} 
                    className="mt-1 font-mono"
                  />
                ) : (
                  <p className="text-muted-foreground font-mono">
                    {property.bacCode || "Non renseigné"}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-primary mt-0.5" />
              <div className="w-full">
                <p className="font-medium">Digicode</p>
                {isEditing ? (
                  <Input 
                    value={editedAccess.digicode} 
                    onChange={(e) => handleInputChange('digicode', e.target.value)} 
                    className="mt-1 font-mono"
                  />
                ) : (
                  <p className="text-muted-foreground font-mono">
                    {property.digicode || "Non renseigné"}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Wifi className="h-5 w-5 text-primary mt-0.5" />
              <div className="w-full">
                <p className="font-medium">Code Wi-Fi</p>
                {isEditing ? (
                  <Input 
                    value={editedAccess.wifiCode} 
                    onChange={(e) => handleInputChange('wifiCode', e.target.value)} 
                    className="mt-1 font-mono"
                  />
                ) : (
                  <p className="text-muted-foreground font-mono">
                    {property.wifiCode || "Non renseigné"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium text-lg mb-4">Emplacement</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Video className="h-5 w-5 text-primary mt-0.5" />
              <div className="w-full">
                <p className="font-medium">Vidéo de présentation</p>
                {isEditing ? (
                  <Input 
                    value={editedAccess.youtubeLink} 
                    onChange={(e) => handleInputChange('youtubeLink', e.target.value)} 
                    className="mt-1"
                    placeholder="URL de la vidéo YouTube"
                  />
                ) : (
                  <p className="text-muted-foreground">
                    <a 
                      href={property.youtubeLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      Voir la vidéo <ExternalLink className="h-3 w-3" />
                    </a>
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Home className="h-5 w-5 text-primary mt-0.5" />
              <div className="w-full">
                <p className="font-medium">Étage</p>
                {isEditing ? (
                  <Input 
                    value={editedAccess.floor} 
                    onChange={(e) => handleInputChange('floor', e.target.value)} 
                    className="mt-1"
                  />
                ) : (
                  <p className="text-muted-foreground">
                    {property.floor || "Non renseigné"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium text-lg mb-4">Notes de l'agent</h3>
          <div className="flex items-start gap-3">
            <StickyNote className="h-5 w-5 text-primary mt-0.5" />
            <div className="w-full">
              {isEditing ? (
                <Textarea 
                  value={editedAccess.agentNotes} 
                  onChange={(e) => handleInputChange('agentNotes', e.target.value)} 
                  className="mt-1"
                  rows={4}
                />
              ) : (
                <p className="text-muted-foreground whitespace-pre-line">
                  {property.agentNotes || "Aucune note disponible"}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium text-lg mb-4">Documents</h3>
          {isEditing ? (
            <div className="space-y-4">
              <ul className="space-y-3">
                {editedAccess.attachments && editedAccess.attachments.length > 0 ? (
                  editedAccess.attachments.map((doc, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-muted-foreground text-sm truncate">{doc.url}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(doc.id)}
                        className="h-7 w-7 p-0 text-destructive"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </li>
                  ))
                ) : (
                  <li className="text-muted-foreground">Aucun document disponible</li>
                )}
              </ul>
              
              <div className="border p-3 rounded-md space-y-3">
                <h4 className="text-sm font-medium">Ajouter un document</h4>
                <div className="space-y-2">
                  <Input
                    placeholder="Nom du document"
                    value={newAttachment.name}
                    onChange={(e) => handleAttachmentChange('name', e.target.value)}
                  />
                  <Input
                    placeholder="URL du document"
                    value={newAttachment.url}
                    onChange={(e) => handleAttachmentChange('url', e.target.value)}
                  />
                  <Button
                    onClick={addAttachment}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter le document
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {property.attachments && property.attachments.length > 0 ? (
                property.attachments.map((doc, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-muted-foreground">
                        <a 
                          href={doc.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          Télécharger <ExternalLink className="h-3 w-3" />
                        </a>
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-muted-foreground">Aucun document disponible</li>
              )}
            </ul>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};
