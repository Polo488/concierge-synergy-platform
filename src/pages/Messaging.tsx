
import React, { useState } from 'react';
import { useMessaging } from '@/hooks/useMessaging';
import { useOperations } from '@/contexts/OperationsContext';
import { ConversationList } from '@/components/messaging/ConversationList';
import { MessageThread } from '@/components/messaging/MessageThread';
import { ContextPanel } from '@/components/messaging/ContextPanel';
import { CreateMaintenanceFromMessageDialog } from '@/components/messaging/dialogs/CreateMaintenanceFromMessageDialog';
import { CreateCleaningIssueFromMessageDialog } from '@/components/messaging/dialogs/CreateCleaningIssueFromMessageDialog';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { MessagingMaintenanceFormData, MessagingCleaningIssueFormData } from '@/types/operations';
import { Conversation } from '@/types/messaging';

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

  const {
    createMaintenanceFromMessaging,
    createCleaningIssueFromMessaging,
    createRepasseFromMessaging,
    hasSimilarTask,
  } = useOperations();

  // Dialog states
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false);
  const [cleaningIssueDialogOpen, setCleaningIssueDialogOpen] = useState(false);
  const [dialogConversation, setDialogConversation] = useState<Conversation | null>(null);

  // Quick action handlers - now open dialogs instead of direct creation
  const handleCreateMaintenanceTask = (conversationId: string) => {
    const conv = conversations.find(c => c.id === conversationId);
    if (conv) {
      setDialogConversation(conv);
      setMaintenanceDialogOpen(true);
    }
  };

  const handleCreateCleaningIssue = (conversationId: string) => {
    const conv = conversations.find(c => c.id === conversationId);
    if (conv) {
      setDialogConversation(conv);
      setCleaningIssueDialogOpen(true);
    }
  };

  const handleCreateRepasse = (conversationId: string) => {
    // For direct repasse, we create a cleaning issue with repasse required
    const conv = conversations.find(c => c.id === conversationId);
    if (conv) {
      setDialogConversation(conv);
      setCleaningIssueDialogOpen(true);
    }
  };

  // Handle maintenance submission
  const handleMaintenanceSubmit = (data: MessagingMaintenanceFormData) => {
    // Create real maintenance task
    const task = createMaintenanceFromMessaging(data);
    
    // Also add linked task reference to conversation
    addLinkedTask(data.conversationId, {
      type: 'maintenance',
      title: data.title,
      status: 'En attente',
    });

    toast({
      title: "Tâche de maintenance créée",
      description: `"${data.title}" liée à la conversation`,
    });
  };

  // Handle cleaning issue submission
  const handleCleaningIssueSubmit = (data: MessagingCleaningIssueFormData, createRepasse: boolean) => {
    // Create real cleaning issue
    const issue = createCleaningIssueFromMessaging(data);
    
    // Add linked task reference to conversation
    addLinkedTask(data.conversationId, {
      type: 'cleaning',
      title: `Problème: ${data.issueTypes.join(', ')}`,
      status: 'Ouvert',
    });

    // If repasse required, create repasse task
    if (createRepasse) {
      createRepasseFromMessaging(
        issue.id,
        data.propertyId,
        data.propertyName,
        data.conversationId,
        data.reservationId
      );

      addLinkedTask(data.conversationId, {
        type: 'repasse',
        title: `Repasse - ${data.propertyName}`,
        status: 'Planifiée',
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

      {/* Dialogs */}
      <CreateMaintenanceFromMessageDialog
        open={maintenanceDialogOpen}
        onOpenChange={setMaintenanceDialogOpen}
        conversation={dialogConversation}
        hasSimilarTask={dialogConversation ? hasSimilarTask(dialogConversation.id, 'maintenance') : false}
        onSubmit={handleMaintenanceSubmit}
      />

      <CreateCleaningIssueFromMessageDialog
        open={cleaningIssueDialogOpen}
        onOpenChange={setCleaningIssueDialogOpen}
        conversation={dialogConversation}
        hasSimilarTask={dialogConversation ? hasSimilarTask(dialogConversation.id, 'cleaning_issue') : false}
        onSubmit={handleCleaningIssueSubmit}
      />
    </div>
  );
};

export default Messaging;
