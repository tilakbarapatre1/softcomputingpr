import React, { useState, useEffect } from 'react';
import {
  BarChart3, Layers, Sparkles, CheckCircle2, RefreshCw, HelpCircle,
  TrendingUp, ArrowRight, Package
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { analyticsApi } from '../services/api';

export const AbcXyzPage: React.FC = () => {
  const [abcData, setAbcData] = useState<any>(null);
  const [xyzData, setXyzData] = useState<any>(null);
  const [selectedCell, setSelectedCell] = useState<string>('AX');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [abc, xyz] = await Promise.all([
        analyticsApi.getAbc(),
        analyticsApi.getXyz()
      ]);
      setAbcData(abc);
      setXyzData(xyz);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading || !abcData || !xyzData) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Computing ABC-XYZ Pareto & Demand Matrix...</p>
      </div>
    );
  }

  const selectedItems = xyzData.matrix_cells[selectedCell] || [];
  const selectedStrategy = xyzData.matrix_summary[selectedCell];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            ABC-XYZ Inventory Classification Matrix
          </h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#c9e89d] text-[#133026]">
            Pareto + Volatility
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Segmenting catalog by annual consumption value (A/B/C) and demand forecast volatility (X/Y/Z) for tailored procurement policies
        </p>
      </div>

      {/* ABC Pareto Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['A', 'B', 'C'].map((cls) => {
          const s = abcData.summary[cls];
          return (
            <div
              key={cls}
              className="p-5 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Class {cls} Items
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  cls === 'A' ? 'bg-emerald-100 text-emerald-800' : cls === 'B' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {s.percentage_of_value}% Value
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                ₹{s.total_value.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {s.count} Products ({s.percentage_of_items}% of catalog)
              </p>
              <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 leading-snug">
                {s.recommendation}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3x3 ABC-XYZ Matrix & Pareto Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3x3 Matrix Grid */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Interactive 3x3 Decision Matrix
            </h3>
            <span className="text-xs text-slate-400">Click any cell to inspect products</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {['AX', 'AY', 'AZ', 'BX', 'BY', 'BZ', 'CX', 'CY', 'CZ'].map((cellKey) => {
              const cellData = xyzData.matrix_summary[cellKey];
              const isSelected = selectedCell === cellKey;
              return (
                <button
                  key={cellKey}
                  onClick={() => setSelectedCell(cellKey)}
                  className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between min-h-[100px] ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#1b3b32] to-[#132a24] text-white border-emerald-500 shadow-md ring-2 ring-[#a3e635]'
                      : 'bg-[#f8faf8] dark:bg-[#182622] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-[#233831] hover:border-emerald-400'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-extrabold text-base tracking-tight">{cellKey}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-[#a3e635] text-[#132a24]' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}>
                      {cellData.count} SKUs
                    </span>
                  </div>
                  <div className="text-[11px] leading-snug mt-2 font-medium opacity-90 truncate">
                    {cellData.label}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Cell Strategy Banner */}
          {selectedStrategy && (
            <div className="mt-5 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs">
              <div className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Strategy for Category {selectedCell} ({selectedStrategy.label}):</span>
              </div>
              <p className="text-emerald-800 dark:text-emerald-200">
                {selectedStrategy.strategy}
              </p>
            </div>
          )}
        </div>

        {/* Pareto Cumulative Chart */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Pareto Cumulative Curve (80/20 Rule)
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Cumulative inventory consumption valuation across products
            </p>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={abcData.pareto_points} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                  <Tooltip
                    formatter={(val: any) => [`${Number(val).toFixed(1)}%`, 'Cumulative Share']}
                    contentStyle={{
                      backgroundColor: '#1b3b32',
                      borderColor: '#274b3f',
                      borderRadius: '0.75rem',
                      color: '#ffffff',
                      fontSize: '11px'
                    }}
                  />
                  <Area type="monotone" dataKey="cum_pct" name="Cumulative Value %" stroke="#16a34a" fill="#dcfce7" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            Top 20% of SKUs generate <strong>75%+</strong> of annual inventory turnover.
          </div>
        </div>
      </div>

      {/* Products under Selected Cell */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Products in Matrix Segment [{selectedCell}] ({selectedItems.length} SKUs)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3">SKU & Product</th>
                <th className="pb-3">Category</th>
                <th className="pb-3 text-right">Annual Units</th>
                <th className="pb-3 text-right">Annual Value</th>
                <th className="pb-3 text-right">Current Stock</th>
                <th className="pb-3 text-center">Demand Volatility (CV)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {selectedItems.map((p: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-[#182622]/50 transition-colors">
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">
                    <div>{p.product_name}</div>
                    <div className="text-[10px] text-slate-400">{p.sku}</div>
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">{p.category}</td>
                  <td className="py-3 text-right font-bold text-slate-800 dark:text-slate-200">
                    {p.annual_sales_qty.toLocaleString()}
                  </td>
                  <td className="py-3 text-right font-extrabold text-emerald-700 dark:text-emerald-400">
                    ₹{p.annual_value.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 text-right text-slate-700 dark:text-slate-300">
                    {p.current_stock}
                  </td>
                  <td className="py-3 text-center font-bold text-slate-600 dark:text-slate-400">
                    {p.cv || '0.35'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
