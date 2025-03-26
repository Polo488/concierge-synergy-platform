
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Property } from '@/hooks/useCalendarData';
import { Key, Wifi, Layers, Video, NoteText, FileText } from 'lucide-react';

interface BookingDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBooking: any;
  properties: Property[];
}

export const BookingDetailsDialog = ({
  open,
  onOpenChange,
  selectedBooking,
  properties
}: BookingDetailsDialogProps) => {
  const [activeTab, setActiveTab] = useState("details");
  
  if (!selectedBooking) return null;

  const property = properties.find(p => p.id === selectedBooking.propertyId);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 rounded-full">Confirmé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 rounded-full">En attente</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-full">Terminé</Badge>;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Détails de la réservation</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">Réservation</TabsTrigger>
            <TabsTrigger value="access">Accès</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">
                {property?.name}
              </h3>
              <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
            </div>
            
            <div>
              <p className="font-medium text-sm">Client:</p>
              <p className="mt-1">{selectedBooking.guestName}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-sm">Arrivée:</p>
                <p className="mt-1">{format(selectedBooking.checkIn, 'dd/MM/yyyy')}</p>
              </div>
              <div>
                <p className="font-medium text-sm">Départ:</p>
                <p className="mt-1">{format(selectedBooking.checkOut, 'dd/MM/yyyy')}</p>
              </div>
            </div>
            
            <div>
              <p className="font-medium text-sm">Durée:</p>
              <p className="mt-1">
                {Math.ceil((selectedBooking.checkOut - selectedBooking.checkIn) / (1000 * 60 * 60 * 24))} nuits
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="access" className="space-y-4">
            {property?.bacCode && (
              <div className="flex items-start gap-3">
                <Key className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Code BAC</p>
                  <p className="mt-1 font-mono">{property.bacCode}</p>
                </div>
              </div>
            )}
            
            {property?.wifiCode && (
              <div className="flex items-start gap-3">
                <Wifi className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Code Wi-Fi</p>
                  <p className="mt-1 font-mono">{property.wifiCode}</p>
                </div>
              </div>
            )}
            
            {property?.floor && (
              <div className="flex items-start gap-3">
                <Layers className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Étage</p>
                  <p className="mt-1">{property.floor}</p>
                </div>
              </div>
            )}
            
            {property?.youtubeLink && (
              <div className="flex items-start gap-3">
                <Video className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Vidéo de présentation</p>
                  <a href={property.youtubeLink} target="_blank" rel="noopener noreferrer" className="mt-1 text-blue-600 hover:underline">
                    Voir la vidéo
                  </a>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="notes" className="space-y-4">
            {property?.agentNotes ? (
              <div className="flex items-start gap-3">
                <NoteText className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Notes des agents</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm">{property.agentNotes}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm italic">Aucune note disponible pour ce logement.</p>
            )}
            
            {property?.attachments?.length > 0 && (
              <div className="mt-4">
                <p className="font-medium text-sm mb-2">Documents associés</p>
                <div className="space-y-2">
                  {property.attachments.map(attachment => (
                    <div key={attachment.id} className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {attachment.name}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
