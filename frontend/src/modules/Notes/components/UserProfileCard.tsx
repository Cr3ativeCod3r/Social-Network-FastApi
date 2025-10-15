import student from "../../../assets/image/student.svg";
import type { UserProfile } from '../types';

interface UserProfileCardProps {
    user: UserProfile;
}

export default function UserProfileCard({ user }: UserProfileCardProps) {
    return (
        <div className="bg-gray-200 rounded-lg p-4 mb-6 border border-gray-200">
            <div className="flex items-start gap-4">
                <div className="flex-1 flex items-center gap-2">
                    <img
                        src={user.profile_picture || student}
                        alt="Zdjęcie profilowe"
                        className="w-16 h-16 rounded-full object-cover border-2 border-green-500 p-2 bg-gray-50"
                    />
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            {user.first_name} {user.last_name}
                        </h2>
                        {user.department && (
                            <p className="text-gray-600">{user.department}</p>
                        )}
                        {user.university && (
                            <p className="text-gray-600 text-sm">{user.university}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}