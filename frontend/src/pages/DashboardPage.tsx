import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Boxes, Package, AlertTriangle, TrendingUp, Sparkles, Cpu,
  CheckCircle2, ArrowUpRight, DollarSign, Clock, Truck, ChevronRight,
  ShieldAlert, RefreshCw, BarChart2, PieChart
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  Tooltip, Legend, CartesianGrid, PieChart as RechartPie, Pie, Cell
} from 'recharts';

import { KpiCard } from '../components/common/KpiCard';
import { dashboardApi } from '../services/api';
import { DashboardSummary } from '../types';

const HEALTH_COLORS = {
  healthy: '#22c55e',
  low_stock: '#eab308',
  critical: '#ef4444',
  overstock: '#3b82f6'
};

export const DashboardPage: React.FC<{ onOpenCopilot: () => void }> = ({ onOpenCopilot }) => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const data = await dashboardApi.getSummary();
      setSummary(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading || !summary) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Loading Smart Inventory AI Intelligence...</p>
      </div>
    );
  }

  // Transform health distribution for donut chart
  const healthChartData = [
    { name: 'Healthy Stock', value: summary.health_distribution.healthy, color: HEALTH_COLORS.healthy },
    { name: 'Low Stock Alert', value: summary.health_distribution.low_stock, color: HEALTH_COLORS.low_stock },
    { name: 'Critical Stockout Risk', value: summary.health_distribution.critical, color: HEALTH_COLORS.critical },
    { name: 'Overstocked Items', value: summary.health_distribution.overstock, color: HEALTH_COLORS.overstock },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner: Dynamic AI Intelligence Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summary.ai_insights.map((insight, idx) => (
          <NavLink
            key={idx}
            to={insight.action}
            className="p-3.5 px-4 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] hover:border-emerald-400 dark:hover:border-emerald-700 shadow-xs hover:shadow-md transition-all flex items-start justify-between group"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    insight.color === 'red'
                      ? 'bg-red-500 ring-2 ring-red-200 dark:ring-red-950'
                      : insight.color === 'amber'
                      ? 'bg-amber-500 ring-2 ring-amber-200 dark:ring-amber-950'
                      : insight.color === 'emerald'
                      ? 'bg-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-950'
                      : 'bg-blue-500 ring-2 ring-blue-200 dark:ring-blue-950'
                  }`}
                />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {insight.badge}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                {insight.text}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors flex-shrink-0 mt-1" />
          </NavLink>
        ))}
      </div>

      {/* Top Executive KPI Row matching Reference Dashboard Style */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Featured Emerald Card (Ref style) */}
        <div className="lg:col-span-4">
          <KpiCard
            featured
            title="Total Inventory Value"
            value={`₹${summary.inventory_value.toLocaleString('en-IN')}`}
            featuredHolder="Retail Operations Portfolio"
            subtitle={`${summary.total_products} active product lines under management`}
            icon={<DollarSign className="w-4 h-4" />}
          />
        </div>

        {/* 3 Metric Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KpiCard
            title="Low Stock & Critical"
            value={summary.low_stock_count}
            subtitle={`${summary.stockout_risk_count} in immediate critical zone`}
            icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
            trend={{ value: "+12%", isPositive: false }}
          />

          <KpiCard
            title="Overstocked Lines"
            value={summary.overstock_count}
            subtitle="Identified capital locked in excess stock"
            icon={<Package className="w-5 h-5 text-blue-600" />}
            trend={{ value: "-4.5%", isPositive: true }}
          />

          <KpiCard
            title="Potential Savings"
            value={`₹${summary.potential_savings.toLocaleString('en-IN')}`}
            subtitle="Via Google OR-Tools multi-supplier allocation"
            icon={<Sparkles className="w-5 h-5 text-emerald-600" />}
            badgeText="Optimized"
            badgeColor="green"
          />
        </div>
      </div>

      {/* Main Mid Section: Cashflow / Demand Chart + Donut Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales vs Predicted Demand Chart (Ref Cashflow style) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Demand Forecasting & Spend Intelligence
                </h3>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold px-2 py-0.5 rounded-full">
                  XGBoost + Ridge
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Monthly actual sales vs machine learning predicted demand & procurement spend
              </p>
            </div>

            <div className="flex items-center gap-2">
              <NavLink
                to="/demand-intelligence/forecast"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>Full Forecast</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </NavLink>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.monthly_sales_vs_forecast} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                  contentStyle={{
                    backgroundColor: '#1b3b32',
                    borderColor: '#274b3f',
                    borderRadius: '0.75rem',
                    color: '#ffffff',
                    fontSize: '12px'
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="actual_sales" name="Actual Sales (₹)" fill="#1b3b32" radius={[6, 6, 0, 0]} />
                <Bar dataKey="predicted_demand" name="ML Predicted Demand (₹)" fill="#a3e635" radius={[6, 6, 0, 0]} />
                <Bar dataKey="procurement_spend" name="Procurement Budget (₹)" fill="#94a3b8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Health Donut & Category Distribution */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Inventory Health
              </h3>
              <NavLink to="/inventory" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
                View All
              </NavLink>
            </div>

            {/* Donut Chart */}
            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartPie>
                  <Pie
                    data={healthChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {healthChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1b3b32',
                      borderColor: '#274b3f',
                      borderRadius: '0.75rem',
                      color: '#ffffff',
                      fontSize: '11px'
                    }}
                  />
                </RechartPie>
              </ResponsiveContainer>
              <div className="absolute text-center pointer-events-none">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {summary.total_products}
                </span>
                <span className="block text-[10px] font-semibold text-slate-400 uppercase">
                  Products
                </span>
              </div>
            </div>

            {/* Legend breakdown list */}
            <div className="space-y-2 mt-2">
              {healthChartData.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {item.value} items ({Math.round((item.value / summary.total_products) * 100)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <button
              onClick={onOpenCopilot}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-50 to-lime-50 dark:from-[#162923] dark:to-[#1b3b32] text-emerald-900 dark:text-[#a3e635] text-xs font-bold flex items-center justify-center gap-2 border border-emerald-200/60 dark:border-emerald-800/40"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Copilot for Inventory Action</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Top Selling Items Table + Recent PO Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Selling Products Table */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Top Revenue Drivers & Sales Velocity
              </h3>
              <p className="text-xs text-slate-400">Products generating highest sales volume and retail demand</p>
            </div>
            <NavLink to="/inventory" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
              Manage Catalog
            </NavLink>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Product</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold text-right">Units Sold</th>
                  <th className="pb-3 font-semibold text-right">Total Revenue</th>
                  <th className="pb-3 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {summary.top_selling_products.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-[#182622]/50 transition-colors">
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">
                      <div>{p.name}</div>
                      <div className="text-[10px] text-slate-400">{p.sku}</div>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">{p.category}</td>
                    <td className="py-3 text-right font-bold text-slate-800 dark:text-slate-200">{p.units_sold.toLocaleString()}</td>
                    <td className="py-3 text-right font-extrabold text-emerald-700 dark:text-emerald-400">
                      ₹{p.revenue.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        High Velocity
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Timeline Widget (Ref style) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Procurement Orders
            </h3>
            <NavLink to="/procurement/purchase-orders" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
              All Orders
            </NavLink>
          </div>

          <div className="space-y-4">
            {summary.recent_activities.map((act) => (
              <div key={act.id} className="flex items-start gap-3 text-xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-[#1b2c26] text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white truncate">{act.title}</span>
                    <span className="text-[10px] text-slate-400 flex-shrink-0">{act.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    {act.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>Procurement Pipeline Status</span>
            <span className="text-emerald-600 font-extrabold">All Healthy</span>
          </div>
        </div>
      </div>
    </div>
  );
};
