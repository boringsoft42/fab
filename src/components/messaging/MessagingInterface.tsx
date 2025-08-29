"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, MessageCircle } from "lucide-react";
import { useMessaging } from "@/hooks/useMessaging";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ConversationsList } from "./ConversationsList";
import { Chat } from "./Chat";

interface MessagingInterfaceProps {
  senderId?: string;
  receiverId?: string;
  isModal?: boolean;
}

export const MessagingInterface: React.FC<MessagingInterfaceProps> = ({
  senderId,
  receiverId,
  isModal = false,
}) => {
  console.log("🔍 MessagingInterface: Component mounted", {
    senderId,
    receiverId,
    isModal,
  });

  const {
    conversations,
    currentMessages,
    stats,
    loading,
    error,
    fetchMessages,
    sendMessage,
    markMessageAsRead,
    refetch,
  } = useMessaging();

  const [selectedContactId, setSelectedContactId] = useState<string>("");
  const [selectedContactName, setSelectedContactName] = useState<string>("");
  const [selectedContactAvatar, setSelectedContactAvatar] =
    useState<string>("");
  const [messagesLoading, setMessagesLoading] = useState(false);

  // Obtener el usuario actual usando el hook de autenticación
  const { profile: currentUser } = useCurrentUser();

  // Intentar obtener el ID del usuario de diferentes fuentes
  const localStorageUserId = localStorage.getItem("userId");
  const localStorageUser = localStorage.getItem("user");
  const currentUserId =
    senderId ||
    localStorageUserId ||
    (localStorageUser ? JSON.parse(localStorageUser)?.id : null) ||
    currentUser?.id ||
    "";

  console.log("🔍 User ID sources:", {
    senderId,
    localStorageUserId,
    localStorageUser: localStorageUser ? JSON.parse(localStorageUser) : null,
    currentUserProfileId: currentUser?.id,
    finalCurrentUserId: currentUserId,
  });

  console.log("🔍 MessagingInterface: State values:", {
    loading,
    error,
    conversationsCount: conversations.length,
    currentUserId,
    hasUser: !!currentUser,
    localStorageUserId: localStorage.getItem("userId"),
    currentUserProfileId: currentUser?.id,
  });

  const handleSelectConversation = async (contactId: string) => {
    setSelectedContactId(contactId);

    // Encontrar la conversación seleccionada para obtener el nombre del contacto
    const conversation = conversations.find(
      (conv) => conv.otherParticipantId === contactId
    );
    if (conversation) {
      setSelectedContactName(
        `${conversation.participant.firstName} ${conversation.participant.lastName}`
      );
      setSelectedContactAvatar(conversation.participant.avatarUrl || "");
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
    console.log("🔍 Manual refresh triggered");
    await refetch();
  };

  // Si se proporciona un receiverId específico, seleccionarlo automáticamente
  useEffect(() => {
    if (receiverId && receiverId !== selectedContactId) {
      console.log("🔍 Auto-selecting conversation with:", receiverId);
      handleSelectConversation(receiverId);
    }
  }, [receiverId]);

  // Force load data on mount if not loading
  useEffect(() => {
    console.log(
      "🔍 MessagingInterface: useEffect triggered, loading:",
      loading
    );
    if (!loading && conversations.length === 0 && !error) {
      console.log("🔍 Forcing data load...");
      refetch();
    }
  }, [loading, conversations.length, error, refetch]);

  // Si es un modal y no hay conversaciones, mostrar solo el chat
  if (isModal && receiverId) {
    return (
      <div className="h-[500px]">
        <Chat
          contactId={receiverId}
          contactName={selectedContactName || "Contacto"}
          contactAvatar={selectedContactAvatar}
          messages={currentMessages}
          onSendMessage={handleSendMessage}
          onMarkAsRead={handleMarkAsRead}
          currentUserId={currentUserId}
          isLoading={messagesLoading}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-96 bg-gray-200 rounded-lg" />
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mensajería</h1>
          <p className="text-muted-foreground">
            {stats ? (
              <>
                {stats.totalConversations} conversaciones •{" "}
                {stats.unreadMessages} mensajes sin leer
              </>
            ) : (
              "Conecta con otros emprendedores"
            )}
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-700 text-sm">Error: {error}</p>
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
            <h3 className="text-xl font-semibold mb-2">
              No tienes conversaciones
            </h3>
            <p className="text-muted-foreground mb-6">
              Para empezar a chatear, primero necesitas conectar con otros
              emprendedores en la red.
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
