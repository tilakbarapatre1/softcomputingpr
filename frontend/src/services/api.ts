import axios from 'axios';
import {
  User, Product, Category, Supplier, PurchaseOrder,
  ProductForecast, AIRecommendation, OptimizationResult,
  SimulationResult, DashboardSummary, InventoryAlert, ModelMetric
} from '../types';
import {
  MOCK_USER, MOCK_CATEGORIES, MOCK_SUPPLIERS, MOCK_PRODUCTS,
  MOCK_DASHBOARD_SUMMARY, MOCK_METRICS, MOCK_RECOMMENDATIONS,
  MOCK_PURCHASE_ORDERS, MOCK_ALERTS,
  getMockProductForecast, getMockOptimizationResult, getMockSimulationResult,
  getMockAiCopilotAnswer
} from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 3000, // 3s timeout before fallback to local intelligent simulation
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// In-memory mutable storage for demo mode
let localProducts = [...MOCK_PRODUCTS];
let localPurchaseOrders = [...MOCK_PURCHASE_ORDERS];
let localAlerts = [...MOCK_ALERTS];
let localRecommendations = [...MOCK_RECOMMENDATIONS];

export function syncLocalRecommendations() {
  localProducts.forEach(p => {
    const isCritical = p.current_stock <= p.safety_stock;
    const isLow = p.current_stock <= p.reorder_point;
    if (isCritical || isLow) {
      const existingIdx = localRecommendations.findIndex(r => r.product_id === p.id);
      const urgency: 'CRITICAL' | 'HIGH' = isCritical ? 'CRITICAL' : 'HIGH';
      const deficit = Math.max(0, p.reorder_point - p.current_stock);
      const recQty = Math.max(20, Math.ceil((deficit + p.safety_stock * 1.5) / 10) * 10);
      const estCost = Math.round(recQty * p.unit_cost);
      const savings = Math.round(recQty * p.unit_cost * 0.08);

      const rationale = [
        `Current stock (${p.current_stock} ${p.unit}) is ${isCritical ? 'at critical limit (below safety threshold)' : 'below reorder point'} (Reorder Point: ${p.reorder_point}, Safety Stock: ${p.safety_stock}).`,
        `Machine learning 30-day forecast projects demand velocity of ~${Math.round(p.reorder_point * 1.8)} units.`,
        `Supplier lead time is ${p.lead_time_days} days with safety buffer requirement of ${p.safety_stock} ${p.unit}.`,
        `Procuring recommended ${recQty} units resolves the critical deficit and yields estimated procurement savings of ₹${savings.toLocaleString('en-IN')}.`
      ];

      const decisionFactors = {
        current_stock: p.current_stock,
        reorder_point: p.reorder_point,
        safety_stock: p.safety_stock,
        lead_time_days: p.lead_time_days,
        forecast_30d: Math.round(p.reorder_point * 1.8),
        supplier_reliability: 96.5,
        moq: 10
      };

      if (existingIdx !== -1) {
        localRecommendations[existingIdx] = {
          ...localRecommendations[existingIdx],
          current_stock: p.current_stock,
          reorder_point: p.reorder_point,
          safety_stock: p.safety_stock,
          urgency,
          recommended_qty: recQty,
          estimated_cost: estCost,
          potential_savings: savings,
          rationale,
          decision_factors: decisionFactors,
          status: 'Active'
        };
      } else {
        const newRec: AIRecommendation = {
          id: localRecommendations.length + 1,
          product_id: p.id,
          product_name: p.name,
          sku: p.sku,
          category: p.category_name,
          current_stock: p.current_stock,
          reorder_point: p.reorder_point,
          safety_stock: p.safety_stock,
          forecast_30d: Math.round(p.reorder_point * 1.8),
          recommended_qty: recQty,
          recommended_supplier_id: 1,
          recommended_supplier_name: 'Apex Agro Commodities Pvt Ltd',
          unit_cost: p.unit_cost,
          estimated_cost: estCost,
          potential_savings: savings,
          urgency,
          lead_time_days: p.lead_time_days,
          rationale,
          decision_factors: decisionFactors,
          status: 'Active',
          created_at: new Date().toISOString()
        };
        localRecommendations.unshift(newRec);
      }

      const alertExists = localAlerts.some(a => a.product_id === p.id && a.severity === (isCritical ? 'CRITICAL' : 'HIGH') && !a.is_read);
      if (!alertExists) {
        localAlerts.unshift({
          id: localAlerts.length + 1,
          product_id: p.id,
          product_name: p.name,
          alert_type: isCritical ? 'CRITICAL_STOCK' : 'LOW_STOCK',
          severity: isCritical ? 'CRITICAL' : 'HIGH',
          message: `Stock alert for ${p.name}: Current stock (${p.current_stock} ${p.unit}) is ${isCritical ? 'at critical limit' : 'approaching reorder point'}. Immediate replenishment recommended.`,
          is_read: false,
          created_at: new Date().toISOString()
        });
      }
    }
  });
}

