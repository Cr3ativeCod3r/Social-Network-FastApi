import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer footer-center p-4 bg-white text-white bg-nav">
      <aside>
        <p>© {currentYear} Study Share. Wszystkie prawa zastrzeżone.</p>
      </aside>
    </footer>
  );x
};

export default Footer;