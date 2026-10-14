import React, { useState } from 'react';
import {
  Search, Bell, Moon, Sun, Database, Sparkles, User as UserIcon,
  CheckCircle2, RefreshCw, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi, forecastApi } from '../../services/api';

interface HeaderProps {
  title?: string;
  onOpenSearch: () => void;
  onOpenCopilot: () => void;
  unreadAlertCount?: number;
  onRefreshData?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = "Dashboard",
  onOpenSearch,
  onOpenCopilot,
  unreadAlertCount = 8,
  onRefreshData
}) => {
  const { user } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      await authApi.seedData();
      showToast("Database seeded with 105+ products, 12 suppliers, & 12M sales!");
      if (onRefreshData) onRefreshData();
    } catch (e: any) {
      showToast("Seed completed or already populated.");
    } finally {
      setIsSeeding(false);
    }
  };

  const handleTrainModels = async () => {
    setIsTraining(true);
    try {
      const res = await forecastApi.trainPipeline();
      showToast(`ML Pipeline Retrained! Best model: ${res.comparison?.best_model || 'XGBoost'}`);
      if (onRefreshData) onRefreshData();
    } catch (e: any) {
      showToast("Error retraining forecasting models.");
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <>
      <header className="h-16 px-6 bg-white/80 dark:bg-[#0e1714]/80 backdrop-blur-md border-b border-[#e5ebe5] dark:border-[#1d2d27] flex items-center justify-between sticky top-0 z-20 transition-colors">
        {/* Left: Page Title */}
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {title}
          </h2>
        </div>

        {/* Center: Search Bar matching reference style */}
        <div className="flex-1 max-w-md mx-6">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-full bg-[#f1f4f1] dark:bg-[#16231f] text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 border border-transparent hover:border-[#c5e2d6] dark:hover:border-[#274b3f] text-sm transition-all"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search products, suppliers, SKUs...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-white dark:bg-[#1f332c] rounded-md border border-slate-200 dark:border-slate-700 shadow-2xs">
              Ctrl + K
            </kbd>
          </button>
        </div>

        {/* Right: Actions, Theme, Notifications, User */}
        <div className="flex items-center gap-3">
          {/* Seed Dataset button */}
          <button
            onClick={handleSeedData}
            disabled={isSeeding}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#182622] dark:hover:bg-[#20332d] text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors disabled:opacity-50"
            title="Seed / Reset realistic retail database"
          >
            <Database className={`w-3.5 h-3.5 text-emerald-600 ${isSeeding ? 'animate-spin' : ''}`} />
            <span>{isSeeding ? 'Seeding...' : 'Seed Data'}</span>
          </button>

          {/* Train ML Models button */}
          <button
            onClick={handleTrainModels}
            disabled={isTraining}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#c9e89d] hover:bg-[#b8de85] text-[#133026] text-xs font-bold transition-all shadow-xs disabled:opacity-50"
            title="Train XGBoost, Random Forest & Ridge forecasting models"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isTraining ? 'animate-spin' : ''}`} />
            <span>{isTraining ? 'Training ML...' : 'Train Models'}</span>
          </button>

          {/* AI Copilot Ask Button */}
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-lime-300" />
            <span className="hidden md:inline">AI Copilot</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#182622] transition-colors"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Notifications Bell */}
          <a
            href="#/alerts"
            className="relative w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#182622] transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#0e1714]" />
            )}
          </a>

          {/* User Profile Avatar matching reference header */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1b3b32] to-[#347866] text-[#a3e635] flex items-center justify-center font-bold text-xs shadow-inner">
              {user?.full_name ? user.full_name.charAt(0) : 'A'}
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">
                {user?.full_name || 'Harsh Vardhan'}
              </p>
              <p className="text-[10px] text-slate-400 leading-none mt-1">
                {user?.role || 'Admin'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Toast Notification Popup */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs shadow-2xl animate-fade-in border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMsg}</span>
          <button onClick={() => setToastMsg(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </>
  );
};
