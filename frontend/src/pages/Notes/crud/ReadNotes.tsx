import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';
import { Search, FileText, Star, ChevronLeft, ChevronRight, Download } from 'lucide-react';





const API_BASE_URL = import.meta.env.VITE_API_URL;

interface Note {
    note_id: number;
    title: string;
    subject: string;
    created_at: string;
    user_id: number;
    average_rating: string;
    rating_count: number;
}

interface ApiResponse {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    items: Note[];
}

export default function NotesList() {
    const navigate = useNavigate();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalPages, setTotalPages] = useState(0);

    const [search, setSearch] = useState('');
    const [subject, setSubject] = useState('');
    const [hasFile, setHasFile] = useState<boolean | null>(null);
    const [sortBy, setSortBy] = useState<'created_at' | 'updated_at' | 'average_rating' | 'rating_count' | 'title'>('created_at');
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');

    const fetchNotes = async () => {
        setLoading(true);
        setError('');

        try {
            const params = new URLSearchParams({
                page: page.toString(),
                page_size: pageSize.toString(),
                sort_by: sortBy,
                order,
            });

            if (search) params.append('search', search);
            if (subject) params.append('subject', subject);
            if (hasFile !== null) params.append('has_file', hasFile.toString());

            const response = await axiosInstance.get<ApiResponse>(`/notes/?${params}`);
            setNotes(response.data.items);
            setTotalPages(response.data.total_pages);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Błąd przy pobieraniu notek');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
    }, [search, subject, hasFile, sortBy, order]);

    useEffect(() => {
        fetchNotes();
    }, [page, search, subject, hasFile, sortBy, order, pageSize]);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="max-w-5xl mx-auto p-6 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Notatki</h1>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow p-4 mb-6 space-y-4">
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Szukaj..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <input
                        type="text"
                        placeholder="Przedmiot"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                        <option value="created_at">Najnowsze</option>
                        <option value="updated_at">Ostatnio zmienione</option>
                        <option value="title">Tytuł</option>
                        <option value="average_rating">Ocena</option>
                        <option value="rating_count">Liczba ocen</option>
                    </select>

                    <select
                        value={order}
                        onChange={(e) => setOrder(e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                        <option value="desc">Malejąco</option>
                        <option value="asc">Rosnąco</option>
                    </select>

                    <select
                        value={hasFile === null ? '' : hasFile.toString()}
                        onChange={(e) => setHasFile(e.target.value === '' ? null : e.target.value === 'true')}
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                        <option value="">Wszystkie</option>
                        <option value="true">Z plikami</option>
                        <option value="false">Bez plików</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Ładowanie...</div>
            ) : notes.length === 0 ? (
                <div className="text-center py-12 text-gray-500">Brak notek</div>
            ) : (
                <div className="space-y-3 mb-6">
                    {notes.map((note) => (
                        <div
                            key={note.note_id}
                            onClick={() => navigate(`/note/${note.note_id}`)}
                            className="bg-white rounded-lg shadow p-4 hover:shadow-md transition cursor-pointer"
                        >

                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-gray-900 break-words">{note.title}</h3>
                                    {note.subject && (
                                        <p className="text-sm text-gray-600 mt-1">{note.subject}</p>
                                    )}
                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                        <span>{formatDate(note.created_at)}</span>
                                        {note.rating_count > 0 && (
                                            <div className="flex items-center gap-1">
                                                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                                <span>{note.average_rating} ({note.rating_count})</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1 || loading}
                        className="flex items-center gap-2 px-3 py-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        <ChevronLeft size={18} />
                        Poprzednia
                    </button>

                    <div className="text-sm text-gray-600">
                        Strona {page} z {totalPages}
                    </div>

                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages || loading}
                        className="flex items-center gap-2 px-3 py-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        Następna
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
}