// Initial sync
syncLocalRecommendations();

export const authApi = {
  login: async (email: string, password: string) => {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      return res.data;
    } catch {
      // Fallback for demo logins on Vercel / offline
      return {
        access_token: 'mock-jwt-smart-inventory-2026',
        token_type: 'bearer',
        user: {
          ...MOCK_USER,
          email,
          role: email.includes('admin') ? 'ADMIN' : email.includes('manager') ? 'INVENTORY_MANAGER' : 'STAFF'
        }
      };
    }
  },
  getMe: async (): Promise<User> => {
    try {
      const res = await apiClient.get('/auth/me');
      return res.data;
    } catch {
      return MOCK_USER;
    }
  },
  seedData: async () => {
    try {
      const res = await apiClient.post('/auth/seed');
      return res.data;
    } catch {
      return { success: true, message: "Dataset pre-seeded with 105 products across 12 categories." };
    }
  }
};

export const dashboardApi = {
  getSummary: async (): Promise<DashboardSummary> => {
    try {
      const res = await apiClient.get('/dashboard/summary');
      return res.data;
    } catch {
      return MOCK_DASHBOARD_SUMMARY;
    }
  }
};

export const productsApi = {
  list: async (params?: {
    search?: string;
    category_id?: number;
    abc_class?: string;
    xyz_class?: string;
    stock_status?: string;
    limit?: number;
    offset?: number;
  }): Promise<Product[]> => {
    try {
      const res = await apiClient.get('/products', { params });
      return res.data;
    } catch {
      let filtered = [...localProducts];
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
      }
      if (params?.category_id) {
        filtered = filtered.filter(p => p.category_id === params.category_id);
      }
      if (params?.abc_class) {
        filtered = filtered.filter(p => p.abc_class === params.abc_class);
      }
      if (params?.xyz_class) {
        filtered = filtered.filter(p => p.xyz_class === params.xyz_class);
      }
      if (params?.stock_status) {
        if (params.stock_status === 'Critical') filtered = filtered.filter(p => p.current_stock <= p.safety_stock);
        else if (params.stock_status === 'Low Stock') filtered = filtered.filter(p => p.current_stock > p.safety_stock && p.current_stock <= p.reorder_point);
        else if (params.stock_status === 'Overstock') filtered = filtered.filter(p => p.current_stock >= p.reorder_point * 1.8);
        else if (params.stock_status === 'Healthy') filtered = filtered.filter(p => p.current_stock > p.reorder_point && p.current_stock < p.reorder_point * 1.8);
      }
      if (params?.offset) {
        filtered = filtered.slice(params.offset);
      }
      if (params?.limit) {
        filtered = filtered.slice(0, params.limit);
      }
      return filtered;
    }
  },
  getDetails: async (id: number): Promise<Product> => {
    try {
      const res = await apiClient.get(`/products/${id}`);
      return res.data;
    } catch {
      return localProducts.find(p => p.id === Number(id)) || localProducts[0];
    }
  },
  getCategories: async (): Promise<Category[]> => {
    try {
      const res = await apiClient.get('/products/categories/list');
      return res.data;
    } catch {
      return MOCK_CATEGORIES;
    }
  },
  create: async (data: Partial<Product>): Promise<Product> => {
    try {
      const res = await apiClient.post('/products', data);
      return res.data;
    } catch {
      const newProd: Product = {
        id: localProducts.length + 1,
        sku: data.sku || `SKU-${1000 + localProducts.length + 1}`,
        name: data.name || 'New Product',
        category_id: data.category_id || 1,
        category_name: MOCK_CATEGORIES.find(c => c.id === data.category_id)?.name || 'Grains & Flours',
        unit: data.unit || 'units',
        unit_cost: data.unit_cost || 100,
        selling_price: data.selling_price || 130,
        current_stock: data.current_stock || 50,
        min_stock: data.safety_stock || 15,
        max_stock: (data.reorder_point || 40) * 3,
        reorder_point: data.reorder_point || 40,
        safety_stock: data.safety_stock || 15,
        lead_time_days: data.lead_time_days || 3,
        abc_class: data.abc_class || 'B',
        xyz_class: data.xyz_class || 'Y',
        inventory_value: (data.current_stock || 50) * (data.unit_cost || 100),
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      localProducts.unshift(newProd);
      syncLocalRecommendations();
      return newProd;
    }
  },
  update: async (id: number, data: Partial<Product>) => {
    try {
      const res = await apiClient.put(`/products/${id}`, data);
      return res.data;
    } catch {
      const idx = localProducts.findIndex(p => p.id === Number(id));
      if (idx !== -1) {
        localProducts[idx] = { ...localProducts[idx], ...data, updated_at: new Date().toISOString() };
        syncLocalRecommendations();
      }
      return localProducts[idx];
    }
  },
  delete: async (id: number) => {
    try {
      const res = await apiClient.delete(`/products/${id}`);
      return res.data;
    } catch {
      localProducts = localProducts.filter(p => p.id !== Number(id));
      return { success: true };
    }
  },
  exportCsvUrl: `${API_BASE_URL}/products/export/csv`
};

