import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Boxes, Sparkles, Lock, Mail, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginAsDemo, isLoading } = useAuth();
  const [email, setEmail] = useState('admin@smartinventory.ai');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError('Invalid email or password. You can use the one-click demo credentials below.');
    }
  };

  const handleDemoLogin = async (role: 'ADMIN' | 'INVENTORY_MANAGER' | 'STAFF') => {
    setError(null);
    try {
      await loginAsDemo(role);
      navigate('/');
    } catch (err: any) {
      setError('Demo login failed. Make sure backend is running.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f5f3] dark:bg-[#0b1210] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#20332c] rounded-3xl shadow-2xl p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1b3b32] to-[#347866] text-[#a3e635] flex items-center justify-center mx-auto shadow-md">
            <Boxes className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            INVENT<span className="text-emerald-600 dark:text-[#a3e635]">AI</span>
          </h1>
          <p className="text-xs text-slate-400">
            Smart Inventory & Procurement Optimizer using AI Decision Intelligence
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs text-red-800 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f4f7f4] dark:bg-[#182622] border border-slate-200 dark:border-[#233831] text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f4f7f4] dark:bg-[#182622] border border-slate-200 dark:border-[#233831] text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-[#1b3b32] hover:bg-[#152e27] text-[#a3e635] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50"
          >
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick 1-Click Demo Profiles */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            One-Click Instant Demo Profiles
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemoLogin('ADMIN')}
              className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-bold text-center text-[11px] transition-colors"
            >
              <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
              Admin
            </button>

            <button
              onClick={() => handleDemoLogin('INVENTORY_MANAGER')}
              className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 font-bold text-center text-[11px] transition-colors"
            >
              <UserCheck className="w-4 h-4 mx-auto mb-1 text-blue-600" />
              Manager
            </button>

            <button
              onClick={() => handleDemoLogin('STAFF')}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#182622] hover:bg-slate-200 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#233831] font-bold text-center text-[11px] transition-colors"
            >
              <Boxes className="w-4 h-4 mx-auto mb-1 text-slate-500" />
              Staff
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
