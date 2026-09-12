'use client';

import React, { useState } from 'react';
import { ProvenanceLevel } from '@/lib/types';
import { getProvenanceBadgeConfig, cn } from '@/lib/utils';
import { ShieldCheck, Info, CheckCircle2 } from 'lucide-react';

interface ProvenanceBadgeProps {
  level: ProvenanceLevel;
  source?: string;
  confidence?: number;
  className?: string;
  showDetails?: boolean;
}

const levelDescriptions: Record<ProvenanceLevel, string> = {
  EMPIRICAL: 'Direct ground-truth measurement from validated consumer surveys and observed transaction logs.',
  CALIBRATED: 'Statistically fitted persona attributes parameterized against empirical distribution priors.',
  SIMULATED: 'Vectorized multi-agent utility calculation and synthetic behavioral decision dynamics.',
  EXTRAPOLATED: 'Econometric Bass diffusion curve projections extended beyond the 30-day agentic horizon.',
  LOW_CONFIDENCE: 'High variance cohort or small demographic subgroup (N < 200) requiring cautious interpretation.'
};

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  level,
  source,
  confidence = 0.95,
  className,
  showDetails = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const config = getProvenanceBadgeConfig(level);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer hover:brightness-110 active:scale-95',
          config.badgeClass,
          className
        )}
        aria-label={`Provenance status: ${config.label}. Source: ${source || 'Swarm Engine'}`}
      >
        <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse shrink-0', config.dotClass)} />
        <span className="tracking-wide uppercase font-semibold text-[10px] font-mono">{config.label}</span>
        {showDetails && (
          <span className="text-[10px] opacity-80 font-mono ml-0.5">
            {(confidence * 100).toFixed(0)}%
          </span>
        )}
      </button>

      {/* Floating Rich Tooltip */}
      {showTooltip && (
        <div className="absolute z-50 left-1/2 -translate-x-1/2 top-full mt-2 w-64 p-3 rounded-xl bg-[#0B0E17]/95 border border-slate-700/80 shadow-2xl backdrop-blur-xl text-left text-xs pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
            <div className="flex items-center gap-1.5">
              <span className={cn('w-2 h-2 rounded-full', config.dotClass)} />
              <span className="font-mono font-bold text-white uppercase text-[11px]">{config.label} TIER</span>
            </div>
            <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
              {(confidence * 100).toFixed(0)}% Conf
            </span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed mb-2">
            {levelDescriptions[level] || 'Validated through SwarmIQ deterministic protocols.'}
          </p>
          {source && (
            <div className="pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono">
              <span className="text-slate-500 block uppercase text-[9px]">Source Evidence:</span>
              <span className="text-slate-200 truncate block">{source}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

