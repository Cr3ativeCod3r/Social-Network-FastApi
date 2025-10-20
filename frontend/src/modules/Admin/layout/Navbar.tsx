import React from "react";
import { NavLink } from "react-router-dom";
import { Shield, Users, BarChart3, Book, MailWarning} from "lucide-react";

const Navbar: React.FC = () => {
  const links = [
    { name: "Użytkownicy", path: "/admin/users", icon: Users },
    { name: "Statystyki", path: "/admin/stats", icon: BarChart3 },
    { name: "Przedmioty", path: "/admin/subjects", icon: Book },
    { name: "Zgłoszenia", path: "/admin/reports", icon: MailWarning },
  ];

  return (
    <nav
      className="
        bg-white border-gray-200 shadow-sm
        flex flex-col md:flex-col
        w-full md:w-56
        h-auto md:h-screen
        border-b md:border-b-0 md:border-r
      "
    >
      <div className="flex items-center justify-center md:justify-start gap-2 p-3 text-lg font-semibold border-b border-gray-100 text-gray-800">
        <Shield className="w-5 h-5 text-green-500" />
        <span>Admin Panel</span>
      </div>
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
                    className={`w-4 h-4 transition-colors ${isActive ? "text-white" : "text-gray-500"
                      }`}
                  />
                  <span className="hidden sm:inline">{name}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;