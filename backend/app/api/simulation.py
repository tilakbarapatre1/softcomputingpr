from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.schemas import SimulationRequest, SimulationResult
from app.services.inventory_service import inventory_service

router = APIRouter(prefix="/simulation", tags=["What-If Simulation Engine"])

@router.post("/run", response_model=SimulationResult)
def run_simulation(req: SimulationRequest, db: Session = Depends(get_db)):
    """
    Simulates demand shocks, supplier lead-time delays, cost inflations, and budget constraints.
    """
    return inventory_service.run_what_if_simulation(
        db=db,
        demand_change_pct=req.demand_change_pct,
        lead_time_change_days=req.lead_time_change_days,
        cost_change_pct=req.cost_change_pct,
        budget_limit=req.budget_limit
    )
