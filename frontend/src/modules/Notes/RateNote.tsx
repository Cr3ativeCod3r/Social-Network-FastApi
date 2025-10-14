import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { Trash2 } from 'lucide-react';

interface RatingResponse {
    note_id: number;
    user_id: number;
    rating: number;
    rated_at: string;
}

interface RatingStats {
    note_id: number;
    average_rating: number | null;
    total_ratings: number;
    rating_distribution: Record<string, number>;
    rating_percentages: Record<string, number>;
}

interface MyRating {
    rating: number | null;
    rated_at?: string;
}

interface NoteRatingProps {
    noteId: number;
    onRatingChange?: (rating: number) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function NoteRating({ noteId, onRatingChange }: NoteRatingProps) {
    const [myRating, setMyRating] = useState<number | null>(null);
    const [stats, setStats] = useState<RatingStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchRatingData();
    }, [noteId]);

    const fetchRatingData = async () => {
        setIsLoading(true);
        setError('');

        try {
            const [myRatingRes, statsRes] = await Promise.all([
                axiosInstance.get<MyRating>(`${API_BASE_URL}/note-ratings/${noteId}/my-rating`),
                axiosInstance.get<RatingStats>(`${API_BASE_URL}/note-ratings/${noteId}/ratings`),
            ]);

            setMyRating(myRatingRes.data.rating);
            setStats(statsRes.data);
        } catch (err: any) {
            console.error('Błąd przy pobieraniu ocen:', err);
        } finally {
            setIsLoading(true);
        }
    };

    const handleRating = async (newRating: number) => {
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            await axiosInstance.post<RatingResponse>(`${API_BASE_URL}/note-ratings/${noteId}/rate`, {
                rating: newRating,
            });

            setMyRating(newRating);
            onRatingChange?.(newRating);

            setTimeout(() => setSuccess(''), 2000);

            // Przeładuj statystyki
            fetchRatingData();
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Błąd przy zapisywaniu oceny');
            console.error('Błąd:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteRating = async () => {
        if (!confirm('Jesteś pewien, że chcesz usunąć swoją ocenę?')) return;

        setIsSubmitting(true);
        setError('');

        try {
            await axiosInstance.delete(`${API_BASE_URL}/note-ratings/${noteId}/rate`);
            setMyRating(null);
            setSuccess('Ocena usunięta!');

            setTimeout(() => setSuccess(''), 2000);
            fetchRatingData();
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Błąd przy usuwaniu oceny');
            console.error('Błąd:', err);
        } finally {
            setIsSubmitting(false);
        }
    };



    return (
        <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Oceń tę notatkę</h3>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                        {success}
                    </div>
                )}

                <div className="flex items-center gap-6">
                    <div className="rating gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <input
                                key={star}
                                type="radio"
                                name={`rating-${noteId}`}
                                className="mask mask-star-2 bg-green-500 cursor-pointer transition hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label={`${star} star`}
                                checked={myRating === star}
                                onChange={() => handleRating(star)}
                                disabled={isSubmitting}
                                title={`${star} gwiazdek`}
                            />
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        {myRating && (
                            <>
                                <div className="text-gray-700 font-medium">
                                    Twoja ocena: <span className="text-green-600">{myRating}/5</span>
                                </div>
                                <button
                                    onClick={handleDeleteRating}
                                    disabled={isSubmitting}
                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition disabled:opacity-50"
                                    title="Usuń ocenę"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </>
                        )}

                    </div>
                </div>

                <p className="text-sm text-gray-500 mt-4">
                    {myRating
                        ? 'Możesz zmienić swoją ocenę w każdej chwili.'
                        : 'Bądź pierwszym, który oceni tę notatkę!'}
                </p>
            </div>

            {stats && stats.total_ratings > 0 && (
                <div className="border-t pt-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Statystyki ocen</h4>

                    <div className="mb-4">
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-gray-900">
                                {stats.average_rating ? stats.average_rating.toFixed(1) : '0'}
                            </span>
                            <span className="text-gray-600">/ 5</span>
                            <span className="text-sm text-gray-500">({stats.total_ratings} ocen)</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = stats.rating_distribution[star.toString()] || 0;
                            const percentage = stats.rating_percentages[star.toString()] || 0;

                            return (
                                <div key={star} className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-700 w-12">
                                        {star} ⭐
                                    </span>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-500 rounded-full transition-all"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-gray-600 w-12 text-right">
                                        {percentage}%
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}