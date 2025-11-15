import React from 'react';
import { Facebook, Youtube } from 'lucide-react';

export default function SocialBanners() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center p-8">
      <div className="space-y-6 w-full max-w-3xl">
        {/* Logo */}
        <div className="flex items-center justify-center mb-12">
          <svg width="60" height="60" viewBox="0 0 200 200" className="mr-4">
            <path d="M95 40 L140 70 L160 100 L140 130 L100 150 L100 80 L120 70 Z" fill="#5DBAAA" opacity="0.8"/>
            <path d="M95 40 L60 70 L50 100 L60 130 L100 150 L100 80 L80 70 Z" fill="#4A9B8E" opacity="0.9"/>
            <path d="M100 70 L110 85 L100 150 L90 85 Z" fill="#E94B8C"/>
          </svg>
          <div>
            <h1 className="text-4xl font-bold text-teal-700">CHOROBY</h1>
            <p className="text-xl text-teal-600 tracking-wider">MÓZGU.PL</p>
          </div>
        </div>

        {/* Facebook Banner */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-8 flex items-center justify-between py-12 ">
            <div className="flex items-center space-x-6">
              <div className="bg-white rounded-full p-4 shadow-lg">
                <Facebook className="w-12 h-12 text-blue-600" />
              </div>
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-2">Dołącz do nas na Facebooku!</h2>
                <p className="text-teal-50 text-lg">Bądź na bieżąco z najnowszymi informacjami</p>
              </div>
            </div>
            <button className="bg-white text-teal-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-teal-50 transition-colors duration-300 shadow-lg hover:shadow-xl">
              Polub stronę
            </button>
          </div>
        </div>

        {/* YouTube Banner */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 flex items-center justify-between py-8">
            <div className="flex items-center space-x-6">
              <div className="bg-white rounded-full p-4 shadow-lg">
                <Youtube className="w-12 h-12 text-red-600" />
              </div>
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-2">Subskrybuj nasz kanał YouTube!</h2>
                <p className="text-emerald-50 text-lg">Oglądaj nasze filmy edukacyjne</p>
              </div>
            </div>
            <button className="bg-white text-emerald-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-emerald-50 transition-colors duration-300 shadow-lg hover:shadow-xl">
              Subskrybuj
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}