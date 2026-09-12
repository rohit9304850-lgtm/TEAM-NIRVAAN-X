export type ProvenanceLevel = 'EMPIRICAL' | 'CALIBRATED' | 'SIMULATED' | 'EXTRAPOLATED' | 'LOW_CONFIDENCE';

export interface ProvenanceBadgeData {
  level: ProvenanceLevel;
  source: string;
  confidence: number;
  description?: string;
}

export interface ConfidenceIntervalData {
  mean: number;
  ci_lower: number;
  ci_upper: number;
  confidence_level: number;
  margin_of_error: number;
  sample_size: number;
}

export interface Persona {
  persona_id: number;
  seed_hash: string;
  name: string;
  age: number;
  gender: string;
  city: string;
  tier: string;
  income_bracket: string;
  monthly_income_inr: number;
  education: string;
  tech_literacy: number;
  segment: string;
  price_sensitivity: number;
  quality_sensitivity: number;
  brand_loyalty: number;
  innovation_affinity: number;
  risk_aversion: number;
  social_influence_weight: number;
  adoption_threshold: number;
}

export interface DemographicFidelity {
  dimension: string;
  target_distribution: Record<string, number>;
  simulated_distribution: Record<string, number>;
  kl_divergence: number;
  wasserstein_distance: number;
  fidelity_score: number;
}

export interface PopulationAudit {
  total_population: number;
  global_seed: number;
  dataset_version: string;
  overall_fidelity_score: number;
  kl_divergence_mean: number;
  provenance: ProvenanceBadgeData;
  audit_dimensions: DemographicFidelity[];
}

export interface SegmentMetric {
  segment_name: string;
  population: number;
  adopted_count: number;
  adoption_rate: number;
  intent_score_mean: number;
  ci_lower: number;
  ci_upper: number;
}

export interface SimulationResult {
  run_id: string;
  product_name: string;
  offered_price: number;
  population_size: number;
  adopted_count: number;
  adoption_rate: number;
  confidence_interval: ConfidenceIntervalData;
  purchase_intent_mean: number;
  strategy_score: number;
  critic_risk_rating: string;
  extrapolation_risk_score: number;
  provenance: ProvenanceBadgeData;
  segment_breakdown: SegmentMetric[];
  adoption_trend_30d: Array<{
    day: number;
    adoption_rate: number;
    ci_lower: number;
    ci_upper: number;
    cumulative_users: number;
  }>;
  top_objections: Array<{
    objection: string;
    prevalence_pct: number;
    primary_segment: string;
    provenance: string;
  }>;
}

export interface SurveyResponse {
  question: string;
  sample_size: number;
  distribution: Record<string, number>;
  provenance: ProvenanceBadgeData;
  ci_95: Record<string, [number, number]>;
  ai_interpretation: string;
}

export interface SocialNode {
  id: number;
  persona_id: number;
  name: string;
  segment: string;
  cluster_id: number;
  city: string;
  influence_score: number;
  connection_count: number;
  initial_opinion: number;
  final_opinion: number;
  is_hub: boolean;
  timeline_opinions: number[];
  x?: number;
  y?: number;
}

export interface SocialEdge {
  source: number;
  target: number;
  weight: number;
}

export interface SocialGraph {
  node_count: number;
  edge_count: number;
  nodes: SocialNode[];
  edges: SocialEdge[];
  timeline_days: number;
  daily_macro_sentiment: {
    day_average_opinion: number[];
    positive_count: number[];
    neutral_count: number[];
    negative_count: number[];
  };
  network_metrics: {
    density: number;
    average_degree: number;
    homophily_clustering_coefficient: number;
    viral_reproduction_rate_r0: number;
  };
  provenance: ProvenanceBadgeData;
}

export interface StrategyCandidate {
  strategy_id: string;
  name: string;
  price: number;
  target_segment: string;
  trial_offer: string;
  guarantee: string;
  positioning: string;
  adoption_rate: number;
  margin_percentage: number;
  revenue_index: number;
  critic_score: number;
  risk_level: string;
  is_pareto_optimal: boolean;
  adoption_lift_vs_baseline: number;
}

export interface StrategySearchResult {
  total_strategies_evaluated: number;
  optimal_strategy_id: string;
  baseline_adoption_rate: number;
  pareto_frontier_count: number;
  strategies: StrategyCandidate[];
  provenance: ProvenanceBadgeData;
  optimization_objective: string;
}

export interface Vulnerability {
  id: string;
  title: string;
  severity: string;
  bias_magnitude_pct: number;
  affected_metric: string;
  description: string;
  adversarial_probe: string;
  countermeasure: string;
}

export interface HardeningRec {
  priority: string;
  action: string;
  expected_impact: string;
}

export interface CriticAudit {
  critic_audit_id: string;
  overall_risk_rating: string;
  overall_critic_score: number;
  simulated_adoption_raw: number;
  adversarially_deflated_adoption: number;
  deflation_delta_pct: number;
  vulnerabilities: Vulnerability[];
  hardening_recommendations: HardeningRec[];
  provenance: ProvenanceBadgeData;
}

export interface ForecastPoint {
  day: number;
  rate: number;
  rate_pct: number;
  ci_lower_pct: number;
  ci_upper_pct: number;
  cumulative_subscribers: number;
  zone: 'SIMULATED' | 'EXTRAPOLATED';
  provenance: string;
}

export interface ForecastTrajectory {
  addressable_market: number;
  pricing_input: number;
  day30_simulated_rate: number;
  day365_projected_rate: number;
  annual_projected_subscribers: number;
  annual_arr_crores_inr: number;
  is_unfamiliar_territory: boolean;
  unfamiliar_alert: {
    triggered: boolean;
    divergence_pct: number;
    message: string;
  };
  points: ForecastPoint[];
  provenance: ProvenanceBadgeData;
}
