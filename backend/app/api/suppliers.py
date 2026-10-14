from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.models import Supplier, SupplierProduct
from app.schemas.schemas import SupplierOut, SupplierCreate

router = APIRouter(prefix="/suppliers", tags=["Suppliers"])

@router.get("", response_model=List[SupplierOut])
def list_suppliers(db: Session = Depends(get_db)):
    suppliers = db.query(Supplier).all()
    results = []
    for s in suppliers:
        # Composite score calculation: 40% On-Time + 30% Quality + 30% Reliability
        overall = round((s.on_time_rate * 0.40) + (s.quality_score * 0.30) + (s.reliability_score * 0.30), 1)
        results.append({
            "id": s.id,
            "name": s.name,
            "contact_email": s.contact_email,
            "phone": s.phone,
            "address": s.address,
            "city": s.city,
            "on_time_rate": s.on_time_rate,
            "quality_score": s.quality_score,
            "reliability_score": s.reliability_score,
            "payment_terms": s.payment_terms,
            "overall_score": overall,
            "created_at": s.created_at
        })
    # Sort by overall score descending
    return sorted(results, key=lambda x: x["overall_score"], reverse=True)

@router.get("/{id}")
def get_supplier_detail(id: int, db: Session = Depends(get_db)):
    s = db.query(Supplier).filter(Supplier.id == id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Supplier not found")
    
    overall = round((s.on_time_rate * 0.40) + (s.quality_score * 0.30) + (s.reliability_score * 0.30), 1)
    
    # Products supplied
    supplied_products = []
    for sp in s.supplier_products:
        p = sp.product
        supplied_products.append({
            "product_id": p.id,
            "product_name": p.name,
            "sku": p.sku,
            "category": p.category.name if p.category else "",
            "unit_cost": sp.unit_cost,
            "lead_time_days": sp.lead_time_days,
            "moq": sp.moq,
            "is_preferred": sp.is_preferred
        })

    return {
        "id": s.id,
        "name": s.name,
        "contact_email": s.contact_email,
        "phone": s.phone,
        "address": s.address,
        "city": s.city,
        "on_time_rate": s.on_time_rate,
        "quality_score": s.quality_score,
        "reliability_score": s.reliability_score,
        "payment_terms": s.payment_terms,
        "overall_score": overall,
        "products_count": len(supplied_products),
        "products": supplied_products,
        "created_at": s.created_at
    }

@router.post("", response_model=SupplierOut)
def create_supplier(supp_in: SupplierCreate, db: Session = Depends(get_db)):
    s = Supplier(
        name=supp_in.name,
        contact_email=supp_in.contact_email,
        phone=supp_in.phone,
        address=supp_in.address,
        city=supp_in.city,
        on_time_rate=supp_in.on_time_rate,
        quality_score=supp_in.quality_score,
        reliability_score=supp_in.reliability_score,
        payment_terms=supp_in.payment_terms
    )
    db.add(s)
    db.commit()
    db.refresh(s)
    overall = round((s.on_time_rate * 0.40) + (s.quality_score * 0.30) + (s.reliability_score * 0.30), 1)
    return {
        "id": s.id,
        "name": s.name,
        "contact_email": s.contact_email,
        "phone": s.phone,
        "address": s.address,
        "city": s.city,
        "on_time_rate": s.on_time_rate,
        "quality_score": s.quality_score,
        "reliability_score": s.reliability_score,
        "payment_terms": s.payment_terms,
        "overall_score": overall,
        "created_at": s.created_at
    }
