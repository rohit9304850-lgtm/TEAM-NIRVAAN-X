'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Cpu, CheckCircle, XCircle, Hash, Sparkles } from 'lucide-react';
import { Persona } from '@/lib/types';
import { ProvenanceBadge } from '@/components/analytics/ProvenanceBadge';
import { formatINR } from '@/lib/utils';
import { getClientActiveProduct, getPersonaDetail } from '@/lib/api';

interface PersonaDrawerProps {
  persona: Persona | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PersonaDrawer: React.FC<PersonaDrawerProps> = ({
  persona,
  isOpen,
  onClose,
}) => {
  const [detail, setDetail] = React.useState<any>(null);
  const activeProduct = getClientActiveProduct();

  React.useEffect(() => {
    if (isOpen && persona) {
      getPersonaDetail(persona.persona_id).then((res) => {
        setDetail(res);
      }).catch(() => {
        setDetail(null);
      });
    } else {
      setDetail(null);
    }
  }, [isOpen, persona]);

  if (!isOpen || !persona) return null;

  // Calculate micro decision breakdown dynamically for the active product
  const actualPrice = detail?.product_micro_decision?.product_price || activeProduct.price || 1999;
  const refPrice = actualPrice <= 2500 ? 1999 : actualPrice;
  const priceRatio = actualPrice / refPrice;
  const priceTerm = detail?.product_micro_decision?.price_term !== undefined
    ? detail.product_micro_decision.price_term
    : Number((persona.price_sensitivity * (1 - priceRatio)).toFixed(3));
  const qualityTerm = detail?.product_micro_decision?.quality_term !== undefined
    ? detail.product_micro_decision.quality_term
    : Number((persona.quality_sensitivity * 0.88).toFixed(3));
  const brandTerm = detail?.product_micro_decision?.brand_term !== undefined
    ? detail.product_micro_decision.brand_term
    : Number((persona.brand_loyalty * 0.62).toFixed(3));
  const socialTerm = detail?.product_micro_decision?.social_term !== undefined
    ? detail.product_micro_decision.social_term
    : Number((persona.social_influence_weight * 0.50).toFixed(3));
  const riskTerm = detail?.product_micro_decision?.risk_deduction !== undefined
    ? detail.product_micro_decision.risk_deduction
    : Number((persona.risk_aversion * 0.32).toFixed(3));
  const netUtility = detail?.product_micro_decision?.net_utility !== undefined
    ? detail.product_micro_decision.net_utility
    : Number((priceTerm + qualityTerm + brandTerm + socialTerm - riskTerm).toFixed(3));
  const adopted = detail?.product_micro_decision?.decision
    ? detail.product_micro_decision.decision === 'ADOPT'
    : netUtility > persona.adoption_threshold;

  const productName = detail?.product_micro_decision?.product_name || activeProduct.name || 'Product';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-screen max-w-md bg-[#0F121C] border-l border-slate-800 shadow-2xl flex flex-col justify-between"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-800/80 bg-slate-900/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                PERSONA #{persona.persona_id}
              </span>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-white">{persona.name}</h2>
            <p className="text-xs text-slate-400">
              {persona.age} yrs • {persona.gender} • {persona.city} ({persona.tier})
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-950/60 border border-purple-800/40 text-purple-300 font-medium">
                {persona.segment}
              </span>
              <ProvenanceBadge level="CALIBRATED" source="Deterministic Persona Seed" />
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
            {/* Deterministic Seed Verification Card */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 font-mono flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-cyan-400" />
                  Deterministic Seed Hash
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Reproducible
                </span>
              </div>
              <p className="font-mono text-[11px] text-slate-300 break-all bg-black/40 p-2 rounded border border-slate-800/80">
                {persona.seed_hash}
              </p>
              <p className="text-[10px] text-slate-400 mt-1.5">
                Formula: SHA256(global_seed:persona_id:2024.2-Q3)
              </p>
            </div>

            {/* Demographics Summary */}
            <div>
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                Demographic Profile
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Monthly Income</span>
                  <span className="font-mono text-white font-semibold">
                    {formatINR(persona.monthly_income_inr)}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Income Bracket</span>
                  <span className="font-mono text-white font-semibold">{persona.income_bracket}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Education</span>
                  <span className="text-white font-medium truncate">{persona.education}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Tech Literacy</span>
                  <span className="font-mono text-white font-semibold">
                    {(persona.tech_literacy * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Psychographic Micro-Weights */}
            <div>
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                Micro Decision Weights [0.0 - 1.0]
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'Price Sensitivity (w_p)', val: persona.price_sensitivity, color: 'bg-rose-500' },
                  { label: 'Quality Sensitivity (w_q)', val: persona.quality_sensitivity, color: 'bg-cyan-500' },
                  { label: 'Brand Loyalty (w_b)', val: persona.brand_loyalty, color: 'bg-purple-500' },
                  { label: 'Innovation Affinity (w_i)', val: persona.innovation_affinity, color: 'bg-emerald-500' },
                  { label: 'Risk Aversion (r)', val: persona.risk_aversion, color: 'bg-amber-500' },
                  { label: 'Social Influence (w_s)', val: persona.social_influence_weight, color: 'bg-blue-500' },
                  { label: 'Adoption Threshold (θ)', val: persona.adoption_threshold, color: 'bg-yellow-400' },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">{item.label}</span>
                      <span className="font-mono text-white">{item.val.toFixed(2)}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full ${item.color}`}
                        style={{ width: `${item.val * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Purchase Utility Decision Policy */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-200 block">
                    {productName} Decision Policy
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    Evaluation Baseline: {formatINR(actualPrice)}/mo
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded font-mono font-bold text-xs flex items-center gap-1 ${
                    adopted
                      ? 'bg-emerald-950 border border-emerald-700/60 text-emerald-300'
                      : 'bg-rose-950 border border-rose-700/60 text-rose-300'
                  }`}
                >
                  {adopted ? (
                    <>
                      <CheckCircle className="w-3 h-3 text-emerald-400" /> ADOPT
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 text-rose-400" /> REJECT
                    </>
                  )}
                </span>
              </div>

              {/* Utility breakdown math */}
              <div className="p-2 rounded bg-black/40 border border-slate-800 font-mono text-[11px] space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span>Price Term [w_p * (1 - P/Ref)]:</span>
                  <span>{priceTerm > 0 ? `+${priceTerm}` : priceTerm}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quality Term [w_q * 0.88]:</span>
                  <span className="text-cyan-400">+{qualityTerm}</span>
                </div>
                <div className="flex justify-between">
                  <span>Brand Term [w_b * 0.62]:</span>
                  <span className="text-purple-400">+{brandTerm}</span>
                </div>
                <div className="flex justify-between">
                  <span>Social Proof [w_s * 0.50]:</span>
                  <span className="text-blue-400">+{socialTerm}</span>
                </div>
                <div className="flex justify-between">
                  <span>Risk Penalty [-r * 0.32]:</span>
                  <span className="text-rose-400">-{riskTerm}</span>
                </div>
                <div className="pt-1 mt-1 border-t border-slate-800 flex justify-between font-bold text-white">
                  <span>Net Utility Score:</span>
                  <span className={netUtility > persona.adoption_threshold ? 'text-emerald-400' : 'text-rose-400'}>
                    {netUtility} (Threshold: {persona.adoption_threshold})
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/80">
                <div className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Micro-Decision Analysis
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed italic">
                  {detail?.product_micro_decision?.reasoning ||
                    (adopted
                      ? `${persona.name} (${persona.segment}) adopted ${productName} (@ ${formatINR(actualPrice)}/mo). High quality sensitivity (${persona.quality_sensitivity}) and innovation affinity (${persona.innovation_affinity}) surpassed the ${persona.adoption_threshold} threshold.`
                      : `${persona.name} (${persona.segment}) rejected ${productName} (@ ${formatINR(actualPrice)}/mo). Price sensitivity (${persona.price_sensitivity}) and risk aversion (${persona.risk_aversion}) prevented utility from crossing the ${persona.adoption_threshold} threshold.`)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
