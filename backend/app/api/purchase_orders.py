from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.models import PurchaseOrder, PurchaseOrderItem, Product, Supplier
from app.schemas.schemas import PurchaseOrderOut, PurchaseOrderCreate, PurchaseOrderUpdate

router = APIRouter(prefix="/purchase-orders", tags=["Purchase Orders"])

@router.get("", response_model=List[PurchaseOrderOut])
def list_purchase_orders(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(PurchaseOrder)
    if status:
        query = query.filter(PurchaseOrder.status == status)
    pos = query.order_by(PurchaseOrder.order_date.desc()).all()

    results = []
    for po in pos:
        items = []
        for item in po.items:
            items.append({
                "id": item.id,
                "product_id": item.product_id,
                "product_name": item.product.name if item.product else "Product",
                "product_sku": item.product.sku if item.product else "",
                "quantity": item.quantity,
                "unit_cost": item.unit_cost,
                "total_cost": item.total_cost,
                "received_quantity": item.received_quantity
            })
        results.append({
            "id": po.id,
            "po_number": po.po_number,
            "supplier_id": po.supplier_id,
            "supplier_name": po.supplier.name if po.supplier else "Supplier",
            "order_date": po.order_date,
            "expected_delivery": po.expected_delivery,
            "status": po.status,
            "total_amount": po.total_amount,
            "budget_allocated": po.budget_allocated,
            "notes": po.notes,
            "created_by": po.created_by,
            "items": items
        })
    return results

@router.get("/{id}", response_model=PurchaseOrderOut)
def get_purchase_order(id: int, db: Session = Depends(get_db)):
    po = db.query(PurchaseOrder).filter(PurchaseOrder.id == id).first()
    if not po:
        raise HTTPException(status_code=404, detail="Purchase order not found")

    items = []
    for item in po.items:
        items.append({
            "id": item.id,
            "product_id": item.product_id,
            "product_name": item.product.name if item.product else "Product",
            "product_sku": item.product.sku if item.product else "",
            "quantity": item.quantity,
            "unit_cost": item.unit_cost,
            "total_cost": item.total_cost,
            "received_quantity": item.received_quantity
        })

    return {
        "id": po.id,
        "po_number": po.po_number,
        "supplier_id": po.supplier_id,
        "supplier_name": po.supplier.name if po.supplier else "Supplier",
        "order_date": po.order_date,
        "expected_delivery": po.expected_delivery,
        "status": po.status,
        "total_amount": po.total_amount,
        "budget_allocated": po.budget_allocated,
        "notes": po.notes,
        "created_by": po.created_by,
        "items": items
    }

@router.post("", response_model=PurchaseOrderOut)
def create_purchase_order(po_in: PurchaseOrderCreate, db: Session = Depends(get_db)):
    supplier = db.query(Supplier).filter(Supplier.id == po_in.supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")

    po_number = f"PO-{datetime.utcnow().strftime('%Y%m%d%H%M')}"
    po = PurchaseOrder(
        po_number=po_number,
        supplier_id=po_in.supplier_id,
        order_date=datetime.utcnow(),
        expected_delivery=po_in.expected_delivery,
        status="Submitted",
        total_amount=0.0,
        budget_allocated=po_in.budget_allocated or 0.0,
        notes=po_in.notes,
        created_by="Admin"
    )
    db.add(po)
    db.flush()

    total_amount = 0.0
    for item_in in po_in.items:
        line_total = item_in.quantity * item_in.unit_cost
        total_amount += line_total
        po_item = PurchaseOrderItem(
            po_id=po.id,
            product_id=item_in.product_id,
            quantity=item_in.quantity,
            unit_cost=item_in.unit_cost,
            total_cost=line_total,
            received_quantity=0
        )
        db.add(po_item)

    po.total_amount = round(total_amount, 2)
    db.commit()
    db.refresh(po)
    return get_purchase_order(po.id, db)

@router.patch("/{id}/status")
def update_po_status(id: int, status_update: PurchaseOrderUpdate, db: Session = Depends(get_db)):
    po = db.query(PurchaseOrder).filter(PurchaseOrder.id == id).first()
    if not po:
        raise HTTPException(status_code=404, detail="Purchase order not found")

    if status_update.status:
        po.status = status_update.status
        # If received, update current inventory stock accordingly!
        if status_update.status == "Received":
            for item in po.items:
                p = item.product
                if p:
                    p.current_stock += item.quantity
                    item.received_quantity = item.quantity

    if status_update.notes:
        po.notes = status_update.notes

    db.commit()
    return {"status": "success", "message": f"PO {po.po_number} status updated to {po.status}."}
