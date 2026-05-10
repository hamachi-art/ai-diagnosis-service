import { Box, Container, Stack, Typography } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

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
        borderColor: 'divider',
        background:
          'radial-gradient(900px circle at 20% 10%, rgba(37, 99, 235, 0.18), transparent 60%), radial-gradient(900px circle at 90% 20%, rgba(6, 182, 212, 0.14), transparent 55%), linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)'
      }}
    >
      <Container maxWidth="lg">
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
                bgcolor: 'rgba(37, 99, 235, 0.08)',
                border: '1px solid rgba(37, 99, 235, 0.18)'
              }}
            >
              <AutoAwesomeIcon fontSize="small" color="primary" />
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#1d4ed8' }}>
                5問・3分で完了
              </Typography>
            </Box>

            <Typography
              component="h1"
              variant="h2"
              sx={{
                fontWeight: 900,
                letterSpacing: -0.7,
                fontSize: { xs: 34, sm: 44, md: 56 }
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
              border: '1px solid',
              borderColor: 'divider',
              background:
                'linear-gradient(135deg, rgba(37, 99, 235, 0.10) 0%, rgba(6, 182, 212, 0.10) 100%)',
              position: 'relative',
              boxShadow: '0 30px 60px rgba(15, 23, 42, 0.08)'
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 18,
                borderRadius: 4,
                bgcolor: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(15, 23, 42, 0.08)',
                display: 'grid',
                placeItems: 'center'
              }}
            >
              <Stack spacing={1} sx={{ textAlign: 'center', px: 2 }}>
                <Typography sx={{ fontWeight: 900, fontSize: 18 }}>
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
                    background: 'linear-gradient(90deg, #2563eb 0%, #06b6d4 100%)'
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

