import React from "react";
import { NavLink } from "react-router-dom";
import { Shield, Users, FileText, BarChart3 } from "lucide-react";

const Navbar: React.FC = () => {
  const links = [
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Notes", path: "/admin/notes", icon: FileText },
    { name: "Statistics", path: "/admin/stats", icon: BarChart3 },
  ];

  return (
    <nav className="w-56 h-screen bg-white border-r border-gray-200 shadow-sm flex flex-col">
      {/* Nagłówek */}
      <div className="flex items-center gap-2 p-4 text-lg font-semibold border-b border-gray-100 text-gray-800">
        <Shield className="w-5 h-5 text-green-500" />
        <span>Admin Panel</span>
      </div>

      {/* Linki */}
      <ul className="flex-1 flex flex-col space-y-1 p-3">
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
                  <span>{name}</span>
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