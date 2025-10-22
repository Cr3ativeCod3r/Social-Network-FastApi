import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { ArrowLeft } from 'lucide-react';
import NoteRating from '../../modules/Notes/RateNote';
import NoteComments from '../../modules/Notes/components/Comments';
import UserProfileCard from '../../modules/Notes/components/UserProfileCard';
import NoteContent from '../../modules/Notes/components/NoteContect';
import NoteEditForm from '../../modules/Notes/components/NoteEditForm';
import type { NoteDetail as NoteDetailType, NoteResponseData, UserProfile } from '../modules/Notes/types';

interface Subject {
    subject_id: number;
    name: string;
}

interface EditData {
    title: string;
    content: string;
    subject_id: number | string;
    file: File | null;
    removeFile: boolean;
}

export default function NoteDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [note, setNote] = useState<NoteDetailType | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isOwner, setIsOwner] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loadingSubjects, setLoadingSubjects] = useState(false);
    const [editData, setEditData] = useState<EditData>({
        title: '',
        content: '',
        subject_id: '',
        file: null,
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
                    subject_id: response.data.note.subject_id,
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

    const fetchSubjects = async () => {
        try {
            setLoadingSubjects(true);
            const response = await axiosInstance.get('/subjects/');
            const data = response.data.subjects || response.data;
            setSubjects(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error('Błąd podczas pobierania przedmiotów:', err);
        } finally {
            setLoadingSubjects(false);
        }
    };

    useEffect(() => {
        if (isEditing) {
            fetchSubjects();
        }
    }, [isEditing]);

    const handleDownload = async () => {
        if (!id || !note?.file_path) return;

        try {
            const response = await axiosInstance.get(`/notes/${id}/download`, {
                responseType: 'blob',
            });

            const disposition = response.headers['content-disposition'];
            let filename = `note-${id}`;

            if (disposition && disposition.includes('filename=')) {
                const match = disposition.match(/filename="?([^"]+)"?/);
                if (match && match[1]) {
                    filename = match[1];
                }
            }

            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
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
            if (editData.subject_id !== note.subject_id) {
                formData.append('subject_id', editData.subject_id.toString());
            }

            if (editData.file) {
                formData.append('file', editData.file);
            }

            if (editData.removeFile) {
                formData.append('remove_file', 'true');
            }

            const response = await axiosInstance.put<NoteDetailType>(`/notes/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setNote(response.data);
            setIsEditing(false);
            setEditData({
                title: response.data.title,
                content: response.data.content,
                subject_id: response.data.subject_id,
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

    const handleCancelEdit = () => {
        if (!note) return;
        setIsEditing(false);
        setEditData({
            title: note.title,
            content: note.content,
            subject_id: note.subject_id,
            file: null,
            removeFile: false,
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
        return <div className="max-w-3xl mx-auto p-6 min-h-screen" />;
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

            {user && <UserProfileCard user={user} user_id={note.user_id} />}

            <div className="bg-white rounded-lg shadow-lg p-8 animate-fade-in">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {isEditing ? (
                    <NoteEditForm
                        editData={editData}
                        setEditData={setEditData}
                        note={note}
                        subjects={subjects}
                        loadingSubjects={loadingSubjects}
                        onSave={handleSaveEdit}
                        onCancel={handleCancelEdit}
                        isSaving={isSaving}
                    />
                ) : (
                    <NoteContent
                        note={note}
                        isOwner={isOwner}
                        isDeleting={isDeleting}
                        onEdit={() => setIsEditing(true)}
                        onDelete={handleDelete}
                        onDownload={handleDownload}
                    />
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