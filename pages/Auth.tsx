import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StorageService } from '../services/storage';
import { User } from '../types';

interface AuthProps {
  setUser: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ setUser }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const user = StorageService.login(email);
      setUser(user);
      setLoading(false);
      navigate('/');
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 glass-panel rounded-2xl shadow-2xl border border-github-border">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-github-accent/20 border border-github-accent/50 rounded-xl flex items-center justify-center text-github-accent font-bold text-2xl mx-auto mb-4 shadow-[0_0_15px_rgba(88,166,255,0.3)]">
          L
        </div>
        <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
        <p className="text-github-muted mt-2">Enter your email to login or register automatically.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-github-text mb-2">Email Address</label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg glass-input focus:outline-none focus:ring-1 focus:ring-github-accent/50 transition-all placeholder-gray-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-github-accent text-white rounded-lg font-bold hover:bg-blue-400 transition-all shadow-[0_0_20px_rgba(88,166,255,0.4)] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Continue'}
        </button>
      </form>
      
      <div className="mt-8 text-center text-xs text-github-muted">
        <p>This is a demo. No real password required.</p>
      </div>
    </div>
  );
};

export default Auth;