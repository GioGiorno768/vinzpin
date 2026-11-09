import { ThemeConfig, ThemeKey } from '../types';

export const THEMES: Record<ThemeKey, ThemeConfig> = {
  cyber: {
    key: 'cyber',
    name: '🌌 Cyber Neon',
    badgeLabel: 'Cyber Neon',
    bodyClass: 'bg-slate-950 text-slate-100',
    cardClass: 'bg-slate-900/85 border-slate-800/80 text-slate-100 shadow-[0_8px_32px_rgba(0,0,0,0.5)]',
    panelHeaderClass: 'border-slate-800 text-slate-200',
    historyItemClass: 'bg-slate-800/50 border-slate-700/60 text-slate-200 hover:border-violet-500/50 hover:bg-slate-800/80',
    modalBoxClass: 'bg-slate-900 border-slate-800 text-slate-100 shadow-2xl',
    glowColor: 'rgba(99, 102, 241, 0.45)',
    pointerColor: '#f59e0b',
    pointerStroke: '#0f172a',
    canvasBorder: '#0f172a',
    centerPinStroke: '#38bdf8',
    spinBtnGradient: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #ec4899 100%)',
    badgeStyle: 'bg-slate-900/90 text-violet-300 border-slate-800 shadow-sm',
    accentText: 'text-violet-400',
    confettiColors: ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#a855f7'],
    sliceColors: [
      '#6366f1', '#ec4899', '#14b8a6', '#f59e0b',
      '#8b5cf6', '#06b6d4', '#10b981', '#f43f5e',
      '#3b82f6', '#d946ef', '#84cc16', '#fb923c'
    ]
  },
  casino: {
    key: 'casino',
    name: '🎰 Royal Casino',
    badgeLabel: 'Royal Casino',
    bodyClass: 'bg-[#090b0e] text-amber-100',
    cardClass: 'bg-[#12141a]/95 border-amber-500/25 text-amber-100 shadow-[0_8px_32px_rgba(0,0,0,0.6)]',
    panelHeaderClass: 'border-amber-500/20 text-amber-200',
    historyItemClass: 'bg-black/55 border-amber-500/20 text-amber-200 hover:border-amber-400/50 hover:bg-black/80',
    modalBoxClass: 'bg-[#14161f] border-amber-500/30 text-amber-100 shadow-2xl',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    pointerColor: '#facc15',
    pointerStroke: '#000000',
    canvasBorder: '#1f1b0f',
    centerPinStroke: '#eab308',
    spinBtnGradient: 'linear-gradient(135deg, #d97706 0%, #b45309 50%, #dc2626 100%)',
    badgeStyle: 'bg-black/80 text-amber-400 border-amber-900/50 shadow-sm',
    accentText: 'text-amber-400',
    confettiColors: ['#facc15', '#ef4444', '#10b981', '#e2e8f0', '#d97706'],
    sliceColors: [
      '#b91c1c', '#047857', '#b45309', '#1e293b',
      '#991b1b', '#065f46', '#92400e', '#0f172a'
    ]
  },
  synthwave: {
    key: 'synthwave',
    name: '🌆 Synthwave 80s',
    badgeLabel: 'Synthwave',
    bodyClass: 'bg-[#10041d] text-pink-100',
    cardClass: 'bg-[#1b0933]/90 border-pink-500/30 text-pink-100 shadow-[0_8px_32px_rgba(236,72,153,0.15)]',
    panelHeaderClass: 'border-pink-500/25 text-pink-200',
    historyItemClass: 'bg-[#270e47]/65 border-pink-500/25 text-pink-200 hover:border-pink-400/60 hover:bg-[#34135e]',
    modalBoxClass: 'bg-[#1c0836] border-pink-500/40 text-pink-100 shadow-2xl',
    glowColor: 'rgba(236, 72, 153, 0.45)',
    pointerColor: '#06b6d4',
    pointerStroke: '#2e0854',
    canvasBorder: '#2a0845',
    centerPinStroke: '#f43f5e',
    spinBtnGradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #06b6d4 100%)',
    badgeStyle: 'bg-purple-950/80 text-pink-300 border-pink-800/60 shadow-sm',
    accentText: 'text-pink-400',
    confettiColors: ['#ec4899', '#06b6d4', '#a855f7', '#fbbf24', '#f43f5e'],
    sliceColors: [
      '#d946ef', '#06b6d4', '#f43f5e', '#8b5cf6',
      '#ec4899', '#3b82f6', '#f97316', '#6366f1'
    ]
  },
  candy: {
    key: 'candy',
    name: '🍦 Candy Pop',
    badgeLabel: 'Candy Pop',
    bodyClass: 'bg-rose-50 text-slate-800',
    cardClass: 'bg-white/95 border-rose-200/90 text-slate-800 shadow-[0_8px_24px_rgba(244,114,182,0.15)]',
    panelHeaderClass: 'border-rose-200 text-slate-800',
    historyItemClass: 'bg-rose-50/90 border-rose-200/80 text-rose-900 hover:border-rose-300 hover:bg-rose-100/80',
    modalBoxClass: 'bg-white border-rose-200 text-slate-800 shadow-2xl',
    glowColor: 'rgba(244, 114, 182, 0.45)',
    pointerColor: '#f43f5e',
    pointerStroke: '#ffffff',
    canvasBorder: '#ffe4e6',
    centerPinStroke: '#fb7185',
    spinBtnGradient: 'linear-gradient(135deg, #fb7185 0%, #f43f5e 50%, #fb923c 100%)',
    badgeStyle: 'bg-white/95 text-rose-600 border-rose-200 shadow-sm',
    accentText: 'text-rose-500',
    confettiColors: ['#fb7185', '#38bdf8', '#fbbf24', '#a78bfa', '#4ade80'],
    sliceColors: [
      '#f472b6', '#38bdf8', '#fbbf24', '#a78bfa',
      '#fb923c', '#4ade80', '#2dd4bf', '#f87171'
    ]
  }
};
