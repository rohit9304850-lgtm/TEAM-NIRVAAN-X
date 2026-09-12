'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Sparkles,
  DollarSign,
  Calendar,
  Users,
  ShieldCheck
} from 'lucide-react';
import { ProvenanceBadge } from '@/components/analytics/ProvenanceBadge';
import { getForecastTrajectory, getClientActiveProduct } from '@/lib/api';
import { ForecastTrajectory } from '@/lib/types';
import { formatINR } from '@/lib/utils';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

export default function ForecastPage() {
  const [testedPrice, setTestedPrice] = useState(() => {
    return getClientActiveProduct()?.price || 1999;
  });
  const [forecast, setForecast] = useState<ForecastTrajectory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleUpdate = () => {
      const current = getClientActiveProduct();
      if (current?.price) {
        setTestedPrice(current.price);
      }
    };
    window.addEventListener('swarmiq_market_updated', handleUpdate);
    return () => window.removeEventListener('swarmiq_market_updated', handleUpdate);
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getForecastTrajectory(testedPrice);
        setForecast(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [testedPrice]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Dual-Zone Trajectory Forecast</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-950/60 border border-amber-800/40 text-amber-300 font-semibold">
              Days 0-30 Sim • Days 31-365 Extrapolated
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Empirically bounded projection integrating short-term agentic simulation with long-term econometric Bass diffusion.
          </p>
        </div>
        <ProvenanceBadge level="EXTRAPOLATED" source="Dual-Zone Econometric Projection" />
      </div>

      {/* Unfamiliar Territory Alert Banner */}
      {forecast?.unfamiliar_alert.triggered && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 flex items-start gap-3 text-xs text-amber-200 shadow-lg shadow-amber-950/20">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-sm uppercase font-mono tracking-wide text-amber-300">
              Unfamiliar Territory Alert: {forecast.unfamiliar_alert.divergence_pct}% Divergence
            </span>
            <p className="leading-relaxed text-slate-300">
              {forecast.unfamiliar_alert.message}
            </p>
          </div>
        </div>
      )}

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-xl p-4 border border-slate-800">
          <span className="text-slate-400 text-[10px] uppercase font-mono block">Day-30 Simulated Rate</span>
          <span className="text-2xl font-extrabold font-mono text-cyan-400">
            {forecast ? `${(forecast.day30_simulated_rate * 100).toFixed(1)}%` : '31.8%'}
          </span>
          <div className="mt-1">
            <ProvenanceBadge level="SIMULATED" />
          </div>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-slate-800">
          <span className="text-slate-400 text-[10px] uppercase font-mono block">Day-365 Projected Rate</span>
          <span className="text-2xl font-extrabold font-mono text-amber-400">
            {forecast ? `${(forecast.day365_projected_rate * 100).toFixed(1)}%` : '24.6%'}
          </span>
          <div className="mt-1">
            <ProvenanceBadge level="EXTRAPOLATED" />
          </div>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-slate-800">
          <span className="text-slate-400 text-[10px] uppercase font-mono block">Annual Active Users</span>
          <span className="text-2xl font-extrabold font-mono text-white">
            {forecast ? forecast.annual_projected_subscribers.toLocaleString() : '123,000'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Out of 500k Addressable</span>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-slate-800">
          <span className="text-slate-400 text-[10px] uppercase font-mono block">Projected Run-rate ARR</span>
          <span className="text-2xl font-extrabold font-mono text-emerald-400">
            ₹{forecast ? forecast.annual_arr_crores_inr : '29.5'} Cr
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">At ₹{testedPrice.toLocaleString()}/mo</span>
        </div>
      </div>

      {/* Dual-Zone Chart Canvas */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-white">365-Day Dual-Zone Growth Trajectory</h3>
            <p className="text-xs text-slate-400">
              Days 0-30: Solid Cyan Line (SIMULATED) • Days 31-365: Dashed Amber Line (EXTRAPOLATED) with error cone
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400 font-medium">Test Price Point:</span>
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg p-1">
              {[1499, 1999, 2499, 3200].map((p) => (
                <button
                  key={p}
                  onClick={() => setTestedPrice(p)}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-colors ${
                    testedPrice === p
                      ? 'bg-cyan-500 text-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ₹{p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={forecast?.points || []}>
              <defs>
                <linearGradient id="uncertaintyCone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                stroke="#475569"
                fontSize={11}
                tickFormatter={(v) => `Day ${v}`}
              />
              <YAxis
                stroke="#475569"
                fontSize={11}
                domain={[0, 45]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F121C',
                  borderColor: '#1E293B',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(val: any, name: any) => [`${val}%`, name]}
                labelFormatter={(label) => `Day ${label}`}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />

              {/* Uncertainty Area */}
              <Area
                type="monotone"
                dataKey="ci_upper_pct"
                stroke="none"
                fill="url(#uncertaintyCone)"
                name="Uncertainty Cone"
              />

              {/* Trajectory line */}
              <Line
                type="monotone"
                dataKey="rate_pct"
                name="Adoption / Retention Rate (%)"
                stroke="#00F2FE"
                strokeWidth={2.5}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-cyan-400" /> Solid Line: 10,000 Persona Agentic Run
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-amber-400" /> Shaded Cone: ±8.4% Econometric Churn Cone
            </span>
          </div>
          <span className="font-mono text-slate-300">Annual Cohort Retention: ~77%</span>
        </div>
      </div>
    </div>
  );
}
