import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';

interface ChatMessageAuthor {
  user_id: number;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
  is_admin: boolean;
}

interface ChatMessageType {
  message_id: number;
  user_id: number;
  content: string;
  created_at: string;
  is_edited: boolean;
  author: ChatMessageAuthor;
  is_author: boolean;
}

interface ChatMessagesListProps {
  messages: ChatMessageType[];
  loading: boolean;
  editingId: number | null;
  editValue: string;
  onEditChange: (value: string) => void;
  onEditStart: (messageId: number, content: string) => void;
  onEditSave: (messageId: number) => void;
  onEditCancel: () => void;
  onDelete: (messageId: number) => void;
}

const ChatMessagesList: React.FC<ChatMessagesListProps> = ({
  messages,
  loading,
  editingId,
  editValue,
  onEditChange,
  onEditStart,
  onEditSave,
  onEditCancel,
  onDelete,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({});
  }, [messages]);

  if (loading && !messages.length) {
    return (
      null
    );
  }

  if (messages.length === 0) {
    return (
      null
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((msg) => (
        <ChatMessage
          key={msg.message_id}
          message_id={msg.message_id}
          content={msg.content}
          created_at={msg.created_at}
          is_edited={msg.is_edited}
          author={msg.author}
          is_author={msg.is_author}
          isEditing={editingId === msg.message_id}
          editValue={editValue}
          onEditChange={onEditChange}
          onEditStart={() => onEditStart(msg.message_id, msg.content)}
          onEditSave={() => onEditSave(msg.message_id)}
          onEditCancel={onEditCancel}
          onDelete={() => onDelete(msg.message_id)}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessagesList;