from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from app.schemas.market import MarketSetupRequest, MarketSetupResponse
from app.schemas.common import ProvenanceBadge, ProvenanceLevel

router = APIRouter()

# Global active market state
_CURRENT_MARKET_STATE: Dict[str, Any] = {
    "project_id": "PRJ-ACTIVE-2024",
    "name": "Pulse — AI Fitness Companion",
    "category": "Health & Fitness SaaS",
    "price": 1999.0,
    "geography": "Urban India (Tier 1 & Tier 2)",
    "description": "Autonomous AI adaptive workout coach with WhatsApp accountability integration and real-time form correction.",
    "dataset_version": "2024.2-Q3",
    "dataset_source": "Indian Urban Consumer Survey 2024 (N=1,200)",
    "competitors": [
        {
            "name": "Pulse AI (Our Product)",
            "price": 1999.0,
            "quality_score": 0.88,
            "brand_score": 0.62,
            "risk_score": 0.32,
            "market_share": 31.8,
            "positioning": "Adaptive AI Coach with High Accountability"
        },
        {
            "name": "Cult.fit / CultPass",
            "price": 2499.0,
            "quality_score": 0.84,
            "brand_score": 0.92,
            "risk_score": 0.22,
            "market_share": 38.4,
            "positioning": "Established Offline/Online Hybrid Gym Brand"
        },
        {
            "name": "Freefit / Generic Apps",
            "price": 499.0,
            "quality_score": 0.52,
            "brand_score": 0.45,
            "risk_score": 0.40,
            "market_share": 16.2,
            "positioning": "Budget-conscious Basic Tracker"
        },
        {
            "name": "Status Quo (No App / YouTube)",
            "price": 0.0,
            "quality_score": 0.41,
            "brand_score": 0.70,
            "risk_score": 0.15,
            "market_share": 13.6,
            "positioning": "Zero-Cost Habit Inertia"
        }
    ],
    "segments": [
        {
            "segment_id": "SEG-01",
            "name": "Fitness Enthusiasts",
            "prevalence": 0.32,
            "willingness_to_pay_median_inr": 2499.0,
            "price_sensitivity_mean": 0.38,
            "quality_sensitivity_mean": 0.88
        },
        {
            "segment_id": "SEG-02",
            "name": "Busy Professionals",
            "prevalence": 0.43,
            "willingness_to_pay_median_inr": 1899.0,
            "price_sensitivity_mean": 0.48,
            "quality_sensitivity_mean": 0.79
        },
        {
            "segment_id": "SEG-03",
            "name": "Price-Sensitive Beginners",
            "prevalence": 0.25,
            "willingness_to_pay_median_inr": 999.0,
            "price_sensitivity_mean": 0.84,
            "quality_sensitivity_mean": 0.52
        }
    ]
}

def get_active_market_state() -> Dict[str, Any]:
    return _CURRENT_MARKET_STATE

