import axios from 'axios';
import {
  User, Product, Category, Supplier, PurchaseOrder,
  ProductForecast, AIRecommendation, OptimizationResult,
  SimulationResult, DashboardSummary, InventoryAlert, ModelMetric
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
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

export const authApi = {
  login: async (email: string, password: string) => {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },
  getMe: async (): Promise<User> => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },
  seedData: async () => {
    const res = await apiClient.post('/auth/seed');
    return res.data;
  }
};

export const dashboardApi = {
  getSummary: async (): Promise<DashboardSummary> => {
    const res = await apiClient.get('/dashboard/summary');
    return res.data;
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
    const res = await apiClient.get('/products', { params });
    return res.data;
  },
  getDetails: async (id: number) => {
    const res = await apiClient.get(`/products/${id}`);
    return res.data;
  },
  getCategories: async (): Promise<Category[]> => {
    const res = await apiClient.get('/products/categories/list');
    return res.data;
  },
  create: async (data: Partial<Product>): Promise<Product> => {
    const res = await apiClient.post('/products', data);
    return res.data;
  },
  update: async (id: number, data: Partial<Product>) => {
    const res = await apiClient.put(`/products/${id}`, data);
    return res.data;
  },
  delete: async (id: number) => {
    const res = await apiClient.delete(`/products/${id}`);
    return res.data;
  },
  exportCsvUrl: `${API_BASE_URL}/products/export/csv`
};

export const forecastApi = {
  getProductForecast: async (productId: number, horizonDays = 30): Promise<ProductForecast> => {
    const res = await apiClient.get(`/forecast/${productId}`, { params: { horizon_days: horizonDays } });
    return res.data;
  },
  getMetrics: async (): Promise<ModelMetric[]> => {
    const res = await apiClient.get('/forecast/metrics');
    return res.data;
  },
  trainPipeline: async () => {
    const res = await apiClient.post('/forecast/train');
    return res.data;
  }
};

export const procurementApi = {
  getRecommendations: async (status = 'Active'): Promise<AIRecommendation[]> => {
    const res = await apiClient.get('/procurement/recommendations', { params: { status } });
    return res.data;
  },
  optimize: async (data: {
    budget_limit: number;
    max_lead_time_days?: number;
    min_supplier_score?: number;
  }): Promise<OptimizationResult> => {
    const res = await apiClient.post('/procurement/optimize', data);
    return res.data;
  },
  convertToPo: async (recommendationId: number) => {
    const res = await apiClient.post(`/procurement/recommendations/${recommendationId}/convert-to-po`);
    return res.data;
  }
};

export const suppliersApi = {
  list: async (): Promise<Supplier[]> => {
    const res = await apiClient.get('/suppliers');
    return res.data;
  },
  getDetails: async (id: number) => {
    const res = await apiClient.get(`/suppliers/${id}`);
    return res.data;
  },
  create: async (data: Partial<Supplier>): Promise<Supplier> => {
    const res = await apiClient.post('/suppliers', data);
    return res.data;
  }
};

export const purchaseOrdersApi = {
  list: async (status?: string): Promise<PurchaseOrder[]> => {
    const res = await apiClient.get('/purchase-orders', { params: { status } });
    return res.data;
  },
  getDetails: async (id: number): Promise<PurchaseOrder> => {
    const res = await apiClient.get(`/purchase-orders/${id}`);
    return res.data;
  },
  create: async (data: any): Promise<PurchaseOrder> => {
    const res = await apiClient.post('/purchase-orders', data);
    return res.data;
  },
  updateStatus: async (id: number, status: string, notes?: string) => {
    const res = await apiClient.patch(`/purchase-orders/${id}/status`, { status, notes });
    return res.data;
  }
};

export const analyticsApi = {
  getAbc: async () => {
    const res = await apiClient.get('/analytics/abc');
    return res.data;
  },
  getXyz: async () => {
    const res = await apiClient.get('/analytics/xyz');
    return res.data;
  },
  getStockoutRisk: async () => {
    const res = await apiClient.get('/analytics/stockout-risk');
    return res.data;
  },
  getOverstock: async () => {
    const res = await apiClient.get('/analytics/overstock');
    return res.data;
  }
};

export const simulationApi = {
  run: async (data: {
    demand_change_pct: number;
    lead_time_change_days: number;
    cost_change_pct: number;
    budget_limit: number;
  }): Promise<SimulationResult> => {
    const res = await apiClient.post('/simulation/run', data);
    return res.data;
  }
};

export const aiAssistantApi = {
  ask: async (query: string) => {
    const res = await apiClient.post('/ai/ask', { query });
    return res.data;
  }
};

export const inventoryApi = {
  getAlerts: async (unreadOnly = false, severity?: string): Promise<InventoryAlert[]> => {
    const res = await apiClient.get('/inventory/alerts', { params: { unread_only: unreadOnly, severity } });
    return res.data;
  },
  markAlertRead: async (id: number) => {
    const res = await apiClient.patch(`/inventory/alerts/${id}/read`);
    return res.data;
  },
  adjustStock: async (productId: number, adjustmentQuantity: number, reason: string) => {
    const res = await apiClient.post('/inventory/adjust', {
      product_id: productId,
      adjustment_quantity: adjustmentQuantity,
      reason
    });
    return res.data;
  }
};

export const reportsApi = {
  exportUrl: (reportType: string) => `${API_BASE_URL}/reports/export/${reportType}`
};

export default apiClient;
