import Link from 'next/link';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography
} from '@mui/material';

import { CosmicBackground } from '@/app/components/CosmicBackground';

type MemberLayoutProps = {
  children: React.ReactNode;
  userName?: string | null;
  userImage?: string | null;
  title: string;
};

export function MemberLayout({
  children,
  userName,
  userImage,
  title
}: MemberLayoutProps) {
  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <CosmicBackground />
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(15, 10, 35, 0.75)'
        }}
      >
        <Toolbar sx={{ gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            {title}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <Button component={Link} href="/dashboard" color="inherit">
              ダッシュボード
            </Button>
            <Button component={Link} href="/profile" color="inherit">
              プロフィール
            </Button>
            <Button component={Link} href="/" color="inherit">
              トップ
            </Button>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Avatar src={userImage ?? undefined} alt={userName ?? 'ユーザー'} />
              <Typography variant="body2" color="text.secondary">
                {userName ?? 'ゲスト'}
              </Typography>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {children}
      </Container>
    </Box>
  );
}
