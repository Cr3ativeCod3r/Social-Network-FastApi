import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import type { User } from "../Types/User"

interface UserListResponse {
  total: number;
  page: number;
  page_size: number;
  users: User[];
}

export default function UsersList() {
  const [data, setData] = useState<UserListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [isBanned, setIsBanned] = useState<boolean | null>(null);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize, search, isBanned, isVerified]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: any = { page, page_size: pageSize };
      if (search) params.search = search;
      if (isBanned !== null) params.is_banned = isBanned;
      if (isVerified !== null) params.is_verified = isVerified;

      const response = await axiosInstance.get('/admin/users', { params });
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Błąd podczas ładowania użytkowników');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleFilterChange = (filterType: 'banned' | 'verified', value: boolean | null) => {
    if (filterType === 'banned') {
      setIsBanned(value);
    } else {
      setIsVerified(value);
    }
    setPage(1);
  };

  const totalPages = data ? Math.ceil(data.total / data.page_size) : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Lista Użytkowników</h1>

        {/* Filtry */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Szukaj po email, imieniu lub nazwisku..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Szukaj
              </button>
              {search && (
                <button
                  type="button"
                  onClick={() => { setSearchInput(''); setSearch(''); }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Wyczyść
                </button>
              )}
            </div>
          </form>

          <div className="flex gap-4 flex-wrap">
            <div className="flex gap-2 items-center">
              <span className="text-sm font-medium text-gray-700">Status weryfikacji:</span>
              <button
                onClick={() => handleFilterChange('verified', null)}
                className={`px-3 py-1 text-sm rounded ${isVerified === null ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Wszyscy
              </button>
              <button
                onClick={() => handleFilterChange('verified', true)}
                className={`px-3 py-1 text-sm rounded ${isVerified === true ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Zweryfikowani
              </button>
              <button
                onClick={() => handleFilterChange('verified', false)}
                className={`px-3 py-1 text-sm rounded ${isVerified === false ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Niezweryfikowani
              </button>
            </div>

            <div className="flex gap-2 items-center">
              <span className="text-sm font-medium text-gray-700">Status bana:</span>
              <button
                onClick={() => handleFilterChange('banned', null)}
                className={`px-3 py-1 text-sm rounded ${isBanned === null ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Wszyscy
              </button>
              <button
                onClick={() => handleFilterChange('banned', false)}
                className={`px-3 py-1 text-sm rounded ${isBanned === false ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Aktywni
              </button>
              <button
                onClick={() => handleFilterChange('banned', true)}
                className={`px-3 py-1 text-sm rounded ${isBanned === true ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Zbanowani
              </button>
            </div>
          </div>
        </div>

        {/* Tabela */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Ładowanie...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800">{error}</p>
          </div>
        ) : data && data.users.length > 0 ? (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imię i Nazwisko</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data utworzenia</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.user_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.first_name} {user.last_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {user.is_verified ? 'Zweryfikowany' : 'Niezweryfikowany'}
                            </span>
                            {user.is_banned && (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                Zbanowany
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString('pl-PL')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Paginacja */}
            <div className="bg-white rounded-lg shadow mt-4 px-6 py-4 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Wyświetlono {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, data.total)} z {data.total} użytkowników
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Poprzednia
                </button>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">
                    Strona {page} z {totalPages}
                  </span>
                </div>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Następna
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">Brak użytkowników spełniających kryteria</p>
          </div>
        )}
      </div>
    </div>
  );
}