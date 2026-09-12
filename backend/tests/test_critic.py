import pytest
from app.simulation.critic_engine import AdversarialCriticEngine

def test_adversarial_critic_audit():
    critic = AdversarialCriticEngine()
    audit = critic.run_adversarial_audit(
        product_name="Pulse — AI Fitness Companion",
        price=1999.0,
        simulated_adoption=0.318
    )

    assert "critic_audit_id" in audit
    assert audit["overall_critic_score"] > 0
    assert len(audit["vulnerabilities"]) >= 3

    # Check for Positive Response Bias detection
    vuln_types = [v["id"] for v in audit["vulnerabilities"]]
    assert "VULN-01" in vuln_types

    # Adversarially deflated adoption must be less than raw simulated adoption
    assert audit["adversarially_deflated_adoption"] < audit["simulated_adoption_raw"]
    assert audit["deflation_delta_pct"] > 0.0

    # Hardening recommendations present
    assert len(audit["hardening_recommendations"]) >= 3
    priorities = [r["priority"] for r in audit["hardening_recommendations"]]
    assert any("CRITICAL" in p for p in priorities)
