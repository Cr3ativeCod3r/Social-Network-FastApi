import { useEffect, useState } from 'react';
import { Loader, FileText } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import UserNoteTable from '../modules/Notes/components/UserNoteTable';
import Pagination from '../modules/Notes/components/Pagination';
import type {SavedNote,SavedNotesResponse } from '../modules/Notes/types';

const page_size = import.meta.env.VITE_PAGE_SIZE_NOTES;

export default function SavedNotes() {
    const [notes, setNotes] = useState<SavedNote[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchSavedNotes = async () => {
            try {
                setIsLoading(true);
                const response = await axiosInstance.get<SavedNotesResponse>(
                    '/saved-notes/',
                    {
                        params: {
                            page,
                            page_size: page_size,
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

        fetchSavedNotes();
    }, [page]);

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

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
        </div>
    );
}