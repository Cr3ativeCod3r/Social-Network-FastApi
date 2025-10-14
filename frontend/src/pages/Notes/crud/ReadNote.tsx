import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';
import { Download, ArrowLeft, Edit2, Trash2, X, Check } from 'lucide-react';
import student from "../../../assets/image/student.svg"
import NoteRating from '../components/RateNote';
import SaveNoteButton from '../components/SaveNote';
import NoteStatistics from '../components/NoteStatistics';
import NoteComments from '../components/Comments';

interface NoteResponseData {
    note: NoteDetail;
    is_owner: boolean;
}

interface NoteDetail {
    title: string;
    content: string;
    subject: string;
    note_id: number;
    file_path: string | null;
    created_at: string;
    updated_at: string;
    user_id: number;
    average_rating: string;
    rating_count: number;
}

interface UserProfile {
    first_name: string;
    last_name: string;
    profile_picture: string;
    university: string;
    department: string;
}

export default function NoteDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [note, setNote] = useState<NoteDetail | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isOwner, setIsOwner] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editData, setEditData] = useState({
        title: '',
        content: '',
        subject: '',
        file: null as File | null,
        removeFile: false,
    });

    useEffect(() => {
        if (!id) {
            setError('ID notatki nie znaleziono');
            setLoading(false);
            return;
        }

        const fetchNote = async () => {
            try {
                setError('');
                const response = await axiosInstance.get<NoteResponseData>(`/notes/${id}`);
                setNote(response.data.note);
                setIsOwner(response.data.is_owner);
                setEditData({
                    title: response.data.note.title,
                    content: response.data.note.content,
                    subject: response.data.note.subject,
                    file: null,
                    removeFile: false,
                });

                const userResponse = await axiosInstance.get<UserProfile>(`/users/${response.data.note.user_id}`);
                setUser(userResponse.data);
            } catch (err: any) {
                setError(err.response?.data?.detail || 'Błąd przy pobieraniu notatki');
                console.error('Błąd:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchNote();
    }, [id]);

    const handleDownload = async () => {
        if (!id || !note?.file_path) return;

        try {
            const response = await axiosInstance.get(`/notes/${id}/download`, {
                responseType: 'blob',
            });

            // Pobranie nazwy pliku z nagłówka Content-Disposition
            const disposition = response.headers['content-disposition'];
            let filename = `note-${id}`; // fallback, jeśli nagłówek nie będzie dostępny

            if (disposition && disposition.includes('filename=')) {
                const match = disposition.match(/filename="?([^"]+)"?/);
                if (match && match[1]) {
                    filename = match[1];
                }
            }

            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename; // używamy nazwy z backendu
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Błąd przy pobieraniu pliku', err);
        }
    };
    const handleSaveEdit = async () => {
        if (!id || !note) return;
        setIsSaving(true);
        setError('');

        try {
            const formData = new FormData();

            if (editData.title !== note.title) {
                formData.append('title', editData.title);
            }
            if (editData.content !== note.content) {
                formData.append('content', editData.content);
            }
            if (editData.subject !== note.subject) {
                formData.append('subject', editData.subject);
            }

            if (editData.file) {
                formData.append('file', editData.file);
            }

            if (editData.removeFile) {
                formData.append('remove_file', 'true');
            }

            const response = await axiosInstance.put<NoteDetail>(`/notes/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setNote(response.data);
            setIsEditing(false);
            setEditData({
                title: response.data.title,
                content: response.data.content,
                subject: response.data.subject,
                file: null,
                removeFile: false,
            });
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Błąd przy zapisywaniu notatki');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!id) return;
        setIsDeleting(true);
        try {
            await axiosInstance.delete(`/notes/${id}`);
            navigate('/notes');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Błąd przy usuwaniu notatki');
            setIsDeleting(false);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };


    if (error && !note) {
        return (
            <div className="max-w-3xl mx-auto p-6">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-6 transition"
                >
                    <ArrowLeft size={18} />
                    Wróć
                </button>
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    if (!note) {
        return (
            <div className="max-w-3xl mx-auto p-6 min-h-screen">

            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6 min-h-screen">
            <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-6 transition"
            >
                <ArrowLeft size={18} />
                Wróć
            </button>

            {user && (
                <div className="bg-gray-200 rounded-lg p-4 mb-6 border border-gray-200">
                    <div className="flex items-start gap-4">
                        <div className="flex-1 flex items-center gap-2">
                            <img
                                src={user.profile_picture || student}
                                alt="Zdjęcie profilowe"
                                className="w-16 h-16 rounded-full object-cover border-2 border-green-500 p-2 bg-gray-50"
                            />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {user.first_name} {user.last_name}
                                </h2>
                                {user.department && (
                                    <p className="text-gray-600">{user.department}</p>
                                )}
                                {user.university && (
                                    <p className="text-gray-600 text-sm">{user.university}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-lg p-8 animate-fade-in">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {isEditing ? (
                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tytuł</label>
                            <input
                                type="text"
                                value={editData.title}
                                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Przedmiot</label>
                            <input
                                type="text"
                                value={editData.subject}
                                onChange={(e) => setEditData({ ...editData, subject: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Treść</label>
                            <textarea
                                value={editData.content}
                                onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                                rows={10}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Plik</label>
                            {note.file_path && (
                                <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                                    <span className="text-sm text-blue-700">Plik już istnieje</span>
                                    <button
                                        type="button"
                                        onClick={() => setEditData({ ...editData, removeFile: !editData.removeFile })}
                                        className={`px-3 py-1 rounded text-sm transition ${editData.removeFile
                                            ? 'bg-red-500 text-white hover:bg-red-600'
                                            : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                                            }`}
                                    >
                                        {editData.removeFile ? 'Anuluj usunięcie' : 'Usuń plik'}
                                    </button>
                                </div>
                            )}
                            <input
                                type="file"
                                onChange={(e) => setEditData({ ...editData, file: e.target.files?.[0] || null })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            {editData.file && (
                                <p className="text-sm text-gray-600 mt-2">Wybrany plik: {editData.file.name}</p>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleSaveEdit}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                            >
                                <Check size={18} />
                                {isSaving ? 'Zapisywanie...' : 'Zapisz'}
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditData({
                                        title: note.title,
                                        content: note.content,
                                        subject: note.subject,
                                        file: null,
                                        removeFile: false,
                                    });
                                }}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition disabled:opacity-50"
                            >
                                <X size={18} />
                                Anuluj
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-4 ">
                                <NoteStatistics noteId={note.note_id} />
                                <SaveNoteButton noteId={note.note_id} />
                            </div>

                            <div className="flex items-center gap-2">
                                {note.file_path && (
                                    <button
                                        onClick={handleDownload}
                                        className="flex items-center justify-center p-2 w-10 h-10 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
                                        title="Pobierz zasoby"
                                    >
                                        <Download size={20} />
                                    </button>
                                )}
                                {isOwner && (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center justify-center p-2 w-10 h-10 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition"
                                            title="Edytuj notatkę"
                                        >
                                            <Edit2 size={20} />
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            disabled={isDeleting}
                                            className="flex items-center justify-center p-2 w-10 h-10 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition disabled:opacity-50"
                                            title="Usuń notatkę"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="mb-6 border-b pb-6">
                            <h1 className="text-3xl font-bold text-gray-900 break-words">{note.title}</h1>
                            {note.subject && (
                                <p className="text-gray-600 text-lg mt-2">{note.subject}</p>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-6 mb-8 text-sm text-gray-500">
                            <div>
                                <span className="font-semibold text-gray-700">Utworzone:</span>
                                <p>{formatDate(note.created_at)}</p>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-700">Zmienione:</span>
                                <p>{formatDate(note.updated_at)}</p>
                            </div>
                        </div>

                        <div className="prose prose-sm max-w-none">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                        </div>
                    </>

                )}
            </div>

            <div className='mt-4'>
                <NoteRating noteId={note.note_id} />
            </div>
            <div className='mt-4'>
                <NoteComments noteId={note.note_id} />
            </div>
        </div>
    );
}