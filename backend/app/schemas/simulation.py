from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from app.schemas.common import ConfidenceInterval, ProvenanceBadge

class SimulationExecuteRequest(BaseModel):
    product_name: str = "Pulse — AI Fitness Companion"
    price: float = 1999.0
    quality_score: float = 0.85
    brand_score: float = 0.60
    risk_score: float = 0.35
    social_proof_level: float = 0.50
    population_size: int = Field(default=10000, ge=100, le=10000)
    seed: Optional[int] = 42

class SegmentAdoptionMetric(BaseModel):
    segment_name: str
    population: int
    adopted_count: int
    adoption_rate: float
    intent_score_mean: float
    ci_lower: float
    ci_upper: float

class SimulationExecuteResponse(BaseModel):
    run_id: str
    product_name: str
    offered_price: float
    population_size: int
    adopted_count: int
    adoption_rate: float
    confidence_interval: ConfidenceInterval
    purchase_intent_mean: float
    strategy_score: float
    critic_risk_rating: str
    extrapolation_risk_score: float
    provenance: ProvenanceBadge
    segment_breakdown: List[SegmentAdoptionMetric]
    adoption_trend_30d: List[Dict[str, Any]]
    top_objections: List[Dict[str, Any]]

class SurveyQuestionRequest(BaseModel):
    question: str
    category: str = "PRICING_PERCEPTION"
    options: List[str] = [
        "Definitely would subscribe",
        "Probably would subscribe",
        "Might consider if discounted",
        "Prefer free alternatives",
        "Not interested at all"
    ]

class SurveyQuestionResponse(BaseModel):
    question: str
    sample_size: int
    distribution: Dict[str, float]
    provenance: ProvenanceBadge
    ci_95: Dict[str, List[float]]
    ai_interpretation: str
