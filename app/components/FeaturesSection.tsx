import { Box, Card, CardContent, Container, Stack, Typography } from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import TuneIcon from '@mui/icons-material/Tune';

const features = [
  {
    title: 'たった5問・3分で完了',
    description:
      '忙しくても続けられる短さ。まずは軽く、今の状況を言語化するところから始められます。',
    icon: BoltIcon
  },
  {
    title: 'AIが深く分析',
    description:
      '回答をもとに、考えがちな落とし穴や優先度を整理。迷いを「判断材料」に変えます。',
    icon: PsychologyAltIcon
  },
  {
    title: 'パーソナライズされた提案',
    description:
      'あなたの状況に合わせて、学習・転職・社内異動などの選択肢を現実的な順序で提案します。',
    icon: TuneIcon
  }
];

export function FeaturesSection() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -0.4 }}>
            迷いを、次の一歩に
          </Typography>
          <Typography sx={{ color: 'text.secondary', maxWidth: 760 }}>
            「何から始めるべきか分からない」を、行動に落とし込むための最短ルートを提示します。
          </Typography>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
            gap: 2.5
          }}
        >
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Box key={f.title}>
                <Card
                  variant="outlined"
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    transition: 'transform 160ms ease, box-shadow 160ms ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 20px 40px rgba(15, 23, 42, 0.10)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 3,
                        display: 'grid',
                        placeItems: 'center',
                        mb: 2,
                        bgcolor: 'rgba(37, 99, 235, 0.10)',
                        border: '1px solid rgba(37, 99, 235, 0.18)'
                      }}
                    >
                      <Icon color="primary" />
                    </Box>
                    <Typography sx={{ fontWeight: 900, fontSize: 18, mb: 1 }}>
                      {f.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                      {f.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}

