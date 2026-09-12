'use client';

import React, { useState, useEffect } from 'react';
import { Share2, Users, Network, TrendingUp, Sparkles, Activity } from 'lucide-react';
import { NetworkCanvas } from '@/components/social/NetworkCanvas';
import { ProvenanceBadge } from '@/components/analytics/ProvenanceBadge';
import { getSocialNetwork } from '@/lib/api';
import { SocialGraph } from '@/lib/types';

export default function SocialNetworkPage() {
  const [graph, setGraph] = useState<SocialGraph | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSocialNetwork(75);
        setGraph(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Social Opinion Dynamics</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-purple-950/60 border border-purple-800/40 text-purple-300 font-semibold">
              30-Day DeGroot Model
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate peer-to-peer recommendation dynamics, cluster homophily, and word-of-mouth propagation.
          </p>
        </div>
        <ProvenanceBadge level="SIMULATED" source="DeGroot Hegselmann-Krause Dynamics" />
      </div>

      {/* Main Interactive Network Canvas */}
      {graph ? (
        <NetworkCanvas graph={graph} />
      ) : (
        <div className="glass-panel rounded-2xl p-16 text-center text-slate-400">
          Loading 30-Day Opinion Dynamics...
        </div>
      )}

      {/* Model Formulation Card */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          DeGroot Hegselmann-Krause Opinion Dynamic Formulation
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          The population social graph is constructed via a Barabási–Albert scale-free topology enriched with psychographic homophily distance. Every persona node updates its opinion over 30 simulation days according to:
        </p>
        <div className="p-3 rounded-xl bg-black/50 border border-slate-800 font-mono text-xs text-cyan-300">
          Opinion_i(t+1) = α · Opinion_i(t) + β · Σ_j W_ij · Opinion_j(t) + γ · ProductExperience_i
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-slate-400 pt-1">
          <div>• α = 0.65 (Stubbornness / self-anchor)</div>
          <div>• β = 0.25 (Peer influence from network ties)</div>
          <div>• γ = 0.10 (Product satisfaction shock)</div>
        </div>
      </div>
    </div>
  );
}
