import { Box, Card, CardContent, Container, Stack, Typography } from '@mui/material';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { CosmicBackground } from '@/app/components/CosmicBackground';
import { GoogleSignInButton } from '@/app/components/GoogleSignInButton';
import { MockSignInButton } from '@/app/components/MockSignInButton';

type SignInPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const session = await auth();
  const { callbackUrl } = await searchParams;
  // 開発時は、Google/Mongoなしで画面確認できるようモックログインを常に表示する
  const showMockButton = process.env.NODE_ENV !== 'production';

  if (session?.user) {
    redirect(callbackUrl ?? '/dashboard');
  }

  const redirectTo = callbackUrl ?? '/dashboard';

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <CosmicBackground />
      <Container
        maxWidth="sm"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1
        }}
      >
        <Card sx={{ width: '100%' }}>
          <CardContent>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                  会員ログイン
                </Typography>
                <Typography color="text.secondary">
                  Googleアカウントでログインすると、会員専用のダッシュボードとプロフィール編集が利用できます。
                </Typography>
              </Box>
              <Stack spacing={2}>
                <GoogleSignInButton callbackUrl={redirectTo} />
                {showMockButton ? <MockSignInButton callbackUrl={redirectTo} /> : null}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
