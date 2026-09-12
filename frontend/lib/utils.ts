import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ProvenanceLevel } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(val: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
}

export function formatPercent(val: number, decimals: number = 1): string {
  return `${(val * (val <= 1.0 ? 100 : 1)).toFixed(decimals)}%`;
}

export function formatNumber(val: number): string {
  return new Intl.NumberFormat('en-IN').format(val);
}

export function getProvenanceBadgeConfig(level: ProvenanceLevel) {
  switch (level) {
    case 'EMPIRICAL':
      return {
        label: 'EMPIRICAL',
        dotClass: 'bg-emerald-400',
        badgeClass: 'bg-emerald-950/70 border-emerald-700/60 text-emerald-300 shadow-emerald-950/40',
        icon: '🟢',
      };
    case 'CALIBRATED':
      return {
        label: 'CALIBRATED',
        dotClass: 'bg-cyan-400',
        badgeClass: 'bg-cyan-950/70 border-cyan-700/60 text-cyan-300 shadow-cyan-950/40',
        icon: '🔵',
      };
    case 'SIMULATED':
      return {
        label: 'SIMULATED',
        dotClass: 'bg-purple-400',
        badgeClass: 'bg-purple-950/70 border-purple-700/60 text-purple-300 shadow-purple-950/40',
        icon: '🟣',
      };
    case 'EXTRAPOLATED':
      return {
        label: 'EXTRAPOLATED',
        dotClass: 'bg-amber-400',
        badgeClass: 'bg-amber-950/70 border-amber-700/60 text-amber-300 shadow-amber-950/40',
        icon: '🟠',
      };
    case 'LOW_CONFIDENCE':
    default:
      return {
        label: 'LOW CONFIDENCE',
        dotClass: 'bg-rose-400',
        badgeClass: 'bg-rose-950/70 border-rose-700/60 text-rose-300 shadow-rose-950/40',
        icon: '🔴',
      };
  }
}
