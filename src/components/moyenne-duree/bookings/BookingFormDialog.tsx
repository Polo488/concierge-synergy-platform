
import { BookingForm, SelectOption } from "../types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface BookingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  bookingForm: BookingForm;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  commissionRates: SelectOption[];
  commissionSplits: SelectOption[];
  bookingSources: SelectOption[];
}

export const BookingFormDialog = ({
  open,
  onOpenChange,
  isEditing,
  bookingForm,
  onInputChange,
  onSubmit,
  onCancel,
  commissionRates,
  commissionSplits,
  bookingSources
}: BookingFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifier la réservation" : "Nouvelle réservation"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Modifiez les informations de la réservation" 
              : "Ajoutez les informations de la nouvelle réservation"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[calc(80vh-180px)] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="property">Bien immobilier *</Label>
            <Input
              id="property"
              name="property"
              value={bookingForm.property}
              onChange={onInputChange}
              placeholder="Nom du bien immobilier"
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="tenant">Locataire *</Label>
            <Input
              id="tenant"
              name="tenant"
              value={bookingForm.tenant}
              onChange={onInputChange}
              placeholder="Nom du locataire"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="startDate">Date de début *</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={bookingForm.startDate}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="endDate">Date de fin *</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={bookingForm.endDate}
                onChange={onInputChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="amount">Montant total (€) *</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="0"
                step="0.01"
                value={bookingForm.amount}
                onChange={onInputChange}
                placeholder="0.00"
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="cleaningFee">Frais de ménage (€)</Label>
              <Input
                id="cleaningFee"
                name="cleaningFee"
                type="number"
                min="0"
                step="0.01"
                value={bookingForm.cleaningFee}
                onChange={onInputChange}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="source">Source de la réservation *</Label>
            <Select
              name="source"
              value={bookingForm.source}
              onValueChange={(value) => {
                onInputChange({
                  target: { name: "source", value },
                } as React.ChangeEvent<HTMLSelectElement>);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une source" />
              </SelectTrigger>
              <SelectContent>
                {bookingSources.map((source) => (
                  <SelectItem key={source.value} value={source.value}>
                    {source.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="commissionRate">Taux de commission *</Label>
            <Select
              name="commissionRate"
              value={bookingForm.commissionRate}
              onValueChange={(value) => {
                onInputChange({
                  target: { name: "commissionRate", value },
                } as React.ChangeEvent<HTMLSelectElement>);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un taux" />
              </SelectTrigger>
              <SelectContent>
                {commissionRates.map((rate) => (
                  <SelectItem key={rate.value} value={rate.value}>
                    {rate.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <Label>Répartition de la commission</Label>
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div>BnB Lyon: {bookingForm.bnbLyonSplit}%</div>
                <Select
                  name="bnbLyonSplit"
                  value={bookingForm.bnbLyonSplit}
                  onValueChange={(value) => {
                    onInputChange({
                      target: { name: "bnbLyonSplit", value },
                    } as React.ChangeEvent<HTMLSelectElement>);
                  }}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="%" />
                  </SelectTrigger>
                  <SelectContent>
                    {commissionSplits.map((split) => (
                      <SelectItem key={split.value} value={split.value}>
                        {split.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-lg font-semibold mx-4">/</div>
              <div className="space-y-1">
                <div>Hamac: {bookingForm.hamacSplit}%</div>
                <Select
                  name="hamacSplit"
                  value={bookingForm.hamacSplit}
                  onValueChange={(value) => {
                    onInputChange({
                      target: { name: "hamacSplit", value },
                    } as React.ChangeEvent<HTMLSelectElement>);
                  }}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="%" />
                  </SelectTrigger>
                  <SelectContent>
                    {commissionSplits.map((split) => (
                      <SelectItem key={split.value} value={split.value}>
                        {split.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-2 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="monthlyPayment" 
                name="monthlyPayment"
                checked={bookingForm.monthlyPayment}
                onCheckedChange={(checked) => {
                  onInputChange({
                    target: { 
                      name: "monthlyPayment", 
                      checked: checked === true, 
                      type: "checkbox",
                      value: checked ? "true" : "false"
                    },
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
              />
              <Label htmlFor="monthlyPayment">Paiement mensuel</Label>
            </div>
          </div>
          
          {bookingForm.monthlyPayment && (
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="paymentDay">Jour de paiement mensuel</Label>
              <Input
                id="paymentDay"
                name="paymentDay"
                type="number"
                min="1"
                max="28"
                value={bookingForm.paymentDay}
                onChange={onInputChange}
                placeholder="Jour du mois (1-28)"
              />
              <p className="text-sm text-muted-foreground">
                Laisser vide pour utiliser le jour de début comme jour de paiement mensuel
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" onClick={onSubmit}>
            {isEditing ? "Mettre à jour" : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
