# SWARMIQ — Autonomous Market Intelligence Engine
> *"Simulate the market before you enter it."*

[![CI](https://github.com/swarmiq/swarmiq/actions/workflows/ci.yml/badge.svg)](https://github.com/swarmiq/swarmiq/actions)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%200.115+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014+-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**SWARMIQ** is an enterprise-grade agentic simulation platform modeling up to **10,000 persistent, heterogeneous AI personas** calibrated on empirical market research datasets. It enables product leaders, strategists, and venture builders to test pricing elasticity, message positioning, competitive threats, and 30-day viral network adoption dynamics with statistical confidence intervals before writing code or spending capital.

---

## 🏛️ System Architecture

```
                               ┌─────────────────────────────────────────┐
                               │  Empirical Dataset (e.g. Urban Survey)  │
                               └────────────────────┬────────────────────┘
                                                    │
                                                    ▼
                               ┌─────────────────────────────────────────┐
                               │     Deterministic Persona Generator     │
                               │  seed = hash(global_seed + id + version)│
                               └────────────────────┬────────────────────┘
                                                    │
                                                    ▼
                     ┌─────────────────────────────────────────────────────────────┐
                     │          10,000 Persistent Calibrated AI Personas           │
                     │   Demographics + Psychographics (wp, wq, wb, wi, r, ws, θ)   │
                     └──────┬───────────────────────┬───────────────────────┬──────┘
                            │                       │                       │
                            ▼                       ▼                       ▼
               ┌───────────────────────┐ ┌────────────────────┐ ┌──────────────────────┐
               │  Vectorized Utility   │ │  Social Opinion    │ │  Bayesian Strategy   │
               │    Decision Policy    │ │  Dynamics Network  │ │   Optimization Lab   │
               └────────────┬──────────┘ └──────────┬─────────┘ └──────────┬───────────┘
                            │                       │                      │
                            ▼                       ▼                      ▼
               ┌───────────────────────┐ ┌────────────────────┐ ┌──────────────────────┐
               │ Competitive Purchase  │ │ DeGroot 30-Day Run │ │  Adversarial Critic  │
               │ Modeling (Pulse vs B) │ │ Homophily Clusters │ │  Cognitive Bias Scan │
               └────────────┬──────────┘ └──────────┬─────────┘ └──────────┬───────────┘
                            │                       │                      │
                            └───────────────────────┼──────────────────────┘
                                                    │
                                                    ▼
                               ┌─────────────────────────────────────────┐
                               │   Dual-Zone Forecaster (30d sim / 365d) │
                               │   + Evidence-Based Provenance Engine    │
                               └────────────────────┬────────────────────┘
                                                    │
                                                    ▼
                               ┌─────────────────────────────────────────┐
                               │     Next.js 14 Reactive Dashboard       │
                               │   (Obsidian Glassmorphic Design System) │
                               └─────────────────────────────────────────┘
```

---

## 📐 Mathematical Formulation

### 1. Vectorized Multi-Attribute Utility Policy
For any product $P$ and persona $i \in \{1, \dots, N\}$:

$$\text{Utility}_{i, P} = w_{p, i} \cdot \left(1 - \frac{\text{Price}_P}{\text{RefPrice}}\right) + w_{q, i} \cdot \text{Quality}_P + w_{b, i} \cdot \text{Brand}_P + w_{s, i} \cdot \text{SocialProof}_P - r_i \cdot \text{Risk}_P + \epsilon_i$$

Where:
- $w_{p, i} \in [0, 1]$: Price sensitivity weight
- $w_{q, i} \in [0, 1]$: Quality sensitivity weight
- $w_{b, i} \in [0, 1]$: Brand affinity weight
- $w_{s, i} \in [0, 1]$: Social proof reliance weight
- $r_i \in [0, 1]$: Risk aversion parameter
- $\epsilon_i \sim \mathcal{N}(0, \sigma^2)$: Seeded stochastic idiosyncratic shock

A persona adopts product $P$ if and only if $\text{Utility}_{i, P} > \theta_i$ (where $\theta_i$ is their latent adoption threshold).

### 2. Social Opinion Dynamics (DeGroot / Hegselmann-Krause)
The population social graph $G = (V, E)$ is generated via Barabási–Albert scale-free preferential attachment combined with a homophily metric:

$$P(e_{ij}) \propto \exp\left(-\frac{\|\mathbf{z}_i - \mathbf{z}_j\|^2}{2\sigma_h^2}\right)$$

For time step $t \in [0, 30]$ days, opinion evolution follows:

$$\text{Opinion}_i(t+1) = \alpha \cdot \text{Opinion}_i(t) + \beta \sum_{j \in \mathcal{N}(i)} W_{ij} \cdot \text{Opinion}_j(t) + \gamma \cdot \text{ProductExperience}_i$$

### 3. Multi-Objective Bayesian Strategy Search
The strategy lab explores the hyperparameter space $\mathcal{S}$ (Price, Segment Allocation, Guarantee, Trial Duration, Brand Positioning):

$$\max_{\mathbf{S} \in \mathcal{S}} f(\mathbf{S}) = \lambda_1 \cdot \text{Adoption}(\mathbf{S}) + \lambda_2 \cdot \text{Margin}(\mathbf{S}) - \lambda_3 \cdot \text{RiskPenalty}(\mathbf{S})$$

Using Gaussian Process surrogate modelling / Expected Improvement heuristic across multi-objective Pareto frontiers.

### 4. Statistical Rigor & Provenance Classification
- **Wilson Score Interval** for 95% binomial confidence bounds:
  $$\hat{p} \pm \frac{z}{1 + \frac{z^2}{n}} \sqrt{\frac{\hat{p}(1-\hat{p})}{n} + \frac{z^2}{4n^2}}$$
- **Wasserstein Distance / KL-Divergence** for population fidelity audits against empirical target demographic distributions.
- **Strict Data Provenance Badges**:
  - 🟢 `EMPIRICAL`: Directly measured in source dataset.
  - 🔵 `CALIBRATED`: Statistically fitted from empirical priors.
  - 🟣 `SIMULATED`: Generated via multi-agent simulation run.
  - 🟠 `EXTRAPOLATED`: Projected beyond simulated time horizon.
  - 🔴 `LOW CONFIDENCE`: Sample size $< 200$ or variance $> 5\%$.

---

## 🚀 Quickstart

### Prerequisites
- Python 3.11+
- Node.js 18+ (Node 20+ recommended)
- Git

### 1. Clone & Setup Backend
```bash
cd swarmiq/backend
pip install -r requirements.txt
python -m pytest -v
python -m uvicorn app.main:app --reload --port 8000
```
Backend API will be live at `http://localhost:8000`. Interactive Swagger docs at `http://localhost:8000/docs`.

### 2. Setup Frontend
```bash
cd swarmiq/frontend
npm install
npm run dev
```
Open `http://localhost:3000` to interact with SWARMIQ.

---

## 🧪 Running Automated Tests
```bash
cd swarmiq/backend
python -m pytest tests/ -v
```

---

## 📦 Docker Deployment
```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
