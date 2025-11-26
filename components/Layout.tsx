import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, PlusCircle, User as UserIcon, LogOut, Home } from 'lucide-react';
import { StorageService } from '../services/storage';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  setUser: (user: User | null) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    StorageService.logout();
    setUser(null);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:bg-indigo-700 transition-colors">
              L
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">
              Lost<span className="text-indigo-600">&</span>Found
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive('/') ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <Home size={18} />
              Home
            </Link>
            <Link 
              to="/post" 
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive('/post') ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <PlusCircle size={18} />
              Post Item
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-indigo-600">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                    <UserIcon size={16} />
                  </div>
                  <span className="hidden sm:inline">{user.username}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-full transition-all shadow-sm hover:shadow-md"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Nav Bottom */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 z-50 pb-safe">
        <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-indigo-600' : 'text-slate-400'}`}>
          <Home size={24} />
          <span className="text-[10px]">Home</span>
        </Link>
        <Link to="/post" className={`flex flex-col items-center gap-1 ${isActive('/post') ? 'text-indigo-600' : 'text-slate-400'}`}>
          <PlusCircle size={24} />
          <span className="text-[10px]">Post</span>
        </Link>
        <Link to={user ? "/profile" : "/login"} className={`flex flex-col items-center gap-1 ${isActive('/profile') || isActive('/login') ? 'text-indigo-600' : 'text-slate-400'}`}>
          <UserIcon size={24} />
          <span className="text-[10px]">{user ? 'Profile' : 'Login'}</span>
        </Link>
      </div>

      <main className="flex-grow container mx-auto px-4 py-6 pb-20 md:pb-6">
        {children}
      </main>
      
      <footer className="hidden md:block bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Lost & Found Community Board. Powered by Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;