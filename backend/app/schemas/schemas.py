from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, EmailStr

# --- Auth Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str
    user: Dict[str, Any]

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    role: str = "STAFF"

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True

# --- Category Schemas ---
class CategoryBase(BaseModel):
    name: str
    code: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryOut(CategoryBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# --- Product Schemas ---
class SupplierProductBrief(BaseModel):
    id: int
    supplier_id: int
    supplier_name: str
    unit_cost: float
    lead_time_days: int
    moq: int
    reliability_score: float
    quality_score: float
    is_preferred: bool

class ProductBase(BaseModel):
    sku: str
    name: str
    description: Optional[str] = None
    category_id: int
    unit: str = "units"
    unit_cost: float
    selling_price: float
    current_stock: int = 0
    min_stock: int = 10
    max_stock: int = 500
    reorder_point: int = 50
    safety_stock: int = 20
    lead_time_days: int = 3
    abc_class: Optional[str] = "B"
    xyz_class: Optional[str] = "Y"

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    sku: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    unit: Optional[str] = None
    unit_cost: Optional[float] = None
    selling_price: Optional[float] = None
    current_stock: Optional[int] = None
    min_stock: Optional[int] = None
    max_stock: Optional[int] = None
    reorder_point: Optional[int] = None
    safety_stock: Optional[int] = None
    lead_time_days: Optional[int] = None
    abc_class: Optional[str] = None
    xyz_class: Optional[str] = None
    is_active: Optional[bool] = None

class ProductOut(ProductBase):
    id: int
    category_name: Optional[str] = None
    inventory_value: Optional[float] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime
    suppliers: Optional[List[SupplierProductBrief]] = []
    class Config:
        from_attributes = True

# --- Supplier Schemas ---
class SupplierBase(BaseModel):
    name: str
    contact_email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    on_time_rate: float = 95.0
    quality_score: float = 92.0
    reliability_score: float = 94.0
    payment_terms: str = "Net 30"

class SupplierCreate(SupplierBase):
    pass

class SupplierOut(SupplierBase):
    id: int
    overall_score: Optional[float] = None
    created_at: datetime
    class Config:
        from_attributes = True

# --- Purchase Order Schemas ---
class POItemCreate(BaseModel):
    product_id: int
    quantity: int
    unit_cost: float

class POItemOut(BaseModel):
    id: int
    product_id: int
    product_name: str
    product_sku: str
    quantity: int
    unit_cost: float
    total_cost: float
    received_quantity: int
    class Config:
        from_attributes = True

class PurchaseOrderCreate(BaseModel):
    supplier_id: int
    expected_delivery: Optional[datetime] = None
    budget_allocated: Optional[float] = 0.0
    notes: Optional[str] = None
    items: List[POItemCreate]

class PurchaseOrderUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class PurchaseOrderOut(BaseModel):
    id: int
    po_number: str
    supplier_id: int
    supplier_name: Optional[str] = None
    order_date: datetime
    expected_delivery: Optional[datetime] = None
    status: str
    total_amount: float
    budget_allocated: float
    notes: Optional[str] = None
    created_by: str
    items: List[POItemOut] = []
    class Config:
        from_attributes = True

# --- Demand Forecast Schemas ---
class ForecastPoint(BaseModel):
    date: str
    predicted: float
    lower_bound: float
    upper_bound: float
    actual: Optional[float] = None

class ProductForecastOut(BaseModel):
    product_id: int
    product_name: str
    sku: str
    model_used: str
    confidence_score: float
    forecast_7d_total: float
    forecast_30d_total: float
    points: List[ForecastPoint]
    metrics: Dict[str, Any]

# --- AI Recommendation & Optimization Schemas ---
class AIRecommendationOut(BaseModel):
    id: int
    product_id: int
    product_name: str
    sku: str
    category: str
    current_stock: int
    reorder_point: int
    safety_stock: int
    forecast_30d: float
    recommended_qty: int
    recommended_supplier_id: Optional[int] = None
    recommended_supplier_name: Optional[str] = None
    unit_cost: float
    estimated_cost: float
    potential_savings: float
    urgency: str
    lead_time_days: int
    rationale: List[str]
    decision_factors: Dict[str, Any]
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

class OptimizationRequest(BaseModel):
    budget_limit: float = 200000.0  # In INR
    max_lead_time_days: Optional[int] = 14
    min_supplier_score: Optional[float] = 80.0
    priority_category: Optional[str] = None
    service_level: Optional[float] = 0.95

class OptimizationResult(BaseModel):
    total_cost: float
    budget_allocated: float
    budget_utilized_pct: float
    total_units_ordered: int
    total_products_covered: int
    potential_savings_vs_default: float
    selected_items: List[Dict[str, Any]]
    supplier_allocations: List[Dict[str, Any]]
    solver_status: str
    execution_time_ms: float

# --- Simulation Schemas ---
class SimulationRequest(BaseModel):
    demand_change_pct: float = 0.0     # e.g., +20%
    lead_time_change_days: int = 0      # e.g., +3 days
    cost_change_pct: float = 0.0        # e.g., +5%
    budget_limit: float = 200000.0

class SimulationResult(BaseModel):
    base_stockout_risk_count: int
    simulated_stockout_risk_count: int
    base_total_procurement_cost: float
    simulated_total_procurement_cost: float
    cost_difference: float
    capital_at_risk: float
    impact_summary: str
    critical_impacted_products: List[Dict[str, Any]]

# --- AI Assistant / Copilot ---
class AICopilotQuery(BaseModel):
    query: str

class AICopilotResponse(BaseModel):
    query: str
    answer: str
    data_points: Optional[Dict[str, Any]] = None
    suggested_actions: Optional[List[Dict[str, Any]]] = None

# --- Alerts & Dashboard Schemas ---
class AlertOut(BaseModel):
    id: int
    product_id: Optional[int] = None
    product_name: Optional[str] = None
    alert_type: str
    severity: str
    message: str
    is_read: bool
    created_at: datetime
    class Config:
        from_attributes = True

class DashboardSummaryOut(BaseModel):
    total_products: int
    inventory_value: float
    low_stock_count: int
    stockout_risk_count: int
    overstock_count: int
    monthly_procurement_cost: float
    potential_savings: float
    ai_insights: List[Dict[str, Any]]
    health_distribution: Dict[str, int]
    top_selling_products: List[Dict[str, Any]]
    category_breakdown: List[Dict[str, Any]]
    monthly_sales_vs_forecast: List[Dict[str, Any]]
    recent_activities: List[Dict[str, Any]]
