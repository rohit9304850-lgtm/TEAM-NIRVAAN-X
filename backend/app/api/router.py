from fastapi import APIRouter
from app.api.endpoints import (
    market,
    personas,
    simulation,
    social,
    strategy,
    critic,
    forecast,
    backtest,
    reports
)

api_router = APIRouter()

api_router.include_router(market.router, prefix="/market", tags=["Market Setup & Competitors"])
api_router.include_router(personas.router, prefix="/personas", tags=["Persona Swarm & Audits"])
api_router.include_router(simulation.router, prefix="/simulation", tags=["Simulation & Surveys"])
api_router.include_router(social.router, prefix="/social", tags=["Social Opinion Dynamics"])
api_router.include_router(strategy.router, prefix="/strategy", tags=["Bayesian Strategy Search"])
api_router.include_router(critic.router, prefix="/critic", tags=["Adversarial Critic Agent"])
api_router.include_router(forecast.router, prefix="/forecast", tags=["Dual-Zone Forecasting"])
api_router.include_router(backtest.router, prefix="/backtest", tags=["Historical Backtesting"])
api_router.include_router(reports.router, prefix="/reports", tags=["Evidence-Based Reports"])
