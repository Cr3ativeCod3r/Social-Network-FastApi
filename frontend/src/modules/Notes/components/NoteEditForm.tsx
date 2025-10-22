import { Check, X } from 'lucide-react';
import type { NoteDetail } from '../types';

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

interface NoteEditFormProps {
    editData: EditData;
    setEditData: (data: EditData) => void;
    note: NoteDetail;
    subjects: Subject[];
    loadingSubjects: boolean;
    onSave: () => void;
    onCancel: () => void;
    isSaving: boolean;
}

export default function NoteEditForm({ 
    editData, 
    setEditData, 
    note,
    subjects,
    loadingSubjects,
    onSave, 
    onCancel, 
    isSaving 
}: NoteEditFormProps) {
    return (
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
                <select
                    value={editData.subject_id}
                    onChange={(e) => setEditData({ ...editData, subject_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-black"
                    disabled={loadingSubjects}
                >
                    <option value="">Wybierz przedmiot</option>
                    {subjects.map((subject) => (
                        <option key={subject.subject_id} value={subject.subject_id}>
                            {subject.name}
                        </option>
                    ))}
                </select>
                {loadingSubjects && (
                    <p className="text-sm text-gray-500 mt-1">Ładowanie przedmiotów...</p>
                )}
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
                            className={`px-3 py-1 rounded text-sm transition ${
                                editData.removeFile
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
                    onClick={onSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                    <Check size={18} />
                    {isSaving ? 'Zapisywanie...' : 'Zapisz'}
                </button>
                <button
                    onClick={onCancel}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition disabled:opacity-50"
                >
                    <X size={18} />
                    Anuluj
                </button>
            </div>
        </div>
    );
}