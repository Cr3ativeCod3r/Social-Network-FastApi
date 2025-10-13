import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';
import { Search, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useAuthStore } from "../../../store/authStore";
import { Book } from "lucide-react";
import SaveNoteButton from '../components/SaveNote';
import NoteStatistics from '../components/NoteStatistics';

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalPages, setTotalPages] = useState(0);
    const { user } = useAuthStore();
    const [search, setSearch] = useState('');
    const [subject, setSubject] = useState('');
    const [hasFile, setHasFile] = useState<boolean | null>(null);
    const [sortBy, setSortBy] = useState<'created_at' | 'updated_at' | 'average_rating' | 'rating_count' | 'title'>('created_at');
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');

    const fetchNotes = async () => {
        if (notes.length === 0) setLoading(true);
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
            const response = await axiosInstance.get<ApiResponse>(`${API_BASE_URL}/notes/?${params}`);
            setNotes(response.data.items);
            setTotalPages(response.data.total_pages);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Błąd przy pobieraniu notek');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (noteId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Jesteś pewien, że chcesz usunąć tę notatkę?")) return;
        try {
            await axiosInstance.delete(`${API_BASE_URL}/notes/${noteId}`);
            setNotes(prevNotes => prevNotes.filter(note => note.note_id !== noteId));
        } catch {
            setError("Nie udało się usunąć notatki.");
        }
    };

    useEffect(() => {
        setPage(1);
        fetchNotes();
    }, [search, subject, hasFile, sortBy, order, pageSize]);

    useEffect(() => {
        fetchNotes();
    }, [page]);

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            {error && (
                <div className="bg-red-50  text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg  p-4 mb-6 space-y-4 border-1 border-gray-300">
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Szukaj po tytule lub treści..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border-1 border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 ">
                    <div className="relative flex items-center">
                        <Book size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Przedmiot..."
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border-2 border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="select select-success bg-white w-full"
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
                        className="select select-success bg-white w-full"
                    >
                        <option value="desc">Malejąco</option>
                        <option value="asc">Rosnąco</option>
                    </select>

                    <select
                        value={hasFile === null ? '' : hasFile.toString()}
                        onChange={(e) => setHasFile(e.target.value === '' ? null : e.target.value === 'true')}
                        className="select select-success bg-white w-full"
                    >
                        <option value="">Wszystkie</option>
                        <option value="true">Z plikami</option>
                        <option value="false">Bez plików</option>
                    </select>
                </div>

            </div>

            {loading ? null : notes.length === 0 ? (
                <div className="text-center py-12 text-gray-500">Brak notek</div>
            ) : (
                <div className="space-y-4 mb-6">
                    {notes.map((note) => (
                        <div key={note.note_id} className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
                            {/* Górna część - tytuł i akcje */}
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div
                                    onClick={() => navigate(`/notatki/${note.note_id}`)}
                                    className="cursor-pointer hover:text-blue-600 transition flex-1 min-w-0"
                                >
                                    <h3 className="font-semibold text-lg text-gray-900 break-words">
                                        {note.title}
                                    </h3>
                                </div>

                                {/* Przyciski akcji */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <SaveNoteButton noteId={note.note_id} />

                                    {user?.is_admin && (
                                        <button
                                            onClick={(e) => handleDelete(note.note_id, e)}
                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                                            aria-label="Usuń notatkę"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Przedmiot */}
                            {note.subject && (
                                <div className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                                    <Book size={14} className="text-gray-500 flex-shrink-0" />
                                    {note.subject}
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <div />
                                <div className="ml-auto">
                                    <NoteStatistics noteId={note.note_id} />
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