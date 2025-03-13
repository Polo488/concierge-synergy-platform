
import React from 'react';
import {
  HospitableImportResult,
  HospitableReservation,
  HospitableProperty,
  HospitableGuest,
  HospitableTransaction
} from '@/types/hospitable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Props {
  data: HospitableImportResult;
}

export function HospitableImportedDataSummary({ data }: Props) {
  const { reservations, properties, guests, transactions } = data;

  // Helper function to format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency || 'EUR'
    }).format(amount);
  };

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy', { locale: fr });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Données importées</CardTitle>
        <CardDescription>
          Résumé des données importées depuis Hospitable
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="reservations">
          <TabsList className="mb-4">
            <TabsTrigger value="reservations">
              Réservations ({reservations.length})
            </TabsTrigger>
            <TabsTrigger value="properties">
              Propriétés ({properties.length})
            </TabsTrigger>
            <TabsTrigger value="guests">
              Clients ({guests.length})
            </TabsTrigger>
            <TabsTrigger value="transactions">
              Transactions ({transactions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reservations">
            <Table>
              <TableCaption>Liste des réservations importées</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Arrivée</TableHead>
                  <TableHead>Départ</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Propriété</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation: HospitableReservation) => {
                  const property = properties.find(p => p.uuid === reservation.property_uuid);
                  const guest = guests.find(g => g.id === reservation.guest_id);

                  return (
                    <TableRow key={reservation.id || reservation.uuid}>
                      <TableCell>{reservation.id || reservation.uuid}</TableCell>
                      <TableCell>{formatDate(reservation.arrival_date)}</TableCell>
                      <TableCell>{formatDate(reservation.departure_date)}</TableCell>
                      <TableCell>{reservation.reservation_status.current}</TableCell>
                      <TableCell>{property?.name || `Propriété #${reservation.property_uuid}`}</TableCell>
                      <TableCell>
                        {guest 
                          ? `${guest.first_name} ${guest.last_name}` 
                          : `Client #${reservation.guest_id}`}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(
                          reservation.financials.guest.total_price,
                          reservation.financials.currency
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="properties">
            <Table>
              <TableCaption>Liste des propriétés importées</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Chambres</TableHead>
                  <TableHead>Salles de bain</TableHead>
                  <TableHead>Surface</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property: HospitableProperty) => (
                  <TableRow key={property.uuid}>
                    <TableCell>{property.id || property.uuid}</TableCell>
                    <TableCell>{property.name}</TableCell>
                    <TableCell>
                      {property.address
                        ? `${property.address.street || ''}, ${property.address.zip || ''} ${property.address.city || ''}`
                        : 'Adresse non spécifiée'}
                    </TableCell>
                    <TableCell>{property.bedrooms_count}</TableCell>
                    <TableCell>{property.bathrooms_count}</TableCell>
                    <TableCell>{`${property.surface} ${property.surface_unit}`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="guests">
            <Table>
              <TableCaption>Liste des clients importés</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Créé le</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guests.map((guest: HospitableGuest) => (
                  <TableRow key={guest.id}>
                    <TableCell>{guest.id}</TableCell>
                    <TableCell>{`${guest.first_name} ${guest.last_name}`}</TableCell>
                    <TableCell>{guest.email || 'Non spécifié'}</TableCell>
                    <TableCell>{guest.phone_numbers && guest.phone_numbers.length > 0 
                      ? guest.phone_numbers[0] 
                      : 'Non spécifié'}</TableCell>
                    <TableCell>{formatDate(guest.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="transactions">
            <Table>
              <TableCaption>Liste des transactions importées</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Réservation</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Méthode</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction: HospitableTransaction) => {
                  const reservation = reservations.find(r => r.id === transaction.reservation_id);
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.id}</TableCell>
                      <TableCell>#{transaction.reservation_id}</TableCell>
                      <TableCell>
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </TableCell>
                      <TableCell>{transaction.status}</TableCell>
                      <TableCell>{transaction.payment_method}</TableCell>
                      <TableCell>{formatDate(transaction.created_at)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
