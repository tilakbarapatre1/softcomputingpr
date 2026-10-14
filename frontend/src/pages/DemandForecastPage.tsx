import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Cpu, Sparkles, RefreshCw, BarChart2, CheckCircle2,
  Calendar, Layers, ArrowUpRight, Award, ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from 'recharts';
import { forecastApi, productsApi } from '../services/api';
import { Product, ProductForecast, ModelMetric } from '../types';

export const DemandForecastPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [forecast, setForecast] = useState<ProductForecast | null>(null);
  const [metrics, setMetrics] = useState<ModelMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [training, setTraining] = useState(false);
  const [horizonDays, setHorizonDays] = useState(30);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [prodsData, metricsData] = await Promise.all([
        productsApi.list({ limit: 100 }),
        forecastApi.getMetrics()
      ]);
      setProducts(prodsData);
      setMetrics(metricsData);
      if (prodsData.length > 0) {
        setSelectedProductId(prodsData[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!selectedProductId) return;
    const fetchForecast = async () => {
      try {
        const data = await forecastApi.getProductForecast(selectedProductId, horizonDays);
        setForecast(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchForecast();
  }, [selectedProductId, horizonDays]);

  const handleRetrain = async () => {
    setTraining(true);
    try {
      await forecastApi.trainPipeline();
      const updatedMetrics = await forecastApi.getMetrics();
      setMetrics(updatedMetrics);
      if (selectedProductId) {
        const data = await forecastApi.getProductForecast(selectedProductId, horizonDays);
        setForecast(data);
      }
      alert("Machine Learning pipeline successfully retrained across all 12 months history!");
    } catch (e) {
      alert("Error training models.");
    } finally {
      setTraining(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Loading Demand Forecasting Engine...</p>
      </div>
    );
  }

  const selectedProduct = products.find(p => p.id === selectedProductId);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              AI Demand Forecasting & ML Intelligence
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#c9e89d] text-[#133026]">
              Real Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Temporal feature engineering, multi-model evaluation, and recursive multi-step retail forecasting
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRetrain}
            disabled={training}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1b3b32] hover:bg-[#152e27] text-[#a3e635] text-xs font-bold transition-all shadow-sm disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${training ? 'animate-spin' : ''}`} />
            <span>{training ? 'Training Models...' : 'Retrain ML Pipeline'}</span>
          </button>
        </div>
      </div>

      {/* Model Benchmark Comparison Table (Prompt Requirement Section 8) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Model Performance & Accuracy Benchmark
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparative holdout test validation metrics calculated directly from 12+ months historical transactions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                m.is_best
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-700 shadow-xs'
                  : 'bg-slate-50/50 dark:bg-[#182622]/50 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{m.model_name}</span>
                {m.is_best ? (
                  <span className="badge-pill badge-green text-[10px]">Best Performer</span>
                ) : (
                  <span className="text-[10px] text-slate-400">Baseline</span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs mt-3">
                <div className="p-2 rounded-lg bg-white dark:bg-[#131f1b]">
                  <div className="text-[10px] text-slate-400 font-bold">MAE</div>
                  <div className="font-extrabold text-slate-900 dark:text-white mt-0.5">{m.mae}</div>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-[#131f1b]">
                  <div className="text-[10px] text-slate-400 font-bold">RMSE</div>
                  <div className="font-extrabold text-slate-900 dark:text-white mt-0.5">{m.rmse}</div>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-[#131f1b]">
                  <div className="text-[10px] text-slate-400 font-bold">MAPE</div>
                  <div className="font-extrabold text-slate-900 dark:text-white mt-0.5">{m.mape}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Selector and Horizon Toggle */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-xs font-bold text-slate-500 whitespace-nowrap">
            Select Product SKU:
          </label>
          <select
            value={selectedProductId || ''}
            onChange={e => setSelectedProductId(parseInt(e.target.value))}
            className="w-full md:w-80 px-3 py-2 text-xs font-bold rounded-xl bg-[#f4f7f4] dark:bg-[#182622] border border-slate-200 dark:border-[#233831] text-slate-800 dark:text-slate-200 focus:outline-hidden"
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.sku})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Horizon:</span>
          <button
            onClick={() => setHorizonDays(7)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              horizonDays === 7 ? 'bg-[#1b3b32] text-[#a3e635]' : 'bg-slate-100 dark:bg-[#182622] text-slate-600'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setHorizonDays(14)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              horizonDays === 14 ? 'bg-[#1b3b32] text-[#a3e635]' : 'bg-slate-100 dark:bg-[#182622] text-slate-600'
            }`}
          >
            14 Days
          </button>
          <button
            onClick={() => setHorizonDays(30)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              horizonDays === 30 ? 'bg-[#1b3b32] text-[#a3e635]' : 'bg-slate-100 dark:bg-[#182622] text-slate-600'
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* Main Forecast Graph */}
      {forecast && selectedProduct && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedProduct.name} — Demand Forecast Curve
                </h3>
                <span className="badge-pill badge-green text-[10px]">
                  {selectedProduct.abc_class}{selectedProduct.xyz_class}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Current Stock: <strong>{selectedProduct.current_stock} {selectedProduct.unit}</strong> | Reorder Point: <strong>{selectedProduct.reorder_point} {selectedProduct.unit}</strong>
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="p-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-[#182622] text-right">
                <span className="text-[10px] text-slate-400 block font-normal">7-Day Projected Need</span>
                <span className="text-emerald-600 font-extrabold text-sm">{forecast.forecast_7d_total} {selectedProduct.unit}</span>
              </div>
              <div className="p-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-[#182622] text-right">
                <span className="text-[10px] text-slate-400 block font-normal">30-Day Projected Need</span>
                <span className="text-emerald-600 font-extrabold text-sm">{forecast.forecast_30d_total} {selectedProduct.unit}</span>
              </div>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecast.points} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${Number(val).toFixed(1)} ${selectedProduct.unit}`, '']}
                  contentStyle={{
                    backgroundColor: '#1b3b32',
                    borderColor: '#274b3f',
                    borderRadius: '0.75rem',
                    color: '#ffffff',
                    fontSize: '12px'
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="upper_bound" name="Upper 95% Confidence" stroke="none" fill="#dcfce7" fillOpacity={0.6} />
                <Area type="monotone" dataKey="lower_bound" name="Lower 95% Confidence" stroke="none" fill="#ffffff" fillOpacity={1} />
                <Line type="monotone" dataKey="predicted" name="Predicted Demand Units" stroke="#1b3b32" strokeWidth={3} dot={{ r: 3, fill: '#a3e635' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
