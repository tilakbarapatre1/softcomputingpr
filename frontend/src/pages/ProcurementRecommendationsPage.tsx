import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Cpu, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Truck,
  DollarSign, Clock, ShieldCheck, RefreshCw, HelpCircle, FileText
} from 'lucide-react';
import { procurementApi } from '../services/api';
import { AIRecommendation } from '../types';

export const ProcurementRecommendationsPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [convertingId, setConvertingId] = useState<number | null>(null);
  const [filterUrgency, setFilterUrgency] = useState<string>('');

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const data = await procurementApi.getRecommendations('Active');
      setRecommendations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleConvertToPo = async (recId: number) => {
    setConvertingId(recId);
    try {
      const res = await procurementApi.convertToPo(recId);
      alert(`Success! Generated Purchase Order: ${res.po_number}`);
      fetchRecommendations();
    } catch (e) {
      alert("Error generating purchase order.");
    } finally {
      setConvertingId(null);
    }
  };

  const filteredRecs = filterUrgency
    ? recommendations.filter(r => r.urgency === filterUrgency)
    : recommendations;

  const totalProcurementSpend = filteredRecs.reduce((sum, r) => sum + r.estimated_cost, 0);
  const totalPotentialSavings = filteredRecs.reduce((sum, r) => sum + r.potential_savings, 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              AI Reorder Recommendations
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Explainable AI (XAI)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent AI decision support answering: What to buy, how much, when, and from which vendor
          </p>
        </div>

        <div className="flex items-center gap-3">
          <NavLink
            to="/procurement/optimizer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1b3b32] hover:bg-[#152e27] text-[#a3e635] text-xs font-bold transition-all shadow-sm"
          >
            <Cpu className="w-4 h-4" />
            <span>Launch OR-Tools MILP Solver</span>
          </NavLink>
        </div>
      </div>

      {/* Summary KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
          <div className="text-xs font-semibold text-slate-400">Total Actionable Recommendations</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {recommendations.length} SKUs
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {recommendations.filter(r => r.urgency === 'CRITICAL').length} urgent critical stockout lines
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
          <div className="text-xs font-semibold text-slate-400">Total Recommended Investment</div>
          <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
            ₹{totalProcurementSpend.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Calculated across optimal vendor price points
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
          <div className="text-xs font-semibold text-slate-400">Identified Procurement Savings</div>
          <div className="text-2xl font-extrabold text-lime-600 dark:text-[#a3e635] mt-1">
            ₹{totalPotentialSavings.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Versus non-optimized default sourcing
          </div>
        </div>
      </div>

      {/* Recommendations Feed with Explainable AI Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Filter Urgency:</span>
            <button
              onClick={() => setFilterUrgency('')}
              className={`px-3 py-1 rounded-xl text-xs font-bold ${!filterUrgency ? 'bg-[#1b3b32] text-[#a3e635]' : 'bg-slate-100 dark:bg-[#182622] text-slate-600'}`}
            >
              All ({recommendations.length})
            </button>
            <button
              onClick={() => setFilterUrgency('CRITICAL')}
              className={`px-3 py-1 rounded-xl text-xs font-bold ${filterUrgency === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-[#182622] text-slate-600'}`}
            >
              Critical Only
            </button>
            <button
              onClick={() => setFilterUrgency('HIGH')}
              className={`px-3 py-1 rounded-xl text-xs font-bold ${filterUrgency === 'HIGH' ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-[#182622] text-slate-600'}`}
            >
              High Only
            </button>
          </div>

          <button onClick={fetchRecommendations} className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center text-emerald-600">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
        ) : filteredRecs.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-[#141f1c] rounded-2xl border border-slate-200 dark:border-[#20332c] text-slate-400 text-xs">
            No active recommendations for the selected filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredRecs.map((rec) => {
              const isCrit = rec.urgency === 'CRITICAL';
              return (
                <div
                  key={rec.id}
                  className="p-6 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                        isCrit ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {isCrit ? 'CRIT' : 'HIGH'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                            {rec.product_name}
                          </h3>
                          <span className="text-xs font-medium text-slate-400">({rec.sku})</span>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-bold">
                            {rec.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Current Stock: <strong className="text-slate-800 dark:text-slate-200">{rec.current_stock}</strong> | Reorder Point: <strong>{rec.reorder_point}</strong> | Safety Buffer: <strong>{rec.safety_stock}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <div className="p-2.5 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-right">
                        <span className="text-[10px] text-slate-400 block font-normal">Recommended Order</span>
                        <span className="text-base font-black text-emerald-800 dark:text-emerald-300">
                          {rec.recommended_qty} units
                        </span>
                      </div>

                      <div className="p-2.5 px-4 rounded-xl bg-slate-50 dark:bg-[#182622] text-right">
                        <span className="text-[10px] text-slate-400 block font-normal">Optimal Supplier</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {rec.recommended_supplier_name}
                        </span>
                      </div>

                      <div className="p-2.5 px-4 rounded-xl bg-slate-50 dark:bg-[#182622] text-right">
                        <span className="text-[10px] text-slate-400 block font-normal">Estimated Cost</span>
                        <span className="text-base font-black text-slate-900 dark:text-white">
                          ₹{rec.estimated_cost.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <button
                        onClick={() => handleConvertToPo(rec.id)}
                        disabled={convertingId === rec.id}
                        className="px-4 py-3 rounded-xl bg-[#1b3b32] hover:bg-[#152e27] text-[#a3e635] font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
                      >
                        <FileText className="w-4 h-4" />
                        <span>{convertingId === rec.id ? 'Generating PO...' : 'Create Purchase Order'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Explainable AI ("WHY?") Section */}
                  <div className="mt-4 pt-2">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WHY DID THE AI RECOMMEND THIS PURCHASE?</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {rec.rationale.map((bullet, bIdx) => (
                        <div
                          key={bIdx}
                          className="flex items-start gap-2 p-2.5 rounded-xl bg-[#f8faf8] dark:bg-[#172420] text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-[#20332c]"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span className="leading-snug">{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
