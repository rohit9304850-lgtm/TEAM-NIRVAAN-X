from pydantic import BaseModel, Field
from typing import List, Optional

class CompetitorSchema(BaseModel):
    name: str
    price: float
    quality_score: float = Field(ge=0.0, le=1.0)
    brand_score: float = Field(ge=0.0, le=1.0)
    risk_score: float = Field(ge=0.0, le=1.0)
    market_share: Optional[float] = 0.0

class TargetSegmentSchema(BaseModel):
    segment_id: str
    name: str
    prevalence: float
    willingness_to_pay_median_inr: float
    price_sensitivity_mean: float
    quality_sensitivity_mean: float

class MarketSetupRequest(BaseModel):
    name: str = "Pulse — AI Fitness Companion"
    category: str = "Health & Fitness SaaS"
    price: float = 1999.0
    geography: str = "Urban India (Tier 1 & Tier 2)"
    description: Optional[str] = "AI-powered adaptive fitness coach with WhatsApp accountability integration."
    competitors: List[CompetitorSchema] = []
    segments: List[TargetSegmentSchema] = []
    dataset_version: str = "2024.2-Q3"

class MarketSetupResponse(BaseModel):
    project_id: str
    name: str
    category: str
    price: float
    geography: str
    status: str = "CONFIGURED"
    competitors_count: int
    segments_count: int
    dataset_source: str
