'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, StepForward, Info, Users, Sparkles } from 'lucide-react';
import { SocialGraph, SocialNode } from '@/lib/types';
import { ProvenanceBadge } from '@/components/analytics/ProvenanceBadge';

interface NetworkCanvasProps {
  graph: SocialGraph;
}

export const NetworkCanvas: React.FC<NetworkCanvasProps> = ({ graph }) => {
  const [currentDay, setCurrentDay] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedNode, setSelectedNode] = useState<SocialNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<SocialNode | null>(null);

  // Play animation loop
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentDay((prev) => {
          if (prev >= 30) {
            setIsPlaying(false);
            return 30;
          }
          return prev + 1;
        });
      }, 350);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Compute fixed 2D positions for nodes in 3 distinct segment clusters
  const nodePositions = useMemo(() => {
    const width = 800;
    const height = 500;
    const clusterCenters: Record<number, { x: number; y: number }> = {
      1: { x: 250, y: 220 }, // Fitness Enthusiasts (Left-Center)
      2: { x: 550, y: 200 }, // Busy Professionals (Right-Center)
      3: { x: 400, y: 390 }, // Price-Sensitive Beginners (Bottom-Center)
    };

    return graph.nodes.map((node, i) => {
      const center = clusterCenters[node.cluster_id] || { x: 400, y: 250 };
      const angle = (i * 137.5 * Math.PI) / 180; // Golden angle distribution
      const radius = 30 + (i % 7) * 18;
      const x = Math.max(40, Math.min(width - 40, center.x + radius * Math.cos(angle)));
      const y = Math.max(40, Math.min(height - 40, center.y + radius * Math.sin(angle)));
      return { ...node, x, y };
    });
  }, [graph.nodes]);

  // Helper to color nodes based on their sentiment at currentDay
  const getNodeColor = (node: SocialNode) => {
    const opinion = node.timeline_opinions[currentDay] || node.initial_opinion;
    if (opinion >= 0.70) return '#10B981'; // High adoption/enthusiastic green
    if (opinion >= 0.50) return '#00F2FE'; // Moderate positive cyan
    if (opinion >= 0.35) return '#8B5CF6'; // Neutral purple
    return '#F43F5E'; // Skeptical/resistant rose
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col gap-4">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-sm text-white">
            Opinion Dynamics Network Graph
          </span>
          <ProvenanceBadge level="SIMULATED" source="DeGroot 30-Day Simulation" />
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl">
          <button
            onClick={() => {
              if (currentDay >= 30) setCurrentDay(0);
              setIsPlaying(!isPlaying);
            }}
            className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
            title={isPlaying ? 'Pause Simulation' : 'Play Dynamics'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-cyan-400" />}
          </button>

          <button
            onClick={() => setCurrentDay((prev) => Math.min(30, prev + 1))}
            disabled={currentDay >= 30}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition-colors"
            title="Step Forward (+1 Day)"
          >
            <StepForward className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setCurrentDay(0);
              setIsPlaying(false);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reset to Day 0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-1" />

          {/* Timeline Scrubber */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-300 font-bold min-w-[56px]">
              DAY {currentDay}/30
            </span>
            <input
              type="range"
              min={0}
              max={30}
              value={currentDay}
              onChange={(e) => setCurrentDay(Number(e.target.value))}
              className="w-28 sm:w-44 accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Main Canvas & Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* SVG Network Visualizer */}
        <div className="lg:col-span-3 bg-[#0A0D15] rounded-xl border border-slate-800/80 p-2 relative overflow-hidden flex items-center justify-center min-h-[460px]">
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

          {/* SVG Canvas */}
          <svg viewBox="0 0 800 500" className="w-full h-full max-h-[500px]">
            {/* Edges */}
            {graph.edges.map((edge, idx) => {
              const src = nodePositions[edge.source];
              const tgt = nodePositions[edge.target];
              if (!src || !tgt) return null;

              const isHighlighted =
                selectedNode && (selectedNode.id === src.id || selectedNode.id === tgt.id);

              return (
                <line
                  key={idx}
                  x1={src.x}
                  y1={src.y}
                  x2={tgt.x}
                  y2={tgt.y}
                  stroke={isHighlighted ? '#00F2FE' : 'rgba(100, 116, 139, 0.22)'}
                  strokeWidth={isHighlighted ? 1.8 : 0.8}
                  strokeDasharray={edge.weight < 0.5 ? '2,2' : undefined}
                />
              );
            })}

            {/* Nodes */}
            {nodePositions.map((node) => {
              const color = getNodeColor(node);
              const isSelected = selectedNode?.id === node.id;
              const isHovered = hoveredNode?.id === node.id;
              const radius = node.is_hub ? 9 : 6;

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="cursor-pointer transition-transform hover:scale-125"
                >
                  {/* Hub halo */}
                  {node.is_hub && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={radius + 5}
                      fill="none"
                      stroke={color}
                      strokeWidth={1.5}
                      strokeDasharray="3,3"
                      className="animate-spin-slow opacity-60"
                    />
                  )}

                  {/* Core node */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius}
                    fill={color}
                    stroke={isSelected ? '#ffffff' : '#0B0D14'}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    className="transition-colors duration-300 shadow-md"
                  />

                  {/* Label for hubs or selected */}
                  {(node.is_hub || isSelected) && (
                    <text
                      x={node.x}
                      y={(node.y || 0) - radius - 4}
                      fill="#e2e8f0"
                      fontSize={10}
                      textAnchor="middle"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {node.name.split(' ')[0]}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Overlay Legend */}
          <div className="absolute bottom-3 left-3 bg-[#0B0E17]/90 backdrop-blur-md border border-slate-800 px-3 py-2 rounded-lg text-[10px] space-y-1">
            <div className="flex items-center gap-2 text-slate-300 font-semibold mb-1">
              <span>Sentiment State</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Adopted / High (&gt;0.70)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Positive (&gt;0.50)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-400" /> Neutral
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-400" /> Resistant
              </span>
            </div>
          </div>
        </div>

        {/* Node Inspector Panel */}
        <div className="bg-[#0A0D15] rounded-xl border border-slate-800/80 p-4 flex flex-col justify-between text-xs">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-cyan-400" />
                Node Inspector
              </span>
              {selectedNode && (
                <span className="font-mono text-cyan-300 text-[10px] bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
                  #{selectedNode.id}
                </span>
              )}
            </div>

            {selectedNode ? (
              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-white text-sm">{selectedNode.name}</h4>
                  <p className="text-[11px] text-slate-400">{selectedNode.segment}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Influence Score</span>
                    <span className="font-mono text-white font-bold">
                      {selectedNode.influence_score}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Connections</span>
                    <span className="font-mono text-white font-bold">
                      {selectedNode.connection_count} edges
                    </span>
                  </div>
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Initial Opinion</span>
                    <span className="font-mono text-slate-300">
                      {selectedNode.initial_opinion}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Day {currentDay} Opinion</span>
                    <span className="font-mono text-cyan-300 font-bold">
                      {selectedNode.timeline_opinions[currentDay]}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-slate-900/40 border border-slate-800 text-[11px] text-slate-300">
                  <p className="leading-relaxed">
                    {selectedNode.is_hub ? '⭐ Key Super-Hub: ' : 'Cluster Node: '}
                    Over 30 simulation days, opinion evolved from {selectedNode.initial_opinion} to{' '}
                    {selectedNode.final_opinion}.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 space-y-2">
                <Users className="w-8 h-8 mx-auto opacity-40 text-slate-400" />
                <p>Click any node on the network graph to inspect influence score, connections, and propagation trajectory.</p>
              </div>
            )}
          </div>

          {/* Macro Network Stats */}
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] space-y-1.5 text-slate-400">
            <div className="flex justify-between">
              <span>Viral R0 Coefficient:</span>
              <span className="font-mono text-emerald-400 font-bold">
                {graph.network_metrics.viral_reproduction_rate_r0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Homophily Clustering:</span>
              <span className="font-mono text-cyan-400">
                {graph.network_metrics.homophily_clustering_coefficient}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Avg Degree:</span>
              <span className="font-mono text-white">
                {graph.network_metrics.average_degree}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
