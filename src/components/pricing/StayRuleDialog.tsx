
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { StayRule, SEASON_LABELS, CHANNEL_LABELS, BookingChannel, SeasonType } from '@/types/pricing';

const stayRuleSchema = z.object({
  propertyId: z.union([z.literal('all'), z.number()]),
  channel: z.enum(['airbnb', 'booking', 'vrbo', 'direct', 'other', 'all'] as const),
  season: z.enum(['low', 'mid', 'high', 'peak', 'all'] as const),
  minNights: z.number().min(1, 'Minimum 1 nuit').max(365, 'Maximum 365 nuits'),
  maxNights: z.number().min(1, 'Minimum 1 nuit').max(365, 'Maximum 365 nuits'),
  priority: z.number().min(1, 'Minimum 1').max(100, 'Maximum 100'),
  isActive: z.boolean(),
}).refine((data) => data.minNights <= data.maxNights, {
  message: 'Le minimum doit être inférieur ou égal au maximum',
  path: ['minNights'],
});

type StayRuleFormData = z.infer<typeof stayRuleSchema>;

interface StayRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule: StayRule | null;
  onSave: (data: Omit<StayRule, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

// Mock properties - would come from your data source
const mockProperties = [
  { id: 1, name: 'Appartement Marais' },
  { id: 2, name: 'Studio Bastille' },
  { id: 3, name: 'Loft Montmartre' },
  { id: 4, name: 'Suite Champs-Élysées' },
];

export function StayRuleDialog({ open, onOpenChange, rule, onSave }: StayRuleDialogProps) {
  const form = useForm<StayRuleFormData>({
    resolver: zodResolver(stayRuleSchema),
    defaultValues: {
      propertyId: 'all',
      channel: 'all',
      season: 'all',
      minNights: 2,
      maxNights: 30,
      priority: 1,
      isActive: true,
    },
  });

  useEffect(() => {
    if (rule) {
      form.reset({
        propertyId: rule.propertyId,
        channel: rule.channel,
        season: rule.season,
        minNights: rule.minNights,
        maxNights: rule.maxNights,
        priority: rule.priority,
        isActive: rule.isActive,
      });
    } else {
      form.reset({
        propertyId: 'all',
        channel: 'all',
        season: 'all',
        minNights: 2,
        maxNights: 30,
        priority: 1,
        isActive: true,
      });
    }
  }, [rule, form]);

  const handleSubmit = (data: StayRuleFormData) => {
    const propertyName = data.propertyId === 'all' 
      ? undefined 
      : mockProperties.find(p => p.id === data.propertyId)?.name;
    
    onSave({
      propertyId: data.propertyId,
      channel: data.channel,
      season: data.season,
      minNights: data.minNights,
      maxNights: data.maxNights,
      priority: data.priority,
      isActive: data.isActive,
      propertyName,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {rule ? 'Modifier la règle' : 'Nouvelle règle de séjour'}
          </DialogTitle>
          <DialogDescription>
            Définissez les conditions de durée de séjour
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="propertyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Propriété</FormLabel>
                  <Select
                    value={String(field.value)}
                    onValueChange={(value) => field.onChange(value === 'all' ? 'all' : Number(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une propriété" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">Toutes les propriétés</SelectItem>
                      {mockProperties.map((property) => (
                        <SelectItem key={property.id} value={String(property.id)}>
                          {property.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="channel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Canal</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(Object.entries(CHANNEL_LABELS) as [BookingChannel, string][]).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="season"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Saison</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(Object.entries(SEASON_LABELS) as [SeasonType, string][]).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minNights"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum de nuits</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={365}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxNights"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum de nuits</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={365}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priorité</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Plus le chiffre est bas, plus la règle est prioritaire
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Règle active</FormLabel>
                    <FormDescription>
                      Activer ou désactiver cette règle
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">
                {rule ? 'Mettre à jour' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
