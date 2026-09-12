from fastapi import APIRouter, Query
from typing import Dict, Any, Optional
from app.simulation.critic_engine import AdversarialCriticEngine
from app.api.endpoints.market import get_active_market_state

router = APIRouter()
critic_engine = AdversarialCriticEngine()

@router.get("/audit", response_model=Dict[str, Any])
async def get_critic_audit(
    price: Optional[float] = Query(None),
    simulated_adoption: float = Query(0.318)
):
    market = get_active_market_state()
    effective_price = price if price is not None else float(market.get("price", 1999.0))
    product_name = market.get("name", "Product")
    category = market.get("category", "General SaaS")
    description = market.get("description", "")

    return critic_engine.run_adversarial_audit(
        product_name=product_name,
        price=effective_price,
        simulated_adoption=simulated_adoption,
        category=category,
        description=description
    )
