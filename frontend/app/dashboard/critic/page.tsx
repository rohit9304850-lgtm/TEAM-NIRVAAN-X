'use client';

import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Flame,
  CheckCircle2,
  TrendingDown,
  ArrowRight,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import { ProvenanceBadge } from '@/components/analytics/ProvenanceBadge';
import { getCriticAudit, getClientActiveProduct } from '@/lib/api';
import { CriticAudit } from '@/lib/types';

export default function CriticPage() {
  const [audit, setAudit] = useState<CriticAudit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const current = getClientActiveProduct();
        const res = await getCriticAudit(current?.price || 1999, 0.318);
        setAudit(res);
      } finally {
        setLoading(false);
      }
    }
    load();

    window.addEventListener('swarmiq_market_updated', load);
    return () => window.removeEventListener('swarmiq_market_updated', load);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Adversarial Critic Agent</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-rose-950/60 border border-rose-800/40 text-rose-300 font-semibold">
              Adversarial Stress Test
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Proactively scans for cognitive bias, switching friction, and network over-optimism before market launch.
          </p>
        </div>
        <ProvenanceBadge level="SIMULATED" source="Adversarial Bias & Risk Scanner" />
      </div>

      {/* Critic Score Card */}
      {audit && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4 bg-gradient-to-r from-slate-900/90 to-[#18141F]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-slate-400">Audit Status</span>
                <h2 className="text-lg font-bold text-white">
                  Risk Rating: <span className="text-amber-400">{audit.overall_risk_rating}</span>
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase">Raw Simulated Intent</span>
                <span className="text-cyan-400 font-bold text-base">
                  {(audit.simulated_adoption_raw * 100).toFixed(1)}%
                </span>
              </div>
              <div className="text-right pl-4 border-l border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Deflated Field Intent</span>
                <span className="text-rose-400 font-extrabold text-base">
                  {(audit.adversarially_deflated_adoption * 100).toFixed(1)}%
                </span>
              </div>
              <div className="text-right pl-4 border-l border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Critic Hardening Score</span>
                <span className="text-emerald-400 font-extrabold text-base">
                  {audit.overall_critic_score}/100
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            The adversarial critic applies behavioral economics discount penalties to raw agent simulations. Surveyed intent is deflated by <strong className="text-rose-400 font-mono">-{audit.deflation_delta_pct}%</strong> to account for real-world checkout friction, credit card mandate drop-off, and free incumbent inertia.
          </p>
        </div>
      )}

      {/* Vulnerabilities Breakdown */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Detected Failure Modes & Biases
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {audit?.vulnerabilities.map((v) => (
            <div
              key={v.id}
              className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400">{v.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      v.severity === 'HIGH'
                        ? 'bg-rose-950/70 text-rose-300 border border-rose-800/60'
                        : 'bg-amber-950/70 text-amber-300 border border-amber-800/60'
                    }`}
                  >
                    {v.severity} RISK
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white">{v.title}</h4>
                <div className="p-2 rounded bg-black/40 border border-slate-800/80 font-mono text-[11px] text-rose-300 font-semibold">
                  {v.affected_metric}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {v.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-1.5">
                <span className="text-[10px] font-mono text-cyan-400 block uppercase">
                  Adversarial Remediation:
                </span>
                <p className="text-xs text-slate-300 font-medium">
                  {v.countermeasure}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable Hardening Recommendations */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            Hardened Launch Protocol Actions
          </h3>
          <ProvenanceBadge level="SIMULATED" />
        </div>

        <div className="space-y-3">
          {audit?.hardening_recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <span className="font-mono text-[10px] font-bold text-cyan-400">
                  {rec.priority}
                </span>
                <p className="font-semibold text-white text-sm">{rec.action}</p>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800/40 shrink-0">
                {rec.expected_impact}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
