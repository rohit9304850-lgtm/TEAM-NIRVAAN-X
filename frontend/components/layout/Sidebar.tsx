'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Users,
  SlidersHorizontal,
  Share2,
  Sword,
  Compass,
  AlertTriangle,
  TrendingUp,
  History,
  FileText,
  Database,
  Settings,
  Cpu,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'CORE PIPELINE',
    items: [
      { name: 'Overview', href: '/dashboard', icon: Activity },
      { name: 'Market Setup', href: '/dashboard/market-setup', icon: SlidersHorizontal },
      { name: 'Persona Swarm', href: '/dashboard/persona-swarm', icon: Users, badge: '10K' },
      { name: 'Simulation Lab', href: '/dashboard/simulation', icon: Cpu, badge: 'Live' },
    ]
  },
  {
    title: 'DYNAMICS & INTELLIGENCE',
    items: [
      { name: 'Social Network', href: '/dashboard/social-network', icon: Share2 },
      { name: 'Competitive Intel', href: '/dashboard/competitive', icon: Sword },
      { name: 'Strategy Lab', href: '/dashboard/strategy-lab', icon: Compass, badge: 'Bayes' },
      { name: 'Adversarial Critic', href: '/dashboard/critic', icon: AlertTriangle },
      { name: 'Forecast (365d)', href: '/dashboard/forecast', icon: TrendingUp },
    ]
  },
  {
    title: 'TRUST & EVIDENCE',
    items: [
      { name: 'Backtest Validation', href: '/dashboard/backtest', icon: History, badge: 'A+' },
      { name: 'Evidence Dossier', href: '/dashboard/reports', icon: FileText },
      { name: 'Data Sources', href: '/dashboard/data-sources', icon: Database },
      { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ]
  }
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed bottom-5 right-5 z-50 p-3 rounded-full bg-cyan-500 text-black shadow-lg shadow-cyan-500/30 font-bold focus:outline-none"
        aria-label="Toggle Navigation Menu"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Backdrop for Mobile */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'w-64 bg-[#0B0D14]/95 backdrop-blur-xl border-r border-slate-800/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-40 transition-transform duration-200',
          isMobileOpen ? 'fixed left-0 top-0 translate-x-0' : 'fixed -translate-x-full lg:translate-x-0 lg:sticky'
        )}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center px-6 border-b border-slate-800/80 gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-black stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-wider text-white">SWARM</span>
                  <span className="font-extrabold text-lg tracking-wider text-cyan-400">IQ</span>
                </div>
                <p className="text-[9px] text-slate-400 font-mono tracking-tight uppercase">
                  Autonomous Market Engine
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation Sectioned List */}
          <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-140px)]">
            {navSections.map((sec) => (
              <div key={sec.title} className="space-y-1">
                <span className="px-3 text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase block pb-1">
                  {sec.title}
                </span>
                {sec.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group',
                        isActive
                          ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={cn(
                            'w-4 h-4 transition-colors',
                            isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                          )}
                        />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={cn(
                            'px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold',
                            isActive
                              ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/40'
                              : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer System Status */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[11px] text-slate-300">DEMO_MODE=active</span>
            </span>
            <span className="text-[10px] font-mono text-cyan-400">10,000 AGENTS</span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono truncate">
            Calibrated: Indian Urban 2024.2
          </p>
        </div>
      </aside>
    </>
  );
};
