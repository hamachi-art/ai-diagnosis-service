/** 壮大で神秘的な宇宙空間テーマ用の共有スタイル */

export const cosmicColors = {
  spaceDeep: '#030014',
  spaceMid: '#0a0828',
  spaceLight: '#12103a',
  star: '#ffffff',
  nebulaPurple: 'rgba(139, 92, 246, 0.45)',
  nebulaPink: 'rgba(236, 72, 153, 0.35)',
  nebulaCyan: 'rgba(34, 211, 238, 0.3)',
  nebulaIndigo: 'rgba(99, 102, 241, 0.4)',
  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
  border: 'rgba(148, 163, 184, 0.15)',
  glass: 'rgba(15, 10, 40, 0.55)'
} as const;

export const cosmicBaseGradient = `
  radial-gradient(ellipse 120% 80% at 50% 0%, rgba(88, 28, 135, 0.35) 0%, transparent 50%),
  radial-gradient(ellipse 80% 60% at 10% 40%, rgba(124, 58, 237, 0.25) 0%, transparent 45%),
  radial-gradient(ellipse 70% 50% at 90% 60%, rgba(6, 182, 212, 0.2) 0%, transparent 40%),
  radial-gradient(ellipse 60% 40% at 70% 20%, rgba(236, 72, 153, 0.18) 0%, transparent 35%),
  linear-gradient(180deg, ${cosmicColors.spaceDeep} 0%, ${cosmicColors.spaceMid} 50%, ${cosmicColors.spaceLight} 100%)
`;

export const glassCardSx = {
  bgcolor: cosmicColors.glass,
  backdropFilter: 'blur(12px)',
  border: `1px solid ${cosmicColors.border}`,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06)'
} as const;

export const ctaGradient =
  'linear-gradient(135deg, #7c3aed 0%, #6366f1 35%, #06b6d4 70%, #ec4899 100%)';

export const ctaGradientHover =
  'linear-gradient(135deg, #6d28d9 0%, #4f46e5 35%, #0891b2 70%, #db2777 100%)';
