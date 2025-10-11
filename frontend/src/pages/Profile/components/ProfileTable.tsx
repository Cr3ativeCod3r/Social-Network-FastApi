import type { UserData } from "../../../Types/User"
import {
  User as Building, BookOpen, ShieldCheck, Info, CalendarDays,
  MessageSquare, Edit, CheckCircle, XCircle, Save, X
} from 'lucide-react';
import Demo from "./ChangePasswordModal"
import student from "../../../assets/image/student.svg"

const PermissionBadge: React.FC<{ granted: boolean }> = ({ granted }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${granted
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800'
    }`}>
    {granted ? <CheckCircle size={14} className="mr-1" /> : <XCircle size={14} className="mr-1" />}
    {granted ? 'Przyznane' : 'Odebrane'}
  </span>
);

interface ProfileTableProps {
  userData: UserData;
  editMode: { [key: string]: boolean };
  editValues: { [key: string]: string | null };
  onEdit: (field: string) => void;
  onCancel: (field: string) => void;
  onSave: (field: string) => void;
  onEditValueChange: (field: string, value: string) => void;
}


const ProfileTable: React.FC<ProfileTableProps> = ({
  userData,
  editMode,
  editValues,
  onEdit,
  onCancel,
  onSave,
  onEditValueChange
}) => {
  const profileDetails = [
    {
      label: 'Data dołączenia',
      value: new Date(userData.created_at).toLocaleDateString('pl-PL', {
        year: 'numeric', month: 'long', day: 'numeric'
      }),
      icon: CalendarDays,
      condition: true,
      editable: false,
      field: 'created_at',
    },
    {
      label: 'Bio',
      value: userData.bio,
      icon: Info,
      condition: true,
      editable: true,
      field: 'bio',
      type: 'textarea',
    },
    {
      label: 'Uczelnia',
      value: userData.university,
      icon: Building,
      condition: true,
      editable: true,
      field: 'university',
    },
    {
      label: 'Wydział',
      value: userData.department,
      icon: BookOpen,
      condition: true,
      editable: true,
      field: 'department',
    },
  ];

  const permissionDetails = [
    {
      label: 'Uprawnienia do pisania postów',
      value: <PermissionBadge granted={userData.post_permission} />,
      icon: Edit,
    },
    {
      label: 'Uprawnienia do komentowania',
      value: <PermissionBadge granted={userData.comment_permission} />,
      icon: MessageSquare,
    },
    {
      label: 'Uprawnienia do czatu',
      value: <PermissionBadge granted={userData.chat_permission} />,
      icon: MessageSquare,
    },
  ];

  return (
    <>

      <div className="min-h-screen flex items-center justify-center  p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl w-full animate-fade-in">

          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative mb-4">
              <img
                src={student}
                alt="Zdjęcie profilowe"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 p-2"
              />
              {userData.is_verified && (
                <div className="absolute bottom-1 right-1 bg-blue-500 rounded-full p-1.5 border-2 border-white" title="Konto zweryfikowane">
                  <ShieldCheck size={20} className="text-white" />
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              {userData.first_name} {userData.last_name}
            </h1>
            <p className="text-gray-500">{userData.email}</p>
            {userData.is_admin && (
              <span className="mt-2 text-sm font-semibold text-white bg-purple-600 px-3 py-1 rounded-full">
                Administrator
              </span>
            )}

          </div>
          <div className="flex flex-col md:flex-row gap-8">

            <div className="flex-1 space-y-4">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Informacje o koncie</h2>
              {profileDetails
                .filter(detail => detail.condition)
                .map(({ label, value, icon: Icon, editable, field, type }) => (
                  <div key={field} className="flex items-start justify-between gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-4 flex-grow">
                      <Icon size={20} className="text-gray-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600">{label}</p>
                        {editable && editMode[field] ? (
                          type === 'textarea' ? (
                            <textarea
                              value={editValues[field] || ''}
                              onChange={(e) => onEditValueChange(field, e.target.value)}
                              className="border rounded px-2 py-1 w-full mt-1 resize-y"
                              rows={3}
                            />
                          ) : (
                            <input
                              type="text"
                              value={editValues[field] || ''}
                              onChange={(e) => onEditValueChange(field, e.target.value)}
                              className="border rounded px-2 py-1 w-full mt-1"
                            />
                          )
                        ) : (
                          <p className="font-medium text-gray-900">{String(value || '-')}</p>
                        )}
                      </div>
                    </div>
                    {editable && (
                      <div className="flex-shrink-0">
                        {editMode[field] ? (
                          <>
                            <button
                              onClick={() => onSave(field)}
                              className="ml-2 p-1 rounded-full bg-green-500 text-white hover:bg-green-600 focus:outline-none"
                              title="Zapisz"
                            >
                              <Save size={16} />
                            </button>
                            <button
                              onClick={() => onCancel(field)}
                              className="ml-1 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 focus:outline-none"
                              title="Anuluj"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => onEdit(field)}
                            className="ml-2 p-1 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
                            title="Edytuj"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </div>

            <div className="flex-1 mt-8 md:mt-0 space-y-4">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Status i Uprawnienia</h2>

              <div className={`flex items-center gap-4 p-4 rounded-lg ${userData.is_banned ? 'bg-red-100' : 'bg-green-100'}`}>
                <div>
                  <p className="text-sm text-gray-600">Status konta</p>
                  <p className={`font-bold ${userData.is_banned ? 'text-red-700' : 'text-green-700'}`}>
                    {userData.is_banned ? (
                      `Zablokowane ${userData.ban_expires_at ? `do ${new Date(userData.ban_expires_at).toLocaleDateString('pl-PL')}` : ''}`
                    ) : 'Aktywne'}
                  </p>
                </div>
              </div>

              {permissionDetails.map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <Icon size={20} className="text-gray-500 flex-shrink-0" />
                    <p className="font-medium text-gray-800">{label}</p>
                  </div>
                  {value}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      <Demo />
    </>
  );
};

export default ProfileTable