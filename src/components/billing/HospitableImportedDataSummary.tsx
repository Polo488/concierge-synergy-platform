
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
                  const property = properties.find(p => p.id === reservation.property_id);
                  const guest = guests.find(g => g.id === reservation.guest_id);

                  return (
                    <TableRow key={reservation.id}>
                      <TableCell>{reservation.id}</TableCell>
                      <TableCell>{formatDate(reservation.check_in)}</TableCell>
                      <TableCell>{formatDate(reservation.check_out)}</TableCell>
                      <TableCell>{reservation.status}</TableCell>
                      <TableCell>{property?.name || `Propriété #${reservation.property_id}`}</TableCell>
                      <TableCell>
                        {guest 
                          ? `${guest.first_name} ${guest.last_name}` 
                          : `Client #${reservation.guest_id}`}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(reservation.amount, reservation.currency)}
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
                  <TableRow key={property.id}>
                    <TableCell>{property.id}</TableCell>
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
                    <TableCell>{guest.phone || 'Non spécifié'}</TableCell>
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
