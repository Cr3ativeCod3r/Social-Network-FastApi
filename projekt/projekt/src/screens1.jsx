import React from 'react';
import { Mail, Lock, User, Search, Filter, Star, Bookmark, MessageSquare, ArrowLeft } from 'lucide-react';

export default function StudyShareSketch() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto space-y-12">
        
        {/* Sekcja 1: Rejestracja */}
        <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
          <div className="grid grid-cols-2">
            {/* Lewa strona - branding */}
            <div className="bg-gray-100 p-8 border-r-2 border-gray-300">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">StudyShare</h1>
              <p className="text-gray-600">
                StudyShare to portal dla studentów, umożliwiający wymianę notatek i materiałów edukacyjnych.
              </p>
            </div>

            {/* Prawa strona - formularz */}
            <div className="bg-white p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Dołącz do nas</h2>
              
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input 
                    type="text"
                    value="test"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input 
                    type="password"
                    value="........"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input 
                    type="text"
                    placeholder="Imię"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input 
                    type="text"
                    placeholder="Nazwisko"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <button className="w-full py-3 bg-gray-200 border-2 border-gray-300 rounded-lg text-gray-700 font-medium">
                  Zarejestruj się
                </button>

                <p className="text-center text-sm text-gray-600 mt-4">
                  Masz już konto? <span className="text-gray-800 font-medium">Zaloguj się</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sekcja 2: Logowanie */}
        <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
          <div className="grid grid-cols-2">
            {/* Lewa strona - branding */}
            <div className="bg-gray-100 p-8 border-r-2 border-gray-300">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">StudyShare</h1>
              <p className="text-gray-600">
                StudyShare to portal dla studentów, umożliwiający wymianę notatek i materiałów edukacyjnych.
              </p>
            </div>

            {/* Prawa strona - formularz */}
            <div className="bg-white p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Witamy ponownie</h2>
              
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input 
                    type="text"
                    value="test"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input 
                    type="password"
                    value="........"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <button className="w-full py-3 bg-gray-200 border-2 border-gray-300 rounded-lg text-gray-700 font-medium">
                  Zaloguj się
                </button>

                <p className="text-center text-sm text-gray-600 mt-4">
                  Nie masz konta? <span className="text-gray-800 font-medium">Zarejestruj się</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sekcja 3: Lista notatek */}
        <div className="border-2 border-gray-300 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-300">
            <div className="w-12 h-12 bg-gray-100 border-2 border-gray-300 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-gray-400"></div>
            </div>
            <input 
              type="text"
              placeholder="Dodaj swoją notatkę..."
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="Szukaj po tytule lub treści..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-5 h-5 border-2 border-gray-300 rounded" />
              <span className="text-sm text-gray-600">Przedmioty</span>
              <Filter className="w-4 h-4 text-gray-400" />
            </div>
            <select className="px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-sm">
              <option>Najnowsze</option>
            </select>
            <Filter className="w-5 h-5 text-gray-400 mt-2" />
            <select className="px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-sm">
              <option>Pliki</option>
            </select>
            <Filter className="w-5 h-5 text-gray-400 mt-2" />
            <select className="px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-sm">
              <option>Malejąco</option>
            </select>
          </div>

          <div className="space-y-4">
            {/* Notatka 1 */}
            <div className="border-2 border-gray-300 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">Klasy i obiekty</h3>
                <Bookmark className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs text-gray-600">
                  Podstawy Elektrotechniki
                </span>
              </div>

              <p className="text-sm text-gray-500 mb-4">23 października 2025</p>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Ocena</span>
                  <span className="text-sm font-medium text-gray-800">(0)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Zapisania</span>
                  <span className="text-sm font-medium text-gray-800">1</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Komentarze</span>
                  <span className="text-sm font-medium text-gray-800">0</span>
                </div>
              </div>
            </div>

            {/* Notatka 2 */}
            <div className="border-2 border-gray-300 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">Obwody szeregowe</h3>
                <Bookmark className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs text-gray-600">
                  Podstawy Elektrotechniki
                </span>
              </div>

              <p className="text-sm text-gray-500 mb-4">23 października 2025</p>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Ocena</span>
                  <span className="text-sm font-medium text-gray-800">(0)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Zapisania</span>
                  <span className="text-sm font-medium text-gray-800">0</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Komentarze</span>
                  <span className="text-sm font-medium text-gray-800">0</span>
                </div>
              </div>
            </div>

            {/* Notatka 3 */}
            <div className="border-2 border-gray-300 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">Całki</h3>
                <Bookmark className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs text-gray-600">
                  Wstęp do matematyki
                </span>
              </div>

              <p className="text-sm text-gray-500 mb-4">23 października 2025</p>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Ocena</span>
                  <span className="text-sm font-medium text-gray-800">(0)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Zapisania</span>
                  <span className="text-sm font-medium text-gray-800">0</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Komentarze</span>
                  <span className="text-sm font-medium text-gray-800">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sekcja 4: Szczegóły notatki */}
        <div className="border-2 border-gray-300 rounded-lg p-6">
          <button className="flex items-center gap-2 text-gray-600 mb-6">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Wróć</span>
          </button>

          <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gray-100 border-2 border-gray-300 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-400"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">admin system</h3>
                <p className="text-gray-600">admin</p>
              </div>
            </div>

            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">Ocena</span>
                <span className="text-sm font-medium text-gray-800">(0)</span>
              </div>
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">Zapisania</span>
                <span className="text-sm font-medium text-gray-800">1</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">Komentarze</span>
                <span className="text-sm font-medium text-gray-800">0</span>
              </div>
              <Bookmark className="w-6 h-6 text-gray-400 ml-auto" />
            </div>
          </div>

          <div className="border-t-2 border-gray-300 pt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Klasy i obiekty</h2>
            <p className="text-gray-600 mb-6">Podstawy Elektrotechniki</p>

            <div className="border-2 border-gray-300 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Utworzone:</p>
                  <p className="font-medium text-gray-800">23 października 2025</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Zmienione:</p>
                  <p className="font-medium text-gray-800">23 października 2025</p>
                </div>
              </div>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-6 bg-gray-50">
              <p className="text-gray-600">Treść...</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}