'use client';

import React, { useState } from 'react';
import { ProvenanceBadge } from './ProvenanceBadge';
import { ProvenanceLevel } from '@/lib/types';
import { cn } from '@/lib/utils';
import { LucideIcon, HelpCircle, ChevronDown } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  provenance: ProvenanceLevel;
  provenanceSource?: string;
  confidenceInterval?: string;
  whyExplanation?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  highlightColor?: 'cyan' | 'purple' | 'emerald' | 'amber';
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  provenance,
  provenanceSource,
  confidenceInterval,
  whyExplanation,
  icon: Icon,
  trend,
  highlightColor = 'cyan',
  className,
}) => {
  const [showWhy, setShowWhy] = useState(false);

  const highlightClasses = {
    cyan: 'from-cyan-500/10 to-transparent border-cyan-500/20 text-cyan-400',
    purple: 'from-purple-500/10 to-transparent border-purple-500/20 text-purple-400',
    emerald: 'from-emerald-500/10 to-transparent border-emerald-500/20 text-emerald-400',
    amber: 'from-amber-500/10 to-transparent border-amber-500/20 text-amber-400',
  }[highlightColor];

  return (
    <div
      className={cn(
        'glass-card rounded-xl p-4 sm:p-5 relative overflow-hidden bg-gradient-to-b flex flex-col justify-between group hover:border-slate-700/80 transition-all duration-300',
        highlightClasses,
        className
      )}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <ProvenanceBadge level={provenance} source={provenanceSource} />
      </div>

      {/* Main value and Icon */}
      <div className="flex items-baseline justify-between gap-3 my-1">
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
          {value}
        </div>
        {Icon && (
          <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/40 text-slate-400 group-hover:text-cyan-400 transition-colors">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Confidence interval & Trend */}
      <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div>
          {confidenceInterval && (
            <span className="font-mono text-[11px] text-cyan-300/90 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/40">
              95% CI: {confidenceInterval}
            </span>
          )}
          {subtitle && !confidenceInterval && (
            <span className="text-slate-400 text-xs">{subtitle}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {trend && (
            <span
              className={cn(
                'font-medium text-xs flex items-center gap-0.5',
                trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
              )}
            >
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </span>
          )}

          {whyExplanation && (
            <button
              type="button"
              onClick={() => setShowWhy(!showWhy)}
              className="text-[10px] font-mono font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-cyan-950/50 border border-cyan-800/40 hover:bg-cyan-900/50 transition-colors"
              title="Click to view underlying behavioral driver"
            >
              <span>Why?</span>
              <ChevronDown className={cn('w-2.5 h-2.5 transition-transform duration-200', showWhy ? 'rotate-180' : '')} />
            </button>
          )}
        </div>
      </div>

      {/* Why Explanation Collapsible Panel */}
      {whyExplanation && showWhy && (
        <div className="mt-2.5 pt-2 border-t border-cyan-800/30 text-[11px] text-cyan-200/90 bg-cyan-950/30 p-2.5 rounded-lg border border-cyan-900/40 leading-relaxed animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-300 uppercase tracking-wider mb-1 font-semibold">
            <HelpCircle className="w-3 h-3 text-cyan-400 shrink-0" />
            <span>Behavioral Driver Analysis</span>
          </div>
          {whyExplanation}
        </div>
      )}
    </div>
  );
};

