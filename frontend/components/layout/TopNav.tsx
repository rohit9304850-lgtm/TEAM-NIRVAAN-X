'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Sparkles, Database, CheckCircle2, RefreshCw, ChevronDown, Check, Zap } from 'lucide-react';
import { ProvenanceBadge } from '@/components/analytics/ProvenanceBadge';
import { LiveProgressModal } from '@/components/simulation/LiveProgressModal';
import { getClientActiveProduct, setClientActiveProduct, saveMarketSetup } from '@/lib/api';
import { formatINR } from '@/lib/utils';

const demoPresets = [
  {
    id: 'pulse',
    name: 'Pulse — AI Fitness Companion',
    category: 'Health & Fitness SaaS',
    price: 1999,
    geography: 'Urban India (Tier 1 & Tier 2)',
    description: 'Autonomous AI adaptive workout coach with WhatsApp accountability integration and real-time form audio correction.',
    competitors: [
      { name: 'Cult.fit / CultPass', price: 2499, quality_score: 0.84, brand_score: 0.92, risk_score: 0.22, market_share: 38.4 },
      { name: 'Freefit / Generic Apps', price: 499, quality_score: 0.52, brand_score: 0.45, risk_score: 0.40, market_share: 16.2 },
      { name: 'Status Quo (No App / YouTube)', price: 0, quality_score: 0.41, brand_score: 0.70, risk_score: 0.15, market_share: 13.6 },
    ],
    segments: [
      { segment_id: 'SEG-01', name: 'Fitness Enthusiasts', prevalence: 0.32, willingness_to_pay_median_inr: 2499, price_sensitivity_mean: 0.38, quality_sensitivity_mean: 0.88 },
      { segment_id: 'SEG-02', name: 'Busy Professionals', prevalence: 0.43, willingness_to_pay_median_inr: 1899, price_sensitivity_mean: 0.48, quality_sensitivity_mean: 0.79 },
      { segment_id: 'SEG-03', name: 'Price-Sensitive Beginners', prevalence: 0.25, willingness_to_pay_median_inr: 999, price_sensitivity_mean: 0.84, quality_sensitivity_mean: 0.52 }
    ]
  },
  {
    id: 'devscribe',
    name: 'DevScribe AI — API Doc Generator',
    category: 'Developer Tools / B2B SaaS',
    price: 4999,
    geography: 'India Tech Hubs & Remote Dev Teams',
    description: 'Scans Git repositories to continuously generate interactive OpenAPI documentation, client SDKs, and developer portals.',
    competitors: [
      { name: 'GitHub Copilot / Enterprise Stack', price: 6500, quality_score: 0.86, brand_score: 0.95, risk_score: 0.18, market_share: 44.0 },
      { name: 'Swagger / ReadMe Open Source', price: 0, quality_score: 0.65, brand_score: 0.82, risk_score: 0.20, market_share: 28.0 },
      { name: 'Manual Internal Engineering Docs', price: 0, quality_score: 0.40, brand_score: 0.60, risk_score: 0.35, market_share: 15.0 },
    ],
    segments: [
      { segment_id: 'SEG-01', name: 'Enterprise Engineering Leads', prevalence: 0.28, willingness_to_pay_median_inr: 6499, price_sensitivity_mean: 0.29, quality_sensitivity_mean: 0.92 },
      { segment_id: 'SEG-02', name: 'Fast-Moving Series A Startups', prevalence: 0.42, willingness_to_pay_median_inr: 4499, price_sensitivity_mean: 0.51, quality_sensitivity_mean: 0.83 },
      { segment_id: 'SEG-03', name: 'Solo Hackers & Indie Devs', prevalence: 0.30, willingness_to_pay_median_inr: 1499, price_sensitivity_mean: 0.89, quality_sensitivity_mean: 0.65 }
    ]
  },
  {
    id: 'finiq',
    name: 'FinIQ — Algorithmic Tax Coach',
    category: 'FinTech / Personal Wealth',
    price: 1499,
    geography: 'Metropolitan Salaried & Freelance India',
    description: 'AI automated Indian income tax calculation, quarterly Section 80C/80D optimizer, and mutual fund tax harvesting.',
    competitors: [
      { name: 'ClearTax / Zerodha Coin', price: 1799, quality_score: 0.85, brand_score: 0.94, risk_score: 0.15, market_share: 46.0 },
      { name: 'Offline Chartered Accountant (CA)', price: 3500, quality_score: 0.82, brand_score: 0.75, risk_score: 0.22, market_share: 26.0 },
      { name: 'Manual Excel & IT Portal', price: 0, quality_score: 0.45, brand_score: 0.65, risk_score: 0.25, market_share: 18.0 },
    ],
    segments: [
      { segment_id: 'SEG-01', name: 'Tier-1 Salaried Techies', prevalence: 0.38, willingness_to_pay_median_inr: 1999, price_sensitivity_mean: 0.35, quality_sensitivity_mean: 0.86 },
      { segment_id: 'SEG-02', name: 'Freelancers & Consultants', prevalence: 0.37, willingness_to_pay_median_inr: 1499, price_sensitivity_mean: 0.49, quality_sensitivity_mean: 0.80 },
      { segment_id: 'SEG-03', name: 'First-Job Freshers', prevalence: 0.25, willingness_to_pay_median_inr: 499, price_sensitivity_mean: 0.91, quality_sensitivity_mean: 0.48 }
    ]
  },
  {
    id: 'eduspark',
    name: 'EduSpark Pro — Exam AI Tutor',
    category: 'EdTech / Competitive Exam Prep',
    price: 2999,
    geography: 'Tier-1 & Tier-2 Aspirants (JEE/NEET/CAT)',
    description: 'Real-time 30-second doubt resolution, personalized spaced repetition question banks, and AI rank prediction analytics.',
    competitors: [
      { name: 'Unacademy / PhysicsWallah Live', price: 3999, quality_score: 0.82, brand_score: 0.91, risk_score: 0.19, market_share: 45.0 },
      { name: 'Offline Coaching Centers', price: 7500, quality_score: 0.78, brand_score: 0.70, risk_score: 0.24, market_share: 28.0 },
      { name: 'Free Telegram & YouTube', price: 0, quality_score: 0.50, brand_score: 0.75, risk_score: 0.18, market_share: 17.0 },
    ],
    segments: [
      { segment_id: 'SEG-01', name: 'Target 99%ile Aspirants', prevalence: 0.30, willingness_to_pay_median_inr: 3999, price_sensitivity_mean: 0.32, quality_sensitivity_mean: 0.94 },
      { segment_id: 'SEG-02', name: 'Self-Paced Repeaters', prevalence: 0.45, willingness_to_pay_median_inr: 2799, price_sensitivity_mean: 0.52, quality_sensitivity_mean: 0.82 },
      { segment_id: 'SEG-03', name: 'Tier-2/3 Budget Students', prevalence: 0.25, willingness_to_pay_median_inr: 999, price_sensitivity_mean: 0.88, quality_sensitivity_mean: 0.58 }
    ]
  }
];

