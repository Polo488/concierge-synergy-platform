
import { Card, CardContent } from '@/components/ui/card';
import { Property } from '@/utils/propertyUtils';
import { TabsContent } from '@/components/ui/tabs';
import { Key, Lock, Wifi, Video, Home, StickyNote, FileText, ExternalLink } from 'lucide-react';

interface PropertyAccessTabProps {
  property: Property;
}

export const PropertyAccessTab = ({ property }: PropertyAccessTabProps) => {
  return (
    <TabsContent value="access" className="space-y-4 mt-4">
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium text-lg mb-4">Informations d'accès</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Key className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Code BAC</p>
                <p className="text-muted-foreground font-mono">
                  {property.bacCode || "Non renseigné"}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Digicode</p>
                <p className="text-muted-foreground font-mono">
                  {property.digicode || "Non renseigné"}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Wifi className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Code Wi-Fi</p>
                <p className="text-muted-foreground font-mono">
                  {property.wifiCode || "Non renseigné"}
                </p>
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
              <div>
                <p className="font-medium">Vidéo de présentation</p>
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
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Home className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Étage</p>
                <p className="text-muted-foreground">
                  {property.floor || "Non renseigné"}
                </p>
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
            <div>
              <p className="text-muted-foreground whitespace-pre-line">
                {property.agentNotes || "Aucune note disponible"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium text-lg mb-4">Documents</h3>
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
        </CardContent>
      </Card>
    </TabsContent>
  );
};