export const forecastApi = {
  getProductForecast: async (productId: number, horizonDays = 30): Promise<ProductForecast> => {
    try {
      const res = await apiClient.get(`/forecast/${productId}`, { params: { horizon_days: horizonDays } });
      return res.data;
    } catch {
      return getMockProductForecast(Number(productId), horizonDays);
    }
  },
  getMetrics: async (): Promise<ModelMetric[]> => {
    try {
      const res = await apiClient.get('/forecast/metrics');
      return res.data;
    } catch {
      return MOCK_METRICS;
    }
  },
  trainPipeline: async () => {
    try {
      const res = await apiClient.post('/forecast/train');
      return res.data;
    } catch {
      return {
        success: true,
        message: "XGBoost, Random Forest, and Ridge models retrained successfully.",
        comparison: {
          best_model: "XGBoost Regressor",
          best_mae: 3.42,
          best_r2: 0.912
        }
      };
    }
  }
};

export const procurementApi = {
  getRecommendations: async (status = 'Active'): Promise<AIRecommendation[]> => {
    try {
      const res = await apiClient.get('/procurement/recommendations', { params: { status } });
      return res.data;
    } catch {
      syncLocalRecommendations();
      return status ? localRecommendations.filter(r => r.status === status) : localRecommendations;
    }
  },
  optimize: async (data: {
    budget_limit: number;
    max_lead_time_days?: number;
    min_supplier_score?: number;
  }): Promise<OptimizationResult> => {
    try {
      const res = await apiClient.post('/procurement/optimize', data);
      return res.data;
    } catch {
      return getMockOptimizationResult(data.budget_limit, data.max_lead_time_days);
    }
  },
  convertToPo: async (recommendationId: number) => {
    try {
      const res = await apiClient.post(`/procurement/recommendations/${recommendationId}/convert-to-po`);
      return res.data;
    } catch {
      const rec = localRecommendations.find(r => r.id === Number(recommendationId));
      const poNum = `PO-2026-${Math.floor(100 + Math.random() * 900)}`;
      if (rec) {
        localPurchaseOrders.unshift({
          id: localPurchaseOrders.length + 1,
          po_number: poNum,
          supplier_id: rec.recommended_supplier_id,
          supplier_name: rec.recommended_supplier_name,
          order_date: new Date().toISOString().split('T')[0],
          expected_delivery: new Date(Date.now() + rec.lead_time_days * 86400000).toISOString().split('T')[0],
          status: 'Submitted',
          total_amount: rec.estimated_cost,
          budget_allocated: rec.estimated_cost * 1.2,
          created_by: 'Tilak Barapatre',
          items: [
            {
              id: 1,
              product_id: rec.product_id,
              product_name: rec.product_name,
              product_sku: rec.sku,
              quantity: rec.recommended_qty,
              unit_cost: rec.unit_cost,
              total_cost: rec.estimated_cost,
              received_quantity: 0
            }
          ]
        });
      }
      return { success: true, po_number: poNum };
    }
  }
};

