import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import type { User } from "../Types/User";
import UserAdminModal from '../modules/Admin/components/UserAdminModal';
import { Settings, UserRound, ShieldCheck, ShieldAlert, Ban, Hash, Mail, Trash2, AlertTriangle } from "lucide-react";
import Pagination from '../modules/Notes/components/Pagination';

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
  const [pageSize, setPageSize] = useState(6);
  const [search, setSearch] = useState('');
  const [isBanned, setIsBanned] = useState<boolean | null>(null);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [searchInput, setSearchInput] = useState('');

  const [selectedUser, setSelectedUser] = useState<{ id: string; email: string } | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/admin/users/${userToDelete.user_id}`);
      setUserToDelete(null);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Błąd podczas usuwania użytkownika.');
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPages = data ? Math.ceil(data.total / data.page_size) : 0;

  return (
    <div className="px-4 sm:px-6">
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex items-center w-full">
                <UserRound className="absolute left-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Szukaj użytkowników..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2 bg-second1 text-white rounded-lg hover:bg-second2 transition"
              >
                Szukaj
              </button>
              {search && (
                <button
                  type="button"
                  onClick={() => { setSearchInput(''); setSearch(''); setPage(1); }}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Wyczyść
                </button>
              )}
            </div>
          </form>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 flex-wrap">
            <div className="flex gap-2 items-center flex-wrap">
              <span className="text-sm font-medium text-gray-700">Weryfikacja:</span>
              <button onClick={() => handleFilterChange('verified', null)} className={`px-3 py-1 text-sm rounded-full transition ${isVerified === null ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Wszyscy</button>
              <button onClick={() => handleFilterChange('verified', true)} className={`px-3 py-1 text-sm rounded-full transition ${isVerified === true ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Tak</button>
              <button onClick={() => handleFilterChange('verified', false)} className={`px-3 py-1 text-sm rounded-full transition ${isVerified === false ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Nie</button>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <span className="text-sm font-medium text-gray-700">Status bana:</span>
              <button onClick={() => handleFilterChange('banned', null)} className={`px-3 py-1 text-sm rounded-full transition ${isBanned === null ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Wszyscy</button>
              <button onClick={() => handleFilterChange('banned', true)} className={`px-3 py-1 text-sm rounded-full transition ${isBanned === true ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Tak</button>
              <button onClick={() => handleFilterChange('banned', false)} className={`px-3 py-1 text-sm rounded-full transition ${isBanned === false ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Nie</button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="text-center p-12">

            </div>
          ) : error ? (
            <div className="text-center p-12 bg-red-50">
              <p className="text-red-700 font-medium">Wystąpił błąd</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button onClick={fetchUsers} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Spróbuj ponownie</button>
            </div>
          ) : data && data.users.length > 0 ? (
            <>
              <div className="overflow-x-auto animate-fade-in">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100 hidden md:table-header-group">
                    <tr>
                      <th scope="col" className="px-6 py-3"><span className="flex items-center"><Hash size={14} className="mr-1" />ID</span></th>
                      <th scope="col" className="px-6 py-3"><span className="flex items-center"><Mail size={14} className="mr-1" />Email</span></th>
                      <th scope="col" className="px-6 py-3"><span className="flex items-center"><UserRound size={14} className="mr-1" />Imię i Nazwisko</span></th>
                      <th scope="col" className="px-6 py-3 text-center"><span className="flex items-center justify-center"><ShieldCheck size={14} className="mr-1" />Status</span></th>
                      <th scope="col" className="px-6 py-3 text-right"><span className="flex items-center justify-end"><Settings size={14} className="mr-1" />Akcje</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.users.map((user) => (
                      <tr key={user.user_id} className="bg-white border-b hover:bg-gray-50 flex flex-col md:table-row py-2 px-4 md:p-0 mb-2 md:mb-0 rounded-lg shadow-md md:shadow-none">
                        <td className="flex justify-between items-center py-2 md:table-cell md:px-6 md:py-4">
                          <span className="font-bold md:hidden mr-2">ID:</span>
                          <span className="break-all">{user.user_id}</span>
                        </td>
                        <td className="flex justify-between items-center py-2 md:table-cell md:px-6 md:py-4 font-medium text-gray-900">
                          <span className="font-bold md:hidden mr-2">Email:</span>
                          <span className="break-all text-right">{user.email}</span>
                        </td>
                        <td className="flex justify-between items-center py-2 md:table-cell md:px-6 md:py-4">
                          <span className="font-bold md:hidden mr-2">Imię i Nazwisko:</span>
                          <span className="text-right">{user.first_name || '-'} {user.last_name || ''}</span>
                        </td>
                        <td className="flex justify-between items-center py-2 md:table-cell md:px-6 md:py-4 md:text-center">
                          <span className="font-bold md:hidden mr-2">Status:</span>
                          <div className="flex items-center justify-end md:justify-center gap-2 flex-wrap">
                            <span className={`flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${user.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {user.is_verified ? (<><ShieldCheck size={12} /> Zweryfikowany</>) : (<><ShieldAlert size={12} /> Niezwerfikowany</>)}
                            </span>
                            {user.is_banned && (
                              <span className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                <Ban size={12} /> Zbanowany
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="flex justify-between items-center py-2 md:table-cell md:px-6 md:py-4 md:text-right">
                          <span className="font-bold md:hidden mr-2">Akcje:</span>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleAdminClick(user.user_id, user.email)}
                              className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800 transition"
                              title="Zarządzaj użytkownikiem"
                            >
                              <Settings size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(user)}
                              className="p-2 text-gray-500 rounded-full hover:bg-red-100 hover:text-red-700 transition"
                              title="Usuń użytkownika"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mb-2">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
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

      {userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Potwierdź usunięcie
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Czy na pewno chcesz usunąć użytkownika <span className="font-bold">{userToDelete.email}</span>? Tej akcji nie można cofnąć.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Usuwanie...' : 'Usuń'}
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                onClick={() => setUserToDelete(null)}
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}