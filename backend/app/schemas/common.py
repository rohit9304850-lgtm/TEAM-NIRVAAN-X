from enum import Enum
from pydantic import BaseModel, Field
from typing import Optional, List, Any

class ProvenanceLevel(str, Enum):
    EMPIRICAL = "EMPIRICAL"
    CALIBRATED = "CALIBRATED"
    SIMULATED = "SIMULATED"
    EXTRAPOLATED = "EXTRAPOLATED"
    LOW_CONFIDENCE = "LOW_CONFIDENCE"

class ProvenanceBadge(BaseModel):
    level: ProvenanceLevel
    source: str
    confidence: float = Field(ge=0.0, le=1.0, default=0.95)
    description: Optional[str] = None

class ConfidenceInterval(BaseModel):
    mean: float
    ci_lower: float
    ci_upper: float
    confidence_level: float = 0.95
    margin_of_error: float
    sample_size: int