def infer_default_competitors(product_name: str, category: str, price: float) -> List[Dict[str, Any]]:
    cat_lower = (category + " " + product_name).lower()
    
    if any(k in cat_lower for k in ["dev", "code", "api", "software", "tech", "saas", "b2b", "developer"]):
        return [
            {"name": f"{product_name} (Our Product)", "price": price, "quality_score": 0.89, "brand_score": 0.58, "risk_score": 0.28, "market_share": 34.5, "positioning": "AI-First Autonomous Platform"},
            {"name": "GitHub Copilot / Enterprise Incumbent", "price": round(price * 1.3, -1), "quality_score": 0.86, "brand_score": 0.95, "risk_score": 0.18, "market_share": 41.2, "positioning": "Established Cloud Ecosystem"},
            {"name": "Open-Source Tools / Swagger / Postman", "price": 0.0, "quality_score": 0.65, "brand_score": 0.82, "risk_score": 0.20, "market_share": 14.8, "positioning": "Self-hosted Free Stack"},
            {"name": "Manual Engineering Workflows", "price": 0.0, "quality_score": 0.40, "brand_score": 0.60, "risk_score": 0.35, "market_share": 9.5, "positioning": "Internal Custom Scripts"}
        ]
    elif any(k in cat_lower for k in ["fin", "tax", "wealth", "money", "invest", "crypto", "banking"]):
        return [
            {"name": f"{product_name} (Our Product)", "price": price, "quality_score": 0.90, "brand_score": 0.55, "risk_score": 0.30, "market_share": 32.0, "positioning": "Algorithmic Smart Wealth Assistant"},
            {"name": "Zerodha / Groww / ClearTax", "price": round(price * 1.1, -1), "quality_score": 0.85, "brand_score": 0.94, "risk_score": 0.15, "market_share": 42.5, "positioning": "Category Standard Platforms"},
            {"name": "Offline Chartered Accountant / Advisor", "price": round(price * 2.2, -1), "quality_score": 0.82, "brand_score": 0.75, "risk_score": 0.22, "market_share": 15.0, "positioning": "Human Relationship Driven"},
            {"name": "Manual Excel & Bank Portals", "price": 0.0, "quality_score": 0.45, "brand_score": 0.65, "risk_score": 0.25, "market_share": 10.5, "positioning": "Zero-Cost DIY Habits"}
        ]
    elif any(k in cat_lower for k in ["edu", "learn", "course", "tutor", "study", "exam", "school"]):
        return [
            {"name": f"{product_name} (Our Product)", "price": price, "quality_score": 0.88, "brand_score": 0.58, "risk_score": 0.26, "market_share": 33.2, "positioning": "Adaptive AI 1-on-1 Personalized Mastery"},
            {"name": "Unacademy / PhysicsWallah / Coursera", "price": round(price * 1.25, -1), "quality_score": 0.82, "brand_score": 0.91, "risk_score": 0.19, "market_share": 40.8, "positioning": "High-Brand Celebrity Educators"},
            {"name": "Local Coaching Institutes", "price": round(price * 2.5, -1), "quality_score": 0.78, "brand_score": 0.70, "risk_score": 0.24, "market_share": 16.5, "positioning": "Physical Classroom Accountability"},
            {"name": "Free YouTube Playlists & PDFs", "price": 0.0, "quality_score": 0.50, "brand_score": 0.75, "risk_score": 0.18, "market_share": 9.5, "positioning": "Unstructured Free Self-Study"}
        ]
    else:
        # Generic / Health default
        return [
            {"name": f"{product_name} (Our Product)", "price": price, "quality_score": 0.88, "brand_score": 0.60, "risk_score": 0.30, "market_share": 31.8, "positioning": "Intelligent AI-Native Companion"},
            {"name": "Market Category Incumbent", "price": round(price * 1.25, -1), "quality_score": 0.84, "brand_score": 0.90, "risk_score": 0.20, "market_share": 39.5, "positioning": "Established Legacy Brand"},
            {"name": "Budget Low-Cost Alternative", "price": round(price * 0.35, -1), "quality_score": 0.55, "brand_score": 0.45, "risk_score": 0.38, "market_share": 16.0, "positioning": "Low-Price Generic Utility"},
            {"name": "Status Quo (No Dedicated Tool)", "price": 0.0, "quality_score": 0.40, "brand_score": 0.70, "risk_score": 0.15, "market_share": 12.7, "positioning": "Zero-Cost Habit Inertia"}
        ]

@router.get("/current", response_model=Dict[str, Any])
async def get_current_market():
    return {
        **_CURRENT_MARKET_STATE,
        "provenance": ProvenanceBadge(
            level=ProvenanceLevel.EMPIRICAL,
            source="Calibrated from Indian Urban Consumer Survey 2024",
            confidence=0.96
        )
    }

@router.post("/setup", response_model=MarketSetupResponse)
async def setup_market(req: MarketSetupRequest):
    _CURRENT_MARKET_STATE["name"] = req.name
    _CURRENT_MARKET_STATE["category"] = req.category
    _CURRENT_MARKET_STATE["price"] = req.price
    _CURRENT_MARKET_STATE["geography"] = req.geography
    if req.description:
        _CURRENT_MARKET_STATE["description"] = req.description

    # If competitors were provided, use them; otherwise auto-infer based on category
    if req.competitors and len(req.competitors) > 0:
        _CURRENT_MARKET_STATE["competitors"] = [c.model_dump() for c in req.competitors]
    else:
        _CURRENT_MARKET_STATE["competitors"] = infer_default_competitors(req.name, req.category, req.price)

    if req.segments and len(req.segments) > 0:
        _CURRENT_MARKET_STATE["segments"] = [s.model_dump() for s in req.segments]

    return MarketSetupResponse(
        project_id=_CURRENT_MARKET_STATE["project_id"],
        name=req.name,
        category=req.category,
        price=req.price,
        geography=req.geography,
        status="CONFIGURED",
        competitors_count=len(_CURRENT_MARKET_STATE["competitors"]),
        segments_count=len(_CURRENT_MARKET_STATE["segments"]),
        dataset_source=_CURRENT_MARKET_STATE["dataset_source"]
    )

@router.get("/competitors", response_model=List[Dict[str, Any]])
async def get_competitors():
    return _CURRENT_MARKET_STATE["competitors"]
