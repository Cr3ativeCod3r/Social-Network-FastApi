import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { Upload, FileText, X } from 'lucide-react';
import { toast } from 'sonner';
import student from "../../assets/image/student.svg";

interface Subject {
    subject_id: number;
    name: string;
}

type CreateNoteModalProps = {
    fetchNotes: () => void;
};

export default function CreateNoteModal({ fetchNotes }: CreateNoteModalProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingSubjects, setLoadingSubjects] = useState(false);

    useEffect(() => {
        if (isModalOpen) {
            fetchSubjects();
        }
    }, [isModalOpen]);

    const fetchSubjects = async () => {
        try {
            setLoadingSubjects(true);
            const response = await axiosInstance.get('/subjects/');
            const data = response.data.subjects || response.data;
            setSubjects(Array.isArray(data) ? data : []);
        } catch (err: any) {
            toast.error('Błąd podczas pobierania przedmiotów');
        } finally {
            setLoadingSubjects(false);
        }
    };

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
        setSubjectId('');
        setFile(null);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            toast.error('Tytuł i zawartość są wymagane');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            if (subjectId) formData.append('subject_id', subjectId);
            if (file) formData.append('file', file);

            await axiosInstance.post('/notes/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.success('Notatka utworzona pomyślnie!');
            setTimeout(() => {
                closeModal();
            }, 500);
        } catch (err: any) {
            const detail = err.response?.data?.detail;
            const errorMsg = typeof detail === 'string'
                ? detail
                : Array.isArray(detail)
                    ? detail.map((e: any) => e.msg).join(', ')
                    : 'Błąd przy tworzeniu notatki';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div
                onClick={openModal}
                className="flex items-center bg-emerald-50 border border-emerald-300 hover:shadow-md 
             px-6 py-3 rounded-xl cursor-pointer transition-shadow duration-300 w-full mt-2"
            >
                <img
                    src={student}
                    alt="User avatar"
                    className="w-10 h-10 rounded-full object-cover mr-3 border border-emerald-200 bg-white p-1"
                />

                <input
                    type="text"
                    placeholder="Dodaj swoją notatkę..."
                    className="flex-1 bg-white text-gray-700 placeholder-gray-400 
               rounded-full px-4 py-2 focus:outline-none cursor-pointer"
                    readOnly
                />
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 h-[85vh] flex mt-2 justify-center z-[9999] backdrop-blur-xs animate-fade-in ">

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
                            <h1 className="text-2xl font-bold mb-6 text-center text-black">Nowa notatka</h1>

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

                            <select
                                value={subjectId}
                                onChange={(e) => setSubjectId(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                                disabled={loadingSubjects}
                            >
                                <option value="">Wybierz przedmiot</option>
                                {subjects.map((subject) => (
                                    <option key={subject.subject_id} value={subject.subject_id}>
                                        {subject.name}
                                    </option>
                                ))}
                            </select>

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
                                onClick={() => {
                                    setTimeout(() => {
                                        fetchNotes();
                                    }, 500);
                                }}
                                className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:bg-gray-400 transition"
                            >
                                {loading ? 'Tworzenie...' : 'Utwórz notatkę'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}