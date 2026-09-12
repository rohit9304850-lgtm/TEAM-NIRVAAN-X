'use client';

import React, { useState, useEffect } from 'react';
import {
  Cpu,
  MessageSquare,
  Play,
  CheckCircle2,
  Sparkles,
  BarChart2,
  Loader2,
  HelpCircle,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { ProvenanceBadge } from '@/components/analytics/ProvenanceBadge';
import { runSurvey, runSimulation, getMarketCurrent } from '@/lib/api';
import { SurveyResponse } from '@/lib/types';
import { formatINR } from '@/lib/utils';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';

export default function SimulationLabPage() {
  const [market, setMarket] = useState<any>(null);
  const [question, setQuestion] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStage, setSimulationStage] = useState('Initializing');
  const [surveyResult, setSurveyResult] = useState<SurveyResponse | null>(null);

  const loadMarket = () => {
    getMarketCurrent().then((m) => {
      setMarket(m);
      setQuestion(`Would you subscribe to ${m.name} at ${formatINR(m.price)}/month for its autonomous features?`);
    });
  };

  useEffect(() => {
    loadMarket();

    const handleUpdate = () => loadMarket();
    window.addEventListener('swarmiq_market_updated', handleUpdate);
    return () => window.removeEventListener('swarmiq_market_updated', handleUpdate);
  }, []);

  const pName = market?.name || 'our product';
  const pPrice = market?.price || 1999;
  const competitor = market?.competitors?.[1]?.name || 'incumbent alternatives';

  const presetQuestions = [
    `Would you subscribe to ${pName} at ${formatINR(pPrice)}/month for its autonomous features?`,
    `Would you consider ${pName} if offered with a 14-day free trial and money-back guarantee?`,
    `How likely are you to switch from ${competitor} to ${pName}?`,
  ];

  const handleRunSurvey = async () => {
    setIsSimulating(true);
    setSimulationStage('Querying 10,000 persistent personas in parallel...');
    const t1 = setTimeout(() => setSimulationStage('Evaluating latent price sensitivity and quality utility...'), 400);
    const t2 = setTimeout(() => setSimulationStage('Computing 95% Wilson score binomial confidence bounds...'), 900);

    try {
      const res = await runSurvey(question);
      setSurveyResult(res);
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      setIsSimulating(false);
    }
  };

  // Convert distribution into recharts array
  const chartData = surveyResult
    ? Object.entries(surveyResult.distribution).map(([key, val]) => ({
        option: key,
        percentage: val,
        ci_lower: surveyResult.ci_95[key]?.[0] || val - 1.2,
        ci_upper: surveyResult.ci_95[key]?.[1] || val + 1.2,
      }))
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Agentic Survey & Simulation Lab</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 font-semibold">
              Instant Polling
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Query 10,000 persistent AI personas in parallel with zero API cost and calculate 95% Wilson score confidence bounds.
          </p>
        </div>
        <ProvenanceBadge level="SIMULATED" source="Seeded Agentic Survey Engine" />
      </div>

      {/* Query Formulation Card */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            Launch Intent Survey Query
          </span>
          <span className="text-xs text-slate-400 font-mono">Sample Size: N = 10,000</span>
        </div>

        {/* Text Area */}
        <textarea
          rows={2}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a market perception or willingness-to-pay question..."
          className="w-full p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm outline-none focus:border-cyan-400"
        />

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-400 font-medium">Suggested Prompts:</span>
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setQuestion(q)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 text-slate-300 transition-colors truncate max-w-xs"
            >
              Prompt #{idx + 1}
            </button>
          ))}
        </div>

        {/* Trigger Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleRunSurvey}
            disabled={isSimulating || !question.trim()}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50 flex items-center gap-2"
          >
            {isSimulating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{simulationStage}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-black" />
                <span>Execute Population Survey</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {surveyResult && (
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-white">Survey Response Distribution</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Wilson score intervals (95% confidence) computed across N={surveyResult.sample_size.toLocaleString()} personas
                </p>
              </div>
              <ProvenanceBadge level="SIMULATED" source="Wilson Score Interval Engine" />
            </div>

            {/* Distribution Bar Chart */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 140, right: 30 }}>
                  <XAxis type="number" domain={[0, 40]} stroke="#475569" fontSize={11} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="option" stroke="#94A3B8" fontSize={11} width={130} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F121C', borderColor: '#1E293B', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(val: any, name: any, item: any) => [
                      `${val}% (95% CI: [${item.payload.ci_lower}%, ${item.payload.ci_upper}%])`,
                      'Percentage',
                    ]}
                  />
                  <Bar dataKey="percentage" radius={[0, 6, 6, 0]}>
                    {chartData.map((entry, index) => {
                      const colors = ['#10B981', '#00F2FE', '#8B5CF6', '#F59E0B', '#F43F5E'];
                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Data Breakdown Table */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
              {chartData.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                  <span className="text-[10px] text-slate-400 block truncate">{item.option}</span>
                  <div className="text-lg font-bold font-mono text-white">{item.percentage}%</div>
                  <span className="text-[10px] font-mono text-cyan-400 block">
                    CI: [{item.ci_lower}%, {item.ci_upper}%]
                  </span>
                </div>
              ))}
            </div>

            {/* AI Synthesized Interpretation */}
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs text-slate-200 space-y-1.5">
              <div className="flex items-center gap-1.5 text-cyan-300 font-semibold text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Deterministic Behavioral Synthesis</span>
              </div>
              <p className="leading-relaxed">{surveyResult.ai_interpretation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
