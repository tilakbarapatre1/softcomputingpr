from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
)
from sqlalchemy.orm import relationship
from app.database.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="STAFF")  # ADMIN, INVENTORY_MANAGER, STAFF
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    code = Column(String(50), unique=True, index=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(255), index=True, nullable=False)
    description = Column(Text, nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    unit = Column(String(50), default="units")  # kg, pack, liters, units
    unit_cost = Column(Float, nullable=False)  # Cost in INR
    selling_price = Column(Float, nullable=False)
    
    current_stock = Column(Integer, default=0)
    min_stock = Column(Integer, default=10)
    max_stock = Column(Integer, default=500)
    reorder_point = Column(Integer, default=50)
    safety_stock = Column(Integer, default=20)
    lead_time_days = Column(Integer, default=3)
    
    abc_class = Column(String(5), default="B")  # A, B, C
    xyz_class = Column(String(5), default="Y")  # X, Y, Z
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    category = relationship("Category", back_populates="products")
    supplier_products = relationship("SupplierProduct", back_populates="product", cascade="all, delete-orphan")
    sales_items = relationship("SalesItem", back_populates="product")
    forecasts = relationship("DemandForecast", back_populates="product", cascade="all, delete-orphan")
    alerts = relationship("InventoryAlert", back_populates="product", cascade="all, delete-orphan")
    recommendations = relationship("AIRecommendation", back_populates="product", cascade="all, delete-orphan")

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True, nullable=False)
    contact_email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    address = Column(String(255), nullable=True)
    city = Column(String(100), nullable=True)
    
    on_time_rate = Column(Float, default=95.0)       # percentage
    quality_score = Column(Float, default=92.0)      # percentage
    reliability_score = Column(Float, default=94.0)  # percentage
    payment_terms = Column(String(100), default="Net 30")
    created_at = Column(DateTime, default=datetime.utcnow)

    supplier_products = relationship("SupplierProduct", back_populates="supplier", cascade="all, delete-orphan")
    purchase_orders = relationship("PurchaseOrder", back_populates="supplier")

class SupplierProduct(Base):
    __tablename__ = "supplier_products"

    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    supplier_sku = Column(String(100), nullable=True)
    unit_cost = Column(Float, nullable=False)
    lead_time_days = Column(Integer, default=3)
    moq = Column(Integer, default=10)  # Minimum Order Quantity
    reliability_score = Column(Float, default=95.0)
    quality_score = Column(Float, default=95.0)
    is_preferred = Column(Boolean, default=False)

    supplier = relationship("Supplier", back_populates="supplier_products")
    product = relationship("Product", back_populates="supplier_products")

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String(100), unique=True, index=True, nullable=False)
    sale_date = Column(DateTime, default=datetime.utcnow, index=True)
    total_amount = Column(Float, nullable=False)
    channel = Column(String(50), default="In-Store")  # In-Store, Online, Wholesale
    status = Column(String(50), default="Completed")
    created_at = Column(DateTime, default=datetime.utcnow)

    items = relationship("SalesItem", back_populates="sale", cascade="all, delete-orphan")

class SalesItem(Base):
    __tablename__ = "sales_items"

    id = Column(Integer, primary_key=True, index=True)
    sale_id = Column(Integer, ForeignKey("sales.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    discount = Column(Float, default=0.0)
    sale_date = Column(DateTime, default=datetime.utcnow, index=True)
    promotion_flag = Column(Boolean, default=False)

    sale = relationship("Sale", back_populates="items")
    product = relationship("Product", back_populates="sales_items")

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(Integer, primary_key=True, index=True)
    po_number = Column(String(100), unique=True, index=True, nullable=False)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=False)
    order_date = Column(DateTime, default=datetime.utcnow)
    expected_delivery = Column(DateTime, nullable=True)
    status = Column(String(50), default="Draft")  # Draft, Submitted, Approved, Ordered, Received, Cancelled
    total_amount = Column(Float, default=0.0)
    budget_allocated = Column(Float, default=0.0)
    notes = Column(Text, nullable=True)
    created_by = Column(String(100), default="Admin")
    created_at = Column(DateTime, default=datetime.utcnow)

    supplier = relationship("Supplier", back_populates="purchase_orders")
    items = relationship("PurchaseOrderItem", back_populates="purchase_order", cascade="all, delete-orphan")

class PurchaseOrderItem(Base):
    __tablename__ = "purchase_order_items"

    id = Column(Integer, primary_key=True, index=True)
    po_id = Column(Integer, ForeignKey("purchase_orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_cost = Column(Float, nullable=False)
    total_cost = Column(Float, nullable=False)
    received_quantity = Column(Integer, default=0)

    purchase_order = relationship("PurchaseOrder", back_populates="items")
    product = relationship("Product")

class DemandForecast(Base):
    __tablename__ = "demand_forecasts"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    forecast_date = Column(DateTime, default=datetime.utcnow, index=True)
    horizon_days = Column(Integer, default=30)
    predicted_demand = Column(Float, nullable=False)
    lower_bound = Column(Float, nullable=True)
    upper_bound = Column(Float, nullable=True)
    model_used = Column(String(100), default="XGBoost")
    confidence_score = Column(Float, default=0.92)
    created_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="forecasts")

class InventoryAlert(Base):
    __tablename__ = "inventory_alerts"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    alert_type = Column(String(100), nullable=False)  # CRITICAL_STOCK, LOW_STOCK, STOCKOUT_RISK, OVERSTOCK, DEAD_STOCK, EXPIRY, SUPPLIER_DELAY
    severity = Column(String(50), default="MEDIUM")  # CRITICAL, HIGH, MEDIUM, LOW
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="alerts")

class AIRecommendation(Base):
    __tablename__ = "ai_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    recommended_supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=True)
    recommended_qty = Column(Integer, nullable=False)
    current_stock = Column(Integer, default=0)
    reorder_point = Column(Integer, default=0)
    safety_stock = Column(Integer, default=0)
    forecast_30d = Column(Float, default=0.0)
    estimated_cost = Column(Float, default=0.0)
    potential_savings = Column(Float, default=0.0)
    urgency = Column(String(50), default="MEDIUM")  # HIGH, MEDIUM, LOW
    rationale = Column(JSON, nullable=True)  # Bullet points of Explainable AI
    decision_factors = Column(JSON, nullable=True)  # Key data metrics behind decision
    status = Column(String(50), default="Active")  # Active, Accepted, Dismissed, Ordered
    created_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="recommendations")
    supplier = relationship("Supplier")

class ModelMetric(Base):
    __tablename__ = "model_metrics"

    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String(100), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    mae = Column(Float, nullable=False)
    rmse = Column(Float, nullable=False)
    mape = Column(Float, nullable=False)
    r2_score = Column(Float, nullable=True)
    trained_at = Column(DateTime, default=datetime.utcnow)
    is_best = Column(Boolean, default=False)