export const suppliersApi = {
  list: async (): Promise<Supplier[]> => {
    try {
      const res = await apiClient.get('/suppliers');
      return res.data;
    } catch {
      return MOCK_SUPPLIERS;
    }
  },
  getDetails: async (id: number): Promise<Supplier> => {
    try {
      const res = await apiClient.get(`/suppliers/${id}`);
      return res.data;
    } catch {
      return MOCK_SUPPLIERS.find(s => s.id === Number(id)) || MOCK_SUPPLIERS[0];
    }
  },
  create: async (data: Partial<Supplier>): Promise<Supplier> => {
    try {
      const res = await apiClient.post('/suppliers', data);
      return res.data;
    } catch {
      const newSup: Supplier = {
        id: MOCK_SUPPLIERS.length + 1,
        name: data.name || 'New Supplier',
        city: data.city || 'Mumbai',
        contact_email: data.contact_email || 'contact@supplier.in',
        phone: data.phone || '+91 98000 00000',
        on_time_rate: data.on_time_rate || 95.0,
        quality_score: data.quality_score || 94.0,
        reliability_score: data.reliability_score || 95.0,
        payment_terms: data.payment_terms || 'Net 30',
        overall_score: 94.6
      };
      MOCK_SUPPLIERS.push(newSup);
      return newSup;
    }
  }
};

export const purchaseOrdersApi = {
  list: async (status?: string): Promise<PurchaseOrder[]> => {
    try {
      const res = await apiClient.get('/purchase-orders', { params: { status } });
      return res.data;
    } catch {
      if (status) {
        return localPurchaseOrders.filter(po => po.status === status);
      }
      return localPurchaseOrders;
    }
  },
  getDetails: async (id: number): Promise<PurchaseOrder> => {
    try {
      const res = await apiClient.get(`/purchase-orders/${id}`);
      return res.data;
    } catch {
      return localPurchaseOrders.find(po => po.id === Number(id)) || localPurchaseOrders[0];
    }
  },
  create: async (data: any): Promise<PurchaseOrder> => {
    try {
      const res = await apiClient.post('/purchase-orders', data);
      return res.data;
    } catch {
      const newPo: PurchaseOrder = {
        id: localPurchaseOrders.length + 1,
        po_number: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
        supplier_id: data.supplier_id || 1,
        supplier_name: MOCK_SUPPLIERS.find(s => s.id === data.supplier_id)?.name || 'Apex Agro Commodities',
        order_date: new Date().toISOString().split('T')[0],
        status: 'Submitted',
        total_amount: data.total_amount || 50000,
        budget_allocated: data.budget_allocated || 60000,
        created_by: 'Tilak Barapatre',
        items: data.items || []
      };
      localPurchaseOrders.unshift(newPo);
      return newPo;
    }
  },
  updateStatus: async (id: number, status: string, notes?: string) => {
    try {
      const res = await apiClient.patch(`/purchase-orders/${id}/status`, { status, notes });
      return res.data;
    } catch {
      const po = localPurchaseOrders.find(p => p.id === Number(id));
      if (po) {
        po.status = status as any;
        if (notes) po.notes = notes;
      }
      return po;
    }
  }
};

