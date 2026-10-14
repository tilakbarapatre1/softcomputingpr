from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.services.inventory_service import inventory_service

router = APIRouter(prefix="/analytics", tags=["Inventory Analytics & Decision Intelligence"])

@router.get("/abc")
def get_abc_analysis(db: Session = Depends(get_db)):
    return inventory_service.get_abc_analysis(db)

@router.get("/xyz")
def get_xyz_and_matrix(db: Session = Depends(get_db)):
    return inventory_service.get_xyz_and_matrix_analysis(db)

@router.get("/stockout-risk")
def get_stockout_risk(db: Session = Depends(get_db)):
    return inventory_service.get_stockout_risk_analysis(db)

@router.get("/overstock")
def get_overstock_analysis(db: Session = Depends(get_db)):
    return inventory_service.get_overstock_and_dead_stock_analysis(db)
