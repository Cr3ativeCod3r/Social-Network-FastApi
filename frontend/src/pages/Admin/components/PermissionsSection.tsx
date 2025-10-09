import { Shield, MessageSquare, FileText, MessageCircle } from 'lucide-react';
import React from 'react';

type FormData = {
  comment_permission: boolean;
  post_permission: boolean;
  chat_permission: boolean;
};

interface PermissionsSectionProps {
  formData: FormData;
  saving: boolean;
  onToggle: (field: keyof FormData) => void;
  onUpdate: () => void;
}

interface PermissionCheckboxProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}

export function PermissionsSection({
  formData,
  saving,
  onToggle,
  onUpdate,
}: PermissionsSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Shield size={20} />
        Uprawnienia
      </h3>

      <div className="space-y-3">
        <PermissionCheckbox
          icon={<MessageSquare size={18} />}
          label="Komentarze"
          description="Możliwość dodawania komentarzy"
          checked={formData.comment_permission}
          onChange={() => onToggle('comment_permission')}
        />

        <PermissionCheckbox
          icon={<FileText size={18} />}
          label="Posty"
          description="Możliwość tworzenia postów"
          checked={formData.post_permission}
          onChange={() => onToggle('post_permission')}
        />

        <PermissionCheckbox
          icon={<MessageCircle size={18} />}
          label="Czat"
          description="Możliwość korzystania z czatu"
          checked={formData.chat_permission}
          onChange={() => onToggle('chat_permission')}
        />
      </div>

      <button
        onClick={onUpdate}
        disabled={saving}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium mt-4"
      >
        Zapisz uprawnienia
      </button>
    </div>
  );
}

function PermissionCheckbox({
  icon,
  label,
  description,
  checked,
  onChange,
}: PermissionCheckboxProps) {
  return (
    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
      <div className="flex items-center gap-3">
        <div className="text-gray-600">{icon}</div>
        <div>
          <span className="font-medium text-gray-900">{label}</span>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
      />
    </label>
  );
}