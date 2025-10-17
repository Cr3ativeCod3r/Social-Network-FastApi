import React, { useState, useEffect, useRef, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'sonner';

import ChatHeader from '../modules/Chat/components/ChatHeader';
import ChatMessagesList from '../modules/Chat/components/ChatMessagesList';
import ChatInput from '../modules/Chat/components/ChatInput';
import { useAuthStore } from "../store/authStore";
import type {ChatMessage, ChatStats} from '../modules/Chat/types';


const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [stats, setStats] = useState<ChatStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pendingMessagesRef = useRef<Set<number>>(new Set());
  const wsConnectedRef = useRef(false);
  const { user } = useAuthStore()

  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/chat/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendLike = async () => {
  try {
    await axiosInstance.post('/chat/messages', {
      content: '👍',
    });
  } catch (error: any) {
    toast.error(error.response?.data?.detail);
  }
};

  const sendNoteMessage = async (noteContent: string) => {
    if (!noteContent.trim()) return;

    try {
      const response = await axiosInstance.post('/chat/messages', {
        content: noteContent,
      });
      pendingMessagesRef.current.add(response.data.message_id);
    } catch (error: any) {
      toast.error(error.response?.data?.detail);
    }
  };

  const loadStats = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/chat/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }, []);

  const getCurrentUserId = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/users/me');
      setCurrentUserId(response.data.user_id);
    } catch (error) {
      console.error('Failed to get current user:', error);
    }
  }, []);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    try {
      const response = await axiosInstance.post('/chat/messages', {
        content: inputValue,
      });
      pendingMessagesRef.current.add(response.data.message_id);
      setInputValue('');
    } catch (error: any) {
      toast.error(error.response?.data?.detail);
    }
  };

  const updateMessage = async (messageId: number) => {
    if (!editValue.trim()) return;

    try {
      await axiosInstance.put(`/chat/messages/${messageId}`, {
        content: editValue,
      });
      setEditingId(null);
      setEditValue('');
    } catch (error) {
      console.error('Failed to update message:', error);
    }
  };

  const deleteMessage = async (messageId: number) => {
    try {
      await axiosInstance.delete(`/chat/messages/${messageId}`);
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const handleEditStart = (messageId: number, content: string) => {
    setEditingId(messageId);
    setEditValue(content);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  useEffect(() => {
    getCurrentUserId();
    loadMessages();
    loadStats();
  }, [getCurrentUserId, loadMessages, loadStats]);

  useEffect(() => {
    if (!currentUserId) return;

    if (wsConnectedRef.current) {
      console.log('WebSocket już połączony, pomijam duplikat');
      return;
    }

    const connect = () => {
      try {
        const ws = new WebSocket(`ws://localhost:8000/ws`);

        ws.onopen = () => {
          console.log('WebSocket connected');
          wsConnectedRef.current = true;
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);

          if (data.type === 'new_message') {
            if (!pendingMessagesRef.current.has(data.data.message_id)) {
              const newMessage = {
                ...data.data,
                is_author: data.data.user_id === currentUserId,
              };
              setMessages((prev) => [...prev, newMessage]);
            } else {
              pendingMessagesRef.current.delete(data.data.message_id);
            }
            setStats((prevStats) =>
              prevStats
                ? {
                    ...prevStats,
                    messages_today: prevStats.messages_today + 1,
                  }
                : null
            );
          } else if (data.type === 'message_edited') {
            setMessages((prev) =>
              prev.map((m) =>
                m.message_id === data.data.message_id
                  ? {
                      ...data.data,
                      is_author: data.data.user_id === currentUserId,
                    }
                  : m
              )
            );
          } else if (data.type === 'message_deleted') {
            setMessages((prev) =>
              prev.filter((m) => m.message_id !== data.message_id)
            );
            setStats((prevStats) =>
              prevStats
                ? {
                    ...prevStats,
                    messages_today: prevStats.messages_today - 1,
                  }
                : null
            );
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
          console.log('WebSocket connection closed');
          wsConnectedRef.current = false;
          setTimeout(connect, 3000);
        };

        wsRef.current = ws;
      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
      }
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsConnectedRef.current = false;
      }
    };
  }, [currentUserId]);

  return (
    <div className="flex items-center justify-center animate-fade-in h-screen ">
      <div className="flex flex-col h-[85vh] mt-20 lg:w-[65vw] sm: w-[98vw] bg-white rounded-lg">
        <ChatHeader stats={stats} />
        
        <ChatMessagesList
          messages={messages}
          loading={loading}
          editingId={editingId}
          editValue={editValue}
          onEditChange={setEditValue}
          onEditStart={handleEditStart}
          onEditSave={updateMessage}
          onEditCancel={handleEditCancel}
          onDelete={deleteMessage}
        />
        
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={sendMessage}
          onLike={sendLike} 
          onSendNote={sendNoteMessage}
          userId={user?.user_id}
        />
      </div>
    </div>
  );
};

export default ChatComponent;