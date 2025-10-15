import { useState } from 'react';
import { X, Eye, EyeOff, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { old_password: string; new_password: string }) => Promise<boolean>;
    loading?: boolean;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose, onSubmit, loading = false }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false,
    });

    const resetForm = () => {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!oldPassword || !newPassword || !confirmPassword) {
            toast.error('Wszystkie pola są wymagane');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Nowe hasła się nie zgadzają');
            return;
        }

        if (newPassword.length < 8) {
            toast.error('Nowe hasło musi mieć co najmniej 8 znaków');
            return;
        }
        const isSuccess = await onSubmit({ old_password: oldPassword, new_password: newPassword });
        if (isSuccess) {
            resetForm();
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    if (!isOpen) return null;

    return (
        <>

            <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 w-screen h-screen">

                <div className="bg-white rounded-lg shadow-2xl w-full max-w-md transform transition-all">
                    <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex items-center justify-between rounded-t-lg">
                        <div className="flex items-center gap-2">
                            <Lock className="w-5 h-5 text-white" />
                            <h2 className="text-xl font-semibold text-white">Zmień hasło</h2>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-white hover:bg-green-800 p-1 rounded transition-colors"
                            aria-label="Zamknij"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Stare hasło
                            </label>
                            <div className="relative">
                                <input
                                    id="oldPassword"
                                    type={showPasswords.old ? 'text' : 'password'}
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    placeholder="Wpisz swoje aktualne hasło"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    disabled={loading}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('old')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPasswords.old ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>


                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Nowe hasło
                            </label>
                            <div className="relative">
                                <input
                                    id="newPassword"
                                    type={showPasswords.new ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Wpisz nowe hasło (min. 8 znaków)"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    disabled={loading}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('new')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        ]
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Potwierdź nowe hasło
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showPasswords.confirm ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Powtórz nowe hasło"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    disabled={loading}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={loading}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Anuluj
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Zmiana hasła...' : 'Zmień hasło'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};



import axiosInstance from '../../../api/axiosInstance';


function Demo() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChangePassword = async (data) => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.post('/users/me/change-password', {
                old_password: data.old_password,
                new_password: data.new_password,
            });
            toast.success(response.data.message || 'Hasło zmienione pomyślnie');
            return true;
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.detail ||
                'Błąd podczas zmiany hasła';

            toast.error(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="mx-auto ml-4 mt-2 text-sm flex items-center">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center text-gray-700 hover:text-blue-600 transition"
                >
                    <Lock className="mr-2 h-4 w-4" />
                    Zmień hasło
                </button>
            </div>

            <ChangePasswordModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleChangePassword}
                loading={isLoading}
            />
        </div>
    );
}

export default Demo;
