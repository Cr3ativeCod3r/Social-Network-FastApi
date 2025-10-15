import { useNavigate } from 'react-router-dom';
import { Book, Star, Users, ArrowRight, Calendar } from 'lucide-react';

interface UserNoteTableProps {
    note_id: number;
    title: string;
    subject: string;
    average_rating: string;
    rating_count: number;
    created_at: string;
}

export default function UserNoteTable({ note_id, title, subject, average_rating, rating_count, created_at }: UserNoteTableProps) {
    const navigate = useNavigate();
    const avgRating = parseFloat(average_rating);
    const hasRatings = rating_count > 0;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow flex items-center justify-between">
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-gray-900 break-words mb-3">
                    {title}
                </h3>
                
                <div className="space-y-2">
                    {subject && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Book size={16} className="text-blue-500 flex-shrink-0" />
                            <span>{subject}</span>
                        </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={16} className="text-gray-400 flex-shrink-0" />
                        <span>{formatDate(created_at)}</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        {hasRatings ? (
                            <>
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <Star size={16} className="text-yellow-500 flex-shrink-0 fill-yellow-500" />
                                    <span className="font-medium">{avgRating.toFixed(1)}</span>
                                </div>
                                
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Users size={16} className="text-gray-500 flex-shrink-0" />
                                    <span>{rating_count} {rating_count === 1 ? 'ocena' : 'ocen'}</span>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Star size={16} className="text-gray-400 flex-shrink-0" />
                                <span>Brak ocen</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <button
                onClick={() => navigate(`/notatki/${note_id}`)}
                className="ml-4 p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition flex-shrink-0"
                title="Przejdź do notatki"
            >
                <ArrowRight size={20} />
            </button>
        </div>
    );
}