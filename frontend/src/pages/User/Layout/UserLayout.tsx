import React from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex  bg-gray-50 text-gray-900">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default UserLayout;