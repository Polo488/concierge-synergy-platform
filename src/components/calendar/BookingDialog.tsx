
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Booking, Property } from '@/hooks/calendar/types';

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  properties: Property[];
  onBookingSubmit: (booking: Booking) => void;
  selectedBooking: Booking | null;
}

export const BookingDialog: React.FC<BookingDialogProps> = ({
  open,
  onOpenChange,
  properties,
  onBookingSubmit,
  selectedBooking
}) => {
  // Form state
  const [propertyId, setPropertyId] = useState<number>(0);
  const [guestName, setGuestName] = useState("");
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<"confirmed" | "pending" | "completed">("confirmed");
  
  // Initialize form with selected booking data if it exists
  useEffect(() => {
    if (selectedBooking) {
      setPropertyId(selectedBooking.propertyId);
      setGuestName(selectedBooking.guestName);
      setCheckIn(selectedBooking.checkIn);
      setCheckOut(selectedBooking.checkOut);
      setStatus(selectedBooking.status);
    } else {
      // Reset form
      setPropertyId(properties[0]?.id || 0);
      setGuestName("");
      setCheckIn(undefined);
      setCheckOut(undefined);
      setStatus("confirmed");
    }
  }, [selectedBooking, properties]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!propertyId || !guestName || !checkIn || !checkOut) {
      // Show validation errors
      return;
    }
    
    const booking: Booking = {
      id: selectedBooking?.id || Date.now(), // Use existing ID or generate new one
      propertyId,
      guestName,
      checkIn,
      checkOut,
      status,
      color: status === 'confirmed' ? '#4CAF50' : status === 'pending' ? '#FFC107' : '#9E9E9E'
    };
    
    onBookingSubmit(booking);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{selectedBooking ? "Modifier la réservation" : "Nouvelle réservation"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="property">Propriété</Label>
            <Select
              value={propertyId.toString()}
              onValueChange={(value) => setPropertyId(parseInt(value))}
            >
              <SelectTrigger id="property">
                <SelectValue placeholder="Sélectionner une propriété" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id.toString()}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="guestName">Nom du client</Label>
            <Input
              id="guestName"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Nom du client"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="checkIn">Date d'arrivée</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkIn && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkIn ? format(checkIn, "dd/MM/yyyy") : <span>Sélectionner</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={setCheckIn}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex-1 space-y-2">
              <Label htmlFor="checkOut">Date de départ</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkOut && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOut ? format(checkOut, "dd/MM/yyyy") : <span>Sélectionner</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={setCheckOut}
                    initialFocus
                    disabled={(date) => date < (checkIn || new Date())}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as "confirmed" | "pending" | "completed")}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confirmed">Confirmé</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {selectedBooking ? "Mettre à jour" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
