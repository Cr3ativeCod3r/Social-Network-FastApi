import { Shield } from 'lucide-react';

type FormData = {
  is_verified: boolean;
  is_admin: boolean;
};

interface StatusSectionProps {
  formData: FormData;
  saving: boolean;
  onVerify: () => void;
  onMakeAdmin: () => void;
  onRemoveAdmin: () => void;
}

export function StatusSection({
  formData,
  saving,
  onVerify,
  onMakeAdmin,
  onRemoveAdmin,
}: StatusSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Shield size={20} />
        Status konta
      </h3>

      <div className="space-y-3">
        {/* Sekcja weryfikacji */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <span className="font-medium text-gray-900">Zweryfikowany</span>
            <p className="text-sm text-gray-600">Użytkownik potwierdził swój email</p>
          </div>
          {formData.is_verified ? (
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Tak
            </span>
          ) : (
            <button
              onClick={onVerify}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 text-sm font-medium"
            >
              Zweryfikuj
            </button>
          )}
        </div>

        {/* Sekcja admina */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <span className="font-medium text-gray-900">Administrator</span>
            <p className="text-sm text-gray-600">Pełne uprawnienia administracyjne</p>
          </div>
          <div className="flex gap-2">
            {formData.is_admin ? (
              <button
                onClick={onRemoveAdmin}
                disabled={saving}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 text-sm font-medium"
              >
                Odbierz admin
              </button>
            ) : (
              <button
                onClick={onMakeAdmin}
                disabled={saving}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 text-sm font-medium"
              >
                Przydziel admin
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}