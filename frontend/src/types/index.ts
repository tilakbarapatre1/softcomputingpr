export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'ADMIN' | 'INVENTORY_MANAGER' | 'STAFF';
}

export interface Category {
  id: number;
  name: string;
  code: string;
  description?: string;
}

export interface SupplierProductBrief {
  id: number;
  supplier_id: number;
  supplier_name: string;
  unit_cost: number;
  lead_time_days: number;
  moq: number;
  reliability_score: number;
  quality_score: number;
  is_preferred: boolean;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  description?: string;
  category_id: number;
  category_name?: string;
  unit: string;
  unit_cost: number;
  selling_price: number;
  current_stock: number;
  min_stock: number;
  max_stock: number;
  reorder_point: number;
  safety_stock: number;
  lead_time_days: number;
  abc_class: string;
  xyz_class: string;
  inventory_value?: number;
  is_active: boolean;
  suppliers?: SupplierProductBrief[];
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: number;
  name: string;
  contact_email?: string;
  phone?: string;
  address?: string;
  city?: string;
  on_time_rate: number;
  quality_score: number;
  reliability_score: number;
  payment_terms: string;
  overall_score: number;
}

export interface POItem {
  id: number;
  product_id: number;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
  received_quantity: number;
}

export interface PurchaseOrder {
  id: number;
  po_number: string;
  supplier_id: number;
  supplier_name: string;
  order_date: string;
  expected_delivery?: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Ordered' | 'Received' | 'Cancelled';
  total_amount: number;
  budget_allocated: number;
  notes?: string;
  created_by: string;
  items: POItem[];
}

export interface ForecastPoint {
  date: string;
  predicted: number;
  lower_bound: number;
  upper_bound: number;
  actual?: number;
}

export interface ProductForecast {
  product_id: number;
  product_name: string;
  sku: string;
  model_used: string;
  confidence_score: number;
  forecast_7d_total: number;
  forecast_30d_total: number;
  points: ForecastPoint[];
  metrics: {
    mae: number;
    rmse: number;
    mape: number;
    r2_score: number;
  };
}

export interface AIRecommendation {
  id: number;
  product_id: number;
  product_name: string;
  sku: string;
  category: string;
  current_stock: number;
  reorder_point: number;
  safety_stock: number;
  forecast_30d: number;
  recommended_qty: number;
  recommended_supplier_id: number;
  recommended_supplier_name: string;
  unit_cost: number;
  estimated_cost: number;
  potential_savings: number;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  lead_time_days: number;
  rationale: string[];
  decision_factors: Record<string, any>;
  status: string;
  created_at: string;
}

export interface OptimizationResult {
  total_cost: number;
  budget_allocated: number;
  budget_utilized_pct: number;
  total_units_ordered: number;
  total_products_covered: number;
  potential_savings_vs_default: number;
  selected_items: Array<{
    product_id: number;
    product_name: string;
    sku: string;
    category: string;
    supplier_id: number;
    supplier_name: string;
    quantity: number;
    unit_cost: number;
    total_cost: number;
    lead_time_days: number;
    reliability_score: number;
    moq: number;
  }>;
  supplier_allocations: Array<{
    supplier_name: string;
    total_spend: number;
    percentage: number;
  }>;
  solver_status: string;
  execution_time_ms: number;
}

export interface SimulationResult {
  base_stockout_risk_count: number;
  simulated_stockout_risk_count: number;
  base_total_procurement_cost: number;
  simulated_total_procurement_cost: number;
  cost_difference: number;
  capital_at_risk: number;
  budget_limit: number;
  is_budget_breached: boolean;
  impact_summary: string;
  critical_impacted_products: Array<{
    product_id: number;
    product_name: string;
    sku: string;
    current_stock: number;
    base_days_to_stockout: number;
    sim_days_to_stockout: number;
    base_risk: string;
    sim_risk: string;
    base_order_qty: number;
    sim_order_qty: number;
    cost_impact: number;
  }>;
}

export interface DashboardSummary {
  total_products: number;
  inventory_value: number;
  low_stock_count: number;
  stockout_risk_count: number;
  overstock_count: number;
  monthly_procurement_cost: number;
  potential_savings: number;
  ai_insights: Array<{
    type: string;
    badge: string;
    color: string;
    text: string;
    action: string;
  }>;
  health_distribution: {
    healthy: number;
    low_stock: number;
    critical: number;
    overstock: number;
  };
  top_selling_products: Array<{
    name: string;
    sku: string;
    category: string;
    units_sold: number;
    revenue: number;
  }>;
  category_breakdown: Array<{
    category: string;
    product_count: number;
    total_value: number;
    share_pct: number;
  }>;
  monthly_sales_vs_forecast: Array<{
    month: string;
    actual_sales: number | null;
    predicted_demand: number;
    procurement_spend: number;
    is_forecast: boolean;
  }>;
  recent_activities: Array<{
    id: number;
    title: string;
    description: string;
    time: string;
    status: string;
    type: string;
  }>;
}

export interface InventoryAlert {
  id: number;
  product_id?: number;
  product_name?: string;
  alert_type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ModelMetric {
  id?: number;
  model_name: string;
  mae: number;
  rmse: number;
  mape: number;
  r2_score: number;
  is_best: boolean;
  trained_at?: string;
}
