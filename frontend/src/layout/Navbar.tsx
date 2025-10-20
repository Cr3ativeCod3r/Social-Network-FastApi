import React, { useState, useRef, useEffect } from "react";
import { User, LogOut, MessageSquare, FileText, Shield, Menu, X } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useNavigate, useLocation } from "react-router-dom";
import image from "../assets/image/ico.svg"
import student from "../assets/image/student.svg"


const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfileClick = () => {
    setMenuOpen((prev) => !prev);
  };

const isActive = (path: string) => {
  if (path.endsWith("/*")) {
    const base = path.replace("/*", "");
    return location.pathname.startsWith(base);
  }
  return location.pathname === path;
};

  const getLinkClasses = (path: string) => {
    const baseClasses = "flex items-center gap-2 uppercase hover:text-[var(--color-basic1)] transition";
    return isActive(path) 
      ? `${baseClasses} text-[var(--color-basic1)] border-b-2 border-[var(--color-basic1)]` 
      : baseClasses;
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

  const navItems = (
    <>
      <li className="flex items-center">
        <a href="/chat" className={getLinkClasses("/chat")}>
          <MessageSquare className="w-5 h-5" />
          <span>Chat</span>
        </a>
      </li>
      <li className="flex items-center">
        <a href="/notatki" className={getLinkClasses("/notatki/*")}>
          <FileText className="w-5 h-5" />
          <span>Notatki</span>
        </a>
      </li>
      {user?.is_admin && (
        <li className="flex items-center">
          <a href="/admin/users" className={getLinkClasses("/admin/*")}>
            <Shield className="w-5 h-5" />
            <span>Admin</span>
          </a>
        </li>
      )}
    </>
  );

  return (
    <nav className="bg-nav text-white shadow-md top-0 sticky z-1">
      <div className="mx-auto flex items-center justify-between px-6 py-4">
        <a
          href="/notatki"
          className="flex items-center gap-2 text-2xl font-semibold"
        >
         <img src={image} className="h-12 "/>
          <span className="hidden sm:inline">Study Share</span>
        </a>
        <ul className="hidden lg:flex gap-8 text-md font-medium items-center">
          {navItems}
        </ul>
        <div className="flex items-center gap-3 relative" ref={menuRef}>
          <p className="hidden sm:inline font-medium text-white">
            {user?.first_name} {user?.last_name}
          </p>
          <img
            onClick={handleProfileClick}
            className="w-10 h-10 rounded-full border-1 p-1 border-gray-500 bg-white object-cover cursor-pointer"
            alt="Avatar"
            src={student}
          />
          {menuOpen && (
            <div className="absolute right-0 top-14 bg-white text-black rounded-xl shadow-lg w-44 py-2 z-50">
              <button
                onClick={() => {
                  navigate("/user/me");
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
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden ml-4"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-nav border-t border-white/20">
          <ul className="flex flex-col gap-2 px-6 py-4">
            {React.Children.map(navItems, (item: React.ReactNode) => (
              <div onClick={() => setMobileMenuOpen(false)}>
                {item}
              </div>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;