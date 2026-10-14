import React, { useState, useEffect } from 'react';
import {
  Bell, AlertTriangle, ShieldAlert, CheckCircle2, RefreshCw,
  Package, Clock, Check
} from 'lucide-react';
import { inventoryApi } from '../services/api';
import { InventoryAlert } from '../types';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<string>('');

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const data = await inventoryApi.getAlerts(false, filterSeverity || undefined);
      setAlerts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [filterSeverity]);

  const handleMarkRead = async (id: number) => {
    try {
      await inventoryApi.markAlertRead(id);
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Inventory & Procurement Alert Center
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time automated warnings for stockout risks, overstocked lines, expiring batches, and supplier delays
          </p>
        </div>

        <button
          onClick={fetchAlerts}
          className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:text-emerald-700"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Alerts
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['', 'CRITICAL', 'HIGH', 'MEDIUM'].map(sev => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterSeverity === sev
                ? 'bg-[#1b3b32] text-[#a3e635]'
                : 'bg-white dark:bg-[#141f1c] border border-slate-200 dark:border-[#20332c] text-slate-600'
            }`}
          >
            {sev === '' ? 'All Severities' : sev}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-12 flex justify-center text-emerald-600">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-[#141f1c] rounded-2xl border border-slate-200 dark:border-[#20332c] text-slate-400 text-xs">
            No active alerts matching the selected criteria.
          </div>
        ) : (
          alerts.map(a => (
            <div
              key={a.id}
              className={`p-4 px-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                a.is_read
                  ? 'bg-[#fafbfa] dark:bg-[#121c19] border-slate-200 dark:border-slate-800/80 opacity-60'
                  : a.severity === 'CRITICAL'
                  ? 'bg-red-50/60 dark:bg-red-950/20 border-red-200 dark:border-red-900/60'
                  : a.severity === 'HIGH'
                  ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
                  : 'bg-white dark:bg-[#141f1c] border-slate-200 dark:border-[#20332c]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 ${
                  a.severity === 'CRITICAL' ? 'bg-red-600 text-white' : a.severity === 'HIGH' ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'
                }`}>
                  <AlertTriangle className="w-4 h-4" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                      {a.alert_type.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(a.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                    {a.message}
                  </p>
                </div>
              </div>

              {!a.is_read && (
                <button
                  onClick={() => handleMarkRead(a.id)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#182622] hover:bg-slate-100 dark:hover:bg-[#223830] text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-[#20332c] flex items-center gap-1 flex-shrink-0"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark Read</span>
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
