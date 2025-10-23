import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import {
  Users,
  UserCheck,
  UserX,
  UserCog,
  MessageCircleOff,
  MessageSquareOff,
  FilePenLine,
  FileText,
  Paperclip,
  Star,
  Bookmark,
  Medal,
  CalendarClock,
  Loader2,
  AlertTriangle,
  Flag,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
} from 'lucide-react';

import StatCard from '../../modules/Admin/components/StatCard';
import type { AdminStats, NotesStats } from '../../modules/Admin/types';

export default function AdminStats() {
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [notesStats, setNotesStats] = useState<NotesStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [admin, notes] = await Promise.all([
          axiosInstance.get('/admin/stats'),
          axiosInstance.get('/admin/notes/stats')
        ]);
        setAdminStats(admin.data);
        setNotesStats(notes.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!adminStats || !notesStats) {
    return (
      <div className="p-6 flex flex-col justify-center items-center h-screen text-red-500">
        <AlertTriangle className="w-12 h-12 mb-4" />
        <p className="text-xl">Błąd ładowania danych statystycznych.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 animate-fade-in">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Użytkownicy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Użytkownicy" value={adminStats.total_users} icon={Users} color="text-blue-500" />
          <StatCard label="Zweryfikowani" value={adminStats.verified_users} icon={UserCheck} color="text-green-500" />
          <StatCard label="Zbanowani" value={adminStats.banned_users} icon={UserX} color="text-red-500" />
          <StatCard label="Admini" value={adminStats.admin_users} icon={UserCog} color="text-purple-500" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Ograniczenia użytkowników</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label="Bez czatu" value={adminStats.users_with_restrictions.without_chat} icon={MessageCircleOff} color="text-yellow-500" />
          <StatCard label="Bez komentarzy" value={adminStats.users_with_restrictions.without_comments} icon={MessageSquareOff} color="text-orange-500" />
          <StatCard label="Bez postów" value={adminStats.users_with_restrictions.without_posts} icon={FilePenLine} color="text-pink-500" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Zgłoszenia</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard label="Wszystkie" value={adminStats.reports_stats.total_reports} icon={Flag} color="text-blue-500" />
          <StatCard label="Oczekujące" value={adminStats.reports_stats.total_pending_reports} icon={AlertCircle} color="text-yellow-500" />
          <StatCard label="W trakcie" value={adminStats.reports_stats.total_in_progress_reports} icon={Clock} color="text-orange-500" />
          <StatCard label="Rozwiązane" value={adminStats.reports_stats.total_resolved_reports} icon={CheckCircle} color="text-green-500" />
          <StatCard label="Odrzucone" value={adminStats.reports_stats.total_rejected_reports} icon={XCircle} color="text-red-500" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Statystyki notatek</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Notatki" value={notesStats.total_notes} icon={FileText} color="text-blue-500" />
          <StatCard label="Z plikami" value={notesStats.notes_with_files} icon={Paperclip} color="text-gray-500" />
          <StatCard label="Oceny" value={notesStats.total_ratings} icon={Star} color="text-yellow-500" />
          <StatCard label="Zapisane" value={notesStats.total_saved} icon={Bookmark} color="text-green-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <StatCard label="Średnia ocena" value={notesStats.average_rating.toFixed(2)} icon={Medal} color="text-indigo-500" />
          <StatCard label="Ostatnie 30 dni" value={notesStats.notes_last_30_days} icon={CalendarClock} color="text-teal-500" />
        </div>
      </div>
    </div>
  );
}