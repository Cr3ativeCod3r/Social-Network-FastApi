import React from 'react';
import { User, MessageSquareDot } from 'lucide-react';

interface ChatStats {
  active_users: number;
  messages_today: number;
}

interface ChatHeaderProps {
  stats: ChatStats | null;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ stats }) => {
  return (
    <div className="bg-white shadow-md p-4 border-b">
      {stats && (
        <div className="flex items-center gap-6 text-sm text-gray-600 mt-1">
          <div className="flex items-center gap-1">
            <User className="text-green-500" size={18} />
            <span className="font-semibold">{stats.active_users}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquareDot className="text-blue-500" size={18} />
            <span className="font-semibold">{stats.messages_today}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;