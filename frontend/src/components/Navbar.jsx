import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ShieldCheck, User, LogOut, Bell } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md border-b-4 border-india-saffron">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <ShieldCheck className="h-8 w-8 text-india-green" />
            <span className="text-xl font-bold text-gov-blue tracking-tight">ApnaHaq</span>
          </Link>

          <div className="flex items-center space-x-6">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gov-blue font-medium">Login</Link>
                <Link to="/register" className="bg-gov-blue text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors font-medium">Register</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-gov-blue font-medium">Dashboard</Link>
                <button className="text-gray-600 hover:text-gov-blue relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">3</span>
                </button>
                <div className="flex items-center space-x-4 border-l pl-4">
                  <Link to="/profile" className="flex items-center space-x-2 text-sm hover:text-gov-blue transition-colors cursor-pointer">
                    <User className="h-5 w-5 text-gov-blue" />
                    <span className="font-semibold text-gray-800">{user?.fullName || 'Citizen'}</span>
                  </Link>
                  <button onClick={handleLogout} className="text-red-600 hover:text-red-800" title="Logout">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="h-1 bg-india-green w-full"></div>
    </nav>
  );
};

export default Navbar;
