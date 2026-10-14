import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ShieldAlert, AlertTriangle, CheckCircle2, Clock, RefreshCw,
  TrendingDown, ArrowRight, Cpu, Package
} from 'lucide-react';
import { analyticsApi } from '../services/api';

export const StockoutRiskPage: React.FC = () => {
  const [riskData, setRiskData] = useState<any>(null);
  const [filterLevel, setFilterLevel] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fetchRisk = async () => {
    setLoading(true);
    try {
      const data = await analyticsApi.getStockoutRisk();
      setRiskData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRisk();
  }, []);

  if (loading || !riskData) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Evaluating Stockout Probabilities & Lead-Time Demands...</p>
      </div>
    );
  }

  const filteredRecords = filterLevel
    ? riskData.records.filter((r: any) => r.risk_level === filterLevel)
    : riskData.records;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Stockout Risk & Lead-Time Depletion Engine
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
              Risk Severity
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Predictive probability of inventory exhaustion prior to supplier delivery replenishment
          </p>
        </div>

        <div className="flex items-center gap-3">
          <NavLink
            to="/procurement/optimizer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1b3b32] hover:bg-[#152e27] text-[#a3e635] text-xs font-bold transition-all shadow-sm"
          >
            <Cpu className="w-4 h-4" />
            <span>Replenish via OR-Tools</span>
          </NavLink>
        </div>
      </div>

      {/* Severity Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setFilterLevel('CRITICAL')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterLevel === 'CRITICAL' ? 'ring-2 ring-red-500' : ''
          } bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-800 dark:text-red-300">CRITICAL RISK</span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
          </div>
          <div className="text-3xl font-black text-red-700 dark:text-red-400 mt-1">
            {riskData.counts.CRITICAL} SKUs
          </div>
          <p className="text-[11px] text-red-600 dark:text-red-400 mt-1">Stockout within lead time</p>
        </div>

        <div
          onClick={() => setFilterLevel('HIGH')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterLevel === 'HIGH' ? 'ring-2 ring-amber-500' : ''
          } bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300">HIGH RISK</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-700 dark:text-amber-400 mt-1">
            {riskData.counts.HIGH} SKUs
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">Breaching reorder threshold</p>
        </div>

        <div
          onClick={() => setFilterLevel('MEDIUM')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterLevel === 'MEDIUM' ? 'ring-2 ring-blue-500' : ''
          } bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800 dark:text-blue-300">MEDIUM RISK</span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          </div>
          <div className="text-3xl font-black text-blue-700 dark:text-blue-400 mt-1">
            {riskData.counts.MEDIUM} SKUs
          </div>
          <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">Stockout in 10-20 days</p>
        </div>

        <div
          onClick={() => setFilterLevel('LOW')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filterLevel === 'LOW' ? 'ring-2 ring-emerald-500' : ''
          } bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">HEALTHY / LOW</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
            {riskData.counts.LOW} SKUs
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Adequate safety buffers</p>
        </div>
      </div>

      {/* Main Stockout Risk Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-bold text-slate-500">
            Assessed {filteredRecords.length} Products {filterLevel && `(${filterLevel} Risk)`}
          </div>
          {filterLevel && (
            <button onClick={() => setFilterLevel('')} className="text-xs font-bold text-emerald-600">
              Clear Filter (Show All)
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Product & SKU</th>
                <th className="pb-3">Category</th>
                <th className="pb-3 text-right">Available Stock</th>
                <th className="pb-3 text-right">Daily Demand</th>
                <th className="pb-3 text-center">Lead Time</th>
                <th className="pb-3 text-center">Days to Stockout</th>
                <th className="pb-3 text-center">Stockout Probability</th>
                <th className="pb-3 text-center">Risk Level</th>
                <th className="pb-3 text-right">Required Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredRecords.map((r: any, idx: number) => {
                const isC = r.risk_level === 'CRITICAL';
                const isH = r.risk_level === 'HIGH';
                return (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-[#182622]/50 transition-colors">
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">
                      <NavLink to={`/inventory/product/${r.product_id}`} className="hover:text-emerald-600 font-bold">
                        {r.product_name}
                      </NavLink>
                      <div className="text-[10px] text-slate-400">{r.sku}</div>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">{r.category}</td>
                    <td className="py-3 text-right font-bold text-slate-800 dark:text-slate-200">
                      {r.current_stock} {r.unit}
                    </td>
                    <td className="py-3 text-right text-slate-600 dark:text-slate-400">
                      ~{r.avg_daily_demand}/day
                    </td>
                    <td className="py-3 text-center text-slate-600 dark:text-slate-400 font-medium">
                      {r.lead_time_days} days
                    </td>
                    <td className="py-3 text-center font-extrabold text-sm">
                      <span className={isC ? 'text-red-600' : isH ? 'text-amber-600' : 'text-slate-800 dark:text-slate-200'}>
                        {r.days_until_stockout}d
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <div className="inline-flex items-center gap-1 font-extrabold">
                        <span className={isC ? 'text-red-600' : isH ? 'text-amber-600' : 'text-emerald-600'}>
                          {r.stockout_probability}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      {isC ? (
                        <span className="badge-pill badge-red">Critical</span>
                      ) : isH ? (
                        <span className="badge-pill badge-amber">High</span>
                      ) : r.risk_level === 'MEDIUM' ? (
                        <span className="badge-pill badge-blue">Medium</span>
                      ) : (
                        <span className="badge-pill badge-green">Low</span>
                      )}
                    </td>
                    <td className="py-3 text-right font-black text-emerald-700 dark:text-emerald-400">
                      {r.recommended_order > 0 ? `${r.recommended_order} ${r.unit}` : '0'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
