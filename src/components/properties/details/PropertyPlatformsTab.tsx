
import { Card, CardContent } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Globe, ExternalLink } from 'lucide-react';
import { Property, platformLinks } from '@/utils/propertyUtils';

interface PropertyPlatformsTabProps {
  property: Property;
}

export const PropertyPlatformsTab = ({ property }: PropertyPlatformsTabProps) => {
  return (
    <TabsContent value="platforms" className="space-y-4 mt-4">
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium text-lg mb-4">Plateformes de location</h3>
          <div className="space-y-4">
            {platformLinks.map((platform, index) => (
              <div key={index} className="flex items-start gap-3">
                <Globe className="h-4 w-4" />
                <div>
                  <p className="font-medium">{platform.name}</p>
                  <p className="text-muted-foreground">
                    <a 
                      href={platform.url(property.id)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      Voir l'annonce <ExternalLink className="h-3 w-3" />
                    </a>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
