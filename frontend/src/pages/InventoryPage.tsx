import React, { useState, useEffect } from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import {
  Package, Search, Filter, Plus, Download, Upload, ArrowUpDown,
  AlertTriangle, CheckCircle2, ChevronRight, Edit3, Trash2, Eye,
  Sliders, RefreshCw, X
} from 'lucide-react';
import { productsApi, inventoryApi } from '../services/api';
import { Product, Category } from '../types';

export const InventoryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('');
  const [selectedAbc, setSelectedAbc] = useState<string>('');
  const [selectedXyz, setSelectedXyz] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>(searchParams.get('status') || '');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedProductForAdjust, setSelectedProductForAdjust] = useState<Product | null>(null);
  const [adjustQty, setAdjustQty] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState('Physical Stock Audit Count');

  // Form for new product
  const [newProd, setNewProd] = useState<Partial<Product>>({
    name: '',
    sku: '',
    category_id: 1,
    unit: 'units',
    unit_cost: 100,
    selling_price: 130,
    current_stock: 50,
    reorder_point: 40,
    safety_stock: 15,
    lead_time_days: 3,
    abc_class: 'B',
    xyz_class: 'Y'
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [prodsData, catsData] = await Promise.all([
        productsApi.list({
          search: searchTerm || undefined,
          category_id: selectedCat ? parseInt(selectedCat) : undefined,
          abc_class: selectedAbc || undefined,
          xyz_class: selectedXyz || undefined,
          stock_status: selectedStatus || undefined
        }),
        productsApi.getCategories()
      ]);
      setProducts(prodsData);
      setCategories(catsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCat, selectedAbc, selectedXyz, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleQuickAdjust = async () => {
    if (!selectedProductForAdjust) return;
    try {
      await inventoryApi.adjustStock(selectedProductForAdjust.id, adjustQty, adjustReason);
      setIsAdjustModalOpen(false);
      setSelectedProductForAdjust(null);
      setAdjustQty(0);
      fetchProducts();
    } catch (e) {
      alert("Error adjusting stock.");
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await productsApi.create(newProd);
      setIsAddModalOpen(false);
      fetchProducts();
    } catch (e) {
      alert("Error creating product.");
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Inventory Management
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time stock ledger, safety thresholds, ABC-XYZ classes, and multi-supplier links
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href={productsApi.exportCsvUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#141f1c] border border-slate-200 dark:border-[#233831] hover:bg-slate-50 dark:hover:bg-[#1b2b26] text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </a>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1b3b32] hover:bg-[#152e27] text-[#a3e635] text-xs font-bold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by Product Name or SKU..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#f4f7f4] dark:bg-[#182622] border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-[#121c19] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Category Filter */}
            <select
              value={selectedCat}
              onChange={e => setSelectedCat(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-[#f4f7f4] dark:bg-[#182622] border border-slate-200 dark:border-[#233831] text-slate-700 dark:text-slate-200 focus:outline-hidden"
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-[#f4f7f4] dark:bg-[#182622] border border-slate-200 dark:border-[#233831] text-slate-700 dark:text-slate-200 focus:outline-hidden"
            >
              <option value="">All Stock Levels</option>
              <option value="critical">Critical Stockout Risk</option>
              <option value="low">Low Stock</option>
              <option value="healthy">Healthy Stock</option>
              <option value="overstock">Overstocked</option>
            </select>

            {/* ABC Filter */}
            <select
              value={selectedAbc}
              onChange={e => setSelectedAbc(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-[#f4f7f4] dark:bg-[#182622] border border-slate-200 dark:border-[#233831] text-slate-700 dark:text-slate-200 focus:outline-hidden"
            >
              <option value="">ABC Class</option>
              <option value="A">Class A (High Value)</option>
              <option value="B">Class B (Medium Value)</option>
              <option value="C">Class C (Low Value)</option>
            </select>

            {/* XYZ Filter */}
            <select
              value={selectedXyz}
              onChange={e => setSelectedXyz(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-[#f4f7f4] dark:bg-[#182622] border border-slate-200 dark:border-[#233831] text-slate-700 dark:text-slate-200 focus:outline-hidden"
            >
              <option value="">XYZ Class</option>
              <option value="X">Class X (Stable Demand)</option>
              <option value="Y">Class Y (Moderate)</option>
              <option value="Z">Class Z (Volatile)</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
            >
              Filter
            </button>
          </div>
        </form>
      </div>

      {/* Products Master Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#141f1c] border border-[#e5ebe5] dark:border-[#1f332c] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Showing {products.length} Products
          </div>
          <button onClick={fetchProducts} className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:text-emerald-700">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center text-emerald-600">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No products match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">SKU & Product</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3 text-right">Current Stock</th>
                  <th className="pb-3 text-right">Reorder Point</th>
                  <th className="pb-3 text-right">Unit Cost</th>
                  <th className="pb-3 text-right">Inventory Value</th>
                  <th className="pb-3 text-center">ABC-XYZ</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {products.map(p => {
                  const isCritical = p.current_stock <= p.safety_stock;
                  const isLow = p.current_stock <= p.reorder_point && !isCritical;
                  const isOverstock = p.current_stock >= p.max_stock * 0.8;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-[#182622]/50 transition-colors">
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">
                        <NavLink to={`/inventory/product/${p.id}`} className="hover:text-emerald-600 font-bold block">
                          {p.name}
                        </NavLink>
                        <span className="text-[10px] text-slate-400">{p.sku} • {p.unit}</span>
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-300">
                        {p.category_name}
                      </td>
                      <td className="py-3 text-right">
                        <span className={`font-extrabold text-sm ${isCritical ? 'text-red-600' : isLow ? 'text-amber-600' : isOverstock ? 'text-blue-600' : 'text-slate-800 dark:text-slate-200'}`}>
                          {p.current_stock}
                        </span>
                        <div className="w-20 ml-auto mt-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isCritical ? 'bg-red-500' : isLow ? 'bg-amber-500' : isOverstock ? 'bg-blue-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(100, (p.current_stock / Math.max(1, p.reorder_point * 2)) * 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3 text-right font-bold text-slate-600 dark:text-slate-400">
                        {p.reorder_point}
                      </td>
                      <td className="py-3 text-right font-bold text-slate-700 dark:text-slate-300">
                        ₹{p.unit_cost}
                      </td>
                      <td className="py-3 text-right font-extrabold text-slate-900 dark:text-white">
                        ₹{(p.current_stock * p.unit_cost).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 text-center">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#e1f0e9] dark:bg-[#16332b] text-[#133026] dark:text-[#a3e635]">
                          {p.abc_class}{p.xyz_class}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        {isCritical ? (
                          <span className="badge-pill badge-red">Critical</span>
                        ) : isLow ? (
                          <span className="badge-pill badge-amber">Low Stock</span>
                        ) : isOverstock ? (
                          <span className="badge-pill badge-blue">Overstock</span>
                        ) : (
                          <span className="badge-pill badge-green">Healthy</span>
                        )}
                      </td>
                      <td className="py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <NavLink
                            to={`/inventory/product/${p.id}`}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#182622] text-slate-700 dark:text-slate-200"
                            title="Product Intelligence"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </NavLink>
                          <button
                            onClick={() => {
                              setSelectedProductForAdjust(p);
                              setIsAdjustModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]"
                            title="Stock Adjust"
                          >
                            ± Adjust
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stock Adjustment Modal */}
      {isAdjustModalOpen && selectedProductForAdjust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#141f1c] rounded-2xl border border-slate-200 dark:border-[#20332c] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Quick Stock Adjustment
              </h3>
              <button onClick={() => setIsAdjustModalOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#182622] text-xs space-y-1">
              <div className="font-bold text-slate-800 dark:text-slate-200">{selectedProductForAdjust.name}</div>
              <div className="text-slate-500">Current Stock: <strong>{selectedProductForAdjust.current_stock} {selectedProductForAdjust.unit}</strong></div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Adjustment Quantity (+ to add, - to reduce)
              </label>
              <input
                type="number"
                value={adjustQty}
                onChange={e => setAdjustQty(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#f4f7f4] dark:bg-[#182622] border border-slate-200 dark:border-[#233831] focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                New resulting stock: <strong>{Math.max(0, selectedProductForAdjust.current_stock + adjustQty)} {selectedProductForAdjust.unit}</strong>
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Reason / Note
              </label>
              <input
                type="text"
                value={adjustReason}
                onChange={e => setAdjustReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#f4f7f4] dark:bg-[#182622] border border-slate-200 dark:border-[#233831] focus:outline-hidden"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setIsAdjustModalOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#182622] text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleQuickAdjust}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
              >
                Save Adjustment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#141f1c] rounded-2xl border border-slate-200 dark:border-[#20332c] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Add New Product to Catalog
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Product Name</label>
                  <input
                    required
                    type="text"
                    value={newProd.name}
                    onChange={e => setNewProd({ ...newProd, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#f4f7f4] dark:bg-[#182622] border border-slate-200 dark:border-[#233831]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">SKU</label>
                  <input
                    required
                    type="text"
                    value={newProd.sku}
                    onChange={e => setNewProd({ ...newProd, sku: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#f4f7f4] dark:bg-[#182622] border border-slate-200 dark:border-[#233831]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={newProd.category_id}
                    onChange={e => setNewProd({ ...newProd, category_id: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#f4f7f4] dark:bg-[#182622] border border-slate-200 dark:border-[#233831]"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Unit</label>
                  <input
                    type="text"
                    value={newProd.unit}
                    onChange={e => setNewProd({ ...newProd, unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#f4f7f4] dark:bg-[#182622] border border-slate-200 dark:border-[#233831]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Unit Cost (₹)</label>
                  <input
                    type="number"
                    value={newProd.unit_cost}
                    onChange={e => setNewProd({ ...newProd, unit_cost: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-[#f4f7f4] dark:bg-[#182622] border border-slate-200 dark:border-[#233831]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={newProd.selling_price}
                    onChange={e => setNewProd({ ...newProd, selling_price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-[#f4f7f4] dark:bg-[#182622] border border-slate-200 dark:border-[#233831]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Current Stock</label>
                  <input
                    type="number"
                    value={newProd.current_stock}
                    onChange={e => setNewProd({ ...newProd, current_stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-[#f4f7f4] dark:bg-[#182622] border border-slate-200 dark:border-[#233831]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Reorder Point</label>
                  <input
                    type="number"
                    value={newProd.reorder_point}
                    onChange={e => setNewProd({ ...newProd, reorder_point: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-[#f4f7f4] dark:bg-[#182622] border border-slate-200 dark:border-[#233831]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Safety Stock</label>
                  <input
                    type="number"
                    value={newProd.safety_stock}
                    onChange={e => setNewProd({ ...newProd, safety_stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-[#f4f7f4] dark:bg-[#182622] border border-slate-200 dark:border-[#233831]"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#182622] text-slate-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
