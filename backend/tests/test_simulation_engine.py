import pytest
from app.simulation.persona_generator import PersonaGenerator
from app.simulation.decision_policy import DecisionPolicyEngine, compute_wilson_score_interval
from app.schemas.simulation import SimulationExecuteRequest

def test_wilson_score_interval():
    rate, lower, upper = compute_wilson_score_interval(successes=318, total=1000, confidence=0.95)
    assert rate == 0.318
    assert lower < rate < upper
    assert 0.28 < lower < 0.31
    assert 0.33 < upper < 0.36

def test_price_elasticity_monotonicity():
    gen = PersonaGenerator(global_seed=42)
    personas = gen.generate_population(population_size=1000)
    engine = DecisionPolicyEngine(ref_price=1999.0)

    # Low price vs High price
    req_cheap = SimulationExecuteRequest(price=999.0, population_size=1000, seed=42)
    req_expensive = SimulationExecuteRequest(price=2999.0, population_size=1000, seed=42)

    res_cheap = engine.evaluate_product(personas, req_cheap)
    res_expensive = engine.evaluate_product(personas, req_expensive)

    # Demand law: Higher price must lead to lower or equal adoption rate
    assert res_cheap.adoption_rate > res_expensive.adoption_rate, (
        f"Adoption rate at ₹999 ({res_cheap.adoption_rate}) should exceed ₹2999 ({res_expensive.adoption_rate})"
    )

def test_segment_differentiation():
    gen = PersonaGenerator(global_seed=42)
    personas = gen.generate_population(population_size=1000)
    engine = DecisionPolicyEngine(ref_price=1999.0)

    req = SimulationExecuteRequest(price=1999.0, population_size=1000, seed=42)
    res = engine.evaluate_product(personas, req)

    seg_rates = {s.segment_name: s.adoption_rate for s in res.segment_breakdown}
    assert "Fitness Enthusiasts" in seg_rates
    assert "Price-Sensitive Beginners" in seg_rates
    # Fitness enthusiasts should have higher adoption for premium fitness app than price sensitive beginners
    assert seg_rates["Fitness Enthusiasts"] > seg_rates["Price-Sensitive Beginners"]

def test_custom_product_intelligence():
    gen = PersonaGenerator(global_seed=42)
    personas = gen.generate_population(population_size=500)
    engine = DecisionPolicyEngine(ref_price=1999.0)

    # Dev Tool Product
    req_dev = SimulationExecuteRequest(
        product_name="DevScribe AI — Automated OpenAPI Doc Generator",
        price=4999.0,
        population_size=500,
        seed=42
    )
    res_dev = engine.evaluate_product(
        personas=personas,
        req=req_dev,
        category="Developer Tools / B2B SaaS",
        description="Scans Git repos and auto-generates live interactive OpenAPI documentation and SDKs."
    )

    assert res_dev.product_name == "DevScribe AI — Automated OpenAPI Doc Generator"
    assert len(res_dev.top_objections) >= 4
    # Check that objections contain software/code/IP themes
    objection_texts = " ".join([o["objection"].lower() for o in res_dev.top_objections])
    assert any(k in objection_texts for k in ["code", "api", "security", "developer", "git", "cli"])

    # FinTech Product
    req_fin = SimulationExecuteRequest(
        product_name="FinIQ — Automated Indian Tax & Wealth AI Coach",
        price=1499.0,
        population_size=500,
        seed=42
    )
    res_fin = engine.evaluate_product(
        personas=personas,
        req=req_fin,
        category="FinTech & Wealth Management",
        description="Analyzes Form 16, AIS, and demat accounts to optimize capital gains and ITR filing."
    )
    assert res_fin.product_name == "FinIQ — Automated Indian Tax & Wealth AI Coach"
    fin_objections = " ".join([o["objection"].lower() for o in res_fin.top_objections])
    assert any(k in fin_objections for k in ["finan", "tax", "bank", "wealth", "ca", "account"])

    # EdTech Product
    req_edu = SimulationExecuteRequest(
        product_name="EduSpark Pro — JEE & NEET AI Rank Accelerator",
        price=2999.0,
        population_size=500,
        seed=42
    )
    res_edu = engine.evaluate_product(
        personas=personas,
        req=req_edu,
        category="EdTech & Test Prep",
        description="Predictive mock exam diagnostic that pinpoints conceptual misconceptions."
    )
    assert res_edu.product_name == "EduSpark Pro — JEE & NEET AI Rank Accelerator"
    edu_objections = " ".join([o["objection"].lower() for o in res_edu.top_objections])
    assert any(k in edu_objections for k in ["outcome", "exam", "rank", "peer", "youtube", "tutor"])

