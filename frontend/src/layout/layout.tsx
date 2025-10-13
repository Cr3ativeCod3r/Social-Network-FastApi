import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col">
      <Navbar />
<main className="bg-[linear-gradient(to_right,_#dcfce7_1px,_transparent_1px),linear-gradient(to_bottom,_#dcfce7_1px,_transparent_1px)] [background-size:22px_22px] bg-gray-50">
  {children}
</main>
      <Footer />
    </div>
  );
};

export default Layout;