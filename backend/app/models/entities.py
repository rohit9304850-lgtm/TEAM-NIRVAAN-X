import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, JSON, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class MarketProject(Base):
    __tablename__ = "market_projects"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String(64), unique=True, index=True, default="PRJ-DEFAULT")
    name = Column(String(128), default="Pulse — AI Fitness Companion")
    category = Column(String(64), default="Health & Fitness SaaS")
    price = Column(Float, default=1999.0)
    geography = Column(String(64), default="Urban India (Tier 1 & 2)")
    description = Column(Text, default="Personalized AI adaptive training coach and habit accountability loop.")
    dataset_version = Column(String(64), default="2024.2-Q3")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Competitor(Base):
    __tablename__ = "competitors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(128))
    price = Column(Float)
    quality_score = Column(Float)
    brand_score = Column(Float)
    risk_score = Column(Float)
    market_share = Column(Float, default=0.0)

class SimulationRun(Base):
    __tablename__ = "simulation_runs"

    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(String(64), unique=True, index=True)
    product_name = Column(String(128))
    price = Column(Float)
    population_size = Column(Integer, default=10000)
    adoption_rate = Column(Float)
    ci_lower = Column(Float)
    ci_upper = Column(Float)
    margin_of_error = Column(Float)
    fidelity_score = Column(Float, default=91.5)
    critic_risk = Column(String(32), default="BALANCED")
    metrics_json = Column(JSON)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class StrategyRun(Base):
    __tablename__ = "strategy_runs"

    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(String(64), index=True)
    strategy_id = Column(String(32))
    name = Column(String(128))
    price = Column(Float)
    target_segment = Column(String(64))
    trial_offer = Column(String(64))
    guarantee = Column(String(64))
    positioning = Column(String(64))
    expected_adoption = Column(Float)
    expected_margin = Column(Float)
    composite_score = Column(Float)
    is_pareto_optimal = Column(Boolean, default=False)
    risk_rating = Column(String(32))