export const TopNav: React.FC = () => {
  const [isSimModalOpen, setIsSimModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<any>(null);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);

  useEffect(() => {
    setActiveProduct(getClientActiveProduct());
    const interval = setInterval(() => {
      setActiveProduct(getClientActiveProduct());
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleSelectPreset = async (preset: typeof demoPresets[0]) => {
    const updated = {
      project_id: `PRJ-${preset.id.toUpperCase()}-2026`,
      name: preset.name,
      category: preset.category,
      price: preset.price,
      geography: preset.geography,
      description: preset.description,
      competitors: [
        { name: `${preset.name} (Our Product)`, price: preset.price, quality_score: 0.88, brand_score: 0.62, risk_score: 0.32, market_share: 31.8 },
        ...preset.competitors
      ],
      segments: preset.segments
    };
    saveMarketSetup(updated);
    setActiveProduct(updated);
    setIsPresetsOpen(false);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('swarmiq_market_updated', { detail: updated }));
    }
  };

  return (
    <>
      <header className="h-16 border-b border-slate-800/80 bg-[#0B0D14]/70 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
        {/* Left: Active Run & Target Product details */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-xs">
            <span className="text-slate-400">Run:</span>
            <span className="font-mono font-semibold text-cyan-300">2026-0912</span>
          </div>

          {/* Preset Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsPresetsOpen(!isPresetsOpen)}
              title="Click to switch test scenarios or configure market"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/50 hover:bg-cyan-900/50 border border-cyan-800/60 text-xs text-cyan-200 transition-all active:scale-95 shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0 fill-cyan-400" />
              <span className="font-semibold truncate max-w-[140px] md:max-w-[200px]">
                {activeProduct?.name || 'Pulse AI'}
              </span>
              <span className="text-[10px] text-cyan-400 font-mono hidden sm:inline">
                ({activeProduct?.price ? formatINR(activeProduct.price) : '₹1,999'})
              </span>
              <ChevronDown className={`w-3 h-3 text-cyan-400 transition-transform ${isPresetsOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isPresetsOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 p-2 rounded-xl bg-[#0E111B] border border-cyan-800/50 shadow-2xl backdrop-blur-xl z-50 space-y-1 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between uppercase">
                  <span>Quick Demo Presets</span>
                  <Link
                    href="/dashboard/market-setup"
                    onClick={() => setIsPresetsOpen(false)}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    Custom +
                  </Link>
                </div>
                {demoPresets.map((preset) => {
                  const isSelected = activeProduct?.name?.includes(preset.id) || activeProduct?.name === preset.name;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-cyan-950/60 border border-cyan-500/40 text-white'
                          : 'hover:bg-slate-800/50 text-slate-300'
                      }`}
                    >
                      <div>
                        <p className="font-semibold">{preset.name.split('—')[0]}</p>
                        <p className="text-[10px] text-slate-400">{preset.category} • {formatINR(preset.price)}</p>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>10,000 Agents</span>
          </div>

          <ProvenanceBadge level="CALIBRATED" source="Urban Consumer Survey 2024" confidence={0.96} />
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsSimModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-xs transition-all shadow-md shadow-cyan-500/20 active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>Run Simulation</span>
          </button>

          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-md border border-slate-800 hover:bg-slate-800/40 transition-colors hidden sm:inline-block"
          >
            Landing
          </Link>
        </div>
      </header>

      {/* Live Simulation Progress Modal */}
      <LiveProgressModal
        isOpen={isSimModalOpen}
        onClose={() => setIsSimModalOpen(false)}
        onComplete={() => setIsSimModalOpen(false)}
      />
    </>
  );
};

