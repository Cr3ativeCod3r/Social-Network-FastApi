
import { Star, Trash2, Edit, Upload, X, Smile, Paperclip, ThumbsUp } from 'lucide-react';

export default function StudyShareFeaturesSketch() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto space-y-12">
        
        {/* Sekcja 1: Ocena i komentarze */}
        <div className="border-2 border-gray-300 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Oceń tę notatkę</h2>
          
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  className={`w-8 h-8 ${star <= 4 ? 'fill-gray-400 text-gray-400' : 'text-gray-300'}`}
                />
              ))}
              <span className="ml-4 text-gray-600">Twoja ocena: <span className="font-semibold">4/5</span></span>
              <button className="ml-2 text-gray-400 hover:text-gray-600">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500">Możesz zmienić swoją ocenę w każdej chwili.</p>
          </div>

          <div className="border-t-2 border-gray-300 pt-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Statystyki ocen</h3>
            
            <div className="mb-4">
              <p className="text-4xl font-bold text-gray-800 inline-block">4.0</p>
              <span className="text-gray-500"> / 5 (1 ocen)</span>
            </div>

            <div className="space-y-3">
              {[
                { stars: 5, percent: 0 },
                { stars: 4, percent: 100 },
                { stars: 3, percent: 0 },
                { stars: 2, percent: 0 },
                { stars: 1, percent: 0 },
              ].map((item) => (
                <div key={item.stars} className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 w-4">{item.stars}</span>
                  <Star className="w-4 h-4 text-gray-400" />
                  <div className="flex-1 h-2 bg-gray-200 border border-gray-300 rounded-full overflow-hidden">
                    {item.percent > 0 && (
                      <div 
                        className="h-full bg-gray-400"
                        style={{ width: `${item.percent}%` }}
                      />
                    )}
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t-2 border-gray-300 pt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Dodaj komentarz</h3>
            
            <textarea
              placeholder="Wpisz swój komentarz..."
              rows="5"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 mb-4"
            />
            
            <div className="flex justify-end">
              <button className="px-6 py-3 bg-gray-200 border-2 border-gray-300 rounded-lg text-gray-700 font-medium">
                Dodaj komentarz
              </button>
            </div>
          </div>

          <div className="border-t-2 border-gray-300 pt-6 mt-6">
            <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-800">Jan Kowalski</p>
                  <p className="text-sm text-gray-500">23 paź 2025, 17:21</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 border border-gray-300 rounded hover:bg-gray-100">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 border border-gray-300 rounded hover:bg-gray-100">
                    <Trash2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
              <p className="text-gray-700">Komentarz pod notatką</p>
            </div>
          </div>
        </div>

        {/* Sekcja 2: Nowa notatka */}
        <div className="border-2 border-gray-300 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-300">
            <h2 className="text-2xl font-bold text-gray-800">Nowa notatka</h2>
            <button className="w-8 h-8 border-2 border-gray-300 rounded flex items-center justify-center text-gray-600 hover:bg-gray-50">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <input 
                type="text"
                placeholder="Tytuł *"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <textarea
                placeholder="Zawartość *"
                rows="6"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50">
                <option>Wybierz przedmiot</option>
              </select>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Kliknij aby dodać plik</p>
            </div>

            <button className="w-full py-3 bg-gray-200 border-2 border-gray-300 rounded-lg text-gray-700 font-medium">
              Utwórz notatkę
            </button>
          </div>
        </div>

        {/* Sekcja 3: Czat */}
        <div className="border-2 border-gray-300 rounded-lg overflow-hidden" style={{ height: '600px' }}>
          <div className="bg-gray-100 border-b-2 border-gray-300 p-4 flex items-center gap-3">
           <p className='font-bold text-2xl'> Chat Grupowy</p>
          </div>

          <div className="p-4 space-y-4 bg-white" style={{ height: 'calc(100% - 140px)', overflowY: 'auto' }}>
            {/* Wiadomość 1 - lewa */}
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gray-100 border-2 border-gray-300 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-3 inline-block max-w-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800">admin system</span>
                    <span className="px-2 py-0.5 bg-gray-200 border border-gray-300 rounded text-xs">Admin</span>
                    <span className="text-xs text-gray-500">17:18</span>
                  </div>
                  <p className="text-gray-700">Hej</p>
                </div>
              </div>
            </div>

            {/* Wiadomość 2 - lewa (edytowana) */}
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gray-100 border-2 border-gray-300 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-3 inline-block max-w-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800">admin system</span>
                    <span className="px-2 py-0.5 bg-gray-200 border border-gray-300 rounded text-xs">Admin</span>
                    <span className="text-xs text-gray-500">17:18 (edytowana)</span>
                  </div>
                  <p className="text-gray-700">edytowana wiadomość</p>
                </div>
              </div>
            </div>

            {/* Wiadomość 3 - prawa */}
            <div className="flex gap-3 justify-end">
              <div className="flex-1 text-right">
                <div className="bg-gray-200 border-2 border-gray-300 rounded-lg p-3 inline-block max-w-xs">
                  <div className="flex items-center gap-2 mb-1 justify-end">
                    <span className="text-xs text-gray-500">17:18</span>
                    <span className="font-semibold text-gray-800">Jan Kowalski</span>
                  </div>
                  <p className="text-gray-700">Hej</p>
                </div>
              </div>
            </div>

            {/* Wiadomość 4 - lewa z obrazkiem */}
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gray-100 border-2 border-gray-300 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-3 inline-block max-w-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-800">admin system</span>
                    <span className="px-2 py-0.5 bg-gray-200 border border-gray-300 rounded text-xs">Admin</span>
                    <span className="text-xs text-gray-500">17:19</span>
                  </div>
                  <p className="text-gray-700 mb-2">Zobacz moją notatkę!</p>
                  <p className="text-sm text-gray-500 mb-2">Podstawy Elektrotechniki</p>
                  <p className="font-semibold text-gray-800 mb-2">Klasy i obiekty</p>
                  <button className="w-full px-4 py-2 bg-gray-200 border-2 border-gray-300 rounded-lg text-gray-700 text-sm font-medium">
                    Otwórz notatkę
                  </button>
                </div>
              </div>
            </div>

            {/* Wiadomość 5 - lewa z emoji */}
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gray-100 border-2 border-gray-300 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-3 inline-block">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800">admin system</span>
                    <span className="px-2 py-0.5 bg-gray-200 border border-gray-300 rounded text-xs">Admin</span>
                    <span className="text-xs text-gray-500">17:19</span>
                  </div>
                  <p className="text-2xl">👍</p>
                </div>
              </div>
            </div>

            {/* Wiadomość 6 - lewa z emoji 2 */}
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gray-100 border-2 border-gray-300 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-3 inline-block">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800">admin system</span>
                    <span className="px-2 py-0.5 bg-gray-200 border border-gray-300 rounded text-xs">Admin</span>
                    <span className="text-xs text-gray-500">17:19</span>
                  </div>
                  <p className="text-2xl">🎉</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-gray-300 p-4 bg-gray-50">
            <div className="flex items-center gap-2">
              <button className="p-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100">
                <Smile className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100">
                <Paperclip className="w-5 h-5 text-gray-600" />
              </button>
              <input 
                type="text"
                placeholder="Wpisz wiadomość..."
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg bg-white"
              />
              <button className="p-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100">
                <ThumbsUp className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}