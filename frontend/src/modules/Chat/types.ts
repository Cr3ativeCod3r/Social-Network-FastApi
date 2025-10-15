export interface ChatMessage {
  message_id: number;
  user_id: number;
  content: string;
  created_at: string;
  is_edited: boolean;
  author: {
    user_id: number;
    first_name: string;
    last_name: string;
    profile_picture: string | null;
    is_admin: boolean;
  };
  is_author: boolean;
}

export interface ChatStats {
  active_users: number;
  messages_today: number;
}