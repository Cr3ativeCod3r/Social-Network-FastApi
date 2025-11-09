import { Eye, Calendar, Info, Edit, Settings, Trash2, MessageSquare, FileText, MessageCircle } from 'lucide-react';

export default function UserManagementSketch() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto space-y-12">
        
        {/* Sekcja 1: Zmień hasło */}
        <div className="border-2 border-gray-300 rounded-lg p-6">
          <div className="bg-gray-100 border-2 border-gray-300 rounded-t-lg p-4 -mx-6 -mt-6 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-gray-400 rounded"></div>
              <h2 className="text-xl font-semibold text-gray-800">Zmień hasło</h2>
            </div>
            <button className="w-6 h-6 border-2 border-gray-400 rounded flex items-center justify-center text-gray-600">×</button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stare hasło</label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="Wpisz swoje aktualne hasło"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-400"
                />
                <Eye className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nowe hasło</label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="Wpisz nowe hasło (min. 8 znaków)"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-400"
                />
                <Eye className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Potwierdź nowe hasło</label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="Powtórz nowe hasło"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-400"
                />
                <Eye className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-600 font-medium hover:bg-gray-50">
                Anuluj
              </button>
              <button className="flex-1 px-6 py-3 bg-gray-200 border-2 border-gray-300 rounded-lg text-gray-700 font-medium">
                Zmień hasło
              </button>
            </div>
          </div>
        </div>

        {/* Sekcja 2: Profil użytkownika */}
        <div className="border-2 border-gray-300 rounded-lg p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 border-2 border-gray-300 rounded-full flex items-center justify-center mb-4 bg-gray-50">
              <div className="w-12 h-12 border-2 border-gray-400 rounded-sm"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Jan Kowalski</h2>
            <p className="text-gray-500">test@example.com</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">Informacje o koncie</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Data dołączenia</p>
                    <p className="font-medium text-gray-800">7 października 2025</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Bio</p>
                    <p className="font-medium text-gray-800">-</p>
                    <button className="mt-1 w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center">
                      <Edit className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">Status i Uprawnienia</h3>
              
              <div className="space-y-3">
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
                  <p className="text-sm text-gray-600">Status konta</p>
                  <p className="font-semibold text-gray-800">Aktywne</p>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Uprawnienia do pisania postów</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 border border-gray-300 rounded px-2 py-1">✓ Przyznane</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Uprawnienia do komentowania</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 border border-gray-300 rounded px-2 py-1">✓ Przyznane</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Uprawnienia do czatu</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 border border-gray-300 rounded px-2 py-1">✓ Przyznane</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sekcja 3: Lista użytkowników */}
        <div className="border-2 border-gray-300 rounded-lg p-6">
          <div className="mb-4">
            <input 
              type="text"
              placeholder="Szukaj użytkowników..."
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          <div className="flex gap-2 mb-6 flex-wrap">
            <span className="text-sm text-gray-600">Weryfikacja</span>
            <button className="px-3 py-1 bg-gray-200 border border-gray-300 rounded-full text-xs">Wszyscy</button>
            <button className="px-3 py-1 border border-gray-300 rounded-full text-xs">Tak</button>
            <button className="px-3 py-1 border border-gray-300 rounded-full text-xs">Nie</button>
            <span className="text-sm text-gray-600 ml-4">Status bana</span>
            <button className="px-3 py-1 bg-gray-200 border border-gray-300 rounded-full text-xs">Wszyscy</button>
            <button className="px-3 py-1 border border-gray-300 rounded-full text-xs">Tak</button>
            <button className="px-3 py-1 border border-gray-300 rounded-full text-xs">Nie</button>
          </div>

          <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700"># ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">EMAIL</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">IMIĘ I NAZWISKO</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">STATUS</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">AKCJE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">5</td>
                  <td className="px-4 py-3 text-sm text-gray-800">testtest@wp.pl</td>
                  <td className="px-4 py-3 text-sm text-gray-800">jan kowalski</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs px-2 py-1 bg-gray-100 border border-gray-300 rounded inline-block">⚠ Niezweryfikowany</span>
                      <span className="text-xs px-2 py-1 bg-gray-100 border border-gray-300 rounded inline-block">⛔ Zbanowany</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
                        <Settings className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
                        <Trash2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">4</td>
                  <td className="px-4 py-3 text-sm text-gray-800">admin@example.com</td>
                  <td className="px-4 py-3 text-sm text-gray-800">admin system</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 bg-gray-100 border border-gray-300 rounded inline-block">✓ Zweryfikowany</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
                        <Settings className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
                        <Trash2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">2</td>
                  <td className="px-4 py-3 text-sm text-gray-800">testt@example.com</td>
                  <td className="px-4 py-3 text-sm text-gray-800">Jan Kowalski</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 bg-gray-100 border border-gray-300 rounded inline-block">✓ Zweryfikowany</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
                        <Settings className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
                        <Trash2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">3</td>
                  <td className="px-4 py-3 text-sm text-gray-800">testtt@example.com</td>
                  <td className="px-4 py-3 text-sm text-gray-800">Jan Kowalski</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 bg-gray-100 border border-gray-300 rounded inline-block">✓ Zweryfikowany</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
                        <Settings className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
                        <Trash2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">1</td>
                  <td className="px-4 py-3 text-sm text-gray-800">test@example.com</td>
                  <td className="px-4 py-3 text-sm text-gray-800">Jan Kowalski</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 bg-gray-100 border border-gray-300 rounded inline-block">✓ Zweryfikowany</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
                        <Settings className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 border border-gray-300 rounded hover:bg-gray-100">
                        <Trash2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Sekcja 4: Zarządzanie użytkownikiem */}
        <div className="border-2 border-gray-300 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-300">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Zarządzanie użytkownikiem</h2>
              <p className="text-sm text-gray-500">testt@example.com</p>
            </div>
            <button className="w-6 h-6 border-2 border-gray-400 rounded flex items-center justify-center text-gray-600">×</button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-gray-400 rounded"></div>
                Status konta
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-300 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Zweryfikowany</p>
                    <p className="text-sm text-gray-500">Użytkownik potwierdził swój email</p>
                  </div>
                  <button className="px-4 py-2 border border-gray-300 rounded text-sm">Tak</button>
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Administrator</p>
                    <p className="text-sm text-gray-500">Pełne uprawnienia administracyjne</p>
                  </div>
                  <button className="px-4 py-2 bg-gray-200 border border-gray-300 rounded text-sm">Przydziel admin</button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-gray-400 rounded"></div>
                Uprawnienia
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-800">Komentarze</p>
                      <p className="text-sm text-gray-500">Możliwość dodawania komentarzy</p>
                    </div>
                  </div>
                  <input type="checkbox" checked className="w-5 h-5 border-2 border-gray-300 rounded" readOnly />
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-800">Posty</p>
                      <p className="text-sm text-gray-500">Możliwość tworzenia postów</p>
                    </div>
                  </div>
                  <input type="checkbox" checked className="w-5 h-5 border-2 border-gray-300 rounded" readOnly />
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-800">Czat</p>
                      <p className="text-sm text-gray-500">Możliwość korzystania z czatu</p>
                    </div>
                  </div>
                  <input type="checkbox" checked className="w-5 h-5 border-2 border-gray-300 rounded" readOnly />
                </div>
              </div>

              <button className="w-full mt-4 px-6 py-3 bg-gray-200 border-2 border-gray-300 rounded-lg text-gray-700 font-medium">
                Zapisz uprawnienia
              </button>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-gray-400 rounded-full"></div>
                Blokada konta
              </h3>
              
              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Powód bana</label>
                <textarea 
                  placeholder="Opisz powód zablokowania konta..."
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}