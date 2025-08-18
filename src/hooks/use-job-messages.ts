import { useState, useEffect } from 'react';
import { useAuthContext } from './use-auth';

export interface JobMessage {
  id: string;
  content: string;
  messageType: 'TEXT' | 'FILE' | 'INTERVIEW_INVITE' | 'STATUS_UPDATE';
  senderId: string;
  senderType: 'COMPANY' | 'APPLICANT' | 'ADMIN';
  createdAt: string;
  readAt?: string;
  isRead?: boolean;
  application?: {
    applicant: {
      firstName: string;
      lastName: string;
      avatarUrl?: string;
    };
    jobOffer: {
      company: {
        name: string;
        email: string;
        website?: string;
      };
    };
  };
}

export interface SendMessageData {
  content: string;
  messageType?: 'TEXT' | 'FILE' | 'INTERVIEW_INVITE' | 'STATUS_UPDATE';
}

export function useJobMessages(applicationId: string) {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState<JobMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch messages
  const fetchMessages = async () => {
    if (!applicationId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      console.log('🔑 Token from localStorage:', token ? 'Present' : 'Missing');
      
      if (!token) {
        setError('No hay token de autenticación');
        return;
      }

      const response = await fetch(`/api/jobapplication-messages/${applicationId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 Received data:', data);
      
      // Handle the backend response structure: {messages: [], pagination: {...}}
      const messagesArray = data.messages || [];
      console.log('📦 Messages array:', messagesArray);
      
      setMessages(messagesArray);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar mensajes');
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const sendMessage = async (messageData: SendMessageData) => {
    if (!applicationId || !messageData.content.trim()) return;
    
    try {
      setSending(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/jobapplication-messages/${applicationId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: messageData.content,
          messageType: messageData.messageType || 'TEXT',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📤 Send message response:', data);
      
      // Handle the response structure - could be the message object directly or wrapped
      const newMessage = data.message || data;
      setMessages(prev => [...prev, newMessage]);
      
      return newMessage;
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Error al enviar mensaje');
      throw err;
    } finally {
      setSending(false);
    }
  };

  // Mark message as read
  const markAsRead = async (messageId: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/jobapplication-messages/${applicationId}/messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true, readAt: new Date().toISOString() } : msg
      ));
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  // Get unread count
  const getUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/jobapplication-messages/unread-count', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.unreadCount || 0;
      }
      return 0;
    } catch (err) {
      console.error('Error getting unread count:', err);
      return 0;
    }
  };

  // Fetch messages when applicationId changes
  useEffect(() => {
    if (!applicationId || applicationId.trim() === '') return;
    
    console.log('💬 useJobMessages - Fetching messages for applicationId:', applicationId);
    
    // Initial fetch
    fetchMessages();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      console.log('💬 useJobMessages - Auto-refreshing messages');
      fetchMessages();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [applicationId]); // Only depend on applicationId

  return {
    messages,
    loading,
    sending,
    error,
    sendMessage,
    markAsRead,
    getUnreadCount,
    refreshMessages: fetchMessages,
  };
}
