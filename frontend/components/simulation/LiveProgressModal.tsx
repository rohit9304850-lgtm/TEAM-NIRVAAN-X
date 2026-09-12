'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Loader2,
  Sparkles,
  X,
  Activity,
  Cpu,
  Users,
  ShieldCheck,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiveProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

const simulationStages = [
  {
    id: 1,
    title: 'Generating Heterogeneous Personas',
    subtext: 'Seeding 10,000 persistent agents via stratified Dirichlet demographic distributions',
    telemetry: 'Seed: 0x42A9 • 8 Metro Regions • Stratified Income Deciles',
    progress: 20,
    agentState: 'INITIALIZING'
  },
  {
    id: 2,
    title: 'Evaluating Multi-Attribute Utility Equations',
    subtext: 'Vectorized price sensitivity, quality weights, and risk aversion calculations',
    telemetry: 'Utility = wp(1 - P/Pref) + wq*Q + wb*B + ws*S - r*R',
    progress: 45,
    agentState: 'EVALUATING'
  },
  {
    id: 3,
    title: 'Propagating 30-Day Social Dynamics',
    subtext: 'DeGroot opinion diffusion over scale-free homophily clusters and peer influence ties',
    telemetry: 'R0: 1.34 • Homophily Coeff: 0.68 • Day 15/30 Cascade',
    progress: 70,
    agentState: 'DIFFUSING'
  },
  {
    id: 4,
    title: 'Adversarial Critic Scanner & Bias Deflation',
    subtext: 'Detecting hypothetical willingness bias and status-quo habit lock-in inertia',
    telemetry: 'Deflation Coeff: 0.72x applied to raw intent for checkout drop-off',
    progress: 88,
    agentState: 'DEFLATING'
  },
  {
    id: 5,
    title: 'Extracting Strategic Insights & 95% Wilson CIs',
    subtext: 'Converging on Pareto-optimal pricing, churn vectors, and decision matrix',
    telemetry: '95% CI: [29.9%, 33.7%] • Strategy S-027 Optimal',
    progress: 100,
    agentState: 'CONVERGED'
  },
];

// 64 synthetic micro-nodes representing the persona swarm in the visualizer
const swarmNodes = Array.from({ length: 64 }).map((_, i) => ({
  id: i,
  x: (i % 8) * 12.5 + 6.25,
  y: Math.floor(i / 8) * 12.5 + 6.25,
  segment: i % 3 === 0 ? 'Enthusiast' : (i % 2 === 0 ? 'Professional' : 'Price-Sensitive'),
  initialAdopt: i % 3 === 0 || (i % 5 === 0 && i % 2 !== 0),
  delay: (i * 17) % 600,
}));

