"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, MessageCircle } from "lucide-react";
import { useMessaging } from "@/hooks/useMessaging";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ConversationsList } from "./ConversationsList";
import { Chat } from "./Chat";

export const MessagingInterface: React.FC = () => {
  console.log('🔍 MessagingInterface: Component mounted');
  
  const {
    conversations,
    currentMessages,
    stats,
    loading,
    error,
    fetchConversations,
    fetchMessages,
    sendMessage,
    markMessageAsRead,
    fetchStats,
    refetch
  } = useMessaging();

  const [selectedContactId, setSelectedContactId] = useState<string>('');
  const [selectedContactName, setSelectedContactName] = useState<string>('');
  const [selectedContactAvatar, setSelectedContactAvatar] = useState<string>('');
  const [messagesLoading, setMessagesLoading] = useState(false);

  // Obtener el usuario actual usando el hook de autenticación
  const { profile: currentUser } = useCurrentUser();
  
  // Intentar obtener el ID del usuario de diferentes fuentes
  const localStorageUserId = localStorage.getItem('userId');
  const localStorageUser = localStorage.getItem('user');
  const currentUserId = localStorageUserId || 
                       (localStorageUser ? JSON.parse(localStorageUser)?.id : null) || 
                       currentUser?.id || '';

  console.log('🔍 User ID sources:', {
    localStorageUserId,
    localStorageUser: localStorageUser ? JSON.parse(localStorageUser) : null,
    currentUserProfileId: currentUser?.id,
    finalCurrentUserId: currentUserId
  });

  console.log('🔍 MessagingInterface: State values:', {
    loading,
    error,
    conversationsCount: conversations.length,
    currentUserId,
    hasUser: !!currentUser,
    localStorageUserId: localStorage.getItem('userId'),
    currentUserProfileId: currentUser?.id
  });

  const handleSelectConversation = async (contactId: string) => {
    setSelectedContactId(contactId);
    
    // Encontrar la conversación seleccionada para obtener el nombre del contacto
    const conversation = conversations.find(conv => conv.otherParticipantId === contactId);
    if (conversation) {
      setSelectedContactName(`${conversation.participant.firstName} ${conversation.participant.lastName}`);
      setSelectedContactAvatar(conversation.participant.avatarUrl || '');
    }
    
    // Cargar mensajes de la conversación
    setMessagesLoading(true);
    try {
      await fetchMessages(contactId);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (selectedContactId) {
      await sendMessage(selectedContactId, content);
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    await markMessageAsRead(messageId);
  };

  const handleRefresh = async () => {
    console.log('🔍 Manual refresh triggered');
    await refetch();
  };

  // Force load data on mount if not loading
  useEffect(() => {
    console.log('🔍 MessagingInterface: useEffect triggered, loading:', loading);
    if (!loading && conversations.length === 0 && !error) {
      console.log('🔍 Forcing data load...');
      refetch();
    }
  }, [loading, conversations.length, error, refetch]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-96 bg-gray-200 rounded" />
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Cargando mensajería...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mensajería</h1>
            <p className="text-muted-foreground">
              Chatea con tus contactos de la red de emprendedores
            </p>
          </div>
          <div className="flex items-center gap-4">
            {stats && (
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {stats.totalConversations} conversaciones
                </Badge>
                {stats.unreadMessages > 0 && (
                  <Badge variant="destructive">
                    {stats.unreadMessages} no leídos
                  </Badge>
                )}
              </div>
            )}
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-700 text-sm">
              Error: {error}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Main Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <ConversationsList
            conversations={conversations}
            onSelectConversation={handleSelectConversation}
            selectedContactId={selectedContactId}
          />
        </div>

        {/* Chat */}
        <div className="lg:col-span-2">
          <Chat
            contactId={selectedContactId}
            contactName={selectedContactName}
            contactAvatar={selectedContactAvatar}
            messages={currentMessages}
            onSendMessage={handleSendMessage}
            onMarkAsRead={handleMarkAsRead}
            currentUserId={currentUserId}
            isLoading={messagesLoading}
          />
        </div>
      </div>

      {/* Empty State */}
      {conversations.length === 0 && !loading && (
        <Card className="mt-6">
          <CardContent className="p-12 text-center">
            <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No tienes conversaciones</h3>
            <p className="text-muted-foreground mb-6">
              Para empezar a chatear, primero necesitas conectar con otros emprendedores en la red.
            </p>
            <Button>
              <MessageCircle className="h-4 w-4 mr-2" />
              Ir a Red de Emprendedores
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
