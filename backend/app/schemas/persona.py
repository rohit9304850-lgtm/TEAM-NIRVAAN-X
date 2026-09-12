from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from app.schemas.common import ProvenanceBadge

class PersonaProfile(BaseModel):
    persona_id: int
    seed_hash: str
    name: str
    age: int
    gender: str
    city: str
    tier: str
    income_bracket: str
    monthly_income_inr: float
    education: str
    tech_literacy: float
    segment: str
    price_sensitivity: float
    quality_sensitivity: float
    brand_loyalty: float
    innovation_affinity: float
    risk_aversion: float
    social_influence_weight: float
    adoption_threshold: float
    latent_utility_score: Optional[float] = None
    adopted_pulse: Optional[bool] = None

class PersonaQueryFilter(BaseModel):
    segment: Optional[str] = None
    min_age: Optional[int] = 18
    max_age: Optional[int] = 70
    city: Optional[str] = None
    max_price_sensitivity: Optional[float] = None
    page: int = 1
    page_size: int = 50

class DemographicFidelity(BaseModel):
    dimension: str
    target_distribution: Dict[str, float]
    simulated_distribution: Dict[str, float]
    kl_divergence: float
    wasserstein_distance: float
    fidelity_score: float

class PopulationAuditResponse(BaseModel):
    total_population: int
    global_seed: int
    dataset_version: str
    overall_fidelity_score: float
    kl_divergence_mean: float
    provenance: ProvenanceBadge
    audit_dimensions: List[DemographicFidelity]
