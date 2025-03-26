
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Property } from '@/hooks/useCalendarData';
import { useForm } from 'react-hook-form';

interface NewBookingFormData {
  propertyId: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'pending';
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
  const form = useForm<NewBookingFormData>({
    defaultValues: {
      propertyId: selectedProperty ? selectedProperty.id.toString() : '',
      guestName: '',
      checkIn: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
      checkOut: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
      status: 'confirmed'
    }
  });

  // Update form values when props change
  useEffect(() => {
    if (selectedProperty) {
      form.setValue('propertyId', selectedProperty.id.toString());
    }
    if (selectedDate) {
      form.setValue('checkIn', format(selectedDate, 'yyyy-MM-dd'));
      form.setValue('checkOut', format(selectedDate, 'yyyy-MM-dd'));
    }
  }, [selectedDate, selectedProperty, form]);

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

    onAddBooking(newBooking);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle réservation</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="propertyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logement</FormLabel>
                <Select
                  onValueChange={field.onChange}
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
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Ajouter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
