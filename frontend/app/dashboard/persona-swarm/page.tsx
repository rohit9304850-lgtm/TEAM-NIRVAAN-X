'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
  Hash,
  ArrowUpDown,
  ExternalLink
} from 'lucide-react';
import { ProvenanceBadge } from '@/components/analytics/ProvenanceBadge';
import { PersonaDrawer } from '@/components/simulation/PersonaDrawer';
import { getPersonas, getPopulationAudit } from '@/lib/api';
import { Persona, PopulationAudit } from '@/lib/types';
import { formatINR } from '@/lib/utils';

export default function PersonaSwarmPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [audit, setAudit] = useState<PopulationAudit | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(10000);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  // Selected persona for side drawer
  const [activePersona, setActivePersona] = useState<Persona | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [pData, aData] = await Promise.all([
          getPersonas({
            segment: selectedSegment !== 'all' ? selectedSegment : undefined,
            city: selectedCity !== 'all' ? selectedCity : undefined,
            page,
            pageSize,
          }),
          getPopulationAudit(),
        ]);
        setPersonas(pData.items || []);
        setTotalCount(pData.total || 10000);
        setAudit(aData);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [page, pageSize, selectedSegment, selectedCity]);

  // Client-side search filtering on names
  const filteredPersonas = personas.filter((p) =>
    searchTerm ? p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.city.toLowerCase().includes(searchTerm.toLowerCase()) : true
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">10,000 Persistent Persona Swarm</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 font-semibold">
              Calibrated Empirical Swarm
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Every persona is persistent, calibrated with deterministic seeds, and computes multi-attribute utility decisions.
          </p>
        </div>
        <ProvenanceBadge level="CALIBRATED" source="Indian Urban Consumer Survey 2024" />
      </div>

      {/* Population Audit Card */}
      {audit && (
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4 bg-gradient-to-r from-slate-900/90 to-[#0F1422]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-white flex items-center gap-2">
                  Empirical Population Fidelity Audit
                </span>
                <p className="text-xs text-slate-400">
                  KL-Divergence & Wasserstein Distance vs Indian Urban Consumer Survey (N=1,200)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase">Mean KL-Divergence</span>
                <span className="text-cyan-300 font-bold">{audit.kl_divergence_mean}</span>
              </div>
              <div className="text-right pl-3 border-l border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Fidelity Score</span>
                <span className="text-emerald-400 font-extrabold text-base">
                  {audit.overall_fidelity_score}/100
                </span>
              </div>
            </div>
          </div>

          {/* Dimension Audit Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {audit.audit_dimensions.map((dim) => (
              <div
                key={dim.dimension}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-200">{dim.dimension}</span>
                  <span className="font-mono text-emerald-400 font-semibold">{dim.fidelity_score}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${dim.fidelity_score}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1">
                  <span>KL-Div: {dim.kl_divergence}</span>
                  <span>Wasserstein: {dim.wasserstein_distance}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="glass-panel rounded-xl p-3 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by persona name or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900/80 border border-slate-700/80 rounded-lg text-white placeholder-slate-500 outline-none focus:border-cyan-400"
            />
          </div>

          <select
            value={selectedSegment}
            onChange={(e) => {
              setSelectedSegment(e.target.value);
              setPage(1);
            }}
            className="bg-slate-900/80 border border-slate-700/80 rounded-lg px-3 py-1.5 text-slate-300 outline-none focus:border-cyan-400"
          >
            <option value="all">All Segments (10,000)</option>
            <option value="Fitness Enthusiasts">Fitness Enthusiasts (32%)</option>
            <option value="Busy Professionals">Busy Professionals (43%)</option>
            <option value="Price-Sensitive Beginners">Price-Sensitive Beginners (25%)</option>
          </select>

          <select
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setPage(1);
            }}
            className="bg-slate-900/80 border border-slate-700/80 rounded-lg px-3 py-1.5 text-slate-300 outline-none focus:border-cyan-400"
          >
            <option value="all">All Metros</option>
            <option value="Bengaluru">Bengaluru (24%)</option>
            <option value="Mumbai">Mumbai (22%)</option>
            <option value="Delhi-NCR">Delhi-NCR (20%)</option>
            <option value="Hyderabad">Hyderabad (12%)</option>
            <option value="Pune">Pune (9%)</option>
          </select>
        </div>

        <div className="text-slate-400 font-mono text-[11px]">
          Showing {filteredPersonas.length} of {totalCount.toLocaleString()} personas
        </div>
      </div>

      {/* Personas Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-mono text-[10px]">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Persona Name</th>
                <th className="px-4 py-3">City & Tier</th>
                <th className="px-4 py-3">Segment</th>
                <th className="px-4 py-3">Income</th>
                <th className="px-4 py-3 text-center">Price Sens.</th>
                <th className="px-4 py-3 text-center">Quality Sens.</th>
                <th className="px-4 py-3 text-center">Risk Av.</th>
                <th className="px-4 py-3 text-center">Threshold</th>
                <th className="px-4 py-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredPersonas.map((p) => (
                <tr
                  key={p.persona_id}
                  onClick={() => {
                    setActivePersona(p);
                    setIsDrawerOpen(true);
                  }}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                >
                  <td className="px-4 py-3 font-mono text-cyan-400">#{p.persona_id}</td>
                  <td className="px-4 py-3 font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {p.name}
                    <span className="text-[10px] text-slate-400 block font-normal">
                      {p.age} yrs • {p.gender}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {p.city}
                    <span className="text-[10px] text-slate-500 block font-mono">{p.tier}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-950/60 border border-purple-800/40 text-purple-300">
                      {p.segment}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-300">
                    {formatINR(p.monthly_income_inr)}
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-semibold text-amber-400">
                    {p.price_sensitivity}
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-semibold text-cyan-400">
                    {p.quality_sensitivity}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-slate-400">
                    {p.risk_aversion}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-slate-300">
                    {p.adoption_threshold}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePersona(p);
                        setIsDrawerOpen(true);
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 bg-slate-900/40">
          <span>
            Page <strong className="text-white">{page}</strong> of{' '}
            <strong className="text-white">{Math.ceil(totalCount / pageSize)}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page * pageSize >= totalCount}
              className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Persona Detail Side Drawer */}
      <PersonaDrawer
        persona={activePersona}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
