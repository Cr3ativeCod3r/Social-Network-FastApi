import React, { useState, useEffect } from 'react';
import { Send, Smile, ThumbsUp, FileText, X } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import type { EmojiClickData } from 'emoji-picker-react';
import axiosInstance from '../../../api/axiosInstance';

interface Note {
  note_id: number;
  title: string;
  subject: string;
  created_at: string;
  user_id: number;
  average_rating: string;
  rating_count: number;
}

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message?: string) => void;
  onSendNote: (message: string) => void;
  onLike?: () => void;
  userId: number;
}

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend, onLike, userId, onSendNote }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/notes/user/${userId}?page=1&page_size=100`);
      const data = response.data;
      setNotes(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showNotesModal) {
      fetchNotes();
    }
  }, [showNotesModal]);

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

 const handleNoteSelect = (noteId: number, title: string, subject: string) => {
    const message = `/notes/${noteId}/${title}/${subject}`;
    onSendNote(message); 
    setShowNotesModal(false);
  };


  return (
    <>
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

          <button
            onClick={() => setShowNotesModal(true)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
            type="button"
            title="Udostępnij notatkę"
          >
            <FileText size={24} />
          </button>

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

      {showNotesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          {/* ... reszta modala bez zmian ... */}
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Wybierz notatkę do udostępnienia</h2>
              <button
                onClick={() => setShowNotesModal(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {!loading && !error && notes.length > 0 && (
                <div className="space-y-2">
                  {notes.map((note) => (
                    <button
                      key={note.note_id}
                      onClick={() => handleNoteSelect(note.note_id, note.title, note.subject)}
                      className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">{note.title}</h3>
                          <p className="text-sm text-gray-600">{note.subject}</p>
                        </div>
                        <div className="text-xs text-gray-500 ml-4">
                          {note.rating_count > 0 && (
                            <div>⭐ {note.average_rating} ({note.rating_count})</div>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        {new Date(note.created_at).toLocaleDateString('pl-PL')}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setShowNotesModal(false)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatInput;