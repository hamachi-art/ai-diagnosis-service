import { Box, Container, Stack, Typography } from '@mui/material';

import { glassCardSx } from '../styles/cosmic';
import { CtaButton } from './CtaButton';

export function BottomCtaSection() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 10 }, position: 'relative' }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            borderRadius: 6,
            position: 'relative',
            overflow: 'hidden',
            ...glassCardSx,
            background: `
              radial-gradient(ellipse 70% 60% at 10% 0%, rgba(139, 92, 246, 0.3) 0%, transparent 55%),
              radial-gradient(ellipse 60% 50% at 90% 30%, rgba(34, 211, 238, 0.2) 0%, transparent 50%),
              radial-gradient(ellipse 50% 40% at 50% 100%, rgba(236, 72, 153, 0.15) 0%, transparent 45%),
              rgba(15, 10, 40, 0.65)
            `,
            boxShadow:
              '0 24px 48px rgba(0, 0, 0, 0.4), 0 0 60px rgba(139, 92, 246, 0.1), inset 0 1px 0 rgba(255,255,255,0.06)',
            px: { xs: 3, sm: 5, md: 7 },
            py: { xs: 4, sm: 5, md: 6 }
          }}
        >
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              top: '10%',
              right: '5%',
              width: 100,
              height: 35,
              borderRadius: '50%',
              background:
                'radial-gradient(ellipse, rgba(255,255,255,0.6) 0%, rgba(196,181,253,0.3) 30%, transparent 70%)',
              transform: 'rotate(-15deg)',
              opacity: 0.5
            }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2.5,
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              position: 'relative'
            }}
          >
            <Stack spacing={0.8} sx={{ maxWidth: 720 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: -0.2 }}>
                まずは5問で、今の「次」を決めよう
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                診断体験はStage2/3で実装予定。今はLPで価値を先に確認できます。
              </Typography>
            </Stack>
            <CtaButton label="無料で診断を始める" />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
