from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.schemas import AICopilotQuery, AICopilotResponse
from app.services.ai_copilot_service import ai_copilot

router = APIRouter(prefix="/ai", tags=["AI Copilot"])

@router.post("/ask", response_model=AICopilotResponse)
def ask_ai_assistant(query_data: AICopilotQuery, db: Session = Depends(get_db)):
    """
    Direct natural language AI Assistant query grounded in live database state.
    """
    res = ai_copilot.answer_query(query_data.query, db)
    return res