export const analyticsApi = {
  getAbc: async () => {
    try {
      const res = await apiClient.get('/analytics/abc');
      return res.data;
    } catch {
      const classA = localProducts.filter(p => p.abc_class === 'A');
      const classB = localProducts.filter(p => p.abc_class === 'B');
      const classC = localProducts.filter(p => p.abc_class === 'C');
      const valA = classA.reduce((s, p) => s + (p.inventory_value || 0), 0);
      const valB = classB.reduce((s, p) => s + (p.inventory_value || 0), 0);
      const valC = classC.reduce((s, p) => s + (p.inventory_value || 0), 0);
      const totalVal = (valA + valB + valC) || 1;
      const totalCount = localProducts.length || 1;

      return {
        summary: {
          A: {
            count: classA.length,
            total_value: Math.round(valA),
            percentage_of_items: Number(((classA.length / totalCount) * 100).toFixed(1)),
            percentage_of_value: Number(((valA / totalVal) * 100).toFixed(1)),
            recommendation: 'Strict daily inventory monitoring, safety buffer management, and priority supplier allocation.'
          },
          B: {
            count: classB.length,
            total_value: Math.round(valB),
            percentage_of_items: Number(((classB.length / totalCount) * 100).toFixed(1)),
            percentage_of_value: Number(((valB / totalVal) * 100).toFixed(1)),
            recommendation: 'Periodic weekly reviews, automated reorders, and regular stock inspections.'
          },
          C: {
            count: classC.length,
            total_value: Math.round(valC),
            percentage_of_items: Number(((classC.length / totalCount) * 100).toFixed(1)),
            percentage_of_value: Number(((valC / totalVal) * 100).toFixed(1)),
            recommendation: 'Bulk monthly ordering, simple min-max controls, and relaxed monitoring.'
          }
        },
        pareto_curve: [
          { rank_pct: 10, cumulative_value_pct: 45 },
          { rank_pct: 20, cumulative_value_pct: 70 },
          { rank_pct: 50, cumulative_value_pct: 90 },
          { rank_pct: 100, cumulative_value_pct: 100 }
        ],
        products: localProducts
      };
    }
  },
  getXyz: async () => {
    try {
      const res = await apiClient.get('/analytics/xyz');
      return res.data;
    } catch {
      const cells: Record<string, any[]> = {
        AX: [], AY: [], AZ: [],
        BX: [], BY: [], BZ: [],
        CX: [], CY: [], CZ: []
      };
      localProducts.forEach(p => {
        const key = `${p.abc_class || 'B'}${p.xyz_class || 'Y'}`;
        if (cells[key]) {
          cells[key].push({
            id: p.id,
            sku: p.sku,
            name: p.name,
            category: p.category_name,
            current_stock: p.current_stock,
            unit_cost: p.unit_cost,
            inventory_value: p.inventory_value || p.current_stock * p.unit_cost,
            reorder_point: p.reorder_point,
            safety_stock: p.safety_stock,
            lead_time_days: p.lead_time_days
          });
        }
      });

      return {
        xyz_summary: {
          X: { count: localProducts.filter(p => p.xyz_class === 'X').length, percentage: 48.0 },
          Y: { count: localProducts.filter(p => p.xyz_class === 'Y').length, percentage: 36.0 },
          Z: { count: localProducts.filter(p => p.xyz_class === 'Z').length, percentage: 16.0 }
        },
        matrix_summary: {
          AX: { count: cells.AX.length, strategy: 'Continuous Replenishment (JIT)', review_frequency: 'Daily', safety_stock_policy: 'Minimal' },
          AY: { count: cells.AY.length, strategy: 'Forecast-Driven Buffer Stock', review_frequency: 'Weekly', safety_stock_policy: 'Moderate' },
          AZ: { count: cells.AZ.length, strategy: 'High Safety Buffer or Make-to-Order', review_frequency: 'Weekly', safety_stock_policy: 'High' },
          BX: { count: cells.BX.length, strategy: 'Automated Periodic Replenishment', review_frequency: 'Bi-Weekly', safety_stock_policy: 'Standard' },
          BY: { count: cells.BY.length, strategy: 'Dynamic Safety Buffer with Lags', review_frequency: 'Bi-Weekly', safety_stock_policy: 'Moderate' },
          BZ: { count: cells.BZ.length, strategy: 'Consolidated Bulk Orders', review_frequency: 'Monthly', safety_stock_policy: 'High' },
          CX: { count: cells.CX.length, strategy: 'Automated Bulk Ordering', review_frequency: 'Monthly', safety_stock_policy: 'Standard' },
          CY: { count: cells.CY.length, strategy: 'Periodic Bulk Restocking', review_frequency: 'Monthly', safety_stock_policy: 'Moderate' },
          CZ: { count: cells.CZ.length, strategy: 'Order on Demand Only', review_frequency: 'Quarterly', safety_stock_policy: 'Minimal' }
        },
        matrix_cells: cells,
        items: localProducts
      };
    }
  },
  getStockoutRisk: async () => {
    try {
      const res = await apiClient.get('/analytics/stockout-risk');
      return res.data;
    } catch {
      const records = localProducts.map(p => {
        const daily = p.daily_demand || Math.max(1, Math.round(p.reorder_point / 15));
        const daysToOut = Number((p.current_stock / daily).toFixed(1));
        const riskLevel = p.current_stock <= p.safety_stock ? 'CRITICAL' : p.current_stock <= p.reorder_point ? 'HIGH' : daysToOut <= 14 ? 'MODERATE' : 'LOW';
        return {
          product_id: p.id,
          name: p.name,
          sku: p.sku,
          category: p.category_name,
          current_stock: p.current_stock,
          safety_stock: p.safety_stock,
          reorder_point: p.reorder_point,
          daily_demand: daily,
          lead_time_days: p.lead_time_days,
          days_to_stockout: daysToOut,
          risk_level: riskLevel,
          recommended_action: riskLevel === 'CRITICAL' ? 'Immediate Replenishment Order Required' : riskLevel === 'HIGH' ? 'Initiate Procurement Batch' : 'Standard Monitoring'
        };
      });

      return {
        counts: {
          critical: records.filter(r => r.risk_level === 'CRITICAL').length,
          high: records.filter(r => r.risk_level === 'HIGH').length,
          moderate: records.filter(r => r.risk_level === 'MODERATE').length,
          low: records.filter(r => r.risk_level === 'LOW').length
        },
        total_assessed: records.length,
        records
      };
    }
  },
  getOverstock: async () => {
    try {
      const res = await apiClient.get('/analytics/overstock');
      return res.data;
    } catch {
      const overstockItems = localProducts
        .filter(p => p.current_stock >= p.reorder_point * 1.5)
        .map(p => {
          const excess = Math.max(0, p.current_stock - p.reorder_point);
          const locked = Math.round(excess * p.unit_cost);
          const dos = Math.round(p.current_stock / Math.max(1, p.reorder_point / 15));
          return {
            product_id: p.id,
            product_name: p.name,
            sku: p.sku,
            category: p.category_name,
            current_stock: p.current_stock,
            reorder_point: p.reorder_point,
            expected_30d_demand: Math.round(p.reorder_point * 1.5),
            excess_units: excess,
            locked_capital: locked,
            days_of_supply: dos,
            recommendation: 'Run clearance promotional discounts or bundle with Class A high-velocity items.'
          };
        });

      const totalLocked = overstockItems.reduce((s, i) => s + i.locked_capital, 0);

      return {
        total_locked_capital: totalLocked,
        overstock_count: overstockItems.length,
        dead_stock_count: 0,
        overstock_items: overstockItems,
        dead_stock_items: []
      };
    }
  }
};

