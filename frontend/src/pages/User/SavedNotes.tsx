import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Book, Loader } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import { FileText } from "lucide-react";

interface SavedNote {
    user_id: number;
    note_id: number;
    saved_at: string;
    title: string;
    subject: string;
    created_at: string;
    average_rating: string;
    rating_count: number;
}

interface SavedNotesResponse {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    items: SavedNote[];
}

export default function SavedNotes() {
    const navigate = useNavigate();
    const [notes, setNotes] = useState<SavedNote[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchSavedNotes();
    }, [page]);

    const fetchSavedNotes = async () => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get<SavedNotesResponse>(
                '/saved-notes/',
                {
                    params: {
                        page,
                        page_size: 20,
                    },
                }
            );
            setNotes(response.data.items);
            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.error('Error fetching saved notes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader size={32} className="text-blue-500 animate-spin" />
            </div>
        );
    }

    if (notes.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Brak zapisanych notatek</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 mb-6 max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center justify-center my-6">
                <FileText className="mr-2" size={32} />
                <h1 className="text-2xl font-bold">Zapisane notatki</h1>
            </div>
            {notes.map((note) => (
                <div
                    key={note.note_id}
                    className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow flex items-center justify-between"
                >
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-gray-900 break-words mb-2">
                            {note.title}
                        </h3>
                        {note.subject && (
                            <div className="text-sm text-gray-600 flex items-center gap-1">
                                <Book size={14} className="text-gray-500 flex-shrink-0" />
                                {note.subject}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => navigate(`/notatki/${note.note_id}`)}
                        className="ml-4 p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition flex-shrink-0"
                        title="Przejdź do notatki"
                    >
                        <ArrowRight size={20} />
                    </button>
                </div>
            ))}

            {/* Paginacja */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    <button
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        Poprzednia
                    </button>

                    <span className="flex items-center px-4 py-2 text-gray-700">
                        Strona {page} z {totalPages}
                    </span>

                    <button
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                        disabled={page === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        Następna
                    </button>
                </div>
            )}
        </div>
    );
}