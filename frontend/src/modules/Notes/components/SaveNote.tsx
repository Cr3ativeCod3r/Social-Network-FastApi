import { Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';

interface SaveNoteButtonProps {
  noteId: string;
}

export default function SaveNoteButton({ noteId }: SaveNoteButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkIfSaved();
  }, [noteId]);

  const checkIfSaved = async () => {
    try {
      setIsChecking(true);
      const response = await axiosInstance.get(`/saved-notes/${noteId}/check`);
      setIsSaved(response.data.is_saved || false);
    } catch (error) {
      console.error('Error checking saved status:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleClick = async () => {
    setIsLoading(true);
    try {
      if (isSaved) {
        await axiosInstance.delete(`/saved-notes/${noteId}`);
        setIsSaved(false);
      } else {
        await axiosInstance.post('/saved-notes/', { note_id: noteId });
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error toggling saved note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <button disabled className="p-2 rounded hover:bg-gray-100 transition-colors">
        <Save size={20} className="text-gray-300" />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="p-2 rounded hover:bg-gray-100 transition-colors disabled:opacity-50"
      title={isSaved ? 'Usuń z zapisanych' : 'Zapisz notatkę'}
    >
      <Save
        size={26}
        className={`transition-colors ${
          isSaved ? 'fill-green-500 text-black' : 'text-black'
        } ${isLoading ? 'opacity-50' : ''}`}
      />
    </button>
  );
}