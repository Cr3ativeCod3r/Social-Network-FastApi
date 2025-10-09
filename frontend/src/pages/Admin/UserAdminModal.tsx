import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { StatusSection } from './components/StatusSection';
import { PermissionsSection } from './components/PermissionsSection';
import { BanSection } from './components/BanSection';
import axiosInstance from '../../api/axiosInstance';

interface UserAdminModalProps {
  userId: string;
  userEmail: string;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function UserAdminModal({ userId, userEmail, onClose, onUpdate }: UserAdminModalProps) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    is_verified: false,
    is_admin: false,
    is_banned: false,
    comment_permission: true,
    post_permission: true,
    chat_permission: true,
    ban_reason: null
  });

  const [banDuration, setBanDuration] = useState(1);
  const [banReasonInput, setBanReasonInput] = useState('');

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/admin/users/${userId}`);
      setData(response.data);
      setFormData(response.data);
    } catch (err) {
      setError('Błąd podczas ładowania danych użytkownika');
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async () => {
    setSaving(true);
    setError(null);
    try {
      await axiosInstance.post(`/admin/users/${userId}/ban`, {
        reason: banReasonInput,
        duration_days: banDuration
      });
      setFormData(prev => ({ ...prev, is_banned: true, ban_reason: banReasonInput }));
      onUpdate?.();
    } catch (err) {
      setError('Błąd podczas banowania użytkownika');
    } finally {
      setSaving(false);
    }
  };

  const handleUnban = async () => {
    setSaving(true);
    setError(null);
    try {
      await axiosInstance.post(`/admin/users/${userId}/unban`, 'Odbanowanie przez administratora');
      setFormData(prev => ({ ...prev, is_banned: false, ban_reason: null }));
      setBanReasonInput('');
      onUpdate?.();
    } catch (err) {
      setError('Błąd podczas odbanowania użytkownika');
    } finally {
      setSaving(false);
    }
  };

  const handleVerify = async () => {
    setSaving(true);
    setError(null);
    try {
      await axiosInstance.patch(`/admin/users/${userId}/verify`, 'Weryfikacja przez administratora');
      setFormData(prev => ({ ...prev, is_verified: true }));
      onUpdate?.();
    } catch (err) {
      setError('Błąd podczas weryfikacji użytkownika');
    } finally {
      setSaving(false);
    }
  };

  const handleMakeAdmin = async () => {
    setSaving(true);
    setError(null);
    try {
      await axiosInstance.patch(`/admin/users/${userId}/make-admin`, 'Nadanie uprawnień admin przez administratora');
      setFormData(prev => ({ ...prev, is_admin: true }));
      onUpdate?.();
    } catch (err) {
      setError('Błąd podczas nadawania uprawnień admin');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAdmin = async () => {
    setSaving(true);
    setError(null);
    try {
      await axiosInstance.patch(`/admin/users/${userId}/remove-admin`, 'Odebranie uprawnień admin przez administratora');
      setFormData(prev => ({ ...prev, is_admin: false }));
      onUpdate?.();
    } catch (err) {
      setError('Błąd podczas odbierania uprawnień admin');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePermissions = async () => {
    setSaving(true);
    setError(null);
    try {
      await axiosInstance.patch(`/admin/users/${userId}/permissions`, {
        comment_permission: formData.comment_permission,
        post_permission: formData.post_permission,
        chat_permission: formData.chat_permission
      });
      onUpdate?.();
    } catch (err) {
      setError('Błąd podczas aktualizacji uprawnień');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4  z-999">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Zarządzanie użytkownikiem</h2>
            <p className="text-sm text-gray-600 mt-1">{userEmail}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Ładowanie...</p>
            </div>
          ) : error && !data ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-800">{error}</p>
              <button
                onClick={fetchUserData}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Spróbuj ponownie
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <StatusSection
                formData={formData}
                saving={saving}
                onVerify={handleVerify}
                onMakeAdmin={handleMakeAdmin}
                onRemoveAdmin={handleRemoveAdmin}
              />

              <PermissionsSection
                formData={formData}
                saving={saving}
                onToggle={handleToggle}
                onUpdate={handleUpdatePermissions}
              />

              <BanSection
                formData={formData}
                saving={saving}
                onBan={handleBan}
                onUnban={handleUnban}
                banDuration={banDuration}
                onBanDurationChange={setBanDuration}
                banReasonInput={banReasonInput}
                onBanReasonChange={setBanReasonInput}
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}


