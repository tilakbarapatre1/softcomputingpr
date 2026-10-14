import React from 'react';
import {
  FileText, Download, Sparkles, Package, Truck, Cpu,
  BarChart3, CheckCircle2, ArrowDownToLine
} from 'lucide-react';
import { reportsApi } from '../services/api';

export const ReportsPage: React.FC = () => {
  const reportsList = [
    {
      type: 'inventory',
      title: 'Master Inventory Valuation Report',
      description: 'Comprehensive inventory ledger including unit costs, current stock, reorder levels, safety buffers, ABC classes, and total valuation in INR.',
      icon: <Package className="w-6 h-6 text-emerald-600" />,
      format: 'CSV / Excel'
    },
    {
      type: 'recommendations',
      title: 'AI Procurement Recommendations & XAI Rationale',
      description: 'AI-generated replenishment orders with optimal supplier quotes, estimated expenditures, and Explainable AI reasoning bullets.',
      icon: <Sparkles className="w-6 h-6 text-lime-600" />,
      format: 'CSV / Excel'
    },
    {
      type: 'procurement',
      title: 'Purchase Orders & Vendor Spend Ledger',
      description: 'Full historical audit trail of purchase orders, status progression (Submitted/Received), budget allocations, and totals.',
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      format: 'CSV / Excel'
    },
    {
      type: 'suppliers',
      title: 'Supplier Performance & Reliability Audit',
      description: 'Vendor scorecards comparing on-time delivery rates, quality compliance, fulfillment reliability, and composite ratings.',
      icon: <Truck className="w-6 h-6 text-purple-600" />,
      format: 'CSV / Excel'
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Executive Reports & Data Export Center
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Generate audit-ready CSV, Excel, and analytics extracts for retail stakeholders
        </p>
      </div>

      {/* Reports Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportsList.map((rep) => (
          <div
            key={rep.type}
            className="p-6 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#f0f5f2] dark:bg-[#182622] flex items-center justify-center flex-shrink-0">
                  {rep.icon}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                    {rep.title}
                  </h3>
                  <span className="inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mt-1">
                    {rep.format}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {rep.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Live database sync</span>
              <a
                href={reportsApi.exportUrl(rep.type)}
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1b3b32] hover:bg-[#152e27] text-[#a3e635] text-xs font-bold transition-colors shadow-xs"
              >
                <ArrowDownToLine className="w-4 h-4" />
                <span>Download Report</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
