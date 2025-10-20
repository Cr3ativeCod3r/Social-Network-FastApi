import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { toast, Toaster } from 'sonner';

interface Subject {
  subject_id: number;
  name: string;
}

interface SubjectFormData {
  name: string;
}

const SubjectsCrud: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<SubjectFormData>({ name: '' });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const getErrorMessage = (err: any): string => {
    if (err.response?.data?.detail) {
      const detail = err.response.data.detail;
      if (typeof detail === 'string') {
        return detail;
      }
      if (Array.isArray(detail)) {
        return detail.map((e: any) => e.msg).join(', ');
      }
    }
    return 'Wystąpił błąd';
  };

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/subjects/');
      const data = response.data.subjects || response.data;
      setSubjects(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast.error(getErrorMessage(err));
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error('Nazwa przedmiotu nie może być pusta');
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post('/subjects/', formData);
      setSubjects([...subjects, response.data]);
      setFormData({ name: '' });
      setIsCreating(false);
      toast.success('Przedmiot został dodany');
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: number) => {
    if (!formData.name.trim()) {
      toast.error('Nazwa przedmiotu nie może być pusta');
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.put(`/subjects/${id}`, formData);
      setSubjects(subjects.map(s => s.subject_id === id ? response.data : s));
      setEditingId(null);
      setFormData({ name: '' });
      toast.success('Przedmiot został zaktualizowany');
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Czy na pewno chcesz usunąć ten przedmiot?')) return;

    try {
      setLoading(true);
      await axiosInstance.delete(`/subjects/${id}`);
      setSubjects(subjects.filter(s => s.subject_id !== id));
      toast.success('Przedmiot został usunięty');
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (subject: Subject) => {
    setEditingId(subject.subject_id);
    setFormData({ name: subject.name });
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({ name: '' });
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 animate-fade-in">
        <h1 className="text-2xl font-semibold mb-6">Zarządzanie przedmiotami</h1>

        <div className="mb-6">
          {!isCreating && !editingId && (
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 bg-second1 text-white rounded-md hover:bg-second2 transition-colors font-medium"
            >
              + Dodaj przedmiot
            </button>
          )}

          {isCreating && (
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                placeholder="Nazwa przedmiotu"
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
                onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreate}
                  disabled={loading}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Zapisz
                </button>
                <button
                  onClick={cancelEdit}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Anuluj
                </button>
              </div>
            </div>
          )}
        </div>

        {loading && subjects.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Ładowanie...</div>
        ) : subjects.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Brak przedmiotów</div>
        ) : (
          <div className="space-y-2">
            {subjects.map((subject) => (
              <div
                key={subject.subject_id}
                className={`p-4 border rounded-lg ${
                  editingId === subject.subject_id ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-200'
                }`}
              >
                {editingId === subject.subject_id ? (
                  <div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                      onKeyPress={(e) => e.key === 'Enter' && handleUpdate(subject.subject_id)}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(subject.subject_id)}
                        disabled={loading}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Zapisz
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={loading}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50"
                      >
                        Anuluj
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium">{subject.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(subject)}
                        disabled={loading}
                        className="px-3 py-1.5 bg-basic2 text-white text-sm rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Edytuj
                      </button>
                      <button
                        onClick={() => handleDelete(subject.subject_id)}
                        disabled={loading}
                        className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Usuń
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SubjectsCrud;