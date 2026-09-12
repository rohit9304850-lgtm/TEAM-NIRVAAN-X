'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  SlidersHorizontal,
  Plus,
  Trash2,
  CheckCircle,
  FileCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Upload,
  Database,
  Code2,
  Coins,
  GraduationCap,
  HeartPulse,
  Edit3
} from 'lucide-react';
import { ProvenanceBadge } from '@/components/analytics/ProvenanceBadge';
import { getClientActiveProduct, saveMarketSetup, getMarketCurrent } from '@/lib/api';
import { formatINR } from '@/lib/utils';

interface Preset {
  id: string;
  name: string;
  category: string;
  price: number;
  geography: string;
  description: string;
  icon: any;
  competitors: Array<{ name: string; price: number; quality_score: number; brand_score: number; risk_score: number }>;
}

const productPresets: Preset[] = [
  {
    id: 'pulse',
    name: 'Pulse — AI Fitness Companion',
    category: 'Health & Fitness SaaS',
    price: 1999,
    geography: 'Urban India (Tier 1 & Tier 2)',
    description: 'Autonomous AI adaptive workout coach with WhatsApp accountability integration and real-time form audio correction.',
    icon: HeartPulse,
    competitors: [
      { name: 'Cult.fit / CultPass', price: 2499, quality_score: 0.84, brand_score: 0.92, risk_score: 0.22 },
      { name: 'Freefit / Generic Apps', price: 499, quality_score: 0.52, brand_score: 0.45, risk_score: 0.40 },
      { name: 'Status Quo (No App / YouTube)', price: 0, quality_score: 0.41, brand_score: 0.70, risk_score: 0.15 },
    ]
  },
  {
    id: 'devscribe',
    name: 'DevScribe AI — Autonomous API Doc Generator',
    category: 'Developer Tools / B2B SaaS',
    price: 4999,
    geography: 'India Tech Hubs & Remote Dev Teams',
    description: 'Scans Git repositories to continuously generate interactive OpenAPI documentation, client SDKs, and developer portals.',
    icon: Code2,
    competitors: [
      { name: 'GitHub Copilot / Enterprise Stack', price: 6500, quality_score: 0.86, brand_score: 0.95, risk_score: 0.18 },
      { name: 'Swagger / ReadMe Open Source', price: 0, quality_score: 0.65, brand_score: 0.82, risk_score: 0.20 },
      { name: 'Manual Internal Engineering Docs', price: 0, quality_score: 0.40, brand_score: 0.60, risk_score: 0.35 },
    ]
  },
  {
    id: 'finiq',
    name: 'FinIQ — Algorithmic Tax & Wealth Coach',
    category: 'FinTech / Personal Wealth',
    price: 1499,
    geography: 'Metropolitan Salaried & Freelance India',
    description: 'AI automated Indian income tax calculation, quarterly Section 80C/80D deduction optimizer, and mutual fund tax harvesting.',
    icon: Coins,
    competitors: [
      { name: 'ClearTax / Zerodha Coin', price: 1799, quality_score: 0.85, brand_score: 0.94, risk_score: 0.15 },
      { name: 'Offline Chartered Accountant (CA)', price: 3500, quality_score: 0.82, brand_score: 0.75, risk_score: 0.22 },
      { name: 'Manual Excel & Income Tax Portal', price: 0, quality_score: 0.45, brand_score: 0.65, risk_score: 0.25 },
    ]
  },
  {
    id: 'eduspark',
    name: 'EduSpark Pro — Adaptive Entrance Exam AI Tutor',
    category: 'EdTech / Competitive Exam Prep',
    price: 2999,
    geography: 'Tier-1 & Tier-2 Aspirants (JEE/NEET/CAT)',
    description: 'Real-time 30-second doubt resolution, personalized spaced repetition question banks, and AI rank prediction analytics.',
    icon: GraduationCap,
    competitors: [
      { name: 'Unacademy / PhysicsWallah Live', price: 3999, quality_score: 0.82, brand_score: 0.91, risk_score: 0.19 },
      { name: 'Offline Kota/Local Coaching Institute', price: 7500, quality_score: 0.78, brand_score: 0.70, risk_score: 0.24 },
      { name: 'Free Telegram Channels & YouTube', price: 0, quality_score: 0.50, brand_score: 0.75, risk_score: 0.18 },
    ]
  }
];

