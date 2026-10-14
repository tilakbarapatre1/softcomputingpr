from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database.session import engine, Base, SessionLocal
from app.services.seed_service import seed_database_data

from app.api.auth import router as auth_router
from app.api.dashboard import router as dashboard_router
from app.api.products import router as products_router
from app.api.forecast import router as forecast_router
from app.api.procurement import router as procurement_router
from app.api.suppliers import router as suppliers_router
from app.api.purchase_orders import router as po_router
from app.api.analytics import router as analytics_router
from app.api.simulation import router as simulation_router
from app.api.ai_assistant import router as ai_router
from app.api.inventory import router as inventory_router
from app.api.reports import router as reports_router

# Initialize database schema
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-seed database with realistic retail dataset on startup if not already seeded
    db = SessionLocal()
    try:
        seed_database_data(db)
    except Exception as e:
        print(f"Database seed notice: {e}")
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Smart Inventory & Procurement Optimizer using AI-Driven Demand Forecasting and Decision Intelligence",
    lifespan=lifespan
)

# CORS configuration for Frontend connectivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(dashboard_router, prefix=settings.API_V1_STR)
app.include_router(products_router, prefix=settings.API_V1_STR)
app.include_router(forecast_router, prefix=settings.API_V1_STR)
app.include_router(procurement_router, prefix=settings.API_V1_STR)
app.include_router(suppliers_router, prefix=settings.API_V1_STR)
app.include_router(po_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)
app.include_router(simulation_router, prefix=settings.API_V1_STR)
app.include_router(ai_router, prefix=settings.API_V1_STR)
app.include_router(inventory_router, prefix=settings.API_V1_STR)
app.include_router(reports_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs_url": "/docs",
        "api_v1": settings.API_V1_STR
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
