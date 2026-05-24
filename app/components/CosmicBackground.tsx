import { Box } from '@mui/material';

import { cosmicBaseGradient } from '../styles/cosmic';

/** 星々・星雲・銀河を重ねた固定背景 */
export function CosmicBackground() {
  return (
    <Box
      aria-hidden
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: cosmicBaseGradient
      }}
    >
      {/* 星雲レイヤー */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 50% 35% at 15% 25%, rgba(168, 85, 247, 0.22) 0%, transparent 70%),
            radial-gradient(ellipse 45% 30% at 85% 15%, rgba(34, 211, 238, 0.15) 0%, transparent 65%),
            radial-gradient(ellipse 55% 40% at 60% 75%, rgba(236, 72, 153, 0.12) 0%, transparent 60%),
            radial-gradient(ellipse 40% 25% at 30% 85%, rgba(99, 102, 241, 0.18) 0%, transparent 55%)
          `
        }}
      />
      {/* 遠方の銀河 */}
      <Box
        sx={{
          position: 'absolute',
          top: '12%',
          right: '8%',
          width: { xs: 120, md: 180 },
          height: { xs: 40, md: 60 },
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse, rgba(255,255,255,0.9) 0%, rgba(200,180,255,0.4) 15%, rgba(139,92,246,0.2) 40%, transparent 70%)',
          transform: 'rotate(-25deg)',
          opacity: 0.7,
          filter: 'blur(1px)'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '5%',
          width: { xs: 80, md: 140 },
          height: { xs: 28, md: 45 },
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse, rgba(255,255,255,0.7) 0%, rgba(180,220,255,0.35) 20%, rgba(6,182,212,0.15) 45%, transparent 70%)',
          transform: 'rotate(15deg)',
          opacity: 0.5
        }}
      />
      {/* 星フィールド（CSS） */}
      <Box
        className="cosmic-stars cosmic-stars--dense"
        sx={{ position: 'absolute', inset: 0 }}
      />
      <Box
        className="cosmic-stars cosmic-stars--sparse"
        sx={{ position: 'absolute', inset: 0, opacity: 0.6 }}
      />
    </Box>
  );
}
