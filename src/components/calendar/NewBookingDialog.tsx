
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { Property } from '@/hooks/useCalendarData';
import { useForm } from 'react-hook-form';
import { Key, Wifi, Layers, Video, StickyNote } from 'lucide-react';

interface NewBookingFormData {
  propertyId: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'pending';
  // Nouveaux champs pour les informations d'accès
  bacCode?: string;
  wifiCode?: string;
  floor?: string;
  youtubeLink?: string;
  agentNotes?: string;
}

interface NewBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  properties: Property[];
  selectedDate?: Date;
  selectedProperty?: Property;
  onAddBooking: (booking: any) => void;
}

export const NewBookingDialog = ({
  open,
  onOpenChange,
  properties,
  selectedDate,
  selectedProperty,
  onAddBooking
}: NewBookingDialogProps) => {
  const [activeTab, setActiveTab] = useState('details');
  const [selectedPropertyData, setSelectedPropertyData] = useState<Property | undefined>(selectedProperty);

  const form = useForm<NewBookingFormData>({
    defaultValues: {
      propertyId: selectedProperty ? selectedProperty.id.toString() : '',
      guestName: '',
      checkIn: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
      checkOut: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
      status: 'confirmed',
      bacCode: selectedProperty?.bacCode || '',
      wifiCode: selectedProperty?.wifiCode || '',
      floor: selectedProperty?.floor || '',
      youtubeLink: selectedProperty?.youtubeLink || '',
      agentNotes: selectedProperty?.agentNotes || ''
    }
  });

  // Update form values when props change
  useEffect(() => {
    if (selectedProperty) {
      form.setValue('propertyId', selectedProperty.id.toString());
      setSelectedPropertyData(selectedProperty);
      
      // Remplir les champs d'accès avec les données existantes
      if (selectedProperty.bacCode) form.setValue('bacCode', selectedProperty.bacCode);
      if (selectedProperty.wifiCode) form.setValue('wifiCode', selectedProperty.wifiCode);
      if (selectedProperty.floor) form.setValue('floor', selectedProperty.floor);
      if (selectedProperty.youtubeLink) form.setValue('youtubeLink', selectedProperty.youtubeLink);
      if (selectedProperty.agentNotes) form.setValue('agentNotes', selectedProperty.agentNotes);
    }
    if (selectedDate) {
      form.setValue('checkIn', format(selectedDate, 'yyyy-MM-dd'));
      form.setValue('checkOut', format(selectedDate, 'yyyy-MM-dd'));
    }
  }, [selectedDate, selectedProperty, form]);

  // Handle property selection change
  const handlePropertyChange = (propertyId: string) => {
    const property = properties.find(p => p.id.toString() === propertyId);
    setSelectedPropertyData(property);
    
    if (property) {
      form.setValue('bacCode', property.bacCode || '');
      form.setValue('wifiCode', property.wifiCode || '');
      form.setValue('floor', property.floor || '');
      form.setValue('youtubeLink', property.youtubeLink || '');
      form.setValue('agentNotes', property.agentNotes || '');
    }
  };

  const handleSubmit = (data: NewBookingFormData) => {
    // Create a new booking object
    const newBooking = {
      id: Math.floor(Math.random() * 1000),
      propertyId: parseInt(data.propertyId),
      guestName: data.guestName,
      checkIn: new Date(data.checkIn),
      checkOut: new Date(data.checkOut),
      status: data.status,
      // Default color based on status
      color: data.status === 'confirmed' ? '#4CAF50' : '#FFC107'
    };

    // Update property data with access information if changed
    if (selectedPropertyData) {
      const updatedProperty = {
        ...selectedPropertyData,
        bacCode: data.bacCode || selectedPropertyData.bacCode,
        wifiCode: data.wifiCode || selectedPropertyData.wifiCode,
        floor: data.floor || selectedPropertyData.floor,
        youtubeLink: data.youtubeLink || selectedPropertyData.youtubeLink,
        agentNotes: data.agentNotes || selectedPropertyData.agentNotes
      };
      
      // TODO: Implement property update function
      console.log("Property updated with new access information:", updatedProperty);
    }

    onAddBooking(newBooking);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Nouvelle réservation</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="details">Réservation</TabsTrigger>
                <TabsTrigger value="access">Accès</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <FormField
                  control={form.control}
                  name="propertyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logement</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handlePropertyChange(value);
                        }}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un logement" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {properties.map((property) => (
                            <SelectItem key={property.id} value={property.id.toString()}>
                              {property.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="guestName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du client</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom du client" {...field} required />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="checkIn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Arrivée</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} required />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="checkOut"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Départ</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} required />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Statut</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un statut" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="confirmed">Confirmé</SelectItem>
                          <SelectItem value="pending">En attente</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="access" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bacCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <Key className="h-4 w-4" />
                          Code BAC
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="A1234" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="wifiCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <Wifi className="h-4 w-4" />
                          Code Wi-Fi
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="WIFI-2024" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="floor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <Layers className="h-4 w-4" />
                          Étage
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="3ème étage" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="youtubeLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <Video className="h-4 w-4" />
                          Lien YouTube
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="https://youtu.be/..." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="notes" className="space-y-4">
                <FormField
                  control={form.control}
                  name="agentNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <StickyNote className="h-4 w-4" />
                        Notes pour les agents
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Informations utiles pour les agents (parking, équipements, particularités...)" 
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {/* TODO: Ajout de fichiers si nécessaire */}
                <div className="text-sm text-muted-foreground mt-2">
                  Les notes seront enregistrées et accessibles pour tous les agents lors des prochaines réservations pour ce logement.
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">Ajouter</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
