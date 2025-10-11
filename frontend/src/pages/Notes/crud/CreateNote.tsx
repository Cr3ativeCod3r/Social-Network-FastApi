import { useState } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { Upload, FileText } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function CreateNote() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [subject, setSubject] = useState('');
    const [groupId, setGroupId] = useState<number | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!title.trim() || !content.trim()) {
            setError('Tytuł i zawartość są wymagane');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            if (subject) formData.append('subject', subject);
            if (groupId) formData.append('group_id', groupId.toString());
            if (file) formData.append('file', file);

            const response = await axiosInstance.post(API_BASE_URL + '/notes/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setSuccess('Notatka utworzona pomyślnie!');
            setTitle('');
            setContent('');
            setSubject('');
            setGroupId(null);
            setFile(null);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Błąd przy tworzeniu notatki');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <h1 className="text-2xl font-bold mb-6">Nowa notatka</h1>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                        {success}
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Tytuł *"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={255}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <textarea
                    placeholder="Zawartość *"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />

                <input
                    type="text"
                    placeholder="Przedmiot"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    maxLength={255}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                    type="number"
                    placeholder="ID grupy"
                    value={groupId || ''}
                    onChange={(e) => setGroupId(e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="relative">
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="file-input"
                    />
                    <label
                        htmlFor="file-input"
                        className="flex items-center justify-center w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-blue-500 transition"
                    >
                        <div className="flex items-center gap-2 text-gray-600">
                            {file ? (
                                <>
                                    <FileText size={20} />
                                    <span className="truncate">{file.name}</span>
                                </>
                            ) : (
                                <>
                                    <Upload size={20} />
                                    <span>Kliknij aby dodać plik</span>
                                </>
                            )}
                        </div>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:bg-gray-400 transition"
                >
                    {loading ? 'Tworzenie...' : 'Utwórz notkę'}
                </button>
            </form>
        </div>
    );
}