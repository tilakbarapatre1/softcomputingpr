import React, { useState, useEffect } from 'react';
import {
  Truck, Star, ShieldCheck, Clock, CheckCircle2, RefreshCw,
  Plus, Search, ArrowRight, MapPin, Mail, Phone, Award
} from 'lucide-react';
import { suppliersApi } from '../services/api';
import { Supplier } from '../types';

export const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const data = await suppliersApi.list();
      setSuppliers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleViewSupplier = async (id: number) => {
    try {
      const data = await suppliersApi.getDetails(id);
      setSelectedSupplier(data);
      setIsDetailModalOpen(true);
    } catch (e) {
      alert("Error fetching supplier details.");
    }
  };

  const filteredSuppliers = suppliers.filter(
    s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || (s.city && s.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Supplier Intelligence & Vendor Scoring
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#c9e89d] text-[#133026]">
              Composite Performance
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluating vendor performance by lead-time reliability (40%), quality compliance (30%), and on-time delivery rates (30%)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSuppliers}
            className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:text-emerald-700"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search suppliers by name or city..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#f4f7f4] dark:bg-[#182622] border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-[#121c19] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Supplier Grid */}
      {loading ? (
        <div className="py-12 flex justify-center text-emerald-600">
          <RefreshCw className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((s, idx) => (
            <div
              key={s.id}
              className="p-6 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1b3b32] to-[#347866] text-[#a3e635] flex items-center justify-center font-bold text-sm shadow-xs">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                        {s.name}
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{s.city || 'India'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-black text-emerald-700 dark:text-emerald-400">
                      {s.overall_score}%
                    </span>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase">
                      Overall Score
                    </span>
                  </div>
                </div>

                {/* Metric Bars */}
                <div className="space-y-2 mt-4 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>On-Time Delivery Rate:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{s.on_time_rate}%</strong>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${s.on_time_rate}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>Quality Compliance:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{s.quality_score}%</strong>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${s.quality_score}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>Fulfillment Reliability:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{s.reliability_score}%</strong>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full" style={{ width: `${s.reliability_score}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Terms: <strong>{s.payment_terms}</strong></span>
                <button
                  onClick={() => handleViewSupplier(s.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#182622] dark:hover:bg-[#223830] text-slate-800 dark:text-slate-200 font-bold transition-colors"
                >
                  View Products
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Supplier Detail Modal */}
      {isDetailModalOpen && selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-[#141f1c] rounded-2xl border border-slate-200 dark:border-[#20332c] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {selectedSupplier.name}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedSupplier.city} • Terms: {selectedSupplier.payment_terms} • Overall Rating: {selectedSupplier.overall_score}%
                </p>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-slate-400">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="font-bold text-slate-700 dark:text-slate-300">
                Products Supplied ({selectedSupplier.products_count} SKUs):
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2">
                {selectedSupplier.products.map((p: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-[#182622] flex items-center justify-between border border-slate-100 dark:border-[#20332c]"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{p.product_name}</div>
                      <div className="text-[10px] text-slate-400">{p.sku} • {p.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-emerald-700 dark:text-emerald-400">₹{p.unit_cost}</div>
                      <div className="text-[10px] text-slate-400">Lead: {p.lead_time_days}d • MOQ: {p.moq}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#1b3b32] text-[#a3e635] font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
