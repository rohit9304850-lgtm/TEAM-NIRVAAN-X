'use client';

import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  Award,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { ProvenanceBadge } from '@/components/analytics/ProvenanceBadge';
import { getStrategies } from '@/lib/api';
import { StrategySearchResult, StrategyCandidate } from '@/lib/types';
import { formatINR } from '@/lib/utils';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ZAxis
} from 'recharts';

export default function StrategyLabPage() {
  const [strategyData, setStrategyData] = useState<StrategySearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterParetoOnly, setFilterParetoOnly] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await getStrategies();
        setStrategyData(res);
      } finally {
        setLoading(false);
      }
    }
    load();

    window.addEventListener('swarmiq_market_updated', load);
    return () => window.removeEventListener('swarmiq_market_updated', load);
  }, []);

  const strategies = strategyData?.strategies || [];
  const displayedStrategies = filterParetoOnly
    ? strategies.filter((s) => s.is_pareto_optimal)
    : strategies;

  // Champion strategy S-027
  const champion = strategies.find((s) => s.strategy_id === 'S-027') || strategies[0];

  // Scatter data: X = Margin%, Y = Adoption%
  const scatterData = strategies.map((s) => ({
    name: s.strategy_id,
    x: s.margin_percentage,
    y: Number((s.adoption_rate * 100).toFixed(1)),
    z: s.revenue_index,
    isPareto: s.is_pareto_optimal,
    isChampion: s.strategy_id === 'S-027',
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Bayesian Strategy Optimization Lab</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 font-semibold">
              Pareto Frontier Search
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Multi-objective hyperparameter optimization balancing adoption velocity, gross margins, and adversarial risk penalty.
          </p>
        </div>
        <ProvenanceBadge level="SIMULATED" source="Bayesian Hyperparameter Search" />
      </div>

      {/* Champion Strategy Spotlight Card: S-027 */}
      {champion && (
        <div className="glass-panel-glow rounded-2xl p-6 border border-cyan-500/40 space-y-4 bg-gradient-to-r from-[#0C1425] to-[#121A2E]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-400 text-black">
                <Award className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base text-white font-mono">
                    CHAMPION STRATEGY: {champion.strategy_id}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-400 text-black">
                    PARETO OPTIMAL
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-cyan-300">{champion.name}</h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-right">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Adoption Lift</span>
                <span className="text-base font-extrabold font-mono text-emerald-400">
                  +{champion.adoption_lift_vs_baseline}% vs Baseline
                </span>
              </div>
            </div>
          </div>

          {/* Hyperparameter matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Optimal Price</span>
              <span className="text-lg font-bold font-mono text-white">{formatINR(champion.price)}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Trial Packaging</span>
              <span className="text-sm font-semibold text-cyan-300">{champion.trial_offer}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Target Segment</span>
              <span className="text-sm font-semibold text-purple-300">{champion.target_segment}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Gross Margin</span>
              <span className="text-lg font-bold font-mono text-emerald-400">{champion.margin_percentage}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Critic Hardening</span>
              <span className="text-lg font-bold font-mono text-cyan-400">{champion.critic_score}/100</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/30 text-xs text-slate-300 leading-relaxed">
            <strong className="text-cyan-200">Mathematical Rationale: </strong>
            Lowering price to ₹1,699 with a 14-day trial unlocks high conversion in the Busy Professionals segment (+9.7% adoption lift) while retaining an exceptional 84.2% gross margin. The Streak Habit Guarantee counters switching friction without diluting perceived brand quality.
          </div>
        </div>
      )}

      {/* Pareto Frontier Scatter Chart */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-white">Multi-Objective Pareto Frontier</h3>
            <p className="text-xs text-slate-400">Adoption Rate vs Gross Margin (%) across 35 tested strategies</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterParetoOnly(!filterParetoOnly)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                filterParetoOnly
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {filterParetoOnly ? 'Show All 35 Strategies' : 'Filter Pareto Frontier Only'}
            </button>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis
                type="number"
                dataKey="x"
                name="Gross Margin"
                unit="%"
                stroke="#475569"
                fontSize={11}
                domain={[50, 95]}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Adoption Rate"
                unit="%"
                stroke="#475569"
                fontSize={11}
                domain={[10, 55]}
              />
              <ZAxis type="number" dataKey="z" range={[60, 240]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#0F121C', borderColor: '#1E293B', borderRadius: '8px', fontSize: '12px' }}
                formatter={(val: any, name: any) => [`${val}%`, name]}
              />
              <Scatter name="Strategies" data={scatterData}>
                {scatterData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isChampion ? '#00F2FE' : entry.isPareto ? '#10B981' : '#475569'}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Champion Strategy (S-027)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Pareto Optimal Frontier
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600" /> Sub-optimal / Dominated
            </span>
          </div>
          <span className="font-mono text-cyan-400">8 Pareto Candidates Found</span>
        </div>
      </div>

      {/* Strategies Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-mono text-[10px]">
              <tr>
                <th className="px-4 py-3">Strategy ID</th>
                <th className="px-4 py-3">Strategy Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Trial & Guarantee</th>
                <th className="px-4 py-3 text-center">Adoption</th>
                <th className="px-4 py-3 text-center">Gross Margin</th>
                <th className="px-4 py-3 text-center">Revenue Index</th>
                <th className="px-4 py-3 text-right">Pareto Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {displayedStrategies.map((s) => (
                <tr
                  key={s.strategy_id}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    s.strategy_id === 'S-027' ? 'bg-cyan-950/20 font-semibold' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-cyan-400">
                    {s.strategy_id}
                  </td>
                  <td className="px-4 py-3 text-white">
                    {s.name}
                    <span className="text-[10px] text-slate-400 block font-normal">{s.positioning}</span>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-white">{formatINR(s.price)}</td>
                  <td className="px-4 py-3 text-slate-300">
                    {s.trial_offer}
                    <span className="text-[10px] text-slate-500 block">{s.guarantee}</span>
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-emerald-400">
                    {(s.adoption_rate * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-slate-200">
                    {s.margin_percentage}%
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-cyan-300">
                    {s.revenue_index}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {s.is_pareto_optimal ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-950/70 border border-emerald-800/50 text-emerald-300">
                        OPTIMAL
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-slate-500 bg-slate-900 border border-slate-800">
                        DOMINATED
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
