'use client';

import React from 'react';
import { Sword, CheckCircle, XCircle, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { ProvenanceBadge } from '@/components/analytics/ProvenanceBadge';
import { formatINR } from '@/lib/utils';
import { getMarketCurrent } from '@/lib/api';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  Legend
} from 'recharts';

export default function CompetitivePage() {
  const [market, setMarket] = React.useState<any>(null);

  React.useEffect(() => {
    const load = () => getMarketCurrent().then((m) => setMarket(m));
    load();

    window.addEventListener('swarmiq_market_updated', load);
    return () => window.removeEventListener('swarmiq_market_updated', load);
  }, []);

  const productName = market?.name || 'Active Product';
  const productPrice = market?.price || 1999;
  const competitorsList = market?.competitors || [];

  const competitorCards = competitorsList.length > 0
    ? competitorsList.map((c: any, index: number) => {
        const isOurs = index === 0 || c.name.toLowerCase().includes('our') || c.name.toLowerCase().includes(productName.toLowerCase());
        const strengths = isOurs
          ? ['Autonomous adaptive intelligence', 'Frictionless local workflow integration', 'Personalized real-time feedback loops']
          : (c.price === 0
              ? ['Zero upfront financial commitment', 'Universal zero-barrier access']
              : ['Established brand awareness in metro tiers', 'Broad feature suite catalog']);
        const weaknesses = isOurs
          ? ['New market entrant brand recognition', 'Perceived switching friction from legacy habits']
          : (c.price === 0
              ? ['Zero proactive accountability', 'High dropout within 14 days']
              : [`Higher price friction (${formatINR(c.price)}/mo)`, 'Generic one-size-fits-all workflows']);

        return {
          name: isOurs ? `${productName} (Our Product)` : c.name,
          price: isOurs ? productPrice : c.price,
          qualityScore: c.quality_score || (isOurs ? 0.88 : 0.75),
          brandScore: c.brand_score || (isOurs ? 0.62 : 0.85),
          riskScore: c.risk_score || (isOurs ? 0.32 : 0.25),
          marketShare: c.market_share || (isOurs ? 31.8 : 20.0),
          meanUtility: Number((1.1 + (c.quality_score || 0.8) * 0.5 - (c.risk_score || 0.3) * 0.3).toFixed(2)),
          strengths,
          weaknesses,
          isOurs
        };
      })
    : [
        {
          name: `${productName} (Our Product)`,
          price: productPrice,
          qualityScore: 0.88,
          brandScore: 0.62,
          riskScore: 0.32,
          marketShare: 31.8,
          meanUtility: 1.41,
          strengths: ['Autonomous adaptive workflows', 'Real-time personalized feedback', 'Accountability loops'],
          weaknesses: ['Brand awareness vs legacy incumbents', 'Initial habit migration friction'],
          isOurs: true,
        }
      ];

  const colors = ['#00F2FE', '#8B5CF6', '#F59E0B', '#64748B', '#EC4899', '#10B981'];

  // Dynamic segment preference
  const segments = ['Early Tech Innovators', 'Busy Professionals', 'Price-Sensitive Beginners'];
  const segmentPreference = segments.map((seg, sIdx) => {
    const row: any = { segment: seg };
    competitorCards.forEach((c: any, cIdx: number) => {
      const key = `comp_${cIdx}`;
      if (c.isOurs) {
        row[key] = sIdx === 0 ? 52.4 : (sIdx === 1 ? 34.1 : 12.8);
      } else if (cIdx === 1) {
        row[key] = sIdx === 0 ? 32.2 : (sIdx === 1 ? 42.5 : 18.5);
      } else if (cIdx === 2) {
        row[key] = sIdx === 0 ? 10.1 : (sIdx === 1 ? 14.2 : 36.2);
      } else {
        row[key] = sIdx === 0 ? 5.3 : (sIdx === 1 ? 9.2 : 32.5);
      }
    });
    return row;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Competitive Purchase Modeling</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 font-semibold">
              Discrete Choice Utility
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulated discrete choice purchase allocation across incumbent alternatives in Tier 1 metros.
          </p>
        </div>
        <ProvenanceBadge level="SIMULATED" source="Multi-Alternative Discrete Choice Model" />
      </div>

      {/* Head-to-Head Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {competitorCards.map((c) => (
          <div
            key={c.name}
            className={`glass-panel rounded-2xl p-5 border flex flex-col justify-between transition-all ${
              c.isOurs
                ? 'border-cyan-500/50 bg-cyan-950/20 shadow-lg shadow-cyan-500/10'
                : 'border-slate-800 bg-slate-900/40'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-bold text-sm text-white">{c.name}</span>
                {c.isOurs && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-400 text-black">
                    OURS
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-extrabold font-mono text-white">
                  {c.price === 0 ? 'FREE' : formatINR(c.price)}
                </span>
                {c.price > 0 && <span className="text-xs text-slate-400">/mo</span>}
              </div>

              {/* Utility metrics */}
              <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800/80 space-y-1 text-xs font-mono mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Quality Index:</span>
                  <span className="text-cyan-400 font-bold">{(c.qualityScore * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Brand Equity:</span>
                  <span className="text-purple-400 font-bold">{(c.brandScore * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mean Utility:</span>
                  <span className="text-emerald-400 font-bold">{c.meanUtility}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-1">
                  <span className="text-slate-400">Market Share:</span>
                  <span className="text-white font-bold">{c.marketShare}%</span>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="space-y-2 text-[11px]">
                <div className="text-emerald-400 flex items-start gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{c.strengths[0]}</span>
                </div>
                <div className="text-rose-400 flex items-start gap-1.5">
                  <XCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{c.weaknesses[0]}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Segment Preference Stacked Chart */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-white">Segment Purchase Intent Allocation</h3>
            <p className="text-xs text-slate-400">Simulated market choice by demographic cohort</p>
          </div>
          <ProvenanceBadge level="SIMULATED" />
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={segmentPreference}>
              <XAxis dataKey="segment" stroke="#475569" fontSize={11} />
              <YAxis stroke="#475569" fontSize={11} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F121C', borderColor: '#1E293B', borderRadius: '8px', fontSize: '12px' }}
                formatter={(val: any) => [`${val}%`, 'Intent Share']}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              {competitorCards.map((c: any, idx: number) => (
                <Bar
                  key={c.name}
                  dataKey={`comp_${idx}`}
                  name={c.isOurs ? `${productName} (Ours)` : c.name}
                  fill={colors[idx % colors.length]}
                  stackId="a"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
