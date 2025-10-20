import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileText } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import UserNoteTable from '../../modules/Notes/components/UserNoteTable';
import Pagination from '../../modules/Notes/components/Pagination';
import type { Note, NotesResponse } from '../../modules/Notes/types';
import student from "../../assets/image/student.svg"

interface UserProfile {
    first_name: string;
    last_name: string;
    profile_picture: string;
    bio: string;
}

const page_size = import.meta.env.VITE_PAGE_SIZE_NOTES;

export default function UserProfile() {
    const { id } = useParams<{ id: string }>();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get<UserProfile>(
                    `/users/${id}`
                );
                setProfile(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching user profile:', err);
                setError('Nie udało się pobrać profilu użytkownika');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [id]);

    useEffect(() => {
        if (!id) return;

        const fetchNotes = async () => {
            try {
                const response = await axiosInstance.get<NotesResponse>(
                    `/notes/user/${id}`,
                    { params: { page, page_size: page_size } }
                );
                setNotes(response.data.items);
                setTotalPages(response.data.total_pages);
            } catch (error) {
                console.error('Error fetching notes:', error);
            }
        };

        fetchNotes();
    }, [id, page]);

    if (loading) {
        return (
            <div className='bg-white min-h-screen'>
            </div>
        );
    }

    if (error || !profile) {
        return (
           <div className='bg-white min-h-screen'>
            </div>
        )
    }

    return (
        <div className="p-6 max-w-4xl mx-auto animate-fade-in min-h-screen animate-fade-in">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                        {profile.profile_picture ? (
                            <img
                                src={profile.profile_picture}
                                alt={`${profile.first_name} ${profile.last_name}`}
                                className="w-24 h-24 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                                <img src={student} className='h-16' />
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2 text-basic2">
                            {profile.first_name} {profile.last_name}
                        </h1>
                        {profile.bio && (
                            <p className="text-gray-600 whitespace-pre-wrap">{profile.bio}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center mb-6 justify-center mt-6">
                <FileText className="mr-2 text-basic2 " size={32} />
                <h2 className="text-2xl font-bold text-basic2 ">Notatki użytkownika</h2>
            </div>

            {notes.length === 0 ? (
                <p className="text-gray-500 min-h-screen">Brak notatek</p>
            ) : (
                <>
                    <div className="space-y-3">
                        {notes.map((note) => (
                            <UserNoteTable
                                key={note.note_id}
                                note_id={note.note_id}
                                title={note.title}
                                subject={note.subject}
                                average_rating={note.average_rating}
                                rating_count={note.rating_count}
                                created_at={note.created_at}
                            />
                        ))}
                    </div>

                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </>
            )}
        </div>
    );
}