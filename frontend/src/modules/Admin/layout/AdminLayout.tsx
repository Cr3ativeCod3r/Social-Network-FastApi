import React from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex lg:flex-row sm: min-h-screen flex-col bg-gray-50 text-gray-900">
      <Navbar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default AdminLayout;