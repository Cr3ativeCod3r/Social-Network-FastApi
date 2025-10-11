import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';
import { Download, ArrowLeft, User } from 'lucide-react';

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
    const [note, setNote] = useState<NoteDetail | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await axiosInstance.get<NoteDetail>(`/notes/${id}`);
                setNote(response.data);

                const userResponse = await axiosInstance.get<UserProfile>(`/users/${response.data.user_id}`);
                setUser(userResponse.data);
            } catch (err: any) {
                setError(err.response?.data?.detail || 'Błąd przy pobieraniu notatki');
            } finally {
                setLoading(false);
            }
        };

        fetchNote();
    }, [id]);

    const handleDownload = async () => {
        if (!id) return;
        try {
            const response = await axiosInstance.get(`/notes/${id}/download`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            link.download = `note-${id}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Błąd przy pobieraniu pliku');
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

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen text-gray-500">Ładowanie...</div>;
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    if (!note) {
        return (
            <div className="max-w-3xl mx-auto p-6">
                <div className="text-center py-12 text-gray-500">Notatka nie znaleziona</div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6 min-h-screen">
            <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition"
            >
                <ArrowLeft size={18} />
                Wróć
            </button>


            {user && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                    <div className="flex items-start gap-4">
                        {user.profile_picture && (
                            <img
                                src={user.profile_picture}
                                alt={`${user.first_name} ${user.last_name}`}
                                className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                            />
                        )}
                        <div className="flex-1 flex items-center gap-2">
                            <User className="text-gray-400" />
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

            <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 break-words">{note.title}</h1>
                        {note.subject && (
                            <p className="text-gray-600 text-lg mt-2">{note.subject}</p>
                        )}
                    </div>
                    {note.file_path && (
                        <button
                            onClick={handleDownload}
                            className="ml-4 flex items-center p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition flex-shrink-0"
                            title="Pobierz plik"
                        >
                            <Download size={24} className='mr-2' />Pobierz zasoby
                        </button>
                    )}
                </div>


                <div className="flex flex-wrap gap-6 mb-8 text-sm text-gray-500 border-b pb-6">
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
            </div>
        </div>
    );
}