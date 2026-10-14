import React, { useState, useEffect } from 'react';
import {
  Sparkles, Sliders, AlertTriangle, TrendingUp, DollarSign, Clock,
  RefreshCw, CheckCircle2, ShieldAlert, ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from 'recharts';
import { simulationApi } from '../services/api';
import { SimulationResult } from '../types';

export const WhatIfSimulatorPage: React.FC = () => {
  const [demandChange, setDemandChange] = useState<number>(20);
  const [leadTimeChange, setLeadTimeChange] = useState<number>(3);
  const [costChange, setCostChange] = useState<number>(5);
  const [budgetLimit, setBudgetLimit] = useState<number>(250000);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runSim = async () => {
    setLoading(true);
    try {
      const data = await simulationApi.run({
        demand_change_pct: demandChange,
        lead_time_change_days: leadTimeChange,
        cost_change_pct: costChange,
        budget_limit: budgetLimit
      });
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSim();
  }, [demandChange, leadTimeChange, costChange, budgetLimit]);

  const comparisonChartData = result ? [
    {
      metric: 'High Stockout Risk SKUs',
      Baseline: result.base_stockout_risk_count,
      Simulated: result.simulated_stockout_risk_count,
    },
  ] : [];

  const costComparisonData = result ? [
    {
      metric: 'Procurement Requirement (₹k)',
      Baseline: Math.round(result.base_total_procurement_cost / 1000),
      Simulated: Math.round(result.simulated_total_procurement_cost / 1000),
      Budget: Math.round(((result.budget_limit ?? budgetLimit) || 0) / 1000)
    }
  ] : [];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            What-If Scenario Simulator & Stress Tester
          </h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#c9e89d] text-[#133026]">
            Sensitivity Modeling
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Simulate supply chain shocks: sudden demand surges, vendor port delays, cost inflation, and budget headroom
        </p>
      </div>

      {/* Interactive Controls Panel */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs space-y-5">
        <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          <Sliders className="w-4 h-4 text-emerald-600" />
          <span>Simulation Levers & Stress Shocks</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
          {/* Demand Surge Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Demand Variation:
              </label>
              <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                {demandChange > 0 ? `+${demandChange}%` : `${demandChange}%`}
              </span>
            </div>
            <input
              type="range"
              min="-40"
              max="80"
              step="5"
              value={demandChange}
              onChange={e => setDemandChange(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>-40% (Downturn)</span>
              <span>0%</span>
              <span>+80% (Surge)</span>
            </div>
          </div>

          {/* Lead Time Delay Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Supplier Delivery Delay:
              </label>
              <span className="font-extrabold text-sm text-amber-600 dark:text-amber-400">
                {leadTimeChange > 0 ? `+${leadTimeChange} days` : `0 days`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={leadTimeChange}
              onChange={e => setLeadTimeChange(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>On-Time (0d)</span>
              <span>+5d Delay</span>
              <span>+10d Bottleneck</span>
            </div>
          </div>

          {/* Unit Cost Inflation */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Purchase Price Inflation:
              </label>
              <span className="font-extrabold text-sm text-blue-600 dark:text-blue-400">
                {costChange > 0 ? `+${costChange}%` : `${costChange}%`}
              </span>
            </div>
            <input
              type="range"
              min="-15"
              max="35"
              step="5"
              value={costChange}
              onChange={e => setCostChange(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>-15% (Deflation)</span>
              <span>0%</span>
              <span>+35% (Spike)</span>
            </div>
          </div>

          {/* Budget Limit */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Allocated Budget:
              </label>
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                ₹{(budgetLimit / 1000).toFixed(0)}k
              </span>
            </div>
            <input
              type="range"
              min="100000"
              max="500000"
              step="25000"
              value={budgetLimit}
              onChange={e => setBudgetLimit(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-800"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹1 Lakh</span>
              <span>₹2.5 Lakh</span>
              <span>₹5 Lakh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Results & Visual Impact */}
      {result && (
        <>
          {/* Executive Impact Summary Alert */}
          <div className={`p-4 px-5 rounded-2xl border text-xs leading-relaxed flex items-start gap-3 ${
            result.is_budget_breached
              ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900 text-red-900 dark:text-red-200'
              : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200'
          }`}>
            <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block text-sm font-extrabold mb-1">
                Scenario Impact Assessment:
              </strong>
              {result.impact_summary}
            </div>
          </div>

          {/* Comparison KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
              <div className="text-xs font-semibold text-slate-400">Baseline Stockout Lines</div>
              <div className="text-2xl font-black text-slate-700 dark:text-slate-300 mt-1">
                {result.base_stockout_risk_count} SKUs
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Normal operating velocity</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
              <div className="text-xs font-semibold text-slate-400">Simulated Stockout Lines</div>
              <div className={`text-2xl font-black mt-1 ${result.simulated_stockout_risk_count > result.base_stockout_risk_count ? 'text-red-600' : 'text-emerald-600'}`}>
                {result.simulated_stockout_risk_count} SKUs
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Shift: <strong>{result.simulated_stockout_risk_count - result.base_stockout_risk_count > 0 ? `+${result.simulated_stockout_risk_count - result.base_stockout_risk_count}` : `${result.simulated_stockout_risk_count - result.base_stockout_risk_count}`} lines</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
              <div className="text-xs font-semibold text-slate-400">Base Required Spend</div>
              <div className="text-2xl font-black text-slate-700 dark:text-slate-300 mt-1">
                ₹{result.base_total_procurement_cost.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Standard replenishment cost</div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
              <div className="text-xs font-semibold text-slate-400">Simulated Required Spend</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                ₹{result.simulated_total_procurement_cost.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Cost delta: <strong>{result.cost_difference > 0 ? `+₹${result.cost_difference.toLocaleString('en-IN')}` : `-₹${Math.abs(result.cost_difference).toLocaleString('en-IN')}`}</strong>
              </div>
            </div>
          </div>

          {/* Critical Impacted Lines Table */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Most Impacted Product Lines Under This Scenario
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Product Name</th>
                    <th className="pb-3 text-right">Current Stock</th>
                    <th className="pb-3 text-center">Base Days to Stockout</th>
                    <th className="pb-3 text-center">Simulated Days to Stockout</th>
                    <th className="pb-3 text-center">Base Risk</th>
                    <th className="pb-3 text-center">Simulated Risk</th>
                    <th className="pb-3 text-right">Base Order</th>
                    <th className="pb-3 text-right">Simulated Order</th>
                    <th className="pb-3 text-right">Cost Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {result.critical_impacted_products.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-[#182622]/50 transition-colors">
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">
                        <div>{p.product_name}</div>
                        <div className="text-[10px] text-slate-400">{p.sku}</div>
                      </td>
                      <td className="py-3 text-right font-bold text-slate-800 dark:text-slate-200">{p.current_stock}</td>
                      <td className="py-3 text-center text-slate-600 dark:text-slate-400">{p.base_days_to_stockout}d</td>
                      <td className="py-3 text-center font-extrabold text-red-600">{p.sim_days_to_stockout}d</td>
                      <td className="py-3 text-center">
                        <span className="badge-pill badge-amber">{p.base_risk}</span>
                      </td>
                      <td className="py-3 text-center">
                        <span className="badge-pill badge-red">{p.sim_risk}</span>
                      </td>
                      <td className="py-3 text-right font-bold text-slate-700 dark:text-slate-300">{p.base_order_qty}</td>
                      <td className="py-3 text-right font-black text-emerald-700 dark:text-emerald-400">{p.sim_order_qty}</td>
                      <td className="py-3 text-right font-extrabold text-slate-900 dark:text-white">
                        {p.cost_impact > 0 ? `+₹${p.cost_impact.toLocaleString('en-IN')}` : `₹${p.cost_impact}`}
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
