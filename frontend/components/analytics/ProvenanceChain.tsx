'use client';

import React from 'react';
import { ShieldCheck, Database, Cpu, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepItem {
  stage: 'EMPIRICAL' | 'CALIBRATED' | 'SIMULATED' | 'EXTRAPOLATED';
  title: string;
  badgeColor: string;
  borderColor: string;
  bgGradient: string;
  icon: React.ElementType;
  definition: string;
  exampleData: string;
  confidence: string;
}

const steps: StepItem[] = [
  {
    stage: 'EMPIRICAL',
    title: 'Ground-Truth Priors',
    badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-700/50',
    borderColor: 'border-emerald-700/40',
    bgGradient: 'from-emerald-950/20 to-transparent',
    icon: Database,
    definition: 'Direct ground-truth observations from stratified consumer surveys across 8 Indian metros.',
    exampleData: 'Indian Urban Survey 2024 (N=1,200)',
    confidence: '96.4% Fidelity'
  },
  {
    stage: 'CALIBRATED',
    title: 'Deterministic Personas',
    badgeColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-700/50',
    borderColor: 'border-cyan-700/40',
    bgGradient: 'from-cyan-950/20 to-transparent',
    icon: ShieldCheck,
    definition: '10,000 persistent personas parameterized via seeded lognormal and Dirichlet distributions.',
    exampleData: '10,000 Persistent Personas (Seed: 42)',
    confidence: 'KL Div: 0.042'
  },
  {
    stage: 'SIMULATED',
    title: 'Multi-Agent Execution',
    badgeColor: 'text-purple-400 bg-purple-950/60 border-purple-700/50',
    borderColor: 'border-purple-700/40',
    bgGradient: 'from-purple-950/20 to-transparent',
    icon: Cpu,
    definition: 'Day 0–30 vectorized utility equations, peer influence dynamics, and adversarial friction tests.',
    exampleData: 'Utility + DeGroot Social Opinion',
    confidence: '95% Wilson CI'
  },
  {
    stage: 'EXTRAPOLATED',
    title: 'Econometric Diffusion',
    badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-700/50',
    borderColor: 'border-amber-700/40',
    bgGradient: 'from-amber-950/20 to-transparent',
    icon: TrendingUp,
    definition: 'Days 31–365 annualized trajectory modeled via dual-zone Bass diffusion with market saturation bounds.',
    exampleData: 'Day 31–365 Annualized ARR Projections',
    confidence: 'Bounded Est.'
  },
];

export const ProvenanceChain: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('glass-panel rounded-2xl p-6 border border-slate-800 space-y-4', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Traceable Data Provenance Pipeline</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Clear separation between observed empirical facts, calibrated persona weights, and synthetic simulations
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/60 text-[10px] font-mono text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>ZERO-HALLUCINATION TAXONOMY</span>
        </div>
      </div>

      {/* Pipeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.stage}
              className={cn(
                'relative p-4 rounded-xl border bg-gradient-to-b flex flex-col justify-between space-y-3 transition-all hover:translate-y-[-2px]',
                step.borderColor,
                step.bgGradient
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border', step.badgeColor)}>
                    0{idx + 1} • {step.stage}
                  </span>
                  <Icon className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="font-semibold text-xs text-white">{step.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                  {step.definition}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-400 truncate max-w-[120px]">{step.exampleData}</span>
                <span className="text-slate-300 font-bold">{step.confidence}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
