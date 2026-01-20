
import React from 'react';
import { useMessaging } from '@/hooks/useMessaging';
import { ConversationList } from '@/components/messaging/ConversationList';
import { MessageThread } from '@/components/messaging/MessageThread';
import { ContextPanel } from '@/components/messaging/ContextPanel';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Messaging = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const {
    conversations,
    selectedConversation,
    selectedConversationId,
    filters,
    setFilters,
    properties,
    quickReplies,
    stats,
    selectConversation,
    sendMessage,
    updateConversationStatus,
    toggleTag,
    togglePriority,
    addLinkedTask,
  } = useMessaging();

  // Quick action handlers
  const handleCreateMaintenanceTask = (conversationId: string) => {
    const conv = conversations.find(c => c.id === conversationId);
    if (conv) {
      addLinkedTask(conversationId, {
        type: 'maintenance',
        title: `Maintenance - ${conv.reservation.propertyName}`,
        status: 'À faire',
      });
      toast({
        title: "Tâche créée",
        description: "La tâche de maintenance a été ajoutée",
      });
    }
  };

  const handleCreateCleaningIssue = (conversationId: string) => {
    const conv = conversations.find(c => c.id === conversationId);
    if (conv) {
      addLinkedTask(conversationId, {
        type: 'cleaning',
        title: `Problème ménage - ${conv.reservation.propertyName}`,
        status: 'À traiter',
      });
      toast({
        title: "Problème signalé",
        description: "Le problème de ménage a été enregistré",
      });
    }
  };

  const handleCreateRepasse = (conversationId: string) => {
    const conv = conversations.find(c => c.id === conversationId);
    if (conv) {
      addLinkedTask(conversationId, {
        type: 'repasse',
        title: `Repasse - ${conv.reservation.propertyName}`,
        status: 'Planifié',
      });
      toast({
        title: "Repasse planifiée",
        description: "La repasse a été ajoutée au planning",
      });
    }
  };

  const handleCreateAgendaNote = (conversationId: string) => {
    const conv = conversations.find(c => c.id === conversationId);
    if (conv) {
      addLinkedTask(conversationId, {
        type: 'agenda',
        title: `Note - ${conv.guest.name}`,
        status: 'Active',
      });
      toast({
        title: "Note ajoutée",
        description: "La note a été ajoutée à l'agenda",
      });
    }
  };

  const handleSendUpsell = (conversationId: string) => {
    toast({
      title: "Offre upsell",
      description: "Sélectionnez une offre à envoyer au voyageur",
    });
  };

  const handleOpenProperty = (propertyId: string) => {
    navigate('/properties');
    toast({
      title: "Propriété",
      description: "Redirection vers la fiche propriété",
    });
  };

  const handleOpenReservation = (reservationId: string) => {
    navigate('/calendar');
    toast({
      title: "Réservation",
      description: "Redirection vers le calendrier",
    });
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Left column - Conversation list */}
      <div className="w-80 flex-shrink-0">
        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onSelectConversation={selectConversation}
          filters={filters}
          onFiltersChange={setFilters}
          properties={properties}
          stats={stats}
        />
      </div>

      {/* Center column - Message thread */}
      <div className="flex-1 min-w-0">
        <MessageThread
          conversation={selectedConversation}
          quickReplies={quickReplies}
          onSendMessage={sendMessage}
          onUpdateStatus={updateConversationStatus}
          onToggleTag={toggleTag}
          onTogglePriority={togglePriority}
        />
      </div>

      {/* Right column - Context panel */}
      <ContextPanel
        conversation={selectedConversation}
        onCreateMaintenanceTask={handleCreateMaintenanceTask}
        onCreateCleaningIssue={handleCreateCleaningIssue}
        onCreateRepasse={handleCreateRepasse}
        onCreateAgendaNote={handleCreateAgendaNote}
        onSendUpsell={handleSendUpsell}
        onOpenProperty={handleOpenProperty}
        onOpenReservation={handleOpenReservation}
      />
    </div>
  );
};

export default Messaging;
