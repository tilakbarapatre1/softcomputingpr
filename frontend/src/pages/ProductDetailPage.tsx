import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import {
  Package, TrendingUp, Cpu, Truck, ShieldAlert, AlertTriangle,
  Sparkles, CheckCircle2, ArrowLeft, RefreshCw, BarChart2, Star
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area, XAxis, YAxis,
  Tooltip, Legend, CartesianGrid
} from 'recharts';
import { productsApi, forecastApi } from '../services/api';
import { ProductForecast } from '../types';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [forecast, setForecast] = useState<ProductForecast | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const [prodData, fcastData] = await Promise.all([
          productsApi.getDetails(parseInt(id)),
          forecastApi.getProductForecast(parseInt(id), 30)
        ]);
        setProduct(prodData);
        setForecast(fcastData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading || !product) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Loading Product Intelligence Data...</p>
      </div>
    );
  }

  const isCritical = product.stockout_risk === 'CRITICAL';
  const isHigh = product.stockout_risk === 'HIGH';

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Back Button & Title Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <NavLink
            to="/inventory"
            className="w-8 h-8 rounded-xl bg-white dark:bg-[#141f1c] border border-slate-200 dark:border-[#233831] flex items-center justify-center text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
          </NavLink>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {product.name}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {product.abc_class}{product.xyz_class} Classification
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              SKU: {product.sku} • Category: {product.category_name} • Unit: {product.unit}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NavLink
            to="/procurement/optimizer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1b3b32] hover:bg-[#152e27] text-[#a3e635] text-xs font-bold transition-colors"
          >
            <Cpu className="w-4 h-4" />
            <span>Optimize Procurement</span>
          </NavLink>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
          <div className="text-xs font-semibold text-slate-400">Current Stock Level</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {product.current_stock} <span className="text-xs font-medium text-slate-400">{product.unit}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Valuation: ₹{(product.current_stock * product.unit_cost).toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
          <div className="text-xs font-semibold text-slate-400">Reorder Point / Safety</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {product.reorder_point} <span className="text-xs font-medium text-slate-400">/ {product.safety_stock} buffer</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Lead Time: {product.lead_time_days} days
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
          <div className="text-xs font-semibold text-slate-400">Daily Demand Velocity</div>
          <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
            ~{product.daily_demand} <span className="text-xs font-medium text-slate-400">{product.unit}/day</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            30-Day Projection: ~{product.monthly_demand} {product.unit}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
          <div className="text-xs font-semibold text-slate-400">Days Until Stockout</div>
          <div className={`text-2xl font-extrabold mt-1 ${isCritical ? 'text-red-600' : isHigh ? 'text-amber-600' : 'text-emerald-600'}`}>
            {product.days_until_stockout} Days
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Risk: <strong className={isCritical ? 'text-red-500' : isHigh ? 'text-amber-500' : 'text-emerald-500'}>{product.stockout_risk}</strong>
          </div>
        </div>
      </div>

      {/* Demand Forecast Chart */}
      {forecast && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  30-Day Step-Ahead Demand Forecast
                </h3>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold px-2 py-0.5 rounded-full">
                  Model: {forecast.model_used}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Predictive regression curve with ±95% uncertainty confidence intervals
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-300">
              <span>7d Demand: <strong className="text-emerald-600">{forecast.forecast_7d_total} {product.unit}</strong></span>
              <span>30d Demand: <strong className="text-emerald-600">{forecast.forecast_30d_total} {product.unit}</strong></span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecast.points} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1b3b32',
                    borderColor: '#274b3f',
                    borderRadius: '0.75rem',
                    color: '#ffffff',
                    fontSize: '12px'
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="upper_bound" name="Upper Confidence Bound" stroke="none" fill="#dcfce7" fillOpacity={0.6} />
                <Area type="monotone" dataKey="lower_bound" name="Lower Confidence Bound" stroke="none" fill="#ffffff" fillOpacity={1} />
                <Line type="monotone" dataKey="predicted" name="Predicted Demand" stroke="#1b3b32" strokeWidth={2.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Supplier Comparison Matrix for this Product */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Supplier Quotes & Reliability Comparison
            </h3>
            <p className="text-xs text-slate-400">Competing verified vendor offers for this SKU</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Supplier Name</th>
                <th className="pb-3">City / Hub</th>
                <th className="pb-3 text-right">Unit Quote</th>
                <th className="pb-3 text-right">Lead Time</th>
                <th className="pb-3 text-right">MOQ</th>
                <th className="pb-3 text-center">On-Time Score</th>
                <th className="pb-3 text-center">Reliability</th>
                <th className="pb-3 text-center">AI Choice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {product.suppliers?.map((s: any, idx: number) => {
                const isBest = idx === 0; // Sorted by unit cost
                return (
                  <tr key={idx} className={`hover:bg-slate-50/50 dark:hover:bg-[#182622]/50 ${isBest ? 'bg-emerald-50/30 dark:bg-emerald-950/20' : ''}`}>
                    <td className="py-3 font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {isBest && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />}
                      <span>{s.supplier_name}</span>
                    </td>
                    <td className="py-3 text-slate-500">{s.city}</td>
                    <td className="py-3 text-right font-extrabold text-slate-900 dark:text-white">
                      ₹{s.unit_cost.toFixed(2)}
                    </td>
                    <td className="py-3 text-right font-bold text-slate-600 dark:text-slate-300">
                      {s.lead_time_days} days
                    </td>
                    <td className="py-3 text-right text-slate-600 dark:text-slate-300">
                      {s.moq} {product.unit}
                    </td>
                    <td className="py-3 text-center font-bold text-slate-700 dark:text-slate-300">
                      {s.on_time_rate}%
                    </td>
                    <td className="py-3 text-center font-bold text-emerald-700 dark:text-emerald-400">
                      {s.reliability_score}%
                    </td>
                    <td className="py-3 text-center">
                      {isBest ? (
                        <span className="badge-pill badge-green">Recommended</span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Secondary</span>
                      )}
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
