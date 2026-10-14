from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.schemas import DashboardSummaryOut
from app.services.inventory_service import inventory_service

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary", response_model=DashboardSummaryOut)
def get_dashboard_summary(db: Session = Depends(get_db)):
    return inventory_service.get_dashboard_summary(db)
