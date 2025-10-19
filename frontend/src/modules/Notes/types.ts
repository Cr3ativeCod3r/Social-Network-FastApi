export interface Note {
  note_id: number;
  title: string;
  subject: string;
  created_at: string;
  user_id: number;
  average_rating: string;
  rating_count: number;
}


export interface NoteDetail {
    title: string;
    content: string;
    subject: string;
    note_id: number;
    file_path: string | null;
    created_at: string;
    updated_at: string;
    user_id: number;
    average_rating: string;
    rating_count: number;

}

export interface UserProfile {
    first_name: string;
    last_name: string;
    profile_picture: string;
    university: string;
    department: string;
    user_id: Number;
}

export interface EditData {
    title: string;
    content: string;
    subject: string;
    file: File | null;
    removeFile: boolean;
}

export interface SavedNote {
    user_id: number;
    note_id: number;
    saved_at: string;
    title: string;
    subject: string;
    created_at: string;
    average_rating: string;
    rating_count: number;
}

export interface SavedNotesResponse {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    items: SavedNote[];
}

export interface NoteResponseData {
    note: NoteDetail;
    is_owner: boolean;
}


export interface NotesResponse {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  items: Note[];
}

export interface RatingResponse {
    note_id: number;
    user_id: number;
    rating: number;
    rated_at: string;
}

export interface RatingStats {
    note_id: number;
    average_rating: number | null;
    total_ratings: number;
    rating_distribution: Record<string, number>;
    rating_percentages: Record<string, number>;
}

export interface MyRating {
    rating: number | null;
    rated_at?: string;
}

export interface NoteRatingProps {
    noteId: number;
    onRatingChange?: (rating: number) => void;
}

export interface Author {
  user_id: number;
  first_name: string;
  last_name: string;
  profile_picture: string;
}

export interface Comment {
  content: string;
  comment_id: number;
  note_id: number;
  user_id: number;
  created_at: string;
  author: Author;
  is_author: boolean;
}

export interface CommentsResponse {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  items: Comment[];
}

export interface NoteCommentsProps {
  noteId: number;
}