import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface ChatMessageAuthor {
  user_id: number;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
  is_admin: boolean;
}

interface ChatMessageProps {
  message_id: number;
  content: string;
  created_at: string;
  is_edited: boolean;
  author: ChatMessageAuthor;
  is_author: boolean;
  isEditing: boolean;
  editValue: string;
  onEditChange: (value: string) => void;
  onEditStart: () => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onDelete: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  created_at,
  is_edited,
  author,
  is_author,
  isEditing,
  editValue,
  onEditChange,
  onEditStart,
  onEditSave,
  onEditCancel,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleEdit = () => {
    setShowMenu(false);
    onEditStart();
  };

  const handleDelete = () => {
    setShowMenu(false);
    onDelete();
  };

  return (
    <div 
      className={`flex animate-fade-in ${is_author ? 'justify-end' : 'justify-start'} relative z-10`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-2">
        {is_author && !isEditing && (
          <div className={`flex items-center relative transition-opacity duration-200 ${isHovered || showMenu ? 'opacity-100' : 'opacity-0'}`}>
            <button
              ref={buttonRef}
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded  transition"
              title="Opcje"
            >
              <div className="flex flex-col gap-0.5">
                <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
              </div>
            </button>

            {showMenu && (
              <div
                ref={menuRef}
                className="absolute top-0 right-full mr-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden min-w-40"
                style={{ zIndex: 9999 }}
              >
                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition"
                >
                  Edytuj
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 transition"
                >
                  Cofnij wysyłanie
                </button>
              </div>
            )}
          </div>
        )}

        <div
          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-3xl shadow ${
            is_author
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-800 border border-gray-200'
          }`}
        >
          <div className="flex justify-between items-start mb-1">
            <div className="font-semibold text-sm">
              {author.first_name} {author.last_name}
              {author.is_admin && (
                <span className="ml-2 text-xs bg-yellow-400 px-2 py-0.5 rounded">
                  Admin
                </span>
              )}
            </div>
            <span
              className={`text-xs ml-2 ${
                is_author ? 'text-blue-100' : 'text-gray-500'
              }`}
            >
              {formatDate(created_at)}
              {is_edited && ' (edytowana)'}
            </span>
          </div>

          {isEditing ? (
            <div className="flex gap-2 mt-2">
              <textarea
                type="text"
                value={editValue}
                onChange={(e) => onEditChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onEditSave()}
                className="flex-1 px-2 py-1 text-sm rounded bg-white text-gray-800"
                autoFocus
              />
           
              <button
                onClick={onEditCancel}
                className="px-2 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <p className="text-sm break-words">{content}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;