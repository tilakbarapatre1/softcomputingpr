import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, TrendingUp, Cpu, Truck, BarChart3,
  Bot, Bell, FileText, AlertTriangle, Boxes, ChevronDown, ChevronRight,
  Layers, Sliders, ShieldAlert, Sparkles, CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  alertCount?: number;
  onOpenCopilot: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ alertCount = 8, onOpenCopilot }) => {
  const { user, loginAsDemo } = useAuth();
  const location = useLocation();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    inventory: true,
    demand: true,
    procurement: true,
    analytics: true
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-150 ${
      isActive
        ? 'bg-[#c9e89d] text-[#133026] font-bold shadow-sm'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-[#182622]'
    }`;

  const subNavItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${
      isActive
        ? 'bg-[#dcfce7] text-[#166534] font-bold dark:bg-[#1f3d32] dark:text-[#86efac]'
        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-[#16231f]'
    }`;

  return (
    <aside className="w-64 bg-[#f8faf8] dark:bg-[#0e1714] border-r border-[#e5ebe5] dark:border-[#1d2d27] flex flex-col h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-[#e5ebe5] dark:border-[#1d2d27]">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1b3b32] to-[#347866] flex items-center justify-center text-[#a3e635] shadow-md">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              INVENT<span className="text-[#15803d] dark:text-[#a3e635]">AI</span>
            </h1>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              Procurement & ML
            </p>
          </div>
        </NavLink>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 text-slate-700">
        {/* Main Dashboard */}
        <NavLink to="/" end className={navItemClass}>
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </NavLink>

        {/* Inventory Group */}
        <div>
          <button
            onClick={() => toggleSection('inventory')}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-600 dark:hover:text-slate-300"
          >
            <span className="flex items-center gap-2">
              <Package className="w-3.5 h-3.5" /> Inventory
            </span>
            {openSections.inventory ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          {openSections.inventory && (
            <div className="pl-3 mt-1 space-y-1 border-l-2 border-slate-200 dark:border-slate-800 ml-3">
              <NavLink to="/inventory" end className={subNavItemClass}>
                <span>All Products</span>
              </NavLink>
              <NavLink to="/inventory?status=low" className={subNavItemClass}>
                <span>Low Stock</span>
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold dark:bg-amber-950 dark:text-amber-300">
                  Alert
                </span>
              </NavLink>
              <NavLink to="/analytics/overstock" className={subNavItemClass}>
                <span>Overstock & Dead Stock</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Demand Intelligence Group */}
        <div>
          <button
            onClick={() => toggleSection('demand')}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-600 dark:hover:text-slate-300"
          >
            <span className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5" /> Demand AI
            </span>
            {openSections.demand ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          {openSections.demand && (
            <div className="pl-3 mt-1 space-y-1 border-l-2 border-slate-200 dark:border-slate-800 ml-3">
              <NavLink to="/demand-intelligence/forecast" className={subNavItemClass}>
                <span>Demand Forecast</span>
              </NavLink>
              <NavLink to="/demand-intelligence/evaluation" className={subNavItemClass}>
                <span>Model Evaluation (MAE/RMSE)</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Procurement AI Group */}
        <div>
          <button
            onClick={() => toggleSection('procurement')}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-600 dark:hover:text-slate-300"
          >
            <span className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5" /> Procurement AI
            </span>
            {openSections.procurement ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          {openSections.procurement && (
            <div className="pl-3 mt-1 space-y-1 border-l-2 border-slate-200 dark:border-slate-800 ml-3">
              <NavLink to="/procurement/recommendations" className={subNavItemClass}>
                <span>AI Reorder Insights</span>
              </NavLink>
              <NavLink to="/procurement/optimizer" className={subNavItemClass}>
                <span className="flex items-center gap-1.5">
                  <span>OR-Tools Optimizer</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded font-extrabold dark:bg-emerald-950 dark:text-emerald-300">MILP</span>
                </span>
              </NavLink>
              <NavLink to="/procurement/purchase-orders" className={subNavItemClass}>
                <span>Purchase Orders</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Suppliers */}
        <NavLink to="/suppliers" className={navItemClass}>
          <Truck className="w-4 h-4" />
          <span>Suppliers Directory</span>
        </NavLink>

        {/* Analytics Group */}
        <div>
          <button
            onClick={() => toggleSection('analytics')}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-600 dark:hover:text-slate-300"
          >
            <span className="flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5" /> Analytics
            </span>
            {openSections.analytics ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          {openSections.analytics && (
            <div className="pl-3 mt-1 space-y-1 border-l-2 border-slate-200 dark:border-slate-800 ml-3">
              <NavLink to="/analytics/abc-xyz" className={subNavItemClass}>
                <span>ABC-XYZ Matrix</span>
              </NavLink>
              <NavLink to="/analytics/stockout-risk" className={subNavItemClass}>
                <span>Stockout Risk Analysis</span>
              </NavLink>
              <NavLink to="/analytics/simulation" className={subNavItemClass}>
                <span>What-If Simulator</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* AI Copilot trigger */}
        <button
          onClick={onOpenCopilot}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-50 to-lime-50 text-emerald-900 hover:from-emerald-100 hover:to-lime-100 dark:from-[#132a24] dark:to-[#1b3b32] dark:text-[#a3e635] border border-emerald-200/60 dark:border-emerald-800/40 transition-all"
        >
          <span className="flex items-center gap-2.5">
            <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>AI Copilot</span>
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold">Ask</span>
        </button>

        {/* Alerts Center */}
        <NavLink to="/alerts" className={navItemClass}>
          <div className="flex items-center justify-between w-full">
            <span className="flex items-center gap-3">
              <Bell className="w-4 h-4" />
              <span>Alert Center</span>
            </span>
            {alertCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500 text-white">
                {alertCount}
              </span>
            )}
          </div>
        </NavLink>

        {/* Reports */}
        <NavLink to="/reports" className={navItemClass}>
          <FileText className="w-4 h-4" />
          <span>Export Reports</span>
        </NavLink>
      </div>

      {/* Reference Image Styled Bottom Promo Card */}
      <div className="p-3 border-t border-[#e5ebe5] dark:border-[#1d2d27]">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#1b3b32] to-[#132a24] text-white shadow-lg relative overflow-hidden">
          <div className="absolute -right-3 -top-3 w-16 h-16 bg-[#a3e635]/15 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-[#a3e635]" />
            <span className="text-xs font-bold tracking-wide text-[#a3e635]">Decision Intelligence</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug mb-3">
            Optimize purchases across 12 suppliers with OR-Tools MILP algorithm.
          </p>
          <NavLink
            to="/procurement/optimizer"
            className="block text-center w-full py-1.5 px-3 rounded-xl bg-[#a3e635] text-[#132a24] font-bold text-xs hover:bg-[#bef264] transition-colors shadow-sm"
          >
            Launch Optimizer
          </NavLink>
        </div>

        {/* Quick Demo User Switcher */}
        <div className="mt-2.5 pt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
          <span>Role: <strong className="text-slate-800 dark:text-slate-200">{user?.role || 'ADMIN'}</strong></span>
          <div className="flex gap-1">
            <button
              onClick={() => loginAsDemo('ADMIN')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${user?.role === 'ADMIN' ? 'bg-[#c9e89d] text-[#133026]' : 'hover:bg-slate-200 dark:hover:bg-slate-800'}`}
              title="Switch to Admin"
            >
              Adm
            </button>
            <button
              onClick={() => loginAsDemo('INVENTORY_MANAGER')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${user?.role === 'INVENTORY_MANAGER' ? 'bg-[#c9e89d] text-[#133026]' : 'hover:bg-slate-200 dark:hover:bg-slate-800'}`}
              title="Switch to Manager"
            >
              Mgr
            </button>
            <button
              onClick={() => loginAsDemo('STAFF')}
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${user?.role === 'STAFF' ? 'bg-[#c9e89d] text-[#133026]' : 'hover:bg-slate-200 dark:hover:bg-slate-800'}`}
              title="Switch to Staff"
            >
              Stf
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
