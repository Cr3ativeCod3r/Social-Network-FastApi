import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useAuthStore } from "../../store/authStore";
import { Book, Search, Trash2, Filter } from "lucide-react";
import SaveNoteButton from './components/SaveNote';
import NoteStatistics from './components/NoteStatistics';
import Pagination from './components/Pagination';
import type { Note, NotesResponse as ApiResponse } from './types';
import formatDate from '../../components/dateFormat';
import CreateNote from "../../modules/Notes/CreateNote";

const page_size = import.meta.env.VITE_PAGE_SIZE_NOTES || 20;

interface Subject {
    subject_id: number;
    name: string;
    subject: {
        subject_id: number;
        name: string;
    };
}

export default function NotesList() {
    const navigate = useNavigate();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const { user } = useAuthStore();
    const [search, setSearch] = useState('');
    const [subjectId, setSubjectId] = useState<string>('');
    const [hasFile, setHasFile] = useState<boolean | null>(null);
    const [sortBy, setSortBy] = useState<'created_at' | 'updated_at' | 'average_rating' | 'rating_count' | 'title'>('created_at');
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');
    const [subjects, setSubjects] = useState<Subject[]>([]);

    const fetchNotes = async () => {
        if (notes.length === 0) setLoading(true);
        setError('');
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                page_size: page_size.toString(),
                sort_by: sortBy,
                order,
            });

            if (search.trim()) params.append('search', search.trim());
            if (subjectId) params.append('subject_id', subjectId);
            if (hasFile !== null) params.append('has_file', hasFile.toString());

            const response = await axiosInstance.get<ApiResponse>(`/notes/?${params.toString()}`);
            setNotes(response.data.items);
            setTotalPages(response.data.total_pages);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Błąd przy pobieraniu notek');
            console.error('Error fetching notes:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchSubjects = async () => {
        try {
            const response = await axiosInstance.get('/subjects/');
            const data = response.data.subjects || response.data;
            setSubjects(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error("Nie udało się pobrać przedmiotów:", err);
        }
    };

    const handleDelete = async (noteId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Jesteś pewien, że chcesz usunąć tę notatkę?")) return;
        try {
            await axiosInstance.delete(`/notes/${noteId}`);
            setNotes(prevNotes => prevNotes.filter(note => note.note_id !== noteId));
        } catch {
            setError("Nie udało się usunąć notatki.");
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    useEffect(() => {
        setPage(1);
    }, [search, subjectId, hasFile, sortBy, order]);

    useEffect(() => {
        fetchNotes();
    }, [page, search, subjectId, hasFile, sortBy, order]);

    return (
        <>
            <div className="max-w-4xl mx-auto animate-fade-in">

            <div className='mb-2'>
                <CreateNote fetchNotes={fetchNotes} />
            </div>

                {error && (
                    <div className="bg-red-50 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-lg p-4 mb-6 space-y-4 border border-gray-300">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Szukaj po tytule lub treści..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div className="flex items-center gap-2">
                            <Book size={20} className="text-gray-400 flex-shrink-0" />
                            <select
                                value={subjectId}
                                onChange={(e) => {
                                    console.log('Selected subject_id:', e.target.value);
                                    setSubjectId(e.target.value);
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="">Przedmioty</option>
                                {subjects.map((subject) => (
                                    <option key={subject.subject_id} value={subject.subject_id.toString()}>
                                        {subject.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <Filter size={20} className="text-gray-400 flex-shrink-0" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="created_at">Najnowsze</option>
                                <option value="updated_at">Ostatnio zmienione</option>
                                <option value="title">Tytuł</option>
                                <option value="average_rating">Ocena</option>
                                <option value="rating_count">Liczba ocen</option>
                            </select>
                        </div>



                        <div className="flex items-center gap-2">
                            <Filter size={20} className="text-gray-400 flex-shrink-0" />
                            <select
                                value={hasFile === null ? '' : hasFile.toString()}
                                onChange={(e) => setHasFile(e.target.value === '' ? null : e.target.value === 'true')}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="">Pliki</option>
                                <option value="true">Z plikami</option>
                                <option value="false">Bez plików</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter size={20} className="text-gray-400 flex-shrink-0" />
                            <select
                                value={order}
                                onChange={(e) => setOrder(e.target.value as any)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="desc">Malejąco</option>
                                <option value="asc">Rosnąco</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-500">Ładowanie...</div>
                ) : notes.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">Brak notek</div>
                ) : (
                    <div className="space-y-4 mb-6">
                        {notes.map((note) => (
                            <div
                                key={note.note_id}
                                onClick={() => navigate(`/notatki/${note.note_id}`)}
                                className="relative bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer"
                            >
                                <div className="flex items-start justify-between gap-4 mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-lg text-gray-900 break-words hover:text-blue-600 transition">
                                            {note.title}
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-2 flex-shrink-0 z-10 relative">
                                        <div
                                            onClick={(e) => e.stopPropagation()}
                                            className="relative z-20"
                                        >
                                            <SaveNoteButton noteId={note.note_id} />
                                        </div>

                                        {user?.is_admin && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(note.note_id, e);
                                                }}
                                                className="relative z-20 p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                                                aria-label="Usuń notatkę"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {note.subject?.name && (
                                    <div className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                                        <Book size={14} className="text-gray-500 flex-shrink-0" />
                                        {note.subject.name}
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <p className="font-semibold text-gray-300 text-xs break-words hover:text-blue-600 transition flex items-center">
                                        {formatDate(note.created_at)}
                                    </p>
                                    <div className="ml-auto">
                                        <NoteStatistics noteId={note.note_id} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </div>
        </>
    );
}