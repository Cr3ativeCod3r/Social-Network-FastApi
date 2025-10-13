import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Settings } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import {FileText} from "lucide-react";

interface Note {
  note_id: number;
  title: string;
  subject: string;
  created_at: string;
  user_id: number;
  average_rating: string;
  rating_count: number;
}

interface NotesResponse {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  items: Note[];
}

export default function UserNotes() {
  const { id } = useParams<{ id: string }>();
  const [notes, setNotes] = useState<Note[]>([]);


  useEffect(() => {
    if (!id) return;

    const fetchNotes = async () => {
      try {
        const response = await axiosInstance.get<NotesResponse>(
          `/notes/user/${id}`,
          { params: { page: 1, page_size: 20 } }
        );
        setNotes(response.data.items);
      } catch (error) {
        console.error('Error fetching notes:', error);
      } 
    };

    fetchNotes();
  }, [id]);


  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <div className="p-6  max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-center mb-6">
        <FileText className="mr-2" size={32} />
        <h1 className="text-2xl font-bold">Moje notatki</h1>
      </div>

      {notes.length === 0 ? (
        <p className="text-gray-500">Brak notatek</p>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.note_id}
              className="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{note.title}</h3>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>{note.subject}</span>
                    <span>{formatDate(note.created_at)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`/notatki/${note.note_id}`}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded transition"
                    title="Podgląd"
                    target='_blank'
                  >
                    <Settings  size={28} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}