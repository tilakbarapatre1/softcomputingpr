import React from 'react';
import { TrendingUp, TrendingDown, MoreVertical, Wifi } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  featured?: boolean;
  featuredHolder?: string;
  badgeText?: string;
  badgeColor?: 'green' | 'red' | 'amber' | 'blue';
  className?: string;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  featured = false,
  featuredHolder = "Retail Enterprise AI",
  badgeText,
  badgeColor = 'green',
  className = '',
  onClick
}) => {
  if (featured) {
    return (
      <div
        onClick={onClick}
        className={`p-6 rounded-2xl bg-gradient-to-br from-[#1b3b32] via-[#16332b] to-[#10241e] text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[170px] ${
          onClick ? 'cursor-pointer hover:scale-[1.01] transition-transform' : ''
        } ${className}`}
      >
        {/* Subtle decorative background glow */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#a3e635]/10 rounded-full blur-2xl pointer-events-none" />
        
        {/* Card Header with icon & NFC */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#a3e635]">
              {icon || <span className="font-bold text-sm">AI</span>}
            </div>
            <span className="text-xs font-semibold text-emerald-200 tracking-wide uppercase">
              {title}
            </span>
          </div>
          <Wifi className="w-5 h-5 text-white/50 rotate-90" />
        </div>

        {/* Card Body */}
        <div className="my-3">
          <div className="text-xs text-emerald-300 font-medium mb-1">{featuredHolder}</div>
          <div className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            {value}
          </div>
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between text-[11px] text-emerald-300/80 pt-2 border-t border-white/10">
          <span>{subtitle || "Real-time AI Asset Valuation"}</span>
          <span className="font-mono text-emerald-400 font-bold">ACTIVE</span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs flex flex-col justify-between transition-all ${
        onClick ? 'cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-800 hover:shadow-sm' : ''
      } ${className}`}
    >
      {/* Top row: icon + more button or badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-xl bg-[#f0f5f2] dark:bg-[#1b2b26] flex items-center justify-center text-[#1b3b32] dark:text-[#a3e635]">
          {icon}
        </div>
        
        {trend && (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
              trend.isPositive
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
            }`}
          >
            {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend.value}
          </span>
        )}

        {badgeText && !trend && (
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
              badgeColor === 'green'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : badgeColor === 'red'
                ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                : badgeColor === 'amber'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
            }`}
          >
            {badgeText}
          </span>
        )}
      </div>

      {/* Main Metric Value */}
      <div>
        <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {value}
        </div>
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
          {title}
        </div>
      </div>

      {/* Optional subtext */}
      {subtitle && (
        <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          {subtitle}
        </div>
      )}
    </div>
  );
};
