from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.models import (
    AIRecommendation, Product, Supplier, SupplierProduct,
    PurchaseOrder, PurchaseOrderItem
)
from app.schemas.schemas import (
    AIRecommendationOut, OptimizationRequest, OptimizationResult, PurchaseOrderOut
)
from ml.optimization.ortools_procurement_optimizer import procurement_optimizer

router = APIRouter(prefix="/procurement", tags=["Procurement AI"])

@router.get("/recommendations", response_model=List[AIRecommendationOut])
def get_recommendations(status: Optional[str] = "Active", db: Session = Depends(get_db)):
    query = db.query(AIRecommendation)
    if status:
        query = query.filter(AIRecommendation.status == status)
    recs = query.order_by(AIRecommendation.urgency.asc(), AIRecommendation.estimated_cost.desc()).all()

    results = []
    for r in recs:
        p = r.product
        supp = r.supplier
        results.append({
            "id": r.id,
            "product_id": r.product_id,
            "product_name": p.name if p else "Product",
            "sku": p.sku if p else "",
            "category": p.category.name if (p and p.category) else "General",
            "current_stock": r.current_stock,
            "reorder_point": r.reorder_point,
            "safety_stock": r.safety_stock,
            "forecast_30d": r.forecast_30d,
            "recommended_qty": r.recommended_qty,
            "recommended_supplier_id": r.recommended_supplier_id,
            "recommended_supplier_name": supp.name if supp else "Optimal Supplier",
            "unit_cost": p.unit_cost if p else 100.0,
            "estimated_cost": r.estimated_cost,
            "potential_savings": r.potential_savings,
            "urgency": r.urgency,
            "lead_time_days": p.lead_time_days if p else 3,
            "rationale": r.rationale or [
                f"Current stock ({r.current_stock}) is below reorder threshold ({r.reorder_point}).",
                f"Projected 30-day demand is {r.forecast_30d} units based on machine learning forecasting.",
                f"Supplier {supp.name if supp else 'Recommended'} has best lead time and quality score."
            ],
            "decision_factors": r.decision_factors or {},
            "status": r.status,
            "created_at": r.created_at
        })
    return results

@router.post("/optimize", response_model=OptimizationResult)
def run_procurement_optimization(
    req: OptimizationRequest,
    db: Session = Depends(get_db)
):
    """
    Executes Google OR-Tools Mixed-Integer Linear Programming optimization
    to determine optimal purchase quantities and supplier allocations under budget constraints.
    """
    # Collect all products needing replenishment or with active recommendations
    products = db.query(Product).filter(Product.is_active == True).all()
    opt_input = []

    for p in products:
        deficit = p.reorder_point - p.current_stock
        if deficit > 0 or p.current_stock <= p.safety_stock:
            req_qty = max(20, int(deficit + p.safety_stock * 1.5))
            
            supp_quotes = []
            for sp in p.supplier_products:
                supp_quotes.append({
                    "supplier_id": sp.supplier_id,
                    "supplier_name": sp.supplier.name if sp.supplier else "Supplier",
                    "unit_cost": sp.unit_cost,
                    "lead_time_days": sp.lead_time_days,
                    "moq": sp.moq,
                    "reliability_score": sp.reliability_score,
                    "quality_score": sp.quality_score
                })

            if supp_quotes:
                opt_input.append({
                    "product_id": p.id,
                    "product_name": p.name,
                    "sku": p.sku,
                    "category": p.category.name if p.category else "General",
                    "current_stock": p.current_stock,
                    "reorder_point": p.reorder_point,
                    "safety_stock": p.safety_stock,
                    "forecast_30d": float(p.reorder_point * 1.8),
                    "required_qty": req_qty,
                    "unit_cost": p.unit_cost,
                    "suppliers": supp_quotes
                })

    if not opt_input:
        # Include top 10 products for simulation demo
        for p in products[:10]:
            supp_quotes = []
            for sp in p.supplier_products:
                supp_quotes.append({
                    "supplier_id": sp.supplier_id,
                    "supplier_name": sp.supplier.name if sp.supplier else "Supplier",
                    "unit_cost": sp.unit_cost,
                    "lead_time_days": sp.lead_time_days,
                    "moq": sp.moq,
                    "reliability_score": sp.reliability_score,
                    "quality_score": sp.quality_score
                })
            opt_input.append({
                "product_id": p.id,
                "product_name": p.name,
                "sku": p.sku,
                "category": p.category.name if p.category else "General",
                "current_stock": p.current_stock,
                "reorder_point": p.reorder_point,
                "safety_stock": p.safety_stock,
                "forecast_30d": float(p.reorder_point * 1.8),
                "required_qty": 50,
                "unit_cost": p.unit_cost,
                "suppliers": supp_quotes
            })

    result = procurement_optimizer.optimize_procurement(
        products_data=opt_input,
        budget_limit=req.budget_limit,
        max_lead_time_days=req.max_lead_time_days,
        min_supplier_score=req.min_supplier_score or 75.0
    )
    return result

@router.post("/recommendations/{id}/convert-to-po")
def convert_recommendation_to_po(id: int, db: Session = Depends(get_db)):
    rec = db.query(AIRecommendation).filter(AIRecommendation.id == id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")

    p = rec.product
    s_id = rec.recommended_supplier_id or (p.supplier_products[0].supplier_id if p.supplier_products else 1)
    
    # Create Purchase Order
    po_num = f"PO-{datetime.utcnow().strftime('%Y%m%d')}-{rec.id}"
    po = PurchaseOrder(
        po_number=po_num,
        supplier_id=s_id,
        order_date=datetime.utcnow(),
        expected_delivery=datetime.utcnow() + timedelta(days=p.lead_time_days or 3),
        status="Submitted",
        total_amount=rec.estimated_cost,
        budget_allocated=rec.estimated_cost * 1.1,
        notes=f"Auto-generated from AI Recommendation #{rec.id} for {p.name}.",
        created_by="AI Procurement Optimizer"
    )
    db.add(po)
    db.flush()

    po_item = PurchaseOrderItem(
        po_id=po.id,
        product_id=p.id,
        quantity=rec.recommended_qty,
        unit_cost=rec.estimated_cost / max(1, rec.recommended_qty),
        total_cost=rec.estimated_cost,
        received_quantity=0
    )
    db.add(po_item)
    rec.status = "Ordered"
    db.commit()

    return {
        "status": "success",
        "message": f"Successfully created Purchase Order {po_num}",
        "po_id": po.id,
        "po_number": po.po_number
    }
