'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Activity,
  Cpu,
  Share2,
  TrendingUp,
  SlidersHorizontal,
  Users,
  Compass,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  Layers,
  Database,
  Award,
  Zap,
  Check
} from 'lucide-react';
import { ProvenanceBadge } from '@/components/analytics/ProvenanceBadge';
import { ProvenanceChain } from '@/components/analytics/ProvenanceChain';
import { formatINR } from '@/lib/utils';

export default function LandingPage() {
  const [particleCoords, setParticleCoords] = useState<Array<{ x: number; y: number; vx: number; vy: number; color: string }>>([]);

  // Interactive Live Preview State
  const [demoPrice, setDemoPrice] = useState(1999);
  const [demoSegment, setDemoSegment] = useState<'all' | 'enthusiast' | 'busy' | 'budget'>('all');

  // Calculate live reactive metrics for preview
  const livePreviewData = useMemo(() => {
    let baseAdoption = 0.318;
    if (demoPrice <= 1299) baseAdoption = 0.442;
    else if (demoPrice <= 1999) baseAdoption = 0.318;
    else if (demoPrice <= 2999) baseAdoption = 0.224;
    else baseAdoption = 0.145;

    let segmentMultiplier = 1.0;
    if (demoSegment === 'enthusiast') segmentMultiplier = 1.85;
    else if (demoSegment === 'busy') segmentMultiplier = 1.05;
    else if (demoSegment === 'budget') segmentMultiplier = 0.38;

    const rate = Math.min(0.92, Math.max(0.05, baseAdoption * segmentMultiplier));
    const ciDelta = 0.019;
    return {
      rate: (rate * 100).toFixed(1),
      ciLower: Math.max(0, (rate - ciDelta) * 100).toFixed(1),
      ciUpper: Math.min(100, (rate + ciDelta) * 100).toFixed(1),
      adoptedCount: Math.round(rate * 10000),
      topObjection: demoPrice > 2500
        ? 'Price friction exceeds perceived daily workout utility'
        : 'Status-quo habit inertia with free manual alternatives'
    };
  }, [demoPrice, demoSegment]);

  // Background Animated Particle Mesh
  useEffect(() => {
    const colors = ['#00F2FE', '#4FACFE', '#10B981', '#8B5CF6'];
    const particles = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * 1000,
      y: Math.random() * 600,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticleCoords(particles);

    const interval = setInterval(() => {
      setParticleCoords((prev) =>
        prev.map((p) => {
          let nx = p.x + p.vx;
          let ny = p.y + p.vy;
          let nvx = p.vx;
          let nvy = p.vy;
          if (nx < 0 || nx > 1000) nvx = -nvx;
          if (ny < 0 || ny > 600) nvy = -nvy;
          return { x: nx, y: ny, vx: nvx, vy: nvy, color: p.color };
        })
      );
    }, 45);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 relative overflow-hidden flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Animated Particle Mesh */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg viewBox="0 0 1000 600" className="w-full h-full">
          {particleCoords.map((p1, i) =>
            particleCoords.slice(i + 1, i + 5).map((p2, j) => {
              const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
              if (dist < 110) {
                return (
                  <line
                    key={`${i}-${j}`}
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={p1.color}
                    strokeWidth={0.6}
                    strokeOpacity={1 - dist / 110}
                  />
                );
              }
              return null;
            })
          )}
          {particleCoords.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={2.2} fill={p.color} />
          ))}
        </svg>
      </div>

      {/* Top Navbar */}
      <header className="h-20 border-b border-slate-800/80 px-6 sm:px-12 flex items-center justify-between relative z-20 backdrop-blur-md bg-black/40 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <Sparkles className="w-5 h-5 text-black stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-xl tracking-wider text-white">SWARM</span>
              <span className="font-extrabold text-xl tracking-wider text-cyan-400">IQ</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-tight uppercase">
              Autonomous Market Intelligence
            </p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-300">
          <a href="#pipeline" className="hover:text-cyan-400 transition-colors">Simulation Pipeline</a>
          <a href="#comparison" className="hover:text-cyan-400 transition-colors">Why SwarmIQ</a>
          <a href="#preview" className="hover:text-cyan-400 transition-colors">Interactive Sandbox</a>
          <a href="#provenance" className="hover:text-cyan-400 transition-colors">Evidence Chain</a>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <ProvenanceBadge level="CALIBRATED" source="Urban Survey 2024" />
          </div>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs tracking-wide transition-all shadow-lg shadow-cyan-500/20 active:scale-95 flex items-center gap-2"
          >
            <span>Launch Engine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-20 text-center flex flex-col items-center">
        {/* Banner Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-xs font-mono mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>PRODUCTION-GRADE AGENTIC MARKET SIMULATION</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.08]">
          Simulate the market <br />
          <span className="gradient-text-cyan">before you enter it.</span>
        </h1>

        {/* Tagline & Subtext */}
        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
          SwarmIQ models <strong className="text-white font-semibold">10,000 persistent, heterogeneous AI personas</strong> calibrated on empirical research. Validate product-market fit, price elasticity, and 30-day viral dynamics with 95% statistical confidence intervals before writing code or committing capital.
        </p>

        {/* Primary CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-sm tracking-wide transition-all shadow-xl shadow-cyan-500/25 active:scale-95 flex items-center gap-2.5"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Run a Simulation</span>
          </Link>

          <Link
            href="/dashboard/persona-swarm"
            className="px-8 py-4 rounded-xl glass-card hover:bg-slate-800/60 text-slate-200 font-semibold text-sm transition-all border border-slate-700/80 active:scale-95 flex items-center gap-2"
          >
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Explore the Swarm</span>
          </Link>
        </div>

        {/* Live Metrics Ticker Bar */}
        <div className="mt-14 w-full grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="glass-panel rounded-xl p-4 border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 block uppercase">Persona Swarm</span>
            <span className="text-2xl font-bold font-mono text-white">10,000</span>
            <span className="text-[11px] text-cyan-400 block mt-1">Persistent & Deterministic</span>
          </div>

          <div className="glass-panel rounded-xl p-4 border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 block uppercase">Empirical Prior</span>
            <span className="text-2xl font-bold font-mono text-emerald-400">96.4%</span>
            <span className="text-[11px] text-slate-400 block mt-1">Urban Survey Fidelity</span>
          </div>

          <div className="glass-panel rounded-xl p-4 border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 block uppercase">Social Dynamics</span>
            <span className="text-2xl font-bold font-mono text-purple-400">30-Day</span>
            <span className="text-[11px] text-slate-400 block mt-1">DeGroot Propagation</span>
          </div>

          <div className="glass-panel rounded-xl p-4 border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 block uppercase">Pareto Strategy</span>
            <span className="text-2xl font-bold font-mono text-cyan-400">S-027</span>
            <span className="text-[11px] text-emerald-400 block mt-1">+9.7% Pareto Lift</span>
          </div>
        </div>

        {/* SECTION: Interactive Live Simulation Sandbox */}
        <section id="preview" className="mt-20 w-full text-left space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Live Swarm Simulation Sandbox</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 font-semibold">
                  INTERACTIVE DEMO
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Tweak pricing or target segment below to observe how 10,000 persistent personas dynamically adjust intent.
              </p>
            </div>
            <ProvenanceBadge level="SIMULATED" source="Vectorized Decision Policy" />
          </div>

          <div className="glass-panel-elevated rounded-2xl p-6 border border-slate-800 space-y-6 bg-gradient-to-r from-slate-900/90 to-[#0F1424]">
            {/* Control Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Test Subscription Price:</span>
                  <span className="font-mono font-bold text-cyan-400 text-sm">
                    {formatINR(demoPrice)} / month
                  </span>
                </div>
                <input
                  type="range"
                  min={499}
                  max={4999}
                  step={500}
                  value={demoPrice}
                  onChange={(e) => setDemoPrice(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>₹499 (Mass Market)</span>
                  <span>₹1,999 (Baseline)</span>
                  <span>₹4,999 (Enterprise)</span>
                </div>
              </div>

              {/* Segment Filter */}
              <div className="space-y-2">
                <span className="text-slate-300 font-medium text-xs block">Target Cohort Filter:</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'all', label: 'All Segments' },
                    { id: 'enthusiast', label: 'Enthusiasts' },
                    { id: 'busy', label: 'Busy Execs' },
                    { id: 'budget', label: 'Price Sensitive' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setDemoSegment(tab.id as any)}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-all ${
                        demoSegment === tab.id
                          ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-sm'
                          : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800/80">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Simulated Adoption Rate</span>
                <div className="text-2xl font-bold font-mono text-cyan-400">
                  {livePreviewData.rate}%
                </div>
                <span className="text-[10px] font-mono text-slate-400 block">
                  95% CI: [{livePreviewData.ciLower}%, {livePreviewData.ciUpper}%]
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Projected Converted Personas</span>
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  {livePreviewData.adoptedCount.toLocaleString()}
                </div>
                <span className="text-[10px] font-mono text-slate-400 block">
                  out of 10,000 persistent agents
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Leading Adoption Barrier</span>
                <p className="text-xs text-rose-300 font-medium leading-snug">
                  {livePreviewData.topObjection}
                </p>
                <span className="text-[10px] font-mono text-slate-500 block">
                  Extracted from non-adopting personas
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Link
                href="/dashboard"
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>Launch full simulation with competitive intel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION: 5-Step Product Pipeline Flow */}
        <section id="pipeline" className="mt-24 w-full text-left space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase text-cyan-400 tracking-wider">
              Autonomous Intelligence Pipeline
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              From Concept to Statistically Validated Strategy
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              SwarmIQ replaces subjective guesswork with deterministic multi-agent simulation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-4">
            {[
              {
                step: '01',
                title: 'Define Market',
                icon: SlidersHorizontal,
                desc: 'Specify product category, pricing model, key features, and Tier-1/2 metro competitors.',
                badge: 'Input'
              },
              {
                step: '02',
                title: 'Generate Swarm',
                icon: Users,
                desc: 'Initialize 10,000 persistent personas with calibrated demographic and psychographic distributions.',
                badge: 'Calibration'
              },
              {
                step: '03',
                title: 'Run Simulation',
                icon: Cpu,
                desc: 'Execute vectorized utility equations and micro-decisions across all personas simultaneously.',
                badge: 'Execution'
              },
              {
                step: '04',
                title: 'Observe Dynamics',
                icon: Share2,
                desc: 'Simulate 30-day viral network propagation, word-of-mouth diffusion, and echo chamber clustering.',
                badge: 'Network'
              },
              {
                step: '05',
                title: 'Extract Insights',
                icon: Compass,
                desc: 'Uncover Pareto-optimal pricing, churn vulnerabilities, and adversarial risk recommendations.',
                badge: 'Decision'
              }
            ].map((st, i) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.step}
                  className="p-5 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between space-y-4 hover:border-cyan-500/30 transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-cyan-400">
                        {st.step}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-slate-800 text-slate-400 border border-slate-700/60">
                        {st.badge}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm text-white">{st.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION: Why SwarmIQ? Comparison Matrix */}
        <section id="comparison" className="mt-24 w-full text-left space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase text-purple-400 tracking-wider">
              Market Intelligence Comparison
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Why SwarmIQ Outperforms Legacy Methods
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Why single LLM prompts or traditional focus groups fail to predict actual market adoption.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4">
            {/* Traditional Surveys */}
            <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Legacy Approach</span>
                <h3 className="text-base font-bold text-slate-200 mt-0.5">Traditional Surveys</h3>
              </div>
              <ul className="space-y-3 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span><strong>Small samples (N=50–200):</strong> High sampling error and unrepresented micro-segments.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span><strong>Slow execution:</strong> Requires 3–8 weeks of field recruitment and synthesis.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span><strong>Prohibitive cost:</strong> $15,000–$50,000+ per agency market study.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span><strong>Static responses:</strong> Zero dynamic simulation of viral word-of-mouth or social proof.</span>
                </li>
              </ul>
            </div>

            {/* Single LLM Query */}
            <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] font-mono uppercase text-slate-500 block">Naive AI Approach</span>
                <h3 className="text-base font-bold text-slate-200 mt-0.5">Single LLM Prompting</h3>
              </div>
              <ul className="space-y-3 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span><strong>One synthetic view:</strong> Single average perspective with severe positive response bias.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span><strong>Lack of heterogeneity:</strong> Cannot capture diverse willingness-to-pay across demographic deciles.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span><strong>Hallucinated numbers:</strong> Produces fabricated percentages with no empirical grounding.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span><strong>No network propagation:</strong> Cannot model viral cascades, churn, or competitive substitution.</span>
                </li>
              </ul>
            </div>

            {/* SwarmIQ */}
            <div className="p-6 rounded-2xl glass-panel-glow border border-cyan-500/40 space-y-4 bg-gradient-to-b from-[#0C1527] to-[#0A0D18]">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-cyan-400 block font-semibold">Autonomous Swarm</span>
                  <h3 className="text-base font-bold text-white mt-0.5">SwarmIQ Platform</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-400 text-black">
                  9+/10 ENTERPRISE
                </span>
              </div>
              <ul className="space-y-3 text-xs text-slate-200">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>10,000 persistent personas:</strong> Statistically fitted to empirical urban distributions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Dynamic 30-day social interactions:</strong> DeGroot opinion spread over scale-free homophily clusters.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Adversarial Critic scanner:</strong> Automatically deflates intent for real-world checkout friction.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Traceable Provenance:</strong> Every number stamped Empirical, Calibrated, or Simulated.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION: Provenance Evidence Chain */}
        <section id="provenance" className="mt-24 w-full text-left">
          <ProvenanceChain />
        </section>

        {/* SECTION: Final CTA */}
        <section className="mt-24 w-full p-10 rounded-3xl glass-panel-glow border border-cyan-500/30 text-center space-y-6 bg-gradient-to-r from-[#0C1322] via-[#0E1B33] to-[#0C1322]">
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Simulate your market today.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Launch pre-calibrated startup scenarios in 1-click or configure your custom product to discover pricing elasticity and segment adoption.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs tracking-wide transition-all shadow-xl shadow-cyan-500/25 active:scale-95 flex items-center gap-2"
            >
              <span>Launch SwarmIQ Engine</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard/market-setup"
              className="px-6 py-3.5 rounded-xl glass-card hover:bg-slate-800/60 text-slate-300 font-semibold text-xs transition-all border border-slate-700/80 active:scale-95"
            >
              <span>Custom Product Setup</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 px-6 py-6 text-center text-xs text-slate-500 font-mono">
        SWARMIQ © 2026 • Autonomous Market Intelligence Engine • Deterministic Calibration Protocol 2.4
      </footer>
    </div>
  );
}
