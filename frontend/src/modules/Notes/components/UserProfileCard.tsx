import student from "../../../assets/image/student.svg";
import type { UserProfile } from '../types';

interface UserProfileCardProps {
    user: UserProfile;
    user_id: number;
}

export default function UserProfileCard({ user, user_id }: UserProfileCardProps) {
    const handleClick = () => {
        window.location.href = `/user/${user_id}`;
    };

    return (
        <div
            className="bg-gray-200 rounded-lg p-4 mb-6 border border-gray-200 cursor-pointer"
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleClick();
            }}
        >
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
                        {user.bio && (
                            <p className="text-gray-600 text-sm">{user.bio}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}