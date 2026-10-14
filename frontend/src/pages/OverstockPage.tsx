import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Package, DollarSign, AlertCircle, Sparkles, RefreshCw,
  TrendingDown, ArrowRight, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { analyticsApi } from '../services/api';

export const OverstockPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overstock' | 'dead_stock'>('overstock');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await analyticsApi.getOverstock();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Scanning for Stagnant Inventory & Locked Capital...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Overstock & Dead Stock Detection
          </h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            Working Capital Efficiency
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Identifying excess stock levels, high Days of Supply (DoS), slow movers, and locked retail working capital
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
          <div className="text-xs font-semibold text-slate-400">Total Capital Locked in Excess Stock</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            ₹{data.total_locked_capital.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Stagnant working capital ready for reallocation</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
          <div className="text-xs font-semibold text-slate-400">Overstocked SKUs</div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {data.overstock_count} Products
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Stock exceeding 60 days of demand coverage</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
          <div className="text-xs font-semibold text-slate-400">Dead Stock / Inactive Lines</div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {data.dead_stock_count} Products
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Zero or minimal sales volume over last 60 days</p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('overstock')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overstock'
              ? 'bg-[#1b3b32] text-[#a3e635] shadow-xs'
              : 'bg-white dark:bg-[#141f1c] border border-slate-200 dark:border-[#20332c] text-slate-600'
          }`}
        >
          Overstocked Inventory ({data.overstock_count})
        </button>
        <button
          onClick={() => setActiveTab('dead_stock')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'dead_stock'
              ? 'bg-[#1b3b32] text-[#a3e635] shadow-xs'
              : 'bg-white dark:bg-[#141f1c] border border-slate-200 dark:border-[#20332c] text-slate-600'
          }`}
        >
          Dead Stock & Slow Movers ({data.dead_stock_count})
        </button>
      </div>

      {/* Overstock Table */}
      {activeTab === 'overstock' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Product & SKU</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3 text-right">Current Stock</th>
                  <th className="pb-3 text-right">30d Demand</th>
                  <th className="pb-3 text-right">Excess Units</th>
                  <th className="pb-3 text-right">Locked Capital</th>
                  <th className="pb-3 text-center">Days of Supply</th>
                  <th className="pb-3 text-left">Recommended Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {data.overstock_items.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-[#182622]/50 transition-colors">
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">
                      <NavLink to={`/inventory/product/${item.product_id}`} className="hover:text-emerald-600 font-bold">
                        {item.product_name}
                      </NavLink>
                      <div className="text-[10px] text-slate-400">{item.sku}</div>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">{item.category}</td>
                    <td className="py-3 text-right font-bold text-slate-800 dark:text-slate-200">{item.current_stock}</td>
                    <td className="py-3 text-right text-slate-600 dark:text-slate-400">~{item.expected_30d_demand}</td>
                    <td className="py-3 text-right font-bold text-blue-600">{item.excess_units}</td>
                    <td className="py-3 text-right font-extrabold text-slate-900 dark:text-white">
                      ₹{item.locked_capital.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 text-center font-bold text-slate-700 dark:text-slate-300">
                      {item.days_of_supply}d
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">
                      <span className="text-[11px] bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-lg">
                        {item.recommendation}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dead Stock Table */}
      {activeTab === 'dead_stock' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Product & SKU</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3 text-right">Current Stock</th>
                  <th className="pb-3 text-right">Sales Last 60 Days</th>
                  <th className="pb-3 text-right">Locked Capital</th>
                  <th className="pb-3 text-center">Days of Supply</th>
                  <th className="pb-3 text-left">Prescribed Liquidation Strategy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {data.dead_stock_items.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-[#182622]/50 transition-colors">
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">
                      <NavLink to={`/inventory/product/${item.product_id}`} className="hover:text-emerald-600 font-bold">
                        {item.product_name}
                      </NavLink>
                      <div className="text-[10px] text-slate-400">{item.sku}</div>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">{item.category}</td>
                    <td className="py-3 text-right font-bold text-slate-800 dark:text-slate-200">{item.current_stock}</td>
                    <td className="py-3 text-right font-bold text-red-600">{item.sales_last_60d} units</td>
                    <td className="py-3 text-right font-extrabold text-slate-900 dark:text-white">
                      ₹{item.locked_capital.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 text-center font-bold text-slate-700 dark:text-slate-300">
                      {item.days_of_supply}d
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">
                      <span className="text-[11px] bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-2 py-1 rounded-lg">
                        {item.action_recommendation}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
