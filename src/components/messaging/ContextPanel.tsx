
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  User, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  CreditCard,
  Wifi,
  Key,
  Star,
  ExternalLink,
  Wrench,
  Sparkles,
  CalendarPlus,
  ClipboardList,
  Package,
  Home,
  Users,
  Clock,
  MessageSquare,
  StickyNote
} from 'lucide-react';
import { 
  Conversation, 
  LinkedTask,
  CHANNEL_ICONS,
  STATUS_LABELS,
} from '@/types/messaging';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

interface ContextPanelProps {
  conversation: Conversation | null;
  onCreateMaintenanceTask: (conversationId: string) => void;
  onCreateCleaningIssue: (conversationId: string) => void;
  onCreateRepasse: (conversationId: string) => void;
  onCreateAgendaNote: (conversationId: string) => void;
  onSendUpsell: (conversationId: string) => void;
  onOpenProperty: (propertyId: string) => void;
  onOpenReservation: (reservationId: string) => void;
}

export const ContextPanel: React.FC<ContextPanelProps> = ({
  conversation,
  onCreateMaintenanceTask,
  onCreateCleaningIssue,
  onCreateRepasse,
  onCreateAgendaNote,
  onSendUpsell,
  onOpenProperty,
  onOpenReservation,
}) => {
  if (!conversation) {
    return (
      <div className="w-80 border-l bg-muted/20 p-4 flex items-center justify-center">
        <p className="text-sm text-muted-foreground text-center">
          Sélectionnez une conversation pour voir le contexte
        </p>
      </div>
    );
  }

  const { guest, reservation, linkedTasks } = conversation;
  const stayDuration = differenceInDays(reservation.checkOut, reservation.checkIn);
  const isCurrentStay = new Date() >= reservation.checkIn && new Date() <= reservation.checkOut;
  const isUpcoming = new Date() < reservation.checkIn;

  return (
    <div className="w-80 border-l bg-background flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Guest Profile */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Voyageur
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {guest.firstName[0]}{guest.lastName[0]}
                </div>
                <div>
                  <p className="font-medium">{guest.name}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Globe className="h-3 w-3" />
                    {guest.language}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="truncate">{guest.email}</span>
                </div>
                {guest.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{guest.phone}</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Séjours</span>
                <Badge variant="secondary">{guest.totalStays}</Badge>
              </div>

              {guest.averageRating && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Note moyenne</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{guest.averageRating}</span>
                  </div>
                </div>
              )}

              {guest.notes && (
                <div className="p-2 bg-muted rounded text-xs">
                  <p className="text-muted-foreground italic">{guest.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reservation */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Réservation
                </CardTitle>
                <Badge variant={isCurrentStay ? 'default' : isUpcoming ? 'secondary' : 'outline'}>
                  {isCurrentStay ? 'En cours' : isUpcoming ? 'À venir' : 'Terminé'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{CHANNEL_ICONS[reservation.channel]}</span>
                <span className="text-sm font-medium capitalize">{reservation.channel}</span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Arrivée</span>
                  <span className="font-medium">
                    {format(reservation.checkIn, 'dd MMM yyyy', { locale: fr })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Départ</span>
                  <span className="font-medium">
                    {format(reservation.checkOut, 'dd MMM yyyy', { locale: fr })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Durée</span>
                  <span>{stayDuration} nuit{stayDuration > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Voyageurs</span>
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    <span>{reservation.guests}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Financial summary */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-medium">{reservation.totalAmount}€</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Payé</span>
                  <span className={cn(
                    reservation.paidAmount >= reservation.totalAmount 
                      ? 'text-green-600' 
                      : 'text-amber-600'
                  )}>
                    {reservation.paidAmount}€
                  </span>
                </div>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => onOpenReservation(reservation.id)}
              >
                <ExternalLink className="h-3.5 w-3.5 mr-2" />
                Voir réservation
              </Button>
            </CardContent>
          </Card>

          {/* Property */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Home className="h-4 w-4" />
                Propriété
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">{reservation.propertyName}</p>
                <div className="flex items-start gap-1 text-xs text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>{reservation.propertyAddress}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {reservation.accessCode && (
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex items-center gap-2">
                      <Key className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Code</span>
                    </div>
                    <code className="font-mono font-medium">{reservation.accessCode}</code>
                  </div>
                )}

                {reservation.wifiNetwork && (
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">WiFi</span>
                    </div>
                    <div className="text-right text-xs">
                      <p className="font-medium">{reservation.wifiNetwork}</p>
                      <p className="text-muted-foreground">{reservation.wifiPassword}</p>
                    </div>
                  </div>
                )}
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => onOpenProperty(reservation.propertyId)}
              >
                <ExternalLink className="h-3.5 w-3.5 mr-2" />
                Voir propriété
              </Button>
            </CardContent>
          </Card>

          {/* Linked Tasks */}
          {linkedTasks.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Tâches liées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {linkedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-2 bg-muted rounded text-sm"
                    >
                      <div className="flex items-center gap-2">
                        {task.type === 'maintenance' && <Wrench className="h-3.5 w-3.5" />}
                        {task.type === 'cleaning' && <Sparkles className="h-3.5 w-3.5" />}
                        {task.type === 'repasse' && <Clock className="h-3.5 w-3.5" />}
                        {task.type === 'agenda' && <CalendarPlus className="h-3.5 w-3.5" />}
                        <span className="truncate">{task.title}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {task.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Actions rapides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-auto py-2 flex-col gap-1"
                      onClick={() => onCreateMaintenanceTask(conversation.id)}
                    >
                      <Wrench className="h-4 w-4" />
                      <span className="text-xs">Maintenance</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Créer une tâche de maintenance</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-auto py-2 flex-col gap-1"
                      onClick={() => onCreateCleaningIssue(conversation.id)}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-xs">Problème</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Signaler un problème ménage</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-auto py-2 flex-col gap-1"
                      onClick={() => onCreateRepasse(conversation.id)}
                    >
                      <Clock className="h-4 w-4" />
                      <span className="text-xs">Repasse</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Créer une repasse</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-auto py-2 flex-col gap-1"
                      onClick={() => onCreateAgendaNote(conversation.id)}
                    >
                      <StickyNote className="h-4 w-4" />
                      <span className="text-xs">Note</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Ajouter une note à l'agenda</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-auto py-2 flex-col gap-1 col-span-2"
                      onClick={() => onSendUpsell(conversation.id)}
                    >
                      <Package className="h-4 w-4" />
                      <span className="text-xs">Envoyer une offre upsell</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Proposer un service additionnel</TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};
