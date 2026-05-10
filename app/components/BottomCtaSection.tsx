import { Box, Container, Stack, Typography } from '@mui/material';

import { CtaButton } from './CtaButton';

export function BottomCtaSection() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            borderRadius: 6,
            border: '1px solid',
            borderColor: 'divider',
            background:
              'radial-gradient(900px circle at 10% 0%, rgba(37, 99, 235, 0.16), transparent 55%), radial-gradient(900px circle at 90% 20%, rgba(6, 182, 212, 0.14), transparent 55%), linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
            px: { xs: 3, sm: 5, md: 7 },
            py: { xs: 4, sm: 5, md: 6 }
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2.5,
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between'
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

