import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package, TrendingUp, Cpu, BarChart3, Truck, FileText, Bell, X, Sparkles } from 'lucide-react';
import { productsApi } from '../../services/api';
import { Product } from '../../types';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCopilot: () => void;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({ isOpen, onClose, onOpenCopilot }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (isOpen) {
      productsApi.list({ limit: 120 }).then(data => {
        setProducts(data);
        setFilteredProducts(data.slice(0, 5));
      }).catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products.slice(0, 5));
    } else {
      const q = searchTerm.toLowerCase();
      const filtered = products.filter(
        p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || (p.category_name && p.category_name.toLowerCase().includes(q))
      );
      setFilteredProducts(filtered.slice(0, 8));
    }
  }, [searchTerm, products]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // Toggle behavior if needed
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickNav = [
    { label: "Executive Dashboard", icon: <BarChart3 className="w-4 h-4 text-emerald-600" />, path: "/" },
    { label: "Demand Forecasting & ML Models", icon: <TrendingUp className="w-4 h-4 text-blue-600" />, path: "/demand-intelligence/forecast" },
    { label: "Procurement Optimizer (OR-Tools)", icon: <Cpu className="w-4 h-4 text-purple-600" />, path: "/procurement/optimizer" },
    { label: "ABC-XYZ Matrix & Pareto Analysis", icon: <BarChart3 className="w-4 h-4 text-amber-600" />, path: "/analytics/abc-xyz" },
    { label: "Stockout Risk Predictor", icon: <Package className="w-4 h-4 text-red-600" />, path: "/analytics/stockout-risk" },
    { label: "What-If Scenario Simulator", icon: <Sparkles className="w-4 h-4 text-teal-600" />, path: "/analytics/simulation" },
    { label: "Suppliers Intelligence Directory", icon: <Truck className="w-4 h-4 text-indigo-600" />, path: "/suppliers" },
  ];

  const handleSelectNav = (path: string) => {
    onClose();
    navigate(path);
  };

  const handleSelectProduct = (productId: number) => {
    onClose();
    navigate(`/inventory/product/${productId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-[#121c19] border border-[#e5ebe5] dark:border-[#20332c] rounded-2xl shadow-2xl overflow-hidden">
        {/* Search input header */}
        <div className="p-4 border-b border-[#e5ebe5] dark:border-[#20332c] flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            autoFocus
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Type a product name, SKU, category, or command..."
            className="flex-1 text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-3 text-xs">
          {/* Products section */}
          {filteredProducts.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1">
                Products
              </div>
              <div className="space-y-0.5">
                {filteredProducts.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectProduct(p.id)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f1f5f2] dark:hover:bg-[#182622] text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px]">
                        {p.abc_class}{p.xyz_class}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{p.name}</div>
                        <div className="text-[11px] text-slate-400">{p.sku} • {p.category_name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{p.current_stock} {p.unit}</div>
                      <div className="text-[10px] text-slate-400">₹{p.unit_cost}/unit</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick navigation */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1">
              Quick Navigation
            </div>
            <div className="space-y-0.5">
              {quickNav.map((n, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectNav(n.path)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#f1f5f2] dark:hover:bg-[#182622] text-slate-700 dark:text-slate-200 font-medium transition-colors"
                >
                  {n.icon}
                  <span>{n.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 px-4 bg-[#f8faf8] dark:bg-[#15221e] border-t border-[#e5ebe5] dark:border-[#20332c] flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigate with mouse or arrow keys</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
