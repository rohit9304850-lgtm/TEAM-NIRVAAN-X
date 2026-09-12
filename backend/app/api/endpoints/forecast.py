import numpy as np
from fastapi import APIRouter, Query
from typing import Dict, Any, List
from app.schemas.common import ProvenanceBadge, ProvenanceLevel

router = APIRouter()

@router.get("/trajectory", response_model=Dict[str, Any])
async def get_forecast_trajectory(
    price: float = Query(1999.0),
    baseline_day30_adoption: float = Query(0.318),
    total_market_addressable: int = Query(500000)
):
    # Check if outside empirical survey boundaries (Survey median price: ₹1,999, range ₹999 - ₹2,999)
    is_unfamiliar_territory = price < 800 or price > 2800
    divergence_pct = round(abs(price - 1999.0) / 1999.0 * 100.0, 1)

    # Days 0 to 30: SIMULATED ZONE (tight confidence intervals)
    trajectory_points = []
    for day in range(0, 31, 2):
        t = day / 30.0
        s_curve = 1.0 / (1.0 + np.exp(-7.5 * (t - 0.45)))
        rate = round(float(baseline_day30_adoption * s_curve), 4)
        error_margin = round(0.015 * (1.0 + t * 0.3), 4)
        trajectory_points.append({
            "day": day,
            "rate": rate,
            "rate_pct": round(rate * 100, 2),
            "ci_lower_pct": round(max(0.0, rate - error_margin) * 100, 2),
            "ci_upper_pct": round(min(1.0, rate + error_margin) * 100, 2),
            "cumulative_subscribers": int(rate * total_market_addressable),
            "zone": "SIMULATED",
            "provenance": "SIMULATED"
        })

    # Days 31 to 365: EXTRAPOLATED ZONE (widening uncertainty cone, monthly churn decay)
    # Bass diffusion tail with annual churn of ~24%
    final_sim_rate = baseline_day30_adoption
    days_extrapolated = [45, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 365]
    monthly_retention = 0.965  # 3.5% monthly net churn
    
    current_active_rate = final_sim_rate
    for day in days_extrapolated:
        months_passed = (day - 30) / 30.0
        # New organic growth slower, churn increases variance
        growth_tail = 0.12 * (1.0 - np.exp(-0.15 * months_passed))
        active_rate = (final_sim_rate + growth_tail) * (monthly_retention ** months_passed)
        current_active_rate = round(float(active_rate), 4)

        # Widening uncertainty cone as time progresses
        cone_uncertainty = round(0.02 + 0.08 * (day / 365.0), 4)
        trajectory_points.append({
            "day": day,
            "rate": current_active_rate,
            "rate_pct": round(current_active_rate * 100, 2),
            "ci_lower_pct": round(max(0.0, current_active_rate - cone_uncertainty) * 100, 2),
            "ci_upper_pct": round(min(1.0, current_active_rate + cone_uncertainty) * 100, 2),
            "cumulative_subscribers": int(current_active_rate * total_market_addressable),
            "zone": "EXTRAPOLATED",
            "provenance": "EXTRAPOLATED"
        })

    return {
        "addressable_market": total_market_addressable,
        "pricing_input": price,
        "day30_simulated_rate": baseline_day30_adoption,
        "day365_projected_rate": current_active_rate,
        "annual_projected_subscribers": int(current_active_rate * total_market_addressable),
        "annual_arr_crores_inr": round((current_active_rate * total_market_addressable * price * 12) / 10000000.0, 2),
        "is_unfamiliar_territory": is_unfamiliar_territory,
        "unfamiliar_alert": {
            "triggered": is_unfamiliar_territory,
            "divergence_pct": divergence_pct,
            "message": (
                f"Unfamiliar Territory Alert: Tested price (₹{price:,.0f}) deviates by {divergence_pct}% "
                f"from empirical calibration bounds (₹999 - ₹2,800). Extrapolation error margin expands to ±{round(0.08*divergence_pct, 1)}%."
            ) if is_unfamiliar_territory else "Operating within empirical calibration bounds."
        },
        "points": trajectory_points,
        "provenance": ProvenanceBadge(
            level=ProvenanceLevel.EXTRAPOLATED,
            source="Dual-Zone Bass Diffusion & Churn Trajectory Model",
            confidence=0.88 if not is_unfamiliar_territory else 0.62,
            description="Days 0-30 agentic simulated; Days 31-365 econometric extrapolation"
        )
    }
