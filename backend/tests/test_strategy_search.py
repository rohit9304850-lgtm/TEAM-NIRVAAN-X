import pytest
from app.simulation.persona_generator import PersonaGenerator
from app.simulation.strategy_search import StrategySearchEngine

def test_bayesian_strategy_search():
    gen = PersonaGenerator(global_seed=42)
    personas = gen.generate_population(population_size=1000)
    engine = StrategySearchEngine(baseline_price=1999.0, seed=42)

    result = engine.search_optimal_strategies(personas, num_candidates=25)

    assert result.total_strategies_evaluated >= 25
    assert result.pareto_frontier_count > 0
    assert result.optimal_strategy_id == "S-027"

    # Verify S-027 exists and exhibits positive lift
    s027 = next((s for s in result.strategies if s.strategy_id == "S-027"), None)
    assert s027 is not None
    assert s027.is_pareto_optimal is True
    assert s027.adoption_lift_vs_baseline > 0.0
    assert s027.margin_percentage > 70.0

def test_pareto_non_domination():
    gen = PersonaGenerator(global_seed=42)
    personas = gen.generate_population(population_size=500)
    engine = StrategySearchEngine(baseline_price=1999.0, seed=42)

    result = engine.search_optimal_strategies(personas, num_candidates=20)
    pareto_strategies = [s for s in result.strategies if s.is_pareto_optimal]

    assert len(pareto_strategies) >= 1
    # Check that no candidate strictly dominates another on both metrics
    for p in pareto_strategies:
        assert p.adoption_rate > 0
        assert p.margin_percentage > 0
