
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Send, 
  Paperclip, 
  MessageSquarePlus,
  Zap,
  Flag,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  CircleDot,
  Bot,
  StickyNote,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';
import { 
  Conversation, 
  Message,
  QuickReplyTemplate,
  ConversationStatus,
  ConversationTag,
  CHANNEL_ICONS,
  TAG_LABELS,
  TAG_COLORS,
  STATUS_LABELS,
  STATUS_COLORS,
} from '@/types/messaging';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface MessageThreadProps {
  conversation: Conversation | null;
  quickReplies: QuickReplyTemplate[];
  onSendMessage: (conversationId: string, content: string, isInternal: boolean) => void;
  onUpdateStatus: (conversationId: string, status: ConversationStatus) => void;
  onToggleTag: (conversationId: string, tag: ConversationTag) => void;
  onTogglePriority: (conversationId: string) => void;
}

export const MessageThread: React.FC<MessageThreadProps> = ({
  conversation,
  quickReplies,
  onSendMessage,
  onUpdateStatus,
  onToggleTag,
  onTogglePriority,
}) => {
  const [messageText, setMessageText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const handleSend = () => {
    if (!conversation || !messageText.trim()) return;
    onSendMessage(conversation.id, messageText, isInternalNote);
    setMessageText('');
    setIsInternalNote(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertQuickReply = (template: QuickReplyTemplate) => {
    if (!conversation) return;
    
    let content = template.content;
    // Replace variables with actual values
    content = content.replace('{{guest_first_name}}', conversation.guest.firstName);
    content = content.replace('{{property_address}}', conversation.reservation.propertyAddress);
    content = content.replace('{{access_code}}', conversation.reservation.accessCode || 'N/A');
    content = content.replace('{{wifi_network}}', conversation.reservation.wifiNetwork || 'N/A');
    content = content.replace('{{wifi_password}}', conversation.reservation.wifiPassword || 'N/A');
    
    setMessageText(content);
    textareaRef.current?.focus();
  };

  const allTags: ConversationTag[] = [
    'check-in-issue',
    'check-out-issue',
    'upsell',
    'complaint',
    'maintenance',
    'cleaning',
    'urgent',
    'vip',
  ];

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center text-muted-foreground">
          <MessageSquarePlus className="h-16 w-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">Sélectionnez une conversation</p>
          <p className="text-sm">pour afficher les messages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{CHANNEL_ICONS[conversation.reservation.channel]}</span>
              <div>
                <h3 className="font-semibold">{conversation.guest.name}</h3>
                <p className="text-sm text-muted-foreground">{conversation.reservation.propertyName}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Status selector */}
            <Select
              value={conversation.status}
              onValueChange={(value) => onUpdateStatus(conversation.id, value as ConversationStatus)}
            >
              <SelectTrigger className="w-32 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">
                  <div className="flex items-center gap-2">
                    <CircleDot className="h-3.5 w-3.5 text-green-500" />
                    Ouvert
                  </div>
                </SelectItem>
                <SelectItem value="pending">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-yellow-500" />
                    En attente
                  </div>
                </SelectItem>
                <SelectItem value="resolved">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-gray-500" />
                    Résolu
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Priority toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={conversation.isPriority ? 'destructive' : 'outline'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onTogglePriority(conversation.id)}
                >
                  <Flag className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {conversation.isPriority ? 'Retirer priorité' : 'Marquer prioritaire'}
              </TooltipContent>
            </Tooltip>

            {/* Tags menu */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  Tags
                  {conversation.tags.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-4 px-1">
                      {conversation.tags.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2">
                <div className="flex flex-wrap gap-1">
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={conversation.tags.includes(tag) ? 'default' : 'outline'}
                      className={cn(
                        'cursor-pointer text-xs',
                        conversation.tags.includes(tag) && TAG_COLORS[tag]
                      )}
                      onClick={() => onToggleTag(conversation.id, tag)}
                    >
                      {TAG_LABELS[tag]}
                    </Badge>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Active tags display */}
        {conversation.tags.length > 0 && (
          <div className="flex gap-1 mt-2">
            {conversation.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className={cn('text-xs', TAG_COLORS[tag])}
              >
                {TAG_LABELS[tag]}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {conversation.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message input */}
      <div className="p-4 border-t">
        {/* Internal note toggle */}
        {isInternalNote && (
          <div className="flex items-center gap-2 mb-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
            <StickyNote className="h-4 w-4 text-amber-600" />
            <span className="text-sm text-amber-700 font-medium">Note interne (non visible par le voyageur)</span>
          </div>
        )}

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isInternalNote ? "Ajouter une note interne..." : "Écrire un message..."}
              className={cn(
                "min-h-[80px] resize-none pr-24",
                isInternalNote && "border-amber-300 bg-amber-50/50"
              )}
            />

            {/* Quick actions */}
            <div className="absolute bottom-2 right-2 flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7"
                    onClick={() => setIsInternalNote(!isInternalNote)}
                  >
                    <StickyNote className={cn(
                      "h-4 w-4",
                      isInternalNote && "text-amber-600"
                    )} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Note interne</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Joindre un fichier</TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {/* Quick replies */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Zap className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  Réponses rapides
                </div>
                {quickReplies.map((template) => (
                  <DropdownMenuItem
                    key={template.id}
                    onClick={() => insertQuickReply(template)}
                  >
                    <div>
                      <p className="font-medium">{template.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {template.content.substring(0, 50)}...
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Send button */}
            <Button 
              onClick={handleSend} 
              disabled={!messageText.trim()}
              className={cn(
                "h-10",
                isInternalNote && "bg-amber-500 hover:bg-amber-600"
              )}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isTeam = message.sender === 'team' || message.sender === 'system';
  const isSystem = message.sender === 'system';
  const isInternal = message.isInternal;

  return (
    <div className={cn(
      'flex',
      isTeam ? 'justify-end' : 'justify-start'
    )}>
      <div className={cn(
        'max-w-[75%] rounded-lg px-4 py-2.5',
        isInternal && 'border-2 border-amber-300 bg-amber-50',
        !isInternal && isSystem && 'bg-muted border border-dashed',
        !isInternal && !isSystem && isTeam && 'bg-primary text-primary-foreground',
        !isInternal && !isSystem && !isTeam && 'bg-muted'
      )}>
        {/* Header */}
        <div className={cn(
          'flex items-center gap-2 mb-1',
          isTeam && !isInternal && !isSystem && 'text-primary-foreground/80'
        )}>
          {isInternal && (
            <StickyNote className="h-3.5 w-3.5 text-amber-600" />
          )}
          {isSystem && (
            <Bot className="h-3.5 w-3.5 text-muted-foreground" />
          )}
          <span className={cn(
            'text-xs font-medium',
            isInternal && 'text-amber-700',
            !isInternal && !isSystem && !isTeam && 'text-foreground'
          )}>
            {message.senderName}
          </span>
          <span className={cn(
            'text-xs',
            isTeam && !isInternal && !isSystem ? 'text-primary-foreground/60' : 'text-muted-foreground'
          )}>
            {format(message.timestamp, 'HH:mm', { locale: fr })}
          </span>
          {message.isAutomated && (
            <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
              <Sparkles className="h-2.5 w-2.5 mr-0.5" />
              Auto
            </Badge>
          )}
        </div>

        {/* Content */}
        <p className={cn(
          'text-sm whitespace-pre-wrap',
          isInternal && 'text-amber-800',
        )}>
          {message.content}
        </p>

        {/* Automation rule info */}
        {message.isAutomated && message.automationRuleName && (
          <p className="text-xs text-muted-foreground mt-1 italic">
            Règle: {message.automationRuleName}
          </p>
        )}

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center gap-1 px-2 py-1 bg-background/50 rounded text-xs"
              >
                {attachment.type === 'image' ? (
                  <ImageIcon className="h-3 w-3" />
                ) : (
                  <Paperclip className="h-3 w-3" />
                )}
                {attachment.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
