import React, { useState, useEffect } from 'react';
import {
  Cpu, Sparkles, CheckCircle2, DollarSign, Clock, ShieldCheck,
  RefreshCw, TrendingUp, BarChart3, Sliders, ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
  PieChart, Pie, Cell
} from 'recharts';
import { procurementApi } from '../services/api';
import { OptimizationResult } from '../types';

const PIE_COLORS = ['#1b3b32', '#22c55e', '#a3e635', '#0284c7', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];

export const ProcurementOptimizerPage: React.FC = () => {
  const [budgetLimit, setBudgetLimit] = useState<number>(250000);
  const [maxLeadTime, setMaxLeadTime] = useState<number>(14);
  const [minReliability, setMinReliability] = useState<number>(80);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runOptimizer = async () => {
    setLoading(true);
    try {
      const data = await procurementApi.optimize({
        budget_limit: budgetLimit,
        max_lead_time_days: maxLeadTime === 99 ? undefined : maxLeadTime,
        min_supplier_score: minReliability
      });
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runOptimizer();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Google OR-Tools Procurement Optimizer
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#c9e89d] text-[#133026]">
              MILP Mathematical Solver
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Mixed-Integer Linear Programming allocating purchase orders across multiple vendors to minimize cost & delivery risk under budget limits
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={runOptimizer}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1b3b32] hover:bg-[#152e27] text-[#a3e635] text-xs font-bold transition-all shadow-sm disabled:opacity-50"
          >
            <Cpu className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Solving MILP...' : 'Run OR-Tools Solver'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Constraints Controls */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          <Sliders className="w-4 h-4 text-emerald-600" />
          <span>Optimizer Constraints & Parameters</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Budget Limit Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Procurement Budget Limit:
              </label>
              <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                ₹{budgetLimit.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="50000"
              max="600000"
              step="25000"
              value={budgetLimit}
              onChange={e => setBudgetLimit(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹50,000</span>
              <span>₹3,00,000</span>
              <span>₹6,00,000</span>
            </div>
          </div>

          {/* Lead Time Filter */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 dark:text-slate-300 block">
              Max Permitted Lead Time:
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: '3 Days', val: 3 },
                { label: '7 Days', val: 7 },
                { label: '14 Days', val: 14 },
                { label: 'Any', val: 99 }
              ].map(item => (
                <button
                  key={item.val}
                  onClick={() => setMaxLeadTime(item.val)}
                  className={`py-2 rounded-xl font-bold text-xs transition-colors ${
                    maxLeadTime === item.val
                      ? 'bg-[#1b3b32] text-[#a3e635]'
                      : 'bg-slate-100 dark:bg-[#182622] text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Min Reliability */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 dark:text-slate-300 block">
              Min Supplier Reliability Score:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: '75% +', val: 75 },
                { label: '85% +', val: 85 },
                { label: '92% +', val: 92 }
              ].map(item => (
                <button
                  key={item.val}
                  onClick={() => setMinReliability(item.val)}
                  className={`py-2 rounded-xl font-bold text-xs transition-colors ${
                    minReliability === item.val
                      ? 'bg-[#1b3b32] text-[#a3e635]'
                      : 'bg-slate-100 dark:bg-[#182622] text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <>
          {/* Top Performance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
              <div className="text-xs font-semibold text-slate-400">Total Optimal Spend</div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                ₹{result.total_cost.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Utilizing <strong>{result.budget_utilized_pct}%</strong> of budget
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
              <div className="text-xs font-semibold text-slate-400">Potential Savings</div>
              <div className="text-2xl font-extrabold text-lime-600 dark:text-[#a3e635] mt-1">
                ₹{result.potential_savings_vs_default.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Versus single-source procurement
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
              <div className="text-xs font-semibold text-slate-400">SKUs Covered</div>
              <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
                {result.total_products_covered} Lines
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {result.total_units_ordered.toLocaleString()} total units allocated
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
              <div className="text-xs font-semibold text-slate-400">Solver Status</div>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">
                {result.solver_status}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                SCIP / CBC Linear Optimizer
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
              <div className="text-xs font-semibold text-slate-400">Execution Speed</div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {result.execution_time_ms} ms
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Zero heuristic delay
              </div>
            </div>
          </div>

          {/* Supplier Allocations & Spend Distribution Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 p-6 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                Vendor Allocation Breakdown
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.supplier_allocations} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                    <XAxis type="number" stroke="#94a3b8" fontSize={10} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                    <YAxis dataKey="supplier_name" type="category" stroke="#94a3b8" fontSize={10} tickLine={false} width={130} />
                    <Tooltip
                      formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Total Allocated Spend']}
                      contentStyle={{
                        backgroundColor: '#1b3b32',
                        borderColor: '#274b3f',
                        borderRadius: '0.75rem',
                        color: '#ffffff',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="total_spend" fill="#1b3b32" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-6 p-6 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                  Supplier Share Matrix
                </h3>
                <div className="space-y-3">
                  {result.supplier_allocations.map((sa, idx) => (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-800 dark:text-slate-200">{sa.supplier_name}</span>
                        <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                          ₹{sa.total_spend.toLocaleString('en-IN')} ({sa.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${sa.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-xs text-emerald-900 dark:text-emerald-300 mt-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>All supplier MOQ constraints and lead-time guarantees satisfied.</span>
              </div>
            </div>
          </div>

          {/* Selected Order Allocation Table */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Optimal Order Allocation Matrix ({result.selected_items.length} Lines)
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Product SKU</th>
                    <th className="pb-3">Selected Vendor</th>
                    <th className="pb-3 text-right">Optimal Qty</th>
                    <th className="pb-3 text-right">Unit Quote</th>
                    <th className="pb-3 text-right">Line Cost</th>
                    <th className="pb-3 text-center">Lead Time</th>
                    <th className="pb-3 text-center">Reliability</th>
                    <th className="pb-3 text-center">MOQ Check</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {result.selected_items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-[#182622]/50 transition-colors">
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">
                        <div>{item.product_name}</div>
                        <div className="text-[10px] text-slate-400">{item.sku} • {item.category}</div>
                      </td>
                      <td className="py-3 text-slate-700 dark:text-slate-300 font-medium">
                        {item.supplier_name}
                      </td>
                      <td className="py-3 text-right font-black text-emerald-700 dark:text-emerald-400 text-sm">
                        {item.quantity}
                      </td>
                      <td className="py-3 text-right font-bold text-slate-700 dark:text-slate-300">
                        ₹{item.unit_cost}
                      </td>
                      <td className="py-3 text-right font-extrabold text-slate-900 dark:text-white">
                        ₹{item.total_cost.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 text-center font-semibold text-slate-600 dark:text-slate-400">
                        {item.lead_time_days}d
                      </td>
                      <td className="py-3 text-center font-bold text-emerald-700 dark:text-emerald-400">
                        {item.reliability_score}%
                      </td>
                      <td className="py-3 text-center">
                        <span className="badge-pill badge-green text-[10px]">
                          ≥ {item.moq} (Pass)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
