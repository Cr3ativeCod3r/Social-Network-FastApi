import { useState } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { AlertCircle, X } from 'lucide-react';
import { toast } from 'sonner';


type CreateReportModalProps = {
    fetchReports: () => void;
};

export default function CreateReportModal({ fetchReports }: CreateReportModalProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !description.trim()) {
            toast.error('Tytuł i opis są wymagane');
            return;
        }

        if (description.trim().length < 10) {
            toast.error('Opis musi mieć minimum 10 znaków');
            return;
        }

        setLoading(true);

        try {
            await axiosInstance.post('/reports/', {
                title: title.trim(),
                description: description.trim()
            });

            toast.success('Zgłoszenie utworzone pomyślnie!');
            setTimeout(() => {
                fetchReports();
                closeModal();
            }, 1500);
        } catch (err: any) {
            const detail = err.response?.data?.detail;
            const errorMsg = typeof detail === 'string'
                ? detail
                : Array.isArray(detail)
                    ? detail.map((e: any) => e.msg).join(', ')
                    : 'Błąd przy tworzeniu zgłoszenia';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>


            <button
                onClick={openModal}
                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
            >
                <AlertCircle className="w-4 h-4" />
                Zgłoś problem
            </button >

            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] animate-fade-in"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl relative mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 p-1 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100 transition"
                        >
                            <X size={24} />
                        </button>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h1 className="text-2xl font-bold mb-6 text-center text-black">Nowe zgłoszenie</h1>

                            <div>
                                <input
                                    type="text"
                                    placeholder="Tytuł *"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    maxLength={255}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>

                            <div>
                                <textarea
                                    placeholder="Opis problemu (minimum 10 znaków) *"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={8}
                                    minLength={10}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    {description.length} znaków
                                </p>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                                <p className="text-sm text-yellow-800">
                                    <strong>Uwaga:</strong> Zgłoszenie zostanie przesłane do administracji.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-600 text-white py-2 rounded font-medium hover:bg-red-700 disabled:bg-gray-400 transition"
                            >
                                {loading ? 'Wysyłanie...' : 'Wyślij zgłoszenie'}
                            </button>
                        </form>

                    </div>

                </div>

            )
            }
        </>
    )
};