
import React, { useState } from 'react';
import { useMessaging } from '@/hooks/useMessaging';
import { useOperations } from '@/contexts/OperationsContext';
import { ConversationList } from '@/components/messaging/ConversationList';
import { MessageThread } from '@/components/messaging/MessageThread';
import { ContextPanel } from '@/components/messaging/ContextPanel';
import { CreateMaintenanceFromMessageDialog } from '@/components/messaging/dialogs/CreateMaintenanceFromMessageDialog';
import { CreateCleaningIssueFromMessageDialog } from '@/components/messaging/dialogs/CreateCleaningIssueFromMessageDialog';
import { TutorialTrigger } from '@/components/tutorial/TutorialTrigger';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { MessagingMaintenanceFormData, MessagingCleaningIssueFormData } from '@/types/operations';
import { Conversation } from '@/types/messaging';
import { useIsMobile } from '@/hooks/use-mobile';

const Messaging = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
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

  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false);
  const [cleaningIssueDialogOpen, setCleaningIssueDialogOpen] = useState(false);
  const [dialogConversation, setDialogConversation] = useState<Conversation | null>(null);

  // Mobile: show thread view when a conversation is selected
  const [mobileShowThread, setMobileShowThread] = useState(false);

  const handleSelectConversation = (id: string) => {
    selectConversation(id);
    if (isMobile) setMobileShowThread(true);
  };

  const handleBackToList = () => {
    setMobileShowThread(false);
  };

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
    const conv = conversations.find(c => c.id === conversationId);
    if (conv) {
      setDialogConversation(conv);
      setCleaningIssueDialogOpen(true);
    }
  };

  const handleMaintenanceSubmit = (data: MessagingMaintenanceFormData) => {
    createMaintenanceFromMessaging(data);
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

  const handleCleaningIssueSubmit = (data: MessagingCleaningIssueFormData, createRepasse: boolean) => {
    const issue = createCleaningIssueFromMessaging(data);
    addLinkedTask(data.conversationId, {
      type: 'cleaning',
      title: `Problème: ${data.issueTypes.join(', ')}`,
      status: 'Ouvert',
    });
    if (createRepasse) {
      createRepasseFromMessaging(issue.id, data.propertyId, data.propertyName, data.conversationId, data.reservationId);
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
      toast({ title: "Note ajoutée", description: "La note a été ajoutée à l'agenda" });
    }
  };

  const handleSendUpsell = () => {
    toast({ title: "Offre upsell", description: "Sélectionnez une offre à envoyer au voyageur" });
  };

  const handleOpenProperty = () => {
    navigate('/properties');
  };

  const handleOpenReservation = () => {
    navigate('/calendar');
  };

  // Mobile layout
  if (isMobile) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-transparent">
        <TutorialTrigger moduleId="messaging" />
        
        {mobileShowThread && selectedConversation ? (
          <MessageThread
            conversation={selectedConversation}
            quickReplies={quickReplies}
            onSendMessage={sendMessage}
            onUpdateStatus={updateConversationStatus}
            onToggleTag={toggleTag}
            onTogglePriority={togglePriority}
            onBack={handleBackToList}
            isMobile
          />
        ) : (
          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            onSelectConversation={handleSelectConversation}
            filters={filters}
            onFiltersChange={setFilters}
            properties={properties}
            stats={stats}
          />
        )}

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
  }

  // Desktop layout
  return (
    <div className="h-[calc(100vh-4rem)] flex bg-card">
      <TutorialTrigger moduleId="messaging" />
      
      <div className="w-80 flex-shrink-0">
        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onSelectConversation={handleSelectConversation}
          filters={filters}
          onFiltersChange={setFilters}
          properties={properties}
          stats={stats}
        />
      </div>

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

      <div>
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
