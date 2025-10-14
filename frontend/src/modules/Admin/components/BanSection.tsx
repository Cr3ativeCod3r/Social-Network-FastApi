import { Ban } from 'lucide-react';

type FormData = {
  is_banned: boolean;
  ban_reason?: string | null;
};

interface BanSectionProps {
  formData: FormData;
  saving: boolean;
  onBan: () => void;
  onUnban: () => void;
  banDuration: number;
  onBanDurationChange: (value: number) => void;
  banReasonInput: string;
  onBanReasonChange: (value: string) => void;
}

export function BanSection({
  formData,
  saving,
  onBan,
  onUnban,
  banDuration,
  onBanDurationChange,
  banReasonInput,
  onBanReasonChange,
}: BanSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Ban size={20} />
        Blokada konta
      </h3>

      {formData.is_banned ? (
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-medium text-red-900">Użytkownik jest zbanowany</p>
              {formData.ban_reason && (
                <p className="text-sm text-red-700 mt-2">
                  <strong>Powód:</strong> {formData.ban_reason}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onUnban}
            disabled={saving}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-medium"
          >
            Odbanuj użytkownika
          </button>
        </div>
      ) : (
        <div className="space-y-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Powód bana
            </label>
            <textarea
              value={banReasonInput}
              onChange={(e) => onBanReasonChange(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Opisz powód zablokowania konta..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Czas bana (dni)
            </label>
            <input
              type="number"
              value={banDuration}
              onChange={(e) =>
                onBanDurationChange(Math.max(1, parseInt(e.target.value) || 1))
              }
              min={1}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={onBan}
            disabled={saving || !banReasonInput.trim()}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 font-medium"
          >
            Zbanuj użytkownika
          </button>
        </div>
      )}
    </div>
  );
}