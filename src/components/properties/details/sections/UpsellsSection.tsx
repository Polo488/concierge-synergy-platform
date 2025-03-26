
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, TrendingUp, ExternalLink, Link, Home, Calendar } from 'lucide-react';
import { Property } from '@/utils/propertyUtils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useCalendarData } from '@/hooks/useCalendarData';
import { format } from 'date-fns';

interface UpsellsSectionProps {
  property: Property;
}

export const UpsellsSection = ({ property }: UpsellsSectionProps) => {
  const { toast } = useToast();
  const { bookings } = useCalendarData();
  
  if (!property.upsells) return null;
  
  const { available, totalRevenue } = property.upsells;
  const totalSold = available.reduce((acc, item) => acc + item.sold, 0);
  
  const copyLinkToClipboard = (serviceLink: string) => {
    navigator.clipboard.writeText(serviceLink);
    toast({
      title: "Lien copié",
      description: "Le lien de vente a été copié dans le presse-papier."
    });
  };

  // Helper function to get booking details
  const getBookingDetails = (bookingId?: string) => {
    if (!bookingId) return null;
    const booking = bookings.find(b => b.id.toString() === bookingId);
    if (!booking) return null;
    return {
      guestName: booking.guestName,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut
    };
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-lg flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Upsells et Services
          </h3>
          <span className="text-sm font-medium">
            Revenus: {totalRevenue}€
          </span>
        </div>
        
        <div className="space-y-4">
          {available.map((upsell) => {
            const percentage = totalSold ? Math.round((upsell.sold / totalSold) * 100) : 0;
            const bookingDetails = getBookingDetails(upsell.bookingId);
            
            return (
              <div key={upsell.id} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="font-medium text-sm flex items-center gap-2">
                    {upsell.name}
                    {upsell.salesLink && (
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-5 w-5 p-0"
                          onClick={() => copyLinkToClipboard(upsell.salesLink!)}
                          title="Copier le lien"
                        >
                          <Link className="h-3 w-3" />
                        </Button>
                        <a 
                          href={upsell.salesLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="text-sm">{upsell.price/100}€ × {upsell.sold} = {(upsell.price * upsell.sold)/100}€</div>
                </div>
                
                {bookingDetails && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span title={`${format(bookingDetails.checkIn, 'dd/MM/yyyy')} - ${format(bookingDetails.checkOut, 'dd/MM/yyyy')}`}>
                      {bookingDetails.guestName}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Progress value={percentage} className="h-2" />
                  <span className="text-xs text-muted-foreground w-10">{percentage}%</span>
                </div>
              </div>
            );
          })}
          
          {totalSold === 0 && (
            <div className="flex items-center gap-2 justify-center py-4 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Aucune vente enregistrée pour ce logement</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
