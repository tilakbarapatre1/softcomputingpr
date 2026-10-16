import io
import csv
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Response
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.session import get_db
from app.models.models import Product, Category, SupplierProduct, Supplier, SalesItem
from app.schemas.schemas import ProductOut, ProductCreate, ProductUpdate, CategoryOut
from app.auth.security import require_role

router = APIRouter(prefix="/products", tags=["Products & Inventory"])

@router.get("/categories/list", response_model=List[CategoryOut])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

@router.get("", response_model=List[ProductOut])
def list_products(
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    abc_class: Optional[str] = None,
    xyz_class: Optional[str] = None,
    stock_status: Optional[str] = None, # healthy, low, critical, overstock
    limit: int = 150,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    query = db.query(Product).filter(Product.is_active == True)
    
    if search:
        s = f"%{search}%"
        query = query.filter((Product.name.ilike(s)) | (Product.sku.ilike(s)))
    if category_id:
        query = query.filter(Product.category_id == category_id)
    if abc_class:
        query = query.filter(Product.abc_class == abc_class)
    if xyz_class:
        query = query.filter(Product.xyz_class == xyz_class)
        
    if stock_status == "critical":
        query = query.filter(Product.current_stock <= Product.safety_stock)
    elif stock_status == "low":
        query = query.filter(Product.current_stock <= Product.reorder_point, Product.current_stock > Product.safety_stock)
    elif stock_status == "overstock":
        query = query.filter(Product.current_stock >= Product.max_stock * 0.8)
    elif stock_status == "healthy":
        query = query.filter(Product.current_stock > Product.reorder_point, Product.current_stock < Product.max_stock * 0.8)

    products = query.order_by(Product.id.asc()).offset(offset).limit(limit).all()

    results = []
    for p in products:
        supp_briefs = []
        for sp in p.supplier_products:
            supp_briefs.append({
                "id": sp.id,
                "supplier_id": sp.supplier_id,
                "supplier_name": sp.supplier.name if sp.supplier else "Supplier",
                "unit_cost": sp.unit_cost,
                "lead_time_days": sp.lead_time_days,
                "moq": sp.moq,
                "reliability_score": sp.reliability_score,
                "quality_score": sp.quality_score,
                "is_preferred": sp.is_preferred
            })

        results.append({
            "id": p.id,
            "sku": p.sku,
            "name": p.name,
            "description": p.description,
            "category_id": p.category_id,
            "category_name": p.category.name if p.category else "General",
            "unit": p.unit,
            "unit_cost": p.unit_cost,
            "selling_price": p.selling_price,
            "current_stock": p.current_stock,
            "min_stock": p.min_stock,
            "max_stock": p.max_stock,
            "reorder_point": p.reorder_point,
            "safety_stock": p.safety_stock,
            "lead_time_days": p.lead_time_days,
            "abc_class": p.abc_class,
            "xyz_class": p.xyz_class,
            "inventory_value": round(p.current_stock * p.unit_cost, 2),
            "is_active": p.is_active,
            "created_at": p.created_at,
            "updated_at": p.updated_at,
            "suppliers": supp_briefs
        })
    return results

@router.get("/{id}")
def get_product_details(id: int, db: Session = Depends(get_db)):
    p = db.query(Product).filter(Product.id == id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")

    # Calculate recent 30-day demand metrics
    sales_sum = db.query(func.sum(SalesItem.quantity)).filter(SalesItem.product_id == p.id).scalar() or (p.reorder_point * 10)
    avg_daily_demand = max(0.5, float(sales_sum) / 120.0)

    # Suppliers for this product
    suppliers = []
    for sp in p.supplier_products:
        suppliers.append({
            "supplier_id": sp.supplier_id,
            "supplier_name": sp.supplier.name if sp.supplier else "Supplier",
            "city": sp.supplier.city if sp.supplier else "India",
            "unit_cost": sp.unit_cost,
            "lead_time_days": sp.lead_time_days,
            "moq": sp.moq,
            "reliability_score": sp.reliability_score,
            "quality_score": sp.quality_score,
            "on_time_rate": sp.supplier.on_time_rate if sp.supplier else 95.0,
            "is_preferred": sp.is_preferred
        })

    days_to_stockout = round(p.current_stock / avg_daily_demand, 1)

    return {
        "id": p.id,
        "sku": p.sku,
        "name": p.name,
        "description": p.description,
        "category_id": p.category_id,
        "category_name": p.category.name if p.category else "General",
        "unit": p.unit,
        "unit_cost": p.unit_cost,
        "selling_price": p.selling_price,
        "current_stock": p.current_stock,
        "min_stock": p.min_stock,
        "max_stock": p.max_stock,
        "reorder_point": p.reorder_point,
        "safety_stock": p.safety_stock,
        "lead_time_days": p.lead_time_days,
        "abc_class": p.abc_class,
        "xyz_class": p.xyz_class,
        "inventory_value": round(p.current_stock * p.unit_cost, 2),
        "daily_demand": round(avg_daily_demand, 1),
        "weekly_demand": round(avg_daily_demand * 7, 1),
        "monthly_demand": round(avg_daily_demand * 30, 1),
        "days_until_stockout": days_to_stockout,
        "stockout_risk": "CRITICAL" if p.current_stock <= p.safety_stock else ("HIGH" if p.current_stock <= p.reorder_point else "LOW"),
        "overstock_risk": "OVERSTOCK" if p.current_stock >= p.max_stock * 0.8 else "NORMAL",
        "suppliers": suppliers,
        "created_at": p.created_at,
        "updated_at": p.updated_at
    }

@router.post("", response_model=ProductOut)
def create_product(prod_in: ProductCreate, db: Session = Depends(get_db)):
    prod = Product(
        sku=prod_in.sku,
        name=prod_in.name,
        description=prod_in.description,
        category_id=prod_in.category_id,
        unit=prod_in.unit,
        unit_cost=prod_in.unit_cost,
        selling_price=prod_in.selling_price,
        current_stock=prod_in.current_stock,
        min_stock=prod_in.min_stock,
        max_stock=prod_in.max_stock,
        reorder_point=prod_in.reorder_point,
        safety_stock=prod_in.safety_stock,
        lead_time_days=prod_in.lead_time_days,
        abc_class=prod_in.abc_class or "B",
        xyz_class=prod_in.xyz_class or "Y",
        is_active=True
    )
    db.add(prod)
    db.flush()

    # Automatically attach preferred supplier quotes from active suppliers
    suppliers = db.query(Supplier).all()
    if suppliers:
        for s in suppliers[:2]: # Link top suppliers
            sp = SupplierProduct(
                supplier_id=s.id,
                product_id=prod.id,
                unit_cost=prod.unit_cost,
                lead_time_days=prod.lead_time_days or 3,
                moq=10,
                reliability_score=s.reliability_score or 95.0,
                quality_score=s.quality_score or 94.0,
                is_preferred=(s.id == suppliers[0].id)
            )
            db.add(sp)

    db.commit()
    db.refresh(prod)

    # Immediately sync AI reorder recommendations if in critical or low stock
    if prod.current_stock <= prod.reorder_point or prod.current_stock <= prod.safety_stock:
        from app.api.procurement import sync_active_recommendations
        sync_active_recommendations(db)

    return prod

@router.put("/{id}")
def update_product(id: int, prod_in: ProductUpdate, db: Session = Depends(get_db)):
    p = db.query(Product).filter(Product.id == id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = prod_in.dict(exclude_unset=True)
    for field, val in update_data.items():
        setattr(p, field, val)

    db.commit()
    db.refresh(p)

    if p.current_stock <= p.reorder_point or p.current_stock <= p.safety_stock:
        from app.api.procurement import sync_active_recommendations
        sync_active_recommendations(db)

    return {"status": "success", "message": "Product updated successfully", "product": p}

@router.delete("/{id}")
def delete_product(id: int, db: Session = Depends(get_db)):
    p = db.query(Product).filter(Product.id == id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    p.is_active = False
    db.commit()
    return {"status": "success", "message": f"Product {p.name} deactivated."}

@router.get("/export/csv")
def export_products_csv(db: Session = Depends(get_db)):
    products = db.query(Product).filter(Product.is_active == True).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "ID", "SKU", "Product Name", "Category", "Unit", "Unit Cost (INR)",
        "Selling Price (INR)", "Current Stock", "Reorder Point", "Safety Stock",
        "Lead Time Days", "ABC Class", "XYZ Class", "Inventory Value (INR)"
    ])

    for p in products:
        writer.writerow([
            p.id, p.sku, p.name, p.category.name if p.category else "",
            p.unit, p.unit_cost, p.selling_price, p.current_stock,
            p.reorder_point, p.safety_stock, p.lead_time_days,
            p.abc_class, p.xyz_class, round(p.current_stock * p.unit_cost, 2)
        ])

    output.seek(0)
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=products_inventory_master.csv"}
    )
