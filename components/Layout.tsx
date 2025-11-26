import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PlusCircle, User as UserIcon, LogOut, Home } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col font-sans text-github-text">
      <header className="sticky top-0 z-50 glass-panel border-b-0 shadow-lg shadow-black/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-github-accent/20 border border-github-accent/50 rounded-lg flex items-center justify-center text-github-accent font-bold text-xl group-hover:bg-github-accent/30 transition-colors shadow-[0_0_15px_rgba(88,166,255,0.3)]">
              L
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Lost<span className="text-github-accent">&</span>Found
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive('/') ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'text-github-muted hover:text-white'}`}
            >
              <Home size={18} />
              Home
            </Link>
            <Link 
              to="/post" 
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive('/post') ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'text-github-muted hover:text-white'}`}
            >
              <PlusCircle size={18} />
              Post Item
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-github-text hover:text-github-accent transition-colors">
                  <div className="w-8 h-8 rounded-full bg-github-card border border-github-border flex items-center justify-center text-github-muted">
                    <UserIcon size={16} />
                  </div>
                  <span className="hidden sm:inline">{user.username}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-github-muted hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="px-5 py-2 bg-github-accent/10 hover:bg-github-accent/20 border border-github-accent/50 text-github-accent text-sm font-bold rounded-full transition-all shadow-[0_0_10px_rgba(88,166,255,0.1)] hover:shadow-[0_0_15px_rgba(88,166,255,0.3)]"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Nav Bottom */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t-0 flex justify-around p-3 z-50 pb-safe shadow-[0_-5px_15px_rgba(0,0,0,0.3)]">
        <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-github-accent' : 'text-github-muted'}`}>
          <Home size={24} />
          <span className="text-[10px]">Home</span>
        </Link>
        <Link to="/post" className={`flex flex-col items-center gap-1 ${isActive('/post') ? 'text-github-accent' : 'text-github-muted'}`}>
          <PlusCircle size={24} />
          <span className="text-[10px]">Post</span>
        </Link>
        <Link to={user ? "/profile" : "/login"} className={`flex flex-col items-center gap-1 ${isActive('/profile') || isActive('/login') ? 'text-github-accent' : 'text-github-muted'}`}>
          <UserIcon size={24} />
          <span className="text-[10px]">{user ? 'Profile' : 'Login'}</span>
        </Link>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8 pb-24 md:pb-8">
        {children}
      </main>
      
      <footer className="hidden md:block glass-panel border-t-0 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-github-muted text-sm">
          <p>&copy; {new Date().getFullYear()} Lost & Found Community Board.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;