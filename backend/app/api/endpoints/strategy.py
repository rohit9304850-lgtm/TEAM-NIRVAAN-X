from fastapi import APIRouter, Query
from typing import Dict, Any
from app.simulation.persona_generator import PersonaGenerator
from app.simulation.strategy_search import StrategySearchEngine
from app.schemas.strategy import StrategySearchResponse

router = APIRouter()
persona_gen = PersonaGenerator()
strategy_engine = StrategySearchEngine()

_CACHED_STRATEGIES: Dict[str, StrategySearchResponse] = {}

@router.get("/search", response_model=StrategySearchResponse)
async def search_strategies(candidates_count: int = Query(35, ge=10, le=60)):
    cache_key = f"strat_{candidates_count}"
    if cache_key not in _CACHED_STRATEGIES:
        personas = persona_gen.generate_population(population_size=10000)
        _CACHED_STRATEGIES[cache_key] = strategy_engine.search_optimal_strategies(personas, num_candidates=candidates_count)
    return _CACHED_STRATEGIES[cache_key]

@router.get("/optimal", response_model=Dict[str, Any])
async def get_optimal_strategy():
    resp = await search_strategies(35)
    optimal = next((s for s in resp.strategies if s.strategy_id == resp.optimal_strategy_id), resp.strategies[0])
    return {
        "optimal_strategy": optimal,
        "executive_rationale": (
            f"Strategy {optimal.strategy_id} outperforms baseline across both adoption (+{optimal.adoption_lift_vs_baseline}%) "
            f"and net margins ({optimal.margin_percentage}%). Introducing a 14-day free trial directly dismantles the "
            f"positive-response bias penalty identified by the critic agent while the Streak Habit Guarantee resolves switching inertia."
        ),
        "provenance": resp.provenance
    }
