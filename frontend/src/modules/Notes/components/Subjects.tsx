import { useEffect, useState } from 'react';
import { BookOpen, Book} from 'lucide-react';
import axiosInstance from '../../../api/axiosInstance';

export default function SubjectsSidebar() {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axiosInstance.get('/notes/subjects/list');
        setSubjects(response.data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const displayedSubjects = subjects.slice(0, 10);

  if (loading) return <div className="w-64 h-screen bg-gray-50" />;

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <BookOpen size={20} />
          Przedmioty
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {displayedSubjects.map((subject) => (
            // <button
            //   key={subject}
            //   onClick={() => setSelected(subject)}
            //   className={`w-full p-1 rounded-lg text-left transition ${
            //     selected === subject
            //       ? 'bg-second1 text-white'
            //       : 'text-gray-700 hover:bg-gray-100'
            //   }`}
            // >
            <div className="flex items-center gap-2 text-black w-full p-1 rounded-lg text-left transition">
              <Book size={18} />
              {subject}
            </div>
            // </button>
          ))}
        </div>
      </div>

      {subjects.length > 10 && (
        <div className="p-4 border-t border-gray-200 text-xs text-gray-500 bg-gray-50">
          {subjects.length} przedmiotów
        </div>
      )}
    </aside>
  );
}