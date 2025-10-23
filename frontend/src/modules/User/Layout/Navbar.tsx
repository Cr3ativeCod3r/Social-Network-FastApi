import React from "react";
import { NavLink } from "react-router-dom";
import { Shield, Users, FileText, BarChart3 } from "lucide-react";
import ChangePasswordmodal from "../components/ChangePasswordModal";
import { useAuthStore } from "../../../store/authStore";

const Navbar: React.FC = () => {
  const { user } = useAuthStore();

  const links = [
    { name: "Zapisane notatki", path: "/user/savednotes", icon: Users },
    { name: "Moje notatki", path: `/user/notes/${user?.user_id}`, icon: FileText },
    { name: "Moje konto", path: "/user/me", icon: BarChart3 },
  ];

  return (
    <nav
      className="
        bg-white border-gray-200 shadow-sm 

        w-full md:w-56
        border-b md:border-b-0 md:border-r

      "
    >
      <div className="flex items-center justify-center md:justify-start gap-2 p-3 text-lg font-semibold border-b border-gray-100 text-gray-800">
        <Shield className="w-5 h-5 text-green-500" />
        <span>User Panel</span>
      </div>

      {/* Linki */}
      <ul
        className="
          flex md:flex-col flex-row 
          justify-center md:justify-start 
          items-center md:items-stretch 
          gap-1 md:space-y-1 
          p-2 md:p-3
       
        "
      >
        {links.map(({ name, path, icon: Icon }) => (
          <li key={path}>
            <NavLink
              to={path}
              className={({ isActive }) =>
                [
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-second1 text-white"
                    : "text-gray-700 hover:bg-gray-100",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-white" : "text-gray-500"
                    }`}
                  />
                  <span className="hidden sm:inline">{name}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
        <ChangePasswordmodal />
      </ul>
    </nav>
  );
};

export default Navbar;