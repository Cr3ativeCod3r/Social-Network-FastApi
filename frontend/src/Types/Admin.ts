export interface UserAdminData {
  is_verified: boolean;
  is_admin: boolean;
  is_banned: boolean;
  comment_permission: boolean;
  post_permission: boolean;
  chat_permission: boolean;
  ban_reason: string | null;
}

export interface UserAdminModalProps {
  userId: string;
  userEmail: string;
  onClose: () => void;
  onUpdate?: () => void;
}