export interface User {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_banned: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface UserData extends User {
  university: string | null;
  department: string | null;
  profile_picture: string | null;
  bio: string | null;
  is_admin: boolean;
  comment_permission: boolean;
  post_permission: boolean;
  chat_permission: boolean;
  ban_expires_at: string | null;
}

