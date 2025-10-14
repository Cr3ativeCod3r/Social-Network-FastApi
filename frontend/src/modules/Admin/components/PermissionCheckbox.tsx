interface PermissionCheckboxProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
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

export default PermissionCheckbox;