import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer footer-center p-4 bg-green-200 text-gray-400">
      <aside>
        <p>© {currentYear} Study Share. Wszystkie prawa zastrzeżone.</p>
      </aside>
    </footer>
  );x
};

export default Footer;