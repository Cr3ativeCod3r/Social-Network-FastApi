
export interface AdminStats {
  total_users: number;
  verified_users: number;
  banned_users: number;
  admin_users: number;
  users_with_restrictions: {
    without_chat: number;
    without_comments: number;
    without_posts: number;
  };
  notes_stats: {
    total_notes: number;
    total_ratings: number;
    total_saved_notes: number;
  };
}

export interface NotesStats {
  total_notes: number;
  notes_with_files: number;
  notes_without_files: number;
  total_ratings: number;
  total_saved: number;
  average_rating: number;
  notes_last_30_days: number;
}

export interface User {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_banned: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface UserListResponse {
  total: number;
  page: number;
  page_size: number;
  users: User[];
}