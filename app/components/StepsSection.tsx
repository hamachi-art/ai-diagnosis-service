import { Box, Container, Stack, Typography } from '@mui/material';

import { glassCardSx } from '../styles/cosmic';

const steps = [
  {
    title: 'Step 1: 質問に回答',
    description: '5つの質問に答えて、今の状況と方向性を整理します。',
    glow: 'rgba(139, 92, 246, 0.2)'
  },
  {
    title: 'Step 2: AI分析',
    description: '回答をもとに、優先度・リスク・強みを読み解きます。',
    glow: 'rgba(34, 211, 238, 0.18)'
  },
  {
    title: 'Step 3: 結果表示',
    description: 'あなた向けのキャリアロードマップ（次の行動案）を提示します。',
    glow: 'rgba(236, 72, 153, 0.18)'
  }
];

export function StepsSection() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 10 },
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(99, 102, 241, 0.12) 0%, transparent 60%)',
          pointerEvents: 'none'
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              letterSpacing: -0.4,
              background: 'linear-gradient(135deg, #f8fafc 0%, #67e8f9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            診断の流れ
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            迷いを可視化し、最短距離で次の一歩に落とし込みます。
          </Typography>
        </Stack>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2.5,
            alignItems: 'stretch'
          }}
        >
          {steps.map((s) => (
            <Box
              key={s.title}
              sx={{
                flex: 1,
                p: 3,
                borderRadius: 4,
                ...glassCardSx,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box
                aria-hidden
                sx={{
                  position: 'absolute',
                  top: -40,
                  right: -40,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  bgcolor: s.glow,
                  filter: 'blur(20px)'
                }}
              />
              <Typography sx={{ fontWeight: 900, mb: 1, position: 'relative' }}>
                {s.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', lineHeight: 1.9, position: 'relative' }}
              >
                {s.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
