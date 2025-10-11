import { useState } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { Upload, FileText, X } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function CreateNoteModal() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [subject, setSubject] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setTitle('');
        setContent('');
        setSubject('');
        setFile(null);
        setError('');
        setSuccess('');
        setLoading(false);
    };

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
            if (file) formData.append('file', file);

            await axiosInstance.post(API_BASE_URL + '/notes/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setSuccess('Notatka utworzona pomyślnie!');
            setTimeout(() => {
                closeModal();
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Błąd przy tworzeniu notatki');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div
                onClick={openModal}
                className="flex items-center bg-white px-12 rounded-xl p-3 cursor-pointer transition-shadow duration-300 w-full"
            >
         
                <img
                    src="https://www.neptumar.pl/wp-content/uploads/facebook-profile-picture-no-pic-avatar.jpg"
                    alt="User avatar"
                    className="w-10 h-10 rounded-full object-cover mr-3"
                />

 
                <input
                    type="text"
                    placeholder="Dodaj swoją notatkę..."
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-gray-700 focus:outline-none cursor-pointer"
                    readOnly
                />
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 w-full h-full flex items-center justify-center z-50">
                    <div
                        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 p-1 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100 transition"
                        >
                            <X size={24} />
                        </button>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h1 className="text-2xl font-bold mb-6 text-center">Nowa notatka</h1>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-sm text-red-700 px-4 py-3 rounded">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="bg-green-50 border border-green-200 text-sm text-green-700 px-4 py-3 rounded">
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
                </div>
            )}
        </>
    );
}