import React, { useState } from 'react';
import { Send, Smile, ThumbsUp } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import type { EmojiClickData } from 'emoji-picker-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onLike?: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend, onLike }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onChange(value + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleSendOrLike = () => {
    if (value.trim()) {
      onSend();
    } else if (onLike) {
      onLike();
    }
  };

  return (
    <div className="bg-white border-t border-gray-300 p-4">
      <div className="flex gap-2 items-end relative">
        <div className="relative">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
            type="button"
          >
            <Smile size={24} />
          </button>
          
          {showEmojiPicker && (
            <div className="absolute bottom-full left-0 mb-2 z-50">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
        
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Wpisz wiadomość..."
          rows={1}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          style={{ minHeight: '42px', maxHeight: '120px' }}
        />
        
        <button
          onClick={handleSendOrLike}
          className="p-2 text-blue-500 hover:text-blue-600 transition"
          type="button"
        >
          {value.trim() ? <Send size={20} /> : <ThumbsUp size={32} className='z-999' />}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;