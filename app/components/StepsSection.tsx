import { Box, Container, Stack, Typography } from '@mui/material';

const steps = [
  {
    title: 'Step 1: 質問に回答',
    description: '5つの質問に答えて、今の状況と方向性を整理します。'
  },
  {
    title: 'Step 2: AI分析',
    description: '回答をもとに、優先度・リスク・強みを読み解きます。'
  },
  {
    title: 'Step 3: 結果表示',
    description: 'あなた向けのキャリアロードマップ（次の行動案）を提示します。'
  }
];

export function StepsSection() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 10 }, bgcolor: '#f8fafc' }}>
      <Container maxWidth="lg">
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -0.4 }}>
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
          {steps.map((s, i) => (
            <Box
              key={s.title}
              sx={{
                flex: 1,
                p: 3,
                borderRadius: 4,
                bgcolor: 'background.default',
                border: '1px solid',
                borderColor: 'divider',
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
                  bgcolor: i === 1 ? 'rgba(6, 182, 212, 0.12)' : 'rgba(37, 99, 235, 0.10)'
                }}
              />
              <Typography sx={{ fontWeight: 900, mb: 1 }}>{s.title}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.9 }}>
                {s.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

