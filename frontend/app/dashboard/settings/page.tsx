'use client';

import React, { useState } from 'react';
import {
  Settings,
  Cpu,
  Hash,
  Database,
  CheckCircle,
  Save,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { ProvenanceBadge } from '@/components/analytics/ProvenanceBadge';

export default function SettingsPage() {
  const [globalSeed, setGlobalSeed] = useState(42);
  const [populationSize, setPopulationSize] = useState(10000);
  const [demoMode, setDemoMode] = useState(true);
  const [apiEndpoint, setApiEndpoint] = useState('http://localhost:8000');
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Engine Settings & Configuration</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 font-semibold">
              System Parameters
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Control deterministic seeding, API connectivity, and LLM reasoning providers.
          </p>
        </div>
        <ProvenanceBadge level="CALIBRATED" source="Global Deterministic Seed" />
      </div>

      {/* Settings Form */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
        {/* Global Seed */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-white flex items-center gap-2">
            <Hash className="w-4 h-4 text-cyan-400" />
            Global Simulation Seed
          </label>
          <p className="text-xs text-slate-400">
            Fixes the master pseudorandom seed. Identical seeds guarantee 100% reproducible personas, network ties, and utility outcomes.
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={globalSeed}
              onChange={(e) => setGlobalSeed(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm w-36 outline-none focus:border-cyan-400"
            />
            <button
              onClick={() => setGlobalSeed(Math.floor(Math.random() * 100000))}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors"
            >
              Generate Random Seed
            </button>
          </div>
        </div>

        {/* Population Size */}
        <div className="space-y-2 pt-4 border-t border-slate-800">
          <label className="text-sm font-semibold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-400" />
            Default Swarm Population Size
          </label>
          <p className="text-xs text-slate-400">
            Scale between 1,000 and 10,000 persistent agents.
          </p>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={1000}
              max={10000}
              step={1000}
              value={populationSize}
              onChange={(e) => setPopulationSize(Number(e.target.value))}
              className="w-64 accent-cyan-400 cursor-pointer"
            />
            <span className="font-mono text-sm font-bold text-cyan-400">
              {populationSize.toLocaleString()} Agents
            </span>
          </div>
        </div>

        {/* Demo Mode & LLM Provider */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <label className="text-sm font-semibold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            Reasoning Engine & Provider
          </label>
          <p className="text-xs text-slate-400">
            Select between deterministic statistical engine (zero API keys needed) or external OpenAI models.
          </p>

          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="radio"
                checked={demoMode}
                onChange={() => setDemoMode(true)}
                className="accent-cyan-400"
              />
              <div>
                <span className="font-semibold text-white block">
                  Deterministic Statistical Engine (Recommended / Offline Capable)
                </span>
                <span className="text-slate-400">
                  Zero external API keys required. 100% fast, reproducible, and mathematically rigorous.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="radio"
                checked={!demoMode}
                onChange={() => setDemoMode(false)}
                className="accent-cyan-400"
              />
              <div>
                <span className="font-semibold text-white block">
                  OpenAI GPT-4o-mini Integration
                </span>
                <span className="text-slate-400">
                  Requires OPENAI_API_KEY. Falls back automatically if missing or rate limited.
                </span>
              </div>
            </label>
          </div>

          {!demoMode && (
            <div className="pt-2 space-y-1.5 text-xs">
              <label className="text-slate-400">OpenAI API Key (Optional)</label>
              <input
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono outline-none focus:border-cyan-400"
              />
            </div>
          )}
        </div>

        {/* Backend API URL */}
        <div className="space-y-2 pt-4 border-t border-slate-800 text-xs">
          <label className="text-sm font-semibold text-white">FastAPI Backend Endpoint</label>
          <input
            type="text"
            value={apiEndpoint}
            onChange={(e) => setApiEndpoint(e.target.value)}
            className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono outline-none focus:border-cyan-400"
          />
        </div>

        {/* Save Bar */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              setGlobalSeed(42);
              setPopulationSize(10000);
              setDemoMode(true);
            }}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center gap-2"
          >
            {saved ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Configuration Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Configuration</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
