import io
import csv
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.models import Product, Supplier, PurchaseOrder, AIRecommendation, SalesItem, Category

router = APIRouter(prefix="/reports", tags=["Reporting & Exports"])

@router.get("/export/{report_type}")
def export_report_csv(report_type: str, db: Session = Depends(get_db)):
    """
    Exports CSV reports for Inventory, Sales, Procurement, Suppliers, and AI Recommendations.
    """
    output = io.StringIO()
    writer = csv.writer(output)

    if report_type == "inventory":
        products = db.query(Product).filter(Product.is_active == True).all()
        writer.writerow([
            "SKU", "Product Name", "Category", "Current Stock", "Unit", "Unit Cost (INR)",
            "Selling Price (INR)", "Reorder Point", "Safety Stock", "ABC Class", "XYZ Class", "Valuation (INR)"
        ])
        for p in products:
            writer.writerow([
                p.sku, p.name, p.category.name if p.category else "", p.current_stock, p.unit,
                p.unit_cost, p.selling_price, p.reorder_point, p.safety_stock, p.abc_class, p.xyz_class,
                round(p.current_stock * p.unit_cost, 2)
            ])
        filename = f"inventory_report_{datetime.utcnow().strftime('%Y%m%d')}.csv"

    elif report_type == "procurement":
        pos = db.query(PurchaseOrder).order_by(PurchaseOrder.order_date.desc()).all()
        writer.writerow([
            "PO Number", "Supplier", "Order Date", "Expected Delivery", "Status",
            "Total Amount (INR)", "Budget Allocated (INR)", "Created By"
        ])
        for po in pos:
            writer.writerow([
                po.po_number, po.supplier.name if po.supplier else "",
                po.order_date.strftime("%Y-%m-%d"),
                po.expected_delivery.strftime("%Y-%m-%d") if po.expected_delivery else "",
                po.status, po.total_amount, po.budget_allocated, po.created_by
            ])
        filename = f"procurement_report_{datetime.utcnow().strftime('%Y%m%d')}.csv"

    elif report_type == "suppliers":
        supps = db.query(Supplier).all()
        writer.writerow([
            "Supplier Name", "City", "Contact Email", "Phone", "On-Time Rate (%)",
            "Quality Score (%)", "Reliability Score (%)", "Overall Score (%)", "Payment Terms"
        ])
        for s in supps:
            overall = round((s.on_time_rate * 0.4) + (s.quality_score * 0.3) + (s.reliability_score * 0.3), 1)
            writer.writerow([
                s.name, s.city, s.contact_email, s.phone, s.on_time_rate,
                s.quality_score, s.reliability_score, overall, s.payment_terms
            ])
        filename = f"suppliers_report_{datetime.utcnow().strftime('%Y%m%d')}.csv"

    elif report_type == "recommendations":
        recs = db.query(AIRecommendation).all()
        writer.writerow([
            "Product SKU", "Product Name", "Current Stock", "Reorder Point", "Recommended Qty",
            "Recommended Supplier", "Estimated Cost (INR)", "Potential Savings (INR)", "Urgency", "Status"
        ])
        for r in recs:
            writer.writerow([
                r.product.sku if r.product else "",
                r.product.name if r.product else "",
                r.current_stock, r.reorder_point, r.recommended_qty,
                r.supplier.name if r.supplier else "",
                r.estimated_cost, r.potential_savings, r.urgency, r.status
            ])
        filename = f"ai_recommendations_report_{datetime.utcnow().strftime('%Y%m%d')}.csv"

    else:
        raise HTTPException(status_code=400, detail="Invalid report type. Allowed: inventory, procurement, suppliers, recommendations")

    output.seek(0)
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
