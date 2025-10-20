import { useNavigate } from 'react-router-dom';
import { Book, Star, Users, ArrowRight, Calendar } from 'lucide-react';
import type { Note as UserNoteTableProps } from "../types"
import formatDate from '../../../components/dateFormat';

export default function UserNoteTable({ note_id, title, subject, average_rating, rating_count, created_at }: UserNoteTableProps) {
    const navigate = useNavigate();
    const avgRating = parseFloat(average_rating);
    const hasRatings = rating_count > 0;

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow flex items-center justify-between cursor-pointer" onClick={() => navigate(`/notatki/${note_id}`)}>
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


        </div>
    );
}