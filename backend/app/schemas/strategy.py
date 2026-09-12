from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from app.schemas.common import ProvenanceBadge

class StrategyCandidate(BaseModel):
    strategy_id: str
    name: str
    price: float
    target_segment: str
    trial_offer: str
    guarantee: str
    positioning: str
    adoption_rate: float
    margin_percentage: float
    revenue_index: float
    critic_score: float
    risk_level: str
    is_pareto_optimal: bool
    adoption_lift_vs_baseline: float

class StrategySearchResponse(BaseModel):
    total_strategies_evaluated: int
    optimal_strategy_id: str
    baseline_adoption_rate: float
    pareto_frontier_count: int
    strategies: List[StrategyCandidate]
    provenance: ProvenanceBadge
    optimization_objective: str
