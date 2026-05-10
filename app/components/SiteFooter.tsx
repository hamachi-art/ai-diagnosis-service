import { Box, Container, Typography } from '@mui/material';

export function SiteFooter() {
  return (
    <Box component="footer" sx={{ py: 4, borderTop: '1px solid', borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1,
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' }
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            © {new Date().getFullYear()} AIキャリア診断
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Stage1: LPのみ（認証・診断機能は後続Stageで提供予定）
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

