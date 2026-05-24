import { Box, Container, Stack, Typography } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import { cosmicColors, glassCardSx } from '../styles/cosmic';
import { CtaButton } from './CtaButton';

export function HeroSection() {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 9, sm: 11, md: 14 },
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      {/* ヒーロー専用の明るい星雲 */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 70% 50% at 20% 30%, rgba(139, 92, 246, 0.28) 0%, transparent 55%),
            radial-gradient(ellipse 60% 45% at 80% 20%, rgba(34, 211, 238, 0.18) 0%, transparent 50%)
          `,
          pointerEvents: 'none'
        }}
      />
      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 5, md: 6 },
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between'
          }}
        >
          <Stack spacing={2.5} sx={{ maxWidth: 640 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                width: 'fit-content',
                px: 1.4,
                py: 0.8,
                borderRadius: 999,
                ...glassCardSx,
                bgcolor: 'rgba(139, 92, 246, 0.15)'
              }}
            >
              <AutoAwesomeIcon fontSize="small" sx={{ color: '#c4b5fd' }} />
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#c4b5fd' }}>
                5問・3分で完了
              </Typography>
            </Box>

            <Typography
              component="h1"
              variant="h2"
              sx={{
                fontWeight: 900,
                letterSpacing: -0.7,
                fontSize: { xs: 34, sm: 44, md: 56 },
                background: 'linear-gradient(135deg, #f8fafc 0%, #c4b5fd 50%, #67e8f9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              5問でわかる、あなたのキャリア
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: 'text.secondary', lineHeight: 1.7, fontWeight: 500 }}
            >
              AIがあなたに最適なキャリアロードマップを提案します。
              <br />
              今の悩みを「次の一歩」に変える、軽い自己診断です。
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                alignItems: 'center'
              }}
            >
              <CtaButton />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                登録・課金はStage2以降（Stage1はLPのみ）
              </Typography>
            </Box>
          </Stack>

          <Box
            aria-hidden
            sx={{
              width: { xs: '100%', md: 420 },
              height: { xs: 240, sm: 280, md: 320 },
              borderRadius: 6,
              position: 'relative',
              overflow: 'hidden',
              ...glassCardSx,
              background: `
                radial-gradient(ellipse 80% 60% at 30% 40%, rgba(139, 92, 246, 0.35) 0%, transparent 50%),
                radial-gradient(ellipse 70% 50% at 70% 60%, rgba(34, 211, 238, 0.25) 0%, transparent 45%),
                radial-gradient(ellipse 50% 40% at 50% 80%, rgba(236, 72, 153, 0.2) 0%, transparent 40%),
                ${cosmicColors.glass}
              `,
              boxShadow:
                '0 30px 60px rgba(0, 0, 0, 0.5), 0 0 80px rgba(139, 92, 246, 0.15), inset 0 1px 0 rgba(255,255,255,0.08)'
            }}
          >
            {/* ミニ銀河 */}
            <Box
              sx={{
                position: 'absolute',
                top: '15%',
                right: '10%',
                width: 90,
                height: 30,
                borderRadius: '50%',
                background:
                  'radial-gradient(ellipse, rgba(255,255,255,0.9) 0%, rgba(196,181,253,0.5) 25%, transparent 70%)',
                transform: 'rotate(-20deg)',
                opacity: 0.8
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
                  radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.9), transparent),
                  radial-gradient(1px 1px at 60% 20%, rgba(255,255,255,0.7), transparent),
                  radial-gradient(1.5px 1.5px at 80% 70%, rgba(255,255,255,0.8), transparent),
                  radial-gradient(1px 1px at 40% 80%, rgba(255,255,255,0.6), transparent)
                `
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 18,
                borderRadius: 4,
                ...glassCardSx,
                bgcolor: 'rgba(10, 8, 40, 0.75)',
                display: 'grid',
                placeItems: 'center'
              }}
            >
              <Stack spacing={1} sx={{ textAlign: 'center', px: 2 }}>
                <Typography sx={{ fontWeight: 900, fontSize: 18, color: cosmicColors.textPrimary }}>
                  あなた向けロードマップ例
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  目標 → スキル → 次の行動を整理
                </Typography>
                <Box
                  sx={{
                    mt: 1,
                    height: 10,
                    borderRadius: 999,
                    background:
                      'linear-gradient(90deg, #7c3aed 0%, #6366f1 40%, #22d3ee 75%, #ec4899 100%)',
                    boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)'
                  }}
                />
              </Stack>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
