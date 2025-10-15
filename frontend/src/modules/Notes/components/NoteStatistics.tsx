import { useEffect, useState } from 'react';
import { Star, Bookmark, MessageSquare, Loader } from 'lucide-react';
import axiosInstance from '../../../api/axiosInstance';

interface Statistics {
  note_id: number;
  total_ratings: number;
  average_rating: string;
  total_saves: number;
  total_comments: number; 
}

interface NoteStatisticsProps {
  noteId: number;
}

export default function NoteStatistics({ noteId }: NoteStatisticsProps) {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, [noteId]);

  const fetchStatistics = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get<Statistics>(
        `/notes/${noteId}/statistics`
      );
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching note statistics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader size={20} className="text-gray-400 animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2 text-sm">
        <div className="p-2 bg-yellow-50 rounded-full">
          <Star size={18} className="fill-yellow-400 text-yellow-400" />
        </div>
        <div>
          <p className="text-gray-600">Ocena</p>
          <p className="font-semibold text-gray-900">
            {stats.average_rating}
            <span className="text-gray-500 font-normal"> ({stats.total_ratings})</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <div className="p-2 bg-green-50 rounded-full">
          <Bookmark size={18} className="fill-green-500 text-green-500" />
        </div>
        <div>
          <p className="text-gray-600">Zapisania</p>
          <p className="font-semibold text-gray-900">{stats.total_saves}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <div className="p-2 bg-blue-50 rounded-full">
          <MessageSquare size={18} className="fill-blue-500 text-blue-500" />
        </div>
        <div>
          <p className="text-gray-600">Komentarze</p>
          <p className="font-semibold text-gray-900">{stats.total_comments}</p>
        </div>
      </div>
    </div>
  );
}