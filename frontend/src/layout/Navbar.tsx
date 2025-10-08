import React, { useState, useRef, useEffect } from "react";
import { BookCopy, User, LogOut, MessageSquare, FileText, Shield } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfileClick = () => {
    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-nav text-white shadow-md top-0 sticky z-10">
      <div className="mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <a
          href="/posty"
          className="flex items-center gap-2 text-2xl font-semibold ml-12"
        >
          <BookCopy />
          Study Share
        </a>

        {/* Linki */}
        <ul className="hidden lg:flex gap-8 text-lg font-medium items-center">
            <li className="flex items-center">
                <a href="/chat" className="flex items-center gap-2 underline-anim uppercase hover:text-[var(--color-basic1)] transition">
                    <MessageSquare className="w-5 h-5 inline-block align-middle mr-2" />
                    <span className="inline-block align-middle">Chat</span>
                </a>
            </li>
            <li className="flex items-center">
                <a href="/posty" className="flex items-center gap-2 underline-anim uppercase hover:text-[var(--color-basic1)] transition">
                    <FileText className="w-5 h-5 inline-block align-middle mr-2" />
                    <span className="inline-block align-middle ">Posty</span>
                </a>
            </li>
            {user?.is_admin && (
                <li className="flex items-center">
                    <a href="/admin" className="flex items-center gap-2 underline-anim uppercase hover:text-[var(--color-basic1)] transition">
                        <Shield className="w-5 h-5 inline-block align-middle mr-2" />
                        <span className="inline-block align-middle">Admin</span>
                    </a>
                </li>
            )}
        </ul>

        {/* Avatar + menu */}
        <div className="flex items-center gap-3 mr-4 relative" ref={menuRef}>
          <p className="font-medium text-white">
            {user?.first_name} {user?.last_name}
          </p>
          <img
            onClick={handleProfileClick}
            className="w-10 h-10 rounded-full border-2 border-[var(--color-second1)] object-cover cursor-pointer"
            alt="Avatar"
            src="https://www.neptumar.pl/wp-content/uploads/facebook-profile-picture-no-pic-avatar.jpg"
          />

          {/* Menu rozwijane */}
          {menuOpen && (
            <div className="absolute right-0 top-14 bg-white text-black rounded-xl shadow-lg w-44 py-2 z-50">
              <button
                onClick={() => {
                  navigate("/profile");
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                <User className="w-4 h-4" />
                Moje konto
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              >
                <LogOut className="w-4 h-4" />
                Wyloguj
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;