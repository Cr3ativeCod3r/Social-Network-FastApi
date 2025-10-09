import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import type { User } from "../../Types/User";
import UserAdminModal from './UserAdminModal';
import { Settings, UserRound, ShieldCheck, ShieldAlert, Ban, Hash, Mail } from "lucide-react";


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

  const [selectedUser, setSelectedUser] = useState<{ id: string; email: string } | null>(null);

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

  const handleAdminClick = (userId: string, email: string) => {
    setSelectedUser({ id: userId, email });
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleUpdateSuccess = () => {
    fetchUsers();
  };

  const totalPages = data ? Math.ceil(data.total / data.page_size) : 0;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto animate-fade-in">

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-2">
              <div className="relative flex items-center w-full">
                <UserRound className="absolute left-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Szukaj użytkowników po emailu, imieniu lub nazwisku..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="flex-1 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Szukaj
              </button>
              {search && (
                <button
                  type="button"
                  onClick={() => { setSearchInput(''); setSearch(''); setPage(1); }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Wyczyść
                </button>
              )}
            </div>
          </form>

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2 items-center">
              <span className="text-sm font-medium text-gray-700">Weryfikacja:</span>
              <button onClick={() => handleFilterChange('verified', null)} className={`px-3 py-1 text-sm rounded-full transition ${isVerified === null ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Wszyscy</button>
              <button onClick={() => handleFilterChange('verified', true)} className={`px-3 py-1 text-sm rounded-full transition ${isVerified === true ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Tak</button>
              <button onClick={() => handleFilterChange('verified', false)} className={`px-3 py-1 text-sm rounded-full transition ${isVerified === false ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Nie</button>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-sm font-medium text-gray-700">Status bana:</span>
              <button onClick={() => handleFilterChange('banned', null)} className={`px-3 py-1 text-sm rounded-full transition ${isBanned === null ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Wszyscy</button>
              <button onClick={() => handleFilterChange('banned', true)} className={`px-3 py-1 text-sm rounded-full transition ${isBanned === true ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Tak</button>
              <button onClick={() => handleFilterChange('banned', false)} className={`px-3 py-1 text-sm rounded-full transition ${isBanned === false ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Nie</button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="text-center p-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-3 text-gray-600">Ładowanie użytkowników...</p>
            </div>
          ) : error ? (
            <div className="text-center p-12 bg-red-50">
              <p className="text-red-700 font-medium">Wystąpił błąd</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button onClick={fetchUsers} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Spróbuj ponownie</button>
            </div>
          ) : data && data.users.length > 0 ? (
            <>
              <div className="overflow-x-auto">

                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        <span className="flex items-center">
                          <Hash size={14} /> ID
                        </span>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <span className="flex items-center">
                          <Mail size={14} className="mr-1" /> Email
                        </span>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <span className="flex items-center">
                          <UserRound size={14} className="mr-1" /> Imię i Nazwisko
                        </span>
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        <span className="flex items-center justify-center">
                          <ShieldCheck size={14} className="mr-1" /> Status
                        </span>
                      </th>
                      <th scope="col" className="px-6 py-3 text-right">
                        <span className="flex items-center justify-end">
                          <Settings size={14} className="mr-1" /> Akcje
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.users.map((user) => (
                      <tr key={user.user_id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{user.user_id}</td>
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{user.email}</td>
                        <td className="px-6 py-4">{user.first_name || '-'} {user.last_name || ''}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className={`flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${user.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {user.is_verified ? (
                                <>
                                  <ShieldCheck size={12} /> Zweryfikowany
                                </>
                              ) : (
                                <>
                                  <ShieldAlert size={12} /> Niezwerfikowany
                                </>
                              )}
                            </span>
                            {user.is_banned && (
                              <span className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                <Ban size={12} /> Zbanowany
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleAdminClick(user.user_id, user.email)}
                            className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800 transition"
                          >
                            <Settings size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t">
                <span className="text-sm text-gray-700">
                  Strona <span className="font-semibold">{data.page}</span> z <span className="font-semibold">{totalPages}</span> (Razem: {data.total})
                </span>
                <div className="flex gap-2">
                  <button onClick={() => setPage(page - 1)} disabled={page <= 1} className="px-4 py-2 text-sm bg-green-500 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    Poprzednia
                  </button>
                  <button onClick={() => setPage(page + 1)} disabled={page >= totalPages} className="px-4 py-2 text-sm bg-green-400 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    Następna
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center p-12">
              <p className="text-gray-700 font-medium">Nie znaleziono użytkowników</p>
              <p className="text-gray-500 text-sm mt-1">Spróbuj zmienić filtry lub wyszukiwaną frazę.</p>
            </div>
          )}
        </div>
      </div>

      {selectedUser && (
        <UserAdminModal
          userId={selectedUser.id}
          userEmail={selectedUser.email}
          onClose={handleCloseModal}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </div>
  );
}