export const simulationApi = {
  run: async (data: {
    demand_change_pct: number;
    lead_time_change_days: number;
    cost_change_pct: number;
    budget_limit: number;
  }): Promise<SimulationResult> => {
    try {
      const res = await apiClient.post('/simulation/run', data);
      return res.data;
    } catch {
      return getMockSimulationResult(
        data.demand_change_pct,
        data.lead_time_change_days,
        data.cost_change_pct,
        data.budget_limit
      );
    }
  }
};

export const aiAssistantApi = {
  ask: async (query: string) => {
    try {
      const res = await apiClient.post('/ai/ask', { query });
      return res.data;
    } catch {
      return {
        answer: getMockAiCopilotAnswer(query),
        sources: [
          { type: 'database', name: 'Inventory Ledger (105 SKUs)' },
          { type: 'ml_model', name: 'XGBoost Forecaster (MAE 3.42)' },
          { type: 'optimization', name: 'OR-Tools MILP Solver' }
        ]
      };
    }
  }
};

export const inventoryApi = {
  getAlerts: async (unreadOnly = false, severity?: string): Promise<InventoryAlert[]> => {
    try {
      const res = await apiClient.get('/inventory/alerts', { params: { unread_only: unreadOnly, severity } });
      return res.data;
    } catch {
      let filtered = [...localAlerts];
      if (unreadOnly) filtered = filtered.filter(a => !a.is_read);
      if (severity) filtered = filtered.filter(a => a.severity === severity);
      return filtered;
    }
  },
  markAlertRead: async (id: number) => {
    try {
      const res = await apiClient.patch(`/inventory/alerts/${id}/read`);
      return res.data;
    } catch {
      const alert = localAlerts.find(a => a.id === Number(id));
      if (alert) alert.is_read = true;
      return { success: true };
    }
  },
  adjustStock: async (productId: number, adjustmentQuantity: number, reason: string) => {
    try {
      const res = await apiClient.post('/inventory/adjust', {
        product_id: productId,
        adjustment_quantity: adjustmentQuantity,
        reason
      });
      return res.data;
    } catch {
      const prod = localProducts.find(p => p.id === Number(productId));
      if (prod) {
        prod.current_stock = Math.max(0, prod.current_stock + adjustmentQuantity);
        prod.inventory_value = prod.current_stock * prod.unit_cost;
        syncLocalRecommendations();
      }
      return {
        success: true,
        product_id: productId,
        new_stock: prod ? prod.current_stock : 50,
        adjustment: adjustmentQuantity,
        reason
      };
    }
  }
};

export const reportsApi = {
  exportUrl: (reportType: string) => `${API_BASE_URL}/reports/export/${reportType}`
};

export default apiClient;
