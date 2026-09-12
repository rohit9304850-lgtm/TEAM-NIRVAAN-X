from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import init_db
from app.api.router import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    await init_db()
    yield

app = FastAPI(
    title="SWARMIQ — Autonomous Market Intelligence Engine",
    description="Agentic market simulations, social opinion dynamics, Bayesian strategy search, and evidence-based reporting across 10,000 persistent calibrated AI personas.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include consolidated API router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "engine": "SWARMIQ",
        "tagline": "Simulate the market before you enter it.",
        "version": "1.0.0",
        "status": "OPERATIONAL",
        "demo_mode": settings.DEMO_MODE,
        "docs_url": "/docs",
        "api_v1": "/api/v1"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "engine_ready": True,
        "demo_mode": settings.DEMO_MODE
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
