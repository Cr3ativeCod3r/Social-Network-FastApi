import { Download, Edit2, Trash2 } from 'lucide-react';
import SaveNoteButton from './SaveNote';
import NoteStatistics from './NoteStatistics';
import type { NoteDetail } from '../types';
import formatDate from '../../../components/dateFormat';

interface NoteContentProps {
    note: NoteDetail;
    isOwner: boolean;
    isDeleting: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onDownload: () => void;
}

export default function NoteContent({ 
    note, 
    isOwner, 
    isDeleting, 
    onEdit, 
    onDelete, 
    onDownload 
}: NoteContentProps) {
 
    return (
        <>
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <NoteStatistics noteId={note.note_id} />
                    <SaveNoteButton noteId={note.note_id} />
                </div>

                <div className="flex items-center gap-2">
                    {note.file_path && (
                        <button
                            onClick={onDownload}
                            className="flex items-center justify-center p-2 w-10 h-10 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
                            title="Pobierz zasoby"
                        >
                            <Download size={20} />
                        </button>
                    )}
                    {isOwner && (
                        <>
                            <button
                                onClick={onEdit}
                                className="flex items-center justify-center p-2 w-10 h-10 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition"
                                title="Edytuj notatkę"
                            >
                                <Edit2 size={20} />
                            </button>
                            <button
                                onClick={onDelete}
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
    );
}