from typing import List, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.models import InventoryAlert, Product
from app.schemas.schemas import AlertOut

router = APIRouter(prefix="/inventory", tags=["Inventory Operations"])

class StockAdjustment(BaseModel):
    product_id: int
    adjustment_quantity: int  # e.g., +50 or -10
    reason: str

@router.get("/alerts", response_model=List[AlertOut])
def get_alerts(
    unread_only: bool = False,
    severity: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(InventoryAlert)
    if unread_only:
        query = query.filter(InventoryAlert.is_read == False)
    if severity:
        query = query.filter(InventoryAlert.severity == severity)
        
    alerts = query.order_by(InventoryAlert.created_at.desc()).limit(100).all()
    
    results = []
    for a in alerts:
        results.append({
            "id": a.id,
            "product_id": a.product_id,
            "product_name": a.product.name if a.product else None,
            "alert_type": a.alert_type,
            "severity": a.severity,
            "message": a.message,
            "is_read": a.is_read,
            "created_at": a.created_at
        })
    return results

@router.patch("/alerts/{id}/read")
def mark_alert_read(id: int, db: Session = Depends(get_db)):
    alert = db.query(InventoryAlert).filter(InventoryAlert.id == id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.is_read = True
    db.commit()
    return {"status": "success", "message": "Alert marked as read"}

@router.post("/adjust")
def adjust_stock(adj: StockAdjustment, db: Session = Depends(get_db)):
    prod = db.query(Product).filter(Product.id == adj.product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    new_stock = max(0, prod.current_stock + adj.adjustment_quantity)
    prod.current_stock = new_stock
    db.commit()

    return {
        "status": "success",
        "message": f"Updated stock for {prod.name} to {new_stock} units.",
        "product_id": prod.id,
        "new_stock": new_stock
    }
