'use client';

import React, { useState } from 'react';
import {
  Database,
  Upload,
  CheckCircle2,
  ShieldCheck,
  FileSpreadsheet,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ProvenanceBadge } from '@/components/analytics/ProvenanceBadge';

export default function DataSourcesPage() {
  const [activeTab, setActiveTab] = useState<'current' | 'upload'>('current');

  const ageDist = [
    { range: '18-24 yrs', pct: '22%', count: '264 respondents' },
    { range: '25-34 yrs', pct: '44%', count: '528 respondents' },
    { range: '35-44 yrs', pct: '21%', count: '252 respondents' },
    { range: '45-54 yrs', pct: '9%', count: '108 respondents' },
    { range: '55+ yrs', pct: '4%', count: '48 respondents' },
  ];

  const cityDist = [
    { city: 'Bengaluru', tier: 'Tier-1', weight: '24%' },
    { city: 'Mumbai', tier: 'Tier-1', weight: '22%' },
    { city: 'Delhi-NCR', tier: 'Tier-1', weight: '20%' },
    { city: 'Hyderabad', tier: 'Tier-1', weight: '12%' },
    { city: 'Pune', tier: 'Tier-1', weight: '9%' },
    { city: 'Chennai', tier: 'Tier-1', weight: '7%' },
    { city: 'Ahmedabad', tier: 'Tier-2', weight: '3%' },
    { city: 'Kolkata', tier: 'Tier-2', weight: '3%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Empirical Data Sources</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 font-semibold">
              Ground-Truth Foundation
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Empirical datasets used to calibrate the 10,000 persona swarm and compute statistical fidelity.
          </p>
        </div>
        <ProvenanceBadge level="EMPIRICAL" source="Survey 2024 (N=1,200)" />
      </div>

      {/* Dataset Details Card */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6 bg-[#0D1019]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 mt-0.5">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  Indian Urban Consumer Survey 2024
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-bold">
                  DEFAULT CALIBRATOR
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Version 2024.2-Q3 • Stratified across 8 metropolitan clusters • Collection: Jan - Jun 2024
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase">Sample Size</span>
              <span className="text-white font-bold text-base">N = 1,200</span>
            </div>
            <div className="text-right pl-3 border-l border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Fidelity Index</span>
              <span className="text-emerald-400 font-bold text-base">96.4%</span>
            </div>
          </div>
        </div>

        {/* Distributions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Age Distribution */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-200 flex items-center justify-between">
              <span>Age Stratification</span>
              <span className="text-[10px] text-slate-400 font-mono">Mean: 31.4 yrs</span>
            </h3>
            <div className="space-y-2">
              {ageDist.map((a) => (
                <div key={a.range} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">{a.range}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-cyan-400 font-semibold">{a.pct}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{a.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* City Distribution */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-200 flex items-center justify-between">
              <span>Metropolitan Geography (8 Tiers)</span>
              <span className="text-[10px] text-slate-400 font-mono">82% Tier-1 Metros</span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {cityDist.map((c) => (
                <div key={c.city} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-slate-200 block font-medium">{c.city}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{c.tier}</span>
                  </div>
                  <span className="font-mono text-emerald-400 font-semibold">{c.weight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upload New Dataset Section */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-white">Upload New Empirical Dataset</h3>
        <p className="text-xs text-slate-400">
          Upload any consumer research survey (CSV or JSON). SwarmIQ automatically validates schema, computes Wasserstein demographic distance, and calibrates a new 10,000 persona population.
        </p>

        <div className="border border-dashed border-slate-700/80 rounded-xl p-8 text-center space-y-3 bg-slate-900/20">
          <Upload className="w-8 h-8 mx-auto text-slate-400" />
          <div>
            <p className="text-xs font-semibold text-white">Drag & drop your survey CSV here</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Supports CSV, XLSX, and JSON up to 50MB</p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium transition-colors">
            Select File from Machine
          </button>
        </div>
      </div>
    </div>
  );
}
