import React, { useState, useEffect } from 'react';
import {
  FileText, Plus, CheckCircle2, Clock, Truck, XCircle, RefreshCw,
  Eye, Filter, ArrowRight, Download
} from 'lucide-react';
import { purchaseOrdersApi } from '../services/api';
import { PurchaseOrder } from '../types';

export const PurchaseOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedPo, setSelectedPo] = useState<PurchaseOrder | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await purchaseOrdersApi.list(statusFilter || undefined);
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      await purchaseOrdersApi.updateStatus(id, newStatus);
      fetchOrders();
      if (selectedPo && selectedPo.id === id) {
        const updated = await purchaseOrdersApi.getDetails(id);
        setSelectedPo(updated);
      }
    } catch (e) {
      alert("Error updating order status.");
    }
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'Received':
        return <span className="badge-pill badge-green">Received</span>;
      case 'Ordered':
        return <span className="badge-pill badge-blue">Ordered / In-Transit</span>;
      case 'Approved':
        return <span className="badge-pill badge-amber">Approved</span>;
      case 'Submitted':
        return <span className="badge-pill badge-amber">Submitted</span>;
      case 'Cancelled':
        return <span className="badge-pill badge-red">Cancelled</span>;
      default:
        return <span className="text-xs text-slate-500 font-bold">{st}</span>;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Purchase Orders & Procurement Lifecycle
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Managing purchase approvals, dispatch tracking, vendor receipt verification, and automatic stock updates
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:text-emerald-700"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['', 'Submitted', 'Approved', 'Ordered', 'Received', 'Cancelled'].map(st => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              statusFilter === st
                ? 'bg-[#1b3b32] text-[#a3e635]'
                : 'bg-white dark:bg-[#141f1c] border border-slate-200 dark:border-[#20332c] text-slate-600 dark:text-slate-300'
            }`}
          >
            {st === '' ? 'All Orders' : st}
          </button>
        ))}
      </div>

      {/* Orders Master Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
        {loading ? (
          <div className="py-12 flex justify-center text-emerald-600">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No purchase orders found for the current status.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">PO Number</th>
                  <th className="pb-3">Vendor / Supplier</th>
                  <th className="pb-3">Order Date</th>
                  <th className="pb-3">Expected Delivery</th>
                  <th className="pb-3 text-right">Total Cost</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {orders.map(po => (
                  <tr key={po.id} className="hover:bg-slate-50/50 dark:hover:bg-[#182622]/50 transition-colors">
                    <td className="py-3 font-bold text-slate-900 dark:text-white">
                      {po.po_number}
                    </td>
                    <td className="py-3 text-slate-700 dark:text-slate-300 font-medium">
                      {po.supplier_name}
                    </td>
                    <td className="py-3 text-slate-500">
                      {new Date(po.order_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-slate-500">
                      {po.expected_delivery ? new Date(po.expected_delivery).toLocaleDateString() : '3-5 Days'}
                    </td>
                    <td className="py-3 text-right font-extrabold text-slate-900 dark:text-white">
                      ₹{po.total_amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 text-center">
                      {getStatusBadge(po.status)}
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedPo(po)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#182622] hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold"
                        >
                          View Items
                        </button>
                        {po.status === 'Ordered' && (
                          <button
                            onClick={() => handleUpdateStatus(po.id, 'Received')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                          >
                            Mark Received
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PO Detail View Modal */}
      {selectedPo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-[#141f1c] rounded-2xl border border-slate-200 dark:border-[#20332c] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Purchase Order {selectedPo.po_number}
                </h3>
                <p className="text-xs text-slate-400">
                  Vendor: <strong>{selectedPo.supplier_name}</strong> | Status: {getStatusBadge(selectedPo.status)}
                </p>
              </div>
              <button onClick={() => setSelectedPo(null)} className="text-slate-400">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="font-bold text-slate-700 dark:text-slate-300">
                Ordered Products & Quantities:
              </div>

              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {selectedPo.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{item.product_name}</div>
                      <div className="text-[10px] text-slate-400">{item.product_sku}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900 dark:text-white">{item.quantity} units @ ₹{item.unit_cost}</div>
                      <div className="text-emerald-600 font-black">₹{item.total_cost.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-50 dark:bg-[#182622] rounded-xl flex justify-between items-center text-sm font-extrabold">
                <span>Total Order Cost:</span>
                <span className="text-emerald-700 dark:text-emerald-400">₹{selectedPo.total_amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-2">
                {selectedPo.status === 'Submitted' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedPo.id, 'Approved')}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
                  >
                    Approve PO
                  </button>
                )}
                {selectedPo.status === 'Approved' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedPo.id, 'Ordered')}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs"
                  >
                    Send to Vendor (Order)
                  </button>
                )}
                {selectedPo.status === 'Ordered' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedPo.id, 'Received')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                  >
                    Receive Stock (Auto Update Inventory)
                  </button>
                )}
              </div>

              <button
                onClick={() => setSelectedPo(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-[#182622] text-slate-700 dark:text-slate-200 font-bold text-xs"
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
