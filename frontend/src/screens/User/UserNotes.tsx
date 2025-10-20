import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileText } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import UserNoteTable from '../../modules/Notes/components/UserNoteTable';
import Pagination from '../../modules/Notes/components/Pagination';
import type {Note,NotesResponse } from '../../modules/Notes/types';

const page_size = import.meta.env.VITE_PAGE_SIZE_NOTES;

export default function UserNotes() {
  const { id } = useParams<{ id: string }>();
  const [notes, setNotes] = useState<Note[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

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

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in ">
      <div className="flex items-center justify-center mb-6">
        <FileText className="mr-2" size={32} />
        <h1 className="text-2xl font-bold">Moje notatki</h1>
      </div>

      {notes.length === 0 ? (
        <p className="text-gray-500">Brak notatek</p>
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