export default function MarketSetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [activePresetId, setActivePresetId] = useState<string>('custom');

  // Step 1: Product
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState(1999);
  const [geography, setGeography] = useState('');
  const [description, setDescription] = useState('');

  // Step 2: Competitors
  const [competitors, setCompetitors] = useState<Array<{ name: string; price: number; quality_score: number; brand_score: number; risk_score: number }>>([]);

  // Step 3: Segments
  const [segments, setSegments] = useState([
    { name: 'Fitness / High-Propensity Cohort', prevalence: 32, wtp: 2499, priceSens: 0.38 },
    { name: 'Busy Working Professionals', prevalence: 43, wtp: 1899, priceSens: 0.48 },
    { name: 'Price-Sensitive Beginners', prevalence: 25, wtp: 999, priceSens: 0.84 },
  ]);

  // Step 4: Evidence source
  const [selectedDataset, setSelectedDataset] = useState('indian_urban_2024');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const current = getClientActiveProduct();
    setProductName(current.name);
    setCategory(current.category);
    setPrice(current.price);
    setGeography(current.geography);
    setDescription(current.description);
    setCompetitors(current.competitors || []);
  }, []);

  const handleSelectPreset = (preset: Preset) => {
    setActivePresetId(preset.id);
    setProductName(preset.name);
    setCategory(preset.category);
    setPrice(preset.price);
    setGeography(preset.geography);
    setDescription(preset.description);
    setCompetitors(preset.competitors);
  };

  const handleSaveAndLaunch = async () => {
    setIsSaving(true);
    try {
      const saved = await saveMarketSetup({
        name: productName,
        category,
        price,
        geography,
        description,
        competitors
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('swarmiq_market_updated', { detail: saved }));
      }
      router.push('/dashboard');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Market Setup Wizard</h1>
            <p className="text-xs text-slate-400 mt-1">
              Configure product parameters, choose an AI preset, or enter any custom product to simulate.
            </p>
          </div>
          <ProvenanceBadge level="CALIBRATED" source="Indian Urban Survey 2024" />
        </div>

        {/* 4-Step Progress Indicator */}
        <div className="grid grid-cols-4 gap-2 mt-6">
          {[
            { step: 1, title: 'Product Definition' },
            { step: 2, title: 'Competitors' },
            { step: 3, title: 'Segments' },
            { step: 4, title: 'Calibration' },
          ].map((s) => (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              className={`text-left p-2.5 rounded-xl border transition-all ${
                currentStep === s.step
                  ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300'
                  : currentStep > s.step
                  ? 'bg-slate-900/40 border-slate-800 text-slate-300'
                  : 'bg-slate-900/20 border-slate-800/40 text-slate-500'
              }`}
            >
              <div className="text-[10px] font-mono uppercase tracking-wider mb-0.5">
                Step 0{s.step}
              </div>
              <div className="text-xs font-semibold truncate">{s.title}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Preset Picker Banner (Step 1) */}
      {currentStep === 1 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase font-mono text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Quick Product Presets (One-Click Setup)
            </span>
            <span className="text-[11px] text-slate-400">Select or enter custom below</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {productPresets.map((p) => {
              const Icon = p.icon;
              const isSelected = activePresetId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-cyan-950/50 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/15'
                      : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="font-mono text-[10px] font-bold text-slate-400">
                      ₹{p.price.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white truncate">{p.name.split('—')[0].trim()}</h4>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{p.category}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 1: Product Definition Form */}
      {currentStep === 1 && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-cyan-400" />
              Customize Product & Value Proposition
            </h2>
            <span className="text-xs text-slate-400 font-mono">10,000 Personas evaluate this</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium">Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => {
                  setProductName(e.target.value);
                  setActivePresetId('custom');
                }}
                placeholder="e.g. DevScribe AI, FinIQ, EduSpark, or your product"
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-lg px-3 py-2 text-white focus:border-cyan-400 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium">Category / Industry</label>
              <input
                type="text"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setActivePresetId('custom');
                }}
                placeholder="e.g. Developer Tools, FinTech, EdTech, B2B SaaS"
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-lg px-3 py-2 text-white focus:border-cyan-400 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium">Monthly Price (INR)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => {
                  setPrice(Number(e.target.value));
                  setActivePresetId('custom');
                }}
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-lg px-3 py-2 text-white font-mono focus:border-cyan-400 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium">Target Geography</label>
              <input
                type="text"
                value={geography}
                onChange={(e) => {
                  setGeography(e.target.value);
                  setActivePresetId('custom');
                }}
                placeholder="e.g. Urban India (Tier 1 & Tier 2)"
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-lg px-3 py-2 text-white focus:border-cyan-400 outline-none"
              />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-slate-400 font-medium">
                Feature & Value Proposition Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setActivePresetId('custom');
                }}
                placeholder="Describe your product's killer features, customer promise, and use case..."
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-lg px-3 py-2 text-white focus:border-cyan-400 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Competitor Landscape */}
      {currentStep === 2 && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Step 2: Competitor Landscape</h2>
              <p className="text-xs text-slate-400">
                Incumbents against which {productName} will compete in simulated purchase choices.
              </p>
            </div>
            <button
              onClick={() =>
                setCompetitors([
                  ...competitors,
                  { name: 'New Alternative', price: Math.round(price * 0.8), quality_score: 0.6, brand_score: 0.5, risk_score: 0.3 }
                ])
              }
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Competitor
            </button>
          </div>

          <div className="space-y-3">
            {competitors.map((comp, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 grid grid-cols-1 sm:grid-cols-5 gap-3 items-center text-xs">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-slate-400 text-[10px]">Competitor Name</label>
                  <input
                    type="text"
                    value={comp.name}
                    onChange={(e) => {
                      const copy = [...competitors];
                      copy[idx].name = e.target.value;
                      setCompetitors(copy);
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 text-[10px]">Price (INR)</label>
                  <input
                    type="number"
                    value={comp.price}
                    onChange={(e) => {
                      const copy = [...competitors];
                      copy[idx].price = Number(e.target.value);
                      setCompetitors(copy);
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 text-[10px]">Quality [0-1]</label>
                  <input
                    type="number"
                    step="0.05"
                    max="1.0"
                    min="0.0"
                    value={comp.quality_score}
                    onChange={(e) => {
                      const copy = [...competitors];
                      copy[idx].quality_score = Number(e.target.value);
                      setCompetitors(copy);
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-white font-mono"
                  />
                </div>
                <div className="flex items-center justify-end sm:pt-4">
                  <button
                    onClick={() => setCompetitors(competitors.filter((_, i) => i !== idx))}
                    className="text-slate-400 hover:text-rose-400 p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Target Segments */}
      {currentStep === 3 && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <h2 className="text-base font-semibold text-white">Step 3: Target Segment Weights</h2>
          <p className="text-xs text-slate-400">
            Configure target population prevalence and willingness-to-pay deciles.
          </p>

          <div className="space-y-3">
            {segments.map((seg, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-sm">{seg.name}</span>
                  <span className="font-mono text-cyan-300 font-bold">{seg.prevalence}% Prevalence</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Median WTP</span>
                    <span className="font-mono font-bold text-white">{formatINR(seg.wtp)}</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Price Sensitivity</span>
                    <span className="font-mono font-bold text-amber-400">{seg.priceSens}</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
                    <span className="text-slate-400 block text-[10px]">Prevalence Weight</span>
                    <input
                      type="range"
                      min={10}
                      max={60}
                      value={seg.prevalence}
                      onChange={(e) => {
                        const copy = [...segments];
                        copy[idx].prevalence = Number(e.target.value);
                        setSegments(copy);
                      }}
                      className="w-full accent-cyan-400 cursor-pointer mt-1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Evidence Sources */}
      {currentStep === 4 && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5">
          <h2 className="text-base font-semibold text-white">Step 4: Empirical Calibration Source</h2>
          <p className="text-xs text-slate-400">
            Select the empirical research dataset that anchors persona traits, income distributions, and behavioral elasticity.
          </p>

          <div className="space-y-3">
            <div
              onClick={() => setSelectedDataset('indian_urban_2024')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedDataset === 'indian_urban_2024'
                  ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 mt-0.5">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-white">
                      Indian Urban Consumer Survey 2024 (Empirical Benchmark)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      N = 1,200 empirical respondents across 8 metro tiers (Bengaluru, Mumbai, Delhi, Hyderabad, Pune, Chennai, etc.)
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <ProvenanceBadge level="EMPIRICAL" source="Survey 2024" />
                      <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                        96.4% Fidelity Confidence
                      </span>
                    </div>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className="px-4 py-2 rounded-xl border border-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-800/60 disabled:opacity-40 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Previous Step
        </button>

        {currentStep < 4 ? (
          <button
            onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5"
          >
            <span>Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={handleSaveAndLaunch}
            disabled={isSaving || !productName.trim()}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 fill-black" />
            <span>{isSaving ? 'Calibrating Swarm...' : `Save & Simulate ${productName || 'Product'} (10K Agents)`}</span>
          </button>
        )}
      </div>
    </div>
  );
}
