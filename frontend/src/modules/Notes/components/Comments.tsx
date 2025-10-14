import { useEffect, useState } from 'react';
import { Edit2, Trash2, Loader } from 'lucide-react';
import axiosInstance from '../../../api/axiosInstance';
import { toast } from 'sonner';

interface Author {
  user_id: number;
  first_name: string;
  last_name: string;
  profile_picture: string;
}

interface Comment {
  content: string;
  comment_id: number;
  note_id: number;
  user_id: number;
  created_at: string;
  author: Author;
  is_author: boolean;
}

interface CommentsResponse {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  items: Comment[];
}

interface NoteCommentsProps {
  noteId: number;
}

export default function NoteComments({ noteId }: NoteCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [noteId, page]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get<CommentsResponse>(
        `/note-comments/${noteId}/comments`,
        {
          params: {
            page,
            page_size: 5,
            sort_order: 'desc',
          },
        }
      );
      setComments(response.data.items);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (comment: Comment) => {
    setEditingId(comment.comment_id);
    setEditContent(comment.content);
  };

  const handleUpdateComment = async (commentId: number) => {
    if (!editContent.trim()) return;

    try {
      setIsSubmitting(true);
      await axiosInstance.put(
        `/note-comments/${noteId}/comments/${commentId}`,
        { content: editContent }
      );
      setEditingId(null);
      fetchComments();
    } catch (error) {
      console.error('Error updating comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('Na pewno chcesz usunąć ten komentarz?')) return;

    try {
      await axiosInstance.delete(
        `/note-comments/${noteId}/comments/${commentId}`
      );
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newCommentContent.trim()) return;

    try {
      setIsAddingComment(true);
      await axiosInstance.post(
        `/note-comments/${noteId}/comments`,
        { content: newCommentContent }
      );
      setNewCommentContent('');
      setPage(1);
      fetchComments();
      toast.success('Komentarz został dodany!');
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast.error(
        error?.response?.data?.detail ||
        'Wystąpił błąd podczas dodawania komentarza.'
      );
    } finally {
      setIsAddingComment(false);
    }
  };

  if (isLoading && comments.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <Loader size={24} className="text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-sm text-gray-900 mb-3">Dodaj komentarz</h3>
        <textarea
          value={newCommentContent}
          onChange={(e) => setNewCommentContent(e.target.value)}
          placeholder="Wpisz swój komentarz..."
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={handleAddComment}
            disabled={isAddingComment || !newCommentContent.trim()}
            className="px-4 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isAddingComment ? 'Dodawanie...' : 'Dodaj komentarz'}
          </button>
        </div>
      </div>

      {comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Brak komentarzy</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.comment_id} className="bg-white border border-gray-200 rounded-lg p-4">
              {/* Autor */}
              <div className="flex items-center gap-3 mb-3">
                {comment.author.profile_picture && (
                  <img
                    src={comment.author.profile_picture}
                    alt={`${comment.author.first_name} ${comment.author.last_name}`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900">
                    {comment.author.first_name} {comment.author.last_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString('pl-PL', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                {comment.is_author && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(comment)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                      title="Edytuj komentarz"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.comment_id)}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                      title="Usuń komentarz"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              {editingId === comment.comment_id ? (
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateComment(comment.comment_id)}
                      disabled={isSubmitting || !editContent.trim()}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50 transition"
                    >
                      {isSubmitting ? 'Zapisuję...' : 'Zapisz'}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400 transition"
                    >
                      Anuluj
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 break-words">{comment.content}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-black"
          >
            Poprzednia
          </button>

          <span className="flex items-center px-4 py-2 text-gray-700 text-sm">
            Strona {page} z {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-black"
          >
            Następna
          </button>
        </div>
      )}
    </div>
  );
}