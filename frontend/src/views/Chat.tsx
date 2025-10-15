import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Edit2, Trash2, X,MessageSquareDot,User } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'sonner';

interface ChatMessage {
  message_id: number;
  user_id: number;
  content: string;
  created_at: string;
  is_edited: boolean;
  author: {
    user_id: number;
    first_name: string;
    last_name: string;
    profile_picture: string | null;
    is_admin: boolean;
  };
  is_author: boolean;
}

interface ChatStats {
  active_users: number;
  messages_today: number;
}



const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [stats, setStats] = useState<ChatStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pendingMessagesRef = useRef<Set<number>>(new Set());
  const wsConnectedRef = useRef(false);

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
          toast.error(error.response?.data?.detail)
    }
  };

  const updateMessage = async (messageId: number) => {
    if (!editValue.trim()) return;

    try {
      await axiosInstance.put(
        `/chat/messages/${messageId}`,
        { content: editValue }
      );
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
              setMessages(prev => [...prev, newMessage]);
            } else {
              pendingMessagesRef.current.delete(data.data.message_id);
            }
            setStats(prevStats => prevStats ? {
              ...prevStats,
              messages_today: prevStats.messages_today + 1
            } : null);
          } else if (data.type === 'message_edited') {
            setMessages(prev =>
              prev.map(m => 
                m.message_id === data.data.message_id 
                  ? {
                      ...data.data,
                      is_author: data.data.user_id === currentUserId,
                    }
                  : m
              )
            );
          } else if (data.type === 'message_deleted') {
            setMessages(prev => prev.filter(m => m.message_id !== data.message_id));
            setStats(prevStats => prevStats ? {
              ...prevStats,
              messages_today: prevStats.messages_today - 1
            } : null);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
          console.log("WebSocket connection closed");
          wsConnectedRef.current = false;
          setTimeout(connect, 3000);
        };

        wsRef.current = ws;
      } catch (error) {
        console.error("Failed to connect WebSocket:", error);
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({});
  }, [messages]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex items-center justify-center my-2 animate-fade-in">
          
      <div className="flex flex-col h-[80vh] w-[60vw] bg-green-50 rounded-lg overflow-hidden shadow-lg z-1">
        {/* Header */}
        <div className="bg-white shadow-md p-4 border-b">

          {stats && (
            <div className="flex items-center gap-6 text-sm text-gray-600 mt-1">
              <div className="flex items-center gap-1">
              <User className="text-green-500" size={18} />
              <span> <span className="font-semibold">{stats.active_users}</span></span>
              </div>
              <div className="flex items-center gap-1">
              <MessageSquareDot className="text-blue-500" size={18} />
              <span> <span className="font-semibold">{stats.messages_today}</span></span>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading && !messages.length ? (
            <div className="flex items-center justify-center h-full">
       
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">

            </div>
          ) : (
            messages.map(msg => (
              <div
                key={msg.message_id}
                className={`flex ${msg.is_author ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg shadow ${msg.is_author
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-semibold text-sm">
                      {msg.author.first_name} {msg.author.last_name}
                      {msg.author.is_admin && (
                        <span className="ml-2 text-xs bg-yellow-400 px-2 py-0.5 rounded">
                          Admin
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-xs ml-2 ${msg.is_author ? 'text-blue-100' : 'text-gray-500'
                        }`}
                    >
                      {formatDate(msg.created_at)}
                      {msg.is_edited && ' (edytowana)'}
                    </span>
                  </div>

                  {editingId === msg.message_id ? (
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && updateMessage(msg.message_id)}
                        className="flex-1 px-2 py-1 text-sm rounded bg-white text-gray-800"
                        autoFocus
                      />
                      <button
                        onClick={() => updateMessage(msg.message_id)}
                        className="px-2 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                      >
                        Zapisz
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm break-words">{msg.content}</p>
                  )}

                  {/* Message Actions */}
                  {msg.is_author && editingId !== msg.message_id && (
                    <div className="flex gap-2 mt-2 justify-end">
                      <button
                        onClick={() => {
                          setEditingId(msg.message_id);
                          setEditValue(msg.content);
                        }}
                        className={`p-1 rounded hover:bg-opacity-75 transition ${msg.is_author
                            ? 'hover:bg-blue-600'
                            : 'hover:bg-gray-300'
                          }`}
                        title="Edytuj"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => deleteMessage(msg.message_id)}
                        className={`p-1 rounded hover:bg-opacity-75 transition ${msg.is_author
                            ? 'hover:bg-red-600'
                            : 'hover:bg-gray-300'
                          }`}
                        title="Usuń"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="bg-white border-t border-gray-300 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Wpisz wiadomość..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              disabled={!inputValue.trim()}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              <Send size={18} />
              Wyślij
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;