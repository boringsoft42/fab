"use client";

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Clock } from "lucide-react";

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: string;
  status: string;
  createdAt: string;
  readAt?: string;
  sender: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
}

interface Conversation {
  id: string;
  otherParticipantId: string;
  participant: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
  };
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

interface ConversationsListProps {
  conversations: Conversation[];
  onSelectConversation: (contactId: string) => void;
  selectedContactId?: string;
}

export const ConversationsList: React.FC<ConversationsListProps> = ({ 
  conversations, 
  onSelectConversation, 
  selectedContactId 
}) => {
  if (conversations.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No tienes conversaciones activas</h3>
            <p className="text-muted-foreground">
              ¡Conecta con otros jóvenes para empezar a chatear!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">
          Conversaciones ({conversations.length})
        </h3>
        <div className="space-y-2">
          {conversations.map((conversation) => (
            <div 
              key={conversation.id} 
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedContactId === conversation.otherParticipantId 
                  ? 'bg-primary/10 border border-primary/20' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => onSelectConversation(conversation.otherParticipantId)}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage 
                      src={conversation.participant.avatarUrl} 
                      alt={`${conversation.participant.firstName} ${conversation.participant.lastName}`} 
                    />
                    <AvatarFallback>
                      {conversation.participant.firstName?.[0] || ''}{conversation.participant.lastName?.[0] || ''}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                    </Badge>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm truncate">
                      {conversation.participant.firstName} {conversation.participant.lastName}
                    </h4>
                    {conversation.lastMessage && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(conversation.lastMessage.createdAt).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    )}
                  </div>
                  {conversation.lastMessage ? (
                    <p className="text-sm text-muted-foreground truncate">
                      <span className="font-medium">
                        {conversation.lastMessage.sender.firstName}:
                      </span>{' '}
                      {conversation.lastMessage.content}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Sin mensajes
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