export const LiveProgressModal: React.FC<LiveProgressModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [progress, setProgress] = useState(15);
  const [isDone, setIsDone] = useState(false);
  const [personaCounter, setPersonaCounter] = useState(1200);
  const [adoptionsCounter, setAdoptionsCounter] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStageIdx(0);
      setProgress(15);
      setIsDone(false);
      setPersonaCounter(1200);
      setAdoptionsCounter(0);
      return;
    }

    // Persona counter animation
    const counterInterval = setInterval(() => {
      setPersonaCounter((prev) => {
        if (prev >= 10000) return 10000;
        return prev + Math.floor(Math.random() * 800) + 400;
      });
      setAdoptionsCounter((prev) => {
        if (prev >= 3180) return 3180;
        return prev + Math.floor(Math.random() * 260) + 120;
      });
    }, 180);

    const t1 = setTimeout(() => { setCurrentStageIdx(1); setProgress(45); }, 750);
    const t2 = setTimeout(() => { setCurrentStageIdx(2); setProgress(70); }, 1600);
    const t3 = setTimeout(() => { setCurrentStageIdx(3); setProgress(88); }, 2500);
    const t4 = setTimeout(() => {
      setCurrentStageIdx(4);
      setProgress(100);
      setIsDone(true);
      setPersonaCounter(10000);
      setAdoptionsCounter(3180);
      if (onComplete) onComplete();
    }, 3400);

    return () => {
      clearInterval(counterInterval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  const currentStage = simulationStages[currentStageIdx];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        className="w-full max-w-2xl bg-[#0C0E17] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-700/50 flex items-center justify-center text-cyan-400">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <span>Autonomous Persona Swarm Simulation</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800/60 text-cyan-300">
                  RUN-2026
                </span>
              </span>
              <p className="text-[11px] text-slate-400">
                Vectorized parallel agent evaluation across 10,000 persistent nodes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Real-time Counter Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-left space-y-0.5">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Personas Initialized</span>
              <span className="text-xl font-bold font-mono text-white">
                {personaCounter.toLocaleString()}
              </span>
              <span className="text-[10px] text-cyan-400 font-mono block">N = 10,000 Total</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-left space-y-0.5">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Simulated Adoptions</span>
              <span className="text-xl font-bold font-mono text-emerald-400">
                {adoptionsCounter.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 font-mono block">
                {((adoptionsCounter / 10000) * 100).toFixed(1)}% Conversion
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-left space-y-0.5">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Current Pipeline State</span>
              <span className="text-xs font-bold font-mono text-cyan-300 block truncate mt-1">
                {currentStage.agentState}
              </span>
              <span className="text-[10px] text-purple-400 font-mono block">Step {currentStageIdx + 1} of 5</span>
            </div>
          </div>

          {/* Dynamic Visual Swarm Activity Matrix */}
          <div className="relative p-4 rounded-xl bg-[#07080E] border border-slate-800/80 overflow-hidden">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-slate-300">Live Agent Micro-State Canvas (64 Representative Nodes)</span>
              </div>
              <span className="text-cyan-400">{progress}% Completed</span>
            </div>

            {/* Agent Nodes Grid */}
            <div className="h-32 w-full relative border border-slate-800/50 rounded-lg bg-grid-pattern overflow-hidden flex items-center justify-center p-2">
              <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5 w-full h-full">
                {swarmNodes.map((node) => {
                  let nodeColor = 'bg-slate-700/50';
                  let pulseClass = '';

                  if (currentStageIdx === 0) {
                    nodeColor = node.id % 2 === 0 ? 'bg-cyan-500/60' : 'bg-slate-700/40';
                    pulseClass = 'animate-pulse';
                  } else if (currentStageIdx === 1) {
                    nodeColor = node.initialAdopt ? 'bg-amber-400/80' : 'bg-slate-600/60';
                  } else if (currentStageIdx === 2) {
                    nodeColor = node.initialAdopt ? 'bg-purple-400' : 'bg-slate-600/50';
                    pulseClass = 'scale-110 transition-transform';
                  } else if (currentStageIdx === 3) {
                    nodeColor = node.initialAdopt ? 'bg-cyan-400' : 'bg-rose-500/50';
                  } else {
                    nodeColor = node.initialAdopt ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-slate-700/60';
                  }

                  return (
                    <div
                      key={node.id}
                      title={`Agent #${node.id + 1} (${node.segment})`}
                      className={cn(
                        'w-full h-full rounded-sm transition-all duration-300 cursor-help',
                        nodeColor,
                        pulseClass
                      )}
                    />
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800/60 mt-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-emerald-400" />
                <span>Adopted ({isDone ? '31.8%' : 'calculating...'})</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-rose-500/60" />
                <span>Price/Habit Objection</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-purple-400" />
                <span>Social Influence In-Flight</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-slate-700" />
                <span>Status Quo Inertia</span>
              </span>
            </div>
          </div>

          {/* Progress Tracking Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white font-medium">{currentStage.title}</span>
              <span className="font-mono text-cyan-400 font-bold">{progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-0.5">
              <span className="truncate max-w-sm text-cyan-300">{currentStage.telemetry}</span>
              <span>{isDone ? 'Finished' : 'Simulating...'}</span>
            </div>
          </div>

          {/* Action on Complete */}
          {isDone && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-1 flex items-center gap-3"
            >
              <button
                onClick={() => {
                  onClose();
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('swarmiq_market_updated'));
                  }
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>View Calibrated Swarm Results (31.8% Adoption • S-027 Optimal)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
