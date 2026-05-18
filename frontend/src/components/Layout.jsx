import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow bg-gov-light-blue bg-opacity-30">
        <Outlet />
      </main>
      <footer className="bg-gov-blue text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2026 ApnaHaq - GovtConnect India. All rights reserved.</p>
          <p className="text-xs text-gray-300 mt-2">Designed for the citizens of India.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
