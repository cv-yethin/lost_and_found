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
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
          L
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
        <p className="text-slate-500 mt-2">Enter your email to login or register automatically.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70"
        >
          {loading ? 'Signing in...' : 'Continue'}
        </button>
      </form>
      
      <div className="mt-8 text-center text-xs text-slate-400">
        <p>This is a demo. No real password required.</p>
      </div>
    </div>
  );
};

export default Auth;