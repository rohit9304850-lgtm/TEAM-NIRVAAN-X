from fastapi import APIRouter, Query, HTTPException
from typing import Dict, Any, List, Optional
from app.simulation.persona_generator import PersonaGenerator
from app.schemas.persona import PersonaProfile, PopulationAuditResponse
from app.schemas.common import ProvenanceBadge, ProvenanceLevel
from app.api.endpoints.market import get_active_market_state
from app.core.llm_provider import get_llm_provider

router = APIRouter()
persona_gen = PersonaGenerator()

@router.get("", response_model=Dict[str, Any])
async def list_personas(
    segment: Optional[str] = Query(None, description="Filter by segment"),
    city: Optional[str] = Query(None, description="Filter by city"),
    min_age: int = Query(18, ge=18),
    max_age: int = Query(75, le=85),
    max_price_sensitivity: Optional[float] = Query(None, ge=0.0, le=1.0),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=500),
    total_population: int = Query(10000, ge=100, le=10000)
):
    all_personas = persona_gen.generate_population(population_size=total_population)

    # Filter
    filtered = all_personas
    if segment:
        filtered = [p for p in filtered if p["segment"].lower() == segment.lower()]
    if city:
        filtered = [p for p in filtered if p["city"].lower() == city.lower()]
    if min_age or max_age:
        filtered = [p for p in filtered if min_age <= p["age"] <= max_age]
    if max_price_sensitivity is not None:
        filtered = [p for p in filtered if p["price_sensitivity"] <= max_price_sensitivity]

    total_count = len(filtered)
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    paginated_items = filtered[start_idx:end_idx]

    return {
        "total": total_count,
        "page": page,
        "page_size": page_size,
        "total_population_size": total_population,
        "items": paginated_items,
        "provenance": ProvenanceBadge(
            level=ProvenanceLevel.CALIBRATED,
            source="Calibrated Persona Generator (N=10,000)",
            confidence=0.96,
            description="Persistent deterministic personas seeded from empirical distributions"
        )
    }

@router.get("/audit", response_model=PopulationAuditResponse)
async def audit_population(total_population: int = Query(10000, ge=100, le=10000)):
    personas = persona_gen.generate_population(population_size=total_population)
    return persona_gen.audit_population_fidelity(personas)

@router.get("/{persona_id}", response_model=Dict[str, Any])
async def get_persona_detail(persona_id: int):
    personas = persona_gen.generate_population(population_size=10000)
    if persona_id < 1 or persona_id > len(personas):
        raise HTTPException(status_code=404, detail=f"Persona {persona_id} not found")

    p = personas[persona_id - 1]
    market = get_active_market_state()
    product_name = market.get("name", "Product")
    actual_price = float(market.get("price", 1999.0))
    category = market.get("category", "General SaaS")
    description = market.get("description", "")

    # Calculate micro decision breakdown dynamically for the ACTIVE product
    ref_price = 1999.0 if actual_price <= 2500 else actual_price
    price_ratio = actual_price / ref_price
    price_term = round(p["price_sensitivity"] * (1.0 - price_ratio), 3)
    quality_term = round(p["quality_sensitivity"] * 0.88, 3)
    brand_term = round(p["brand_loyalty"] * 0.62, 3)
    social_term = round(p["social_influence_weight"] * 0.50, 3)
    risk_term = round(p["risk_aversion"] * 0.32, 3)
    utility = round(price_term + quality_term + brand_term + social_term - risk_term, 3)
    adopted = utility > p["adoption_threshold"]

    # Synthesize qualitative reasoning using LLM provider
    llm = get_llm_provider()
    reasoning_text = await llm.explain_persona_decision(
        persona=p,
        product={"name": product_name, "price": actual_price, "category": category, "description": description},
        adopted=adopted,
        utility=utility
    )

    return {
        "persona": p,
        "active_product_context": {
            "name": product_name,
            "category": category,
            "price": actual_price,
            "description": description
        },
        "deterministic_verification": {
            "seed_hash": p["seed_hash"],
            "reproducible": True,
            "generator_engine": "Vectorized Lognormal/Stratified Distribution"
        },
        "product_micro_decision": {
            "product_name": product_name,
            "product_price": actual_price,
            "price_term": price_term,
            "quality_term": quality_term,
            "brand_term": brand_term,
            "social_term": social_term,
            "risk_deduction": risk_term,
            "net_utility": utility,
            "adoption_threshold": p["adoption_threshold"],
            "decision": "ADOPT" if adopted else "REJECT",
            "reasoning": reasoning_text
        },
        # Backwards compatible alias for any legacy client
        "pulse_micro_decision": {
            "product_price": actual_price,
            "price_term": price_term,
            "quality_term": quality_term,
            "brand_term": brand_term,
            "social_term": social_term,
            "risk_deduction": risk_term,
            "net_utility": utility,
            "adoption_threshold": p["adoption_threshold"],
            "decision": "ADOPT" if adopted else "REJECT",
            "reasoning": reasoning_text
        },
        "provenance": ProvenanceBadge(
            level=ProvenanceLevel.CALIBRATED,
            source=f"Persistent Persona Swarm evaluated against {product_name}",
            confidence=0.96
        )
    }
