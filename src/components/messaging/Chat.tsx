"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Send, MessageCircle } from "lucide-react";

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

interface ChatProps {
  contactId: string;
  contactName: string;
  contactAvatar?: string;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onMarkAsRead: (messageId: string) => void;
  currentUserId?: string;
  isLoading?: boolean;
}

export const Chat: React.FC<ChatProps> = ({ 
  contactId, 
  contactName, 
  contactAvatar,
  messages, 
  onSendMessage, 
  onMarkAsRead,
  currentUserId,
  isLoading = false
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isOwnMessage = (message: Message) => {
    console.log('🔍 isOwnMessage check:', {
      messageSenderId: message.senderId,
      currentUserId: currentUserId,
      isOwn: message.senderId === currentUserId,
      fullMessage: message
    });
    return message.senderId === currentUserId;
  };

  if (!contactId) {
    return (
      <Card className="h-full">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Selecciona una conversación</h3>
            <p className="text-muted-foreground">
              Elige un contacto para empezar a chatear
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={contactAvatar} alt={contactName} />
            <AvatarFallback>
              {contactName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{contactName}</h3>
            <p className="text-sm text-muted-foreground">En línea</p>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 p-4 pt-0">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">
                  Cargando mensajes...
                </p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No hay mensajes aún. ¡Envía el primer mensaje!
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${isOwnMessage(message) ? 'justify-end' : 'justify-start'}`}
                  onMouseEnter={() => {
                    if (message.status !== 'READ' && !isOwnMessage(message)) {
                      onMarkAsRead(message.id);
                    }
                  }}
                >
                  <div className={`max-w-[70%] flex ${isOwnMessage(message) ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-end gap-2 ${isOwnMessage(message) ? 'flex-row-reverse' : 'flex-row'}`}>
                      {!isOwnMessage(message) && (
                        <Avatar className="h-6 w-6 flex-shrink-0">
                          <AvatarImage src={message.sender.avatarUrl} alt={`${message.sender.firstName} ${message.sender.lastName}`} />
                          <AvatarFallback className="text-xs">
                            {message.sender.firstName?.[0] || ''}{message.sender.lastName?.[0] || ''}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={`rounded-lg px-3 py-2 ${
                        isOwnMessage(message) 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm break-words">{message.content}</p>
                        <div className={`flex items-center gap-1 mt-1 ${
                          isOwnMessage(message) ? 'justify-end' : 'justify-start'
                        }`}>
                          <span className="text-xs opacity-70">
                            {new Date(message.createdAt).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {isOwnMessage(message) && (
                            <span className="text-xs opacity-70 ml-1">
                              {message.status === 'READ' ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe un mensaje..."
              className="min-h-[40px] max-h-[120px] resize-none"
              rows={1}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!newMessage.trim()}
              size="sm"
              className="px-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
