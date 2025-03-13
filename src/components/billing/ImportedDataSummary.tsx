
import React from 'react';
import { BookingSyncImportResult } from '@/types/bookingSync';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ImportedDataSummaryProps {
  data: BookingSyncImportResult;
}

export function ImportedDataSummary({ data }: ImportedDataSummaryProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy HH:mm', { locale: fr });
  };

  const formatPrice = (cents: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency || 'EUR',
    }).format(cents / 100);
  };

  return (
    <Card className="mt-4 border-green-500/20 bg-green-500/5">
      <CardHeader>
        <CardTitle>Résumé de l'importation</CardTitle>
        <CardDescription>
          L'importation a été réalisée avec succès. {data.bookings.length} réservations,{' '}
          {data.rentals.length} propriétés, {data.clients.length} clients et{' '}
          {data.payments.length} paiements ont été importés.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bookings">
          <TabsList className="w-full">
            <TabsTrigger value="bookings" className="flex-1">
              Réservations ({data.bookings.length})
            </TabsTrigger>
            <TabsTrigger value="rentals" className="flex-1">
              Propriétés ({data.rentals.length})
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex-1">
              Clients ({data.clients.length})
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex-1">
              Paiements ({data.payments.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings">
            <ScrollArea className="h-[300px]">
              <div className="space-y-4 p-1">
                {data.bookings.map((booking) => {
                  const rental = data.rentals.find(r => r.id === booking.rental_id);
                  const client = data.clients.find(c => c.id === booking.client_id);
                  
                  return (
                    <div key={booking.id} className="rounded-md border p-3">
                      <div className="flex justify-between">
                        <div className="font-medium">
                          {rental?.name || `Propriété #${booking.rental_id}`}
                        </div>
                        <div className={`px-2 py-0.5 rounded-full text-xs ${
                          booking.status === 'Booked' ? 'bg-green-100 text-green-800' :
                          booking.status === 'Canceled' ? 'bg-red-100 text-red-800' :
                          booking.status === 'Tentative' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        <div className="flex justify-between">
                          <span>Client: {client ? `${client.firstname} ${client.lastname}` : `Client #${booking.client_id}`}</span>
                          <span>{formatPrice(booking.price_cents, booking.currency)}</span>
                        </div>
                        <div className="mt-1">
                          Du {formatDate(booking.start_at)} au {formatDate(booking.end_at)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="rentals">
            <ScrollArea className="h-[300px]">
              <div className="space-y-4 p-1">
                {data.rentals.map((rental) => (
                  <div key={rental.id} className="rounded-md border p-3">
                    <div className="font-medium">{rental.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      <div className="grid grid-cols-2 gap-2">
                        <span>Chambres: {rental.bedrooms_count}</span>
                        <span>Salles de bain: {rental.bathrooms_count}</span>
                        <span>Surface: {rental.surface} {rental.surface_unit}</span>
                        <span>
                          Adresse: {rental.address?.city || 'N/A'}, {rental.address?.country_code || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="clients">
            <ScrollArea className="h-[300px]">
              <div className="space-y-4 p-1">
                {data.clients.map((client) => (
                  <div key={client.id} className="rounded-md border p-3">
                    <div className="font-medium">{client.firstname} {client.lastname}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      <div>Email: {client.email || 'Non spécifié'}</div>
                      <div>Téléphone: {client.phone || 'Non spécifié'}</div>
                      <div>Créé le: {formatDate(client.created_at)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="payments">
            <ScrollArea className="h-[300px]">
              <div className="space-y-4 p-1">
                {data.payments.map((payment) => {
                  const booking = data.bookings.find(b => b.id === payment.booking_id);
                  return (
                    <div key={payment.id} className="rounded-md border p-3">
                      <div className="flex justify-between">
                        <div className="font-medium">
                          Paiement #{payment.id} pour la réservation #{payment.booking_id}
                        </div>
                        <div className={`px-2 py-0.5 rounded-full text-xs ${
                          payment.status === 'Captured' ? 'bg-green-100 text-green-800' :
                          payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          payment.status === 'Refunded' ? 'bg-blue-100 text-blue-800' :
                          payment.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {payment.status}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        <div className="flex justify-between">
                          <span>Méthode: {payment.payment_method}</span>
                          <span className="font-medium">{formatPrice(payment.amount_cents, payment.currency)}</span>
                        </div>
                        <div className="mt-1">
                          Date: {formatDate(payment.created_at)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
