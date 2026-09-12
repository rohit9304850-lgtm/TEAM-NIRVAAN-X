import pytest
from app.simulation.persona_generator import PersonaGenerator, compute_seed_hash

def test_deterministic_seed_hash():
    hash1 = compute_seed_hash(42, 101, "2024.2-Q3")
    hash2 = compute_seed_hash(42, 101, "2024.2-Q3")
    hash3 = compute_seed_hash(43, 101, "2024.2-Q3")
    
    assert hash1 == hash2, "Seed hashes for identical inputs must match exactly"
    assert hash1 != hash3, "Different global seed must produce different hash"

def test_persona_generation_reproducibility():
    gen1 = PersonaGenerator(global_seed=42)
    gen2 = PersonaGenerator(global_seed=42)

    pop1 = gen1.generate_population(population_size=100)
    pop2 = gen2.generate_population(population_size=100)

    assert len(pop1) == 100
    assert len(pop2) == 100

    # Verify first 5 personas have identical attributes across runs
    for i in range(5):
        p1 = pop1[i]
        p2 = pop2[i]
        assert p1["persona_id"] == p2["persona_id"]
        assert p1["name"] == p2["name"]
        assert p1["age"] == p2["age"]
        assert p1["city"] == p2["city"]
        assert p1["monthly_income_inr"] == p2["monthly_income_inr"]
        assert p1["price_sensitivity"] == p2["price_sensitivity"]
        assert p1["quality_sensitivity"] == p2["quality_sensitivity"]
        assert p1["adoption_threshold"] == p2["adoption_threshold"]
        assert p1["seed_hash"] == p2["seed_hash"]

def test_population_fidelity_audit():
    gen = PersonaGenerator(global_seed=42)
    pop = gen.generate_population(population_size=500)
    audit = gen.audit_population_fidelity(pop)

    assert audit.total_population == 500
    assert audit.overall_fidelity_score >= 80.0
    assert len(audit.audit_dimensions) >= 3
    for dim in audit.audit_dimensions:
        assert dim.fidelity_score >= 70.0
        assert dim.kl_divergence >= 0.0
