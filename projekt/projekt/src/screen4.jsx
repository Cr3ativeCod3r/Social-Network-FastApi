import React from 'react';
import { Users, UserCheck, UserX, ShieldCheck, Ban, MessageSquare, FileText, Flag, CheckCircle, XCircle, AlertCircle, Eye, Star, Bookmark, Lightbulb } from 'lucide-react';

export default function AdminDashboardSketch() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Statystyki aplikacji</h1>

        {/* Sekcja 1: Użytkownicy */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Użytkownicy</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 border-2 border-blue-300 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Użytkownicy</p>
                  <p className="text-2xl font-bold text-gray-800">5</p>
                </div>
              </div>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 border-2 border-green-300 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Zweryfikowani</p>
                  <p className="text-2xl font-bold text-gray-800">4</p>
                </div>
              </div>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-red-100 border-2 border-red-300 rounded-lg flex items-center justify-center">
                  <UserX className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Zbanowani</p>
                  <p className="text-2xl font-bold text-gray-800">1</p>
                </div>
              </div>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-100 border-2 border-purple-300 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Admini</p>
                  <p className="text-2xl font-bold text-gray-800">1</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sekcja 2: Ograniczenia użytkowników */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Ograniczenia użytkowników</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-yellow-100 border-2 border-yellow-300 rounded-lg flex items-center justify-center">
                  <Ban className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bez czatu</p>
                  <p className="text-2xl font-bold text-gray-800">1</p>
                </div>
              </div>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-100 border-2 border-orange-300 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bez komentarzy</p>
                  <p className="text-2xl font-bold text-gray-800">2</p>
                </div>
              </div>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-pink-100 border-2 border-pink-300 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bez postów</p>
                  <p className="text-2xl font-bold text-gray-800">2</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sekcja 3: Zgłoszenia */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Zgłoszenia</h2>
          <div className="grid grid-cols-5 gap-4">
            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 border-2 border-blue-300 rounded-lg flex items-center justify-center">
                  <Flag className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Wszystkie</p>
                  <p className="text-2xl font-bold text-gray-800">17</p>
                </div>
              </div>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-yellow-100 border-2 border-yellow-300 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Oczekujące</p>
                  <p className="text-2xl font-bold text-gray-800">15</p>
                </div>
              </div>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-100 border-2 border-orange-300 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">W trakcie</p>
                  <p className="text-2xl font-bold text-gray-800">1</p>
                </div>
              </div>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 border-2 border-green-300 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rozwiązane</p>
                  <p className="text-2xl font-bold text-gray-800">0</p>
                </div>
              </div>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-red-100 border-2 border-red-300 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Odrzucone</p>
                  <p className="text-2xl font-bold text-gray-800">1</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sekcja 4: Statystyki notatek */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Statystyki notatek</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 border-2 border-blue-300 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Notatki</p>
                  <p className="text-2xl font-bold text-gray-800">3</p>
                </div>
              </div>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Z plikami</p>
                  <p className="text-2xl font-bold text-gray-800">1</p>
                </div>
              </div>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-yellow-100 border-2 border-yellow-300 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Oceny</p>
                  <p className="text-2xl font-bold text-gray-800">1</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 border-2 border-green-300 rounded-lg flex items-center justify-center">
                  <Bookmark className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Zapisania</p>
                  <p className="text-2xl font-bold text-gray-800">3</p>
                </div>
              </div>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-100 border-2 border-purple-300 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Średnia ocena</p>
                  <p className="text-2xl font-bold text-gray-800">4.00</p>
                </div>
              </div>
            </div>

            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-cyan-100 border-2 border-cyan-300 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ostatnie 30 dni</p>
                  <p className="text-2xl font-bold text-gray-800">3</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}