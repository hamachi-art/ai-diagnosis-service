import { Avatar, Card, CardContent, Stack, Typography } from '@mui/material';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { MemberLayout } from '@/app/components/MemberLayout';
import { SignOutButton } from '@/app/components/SignOutButton';
import { getDisplayImage, getUserProfile } from '@/lib/user';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const profile = await getUserProfile(session.user.id);
  const displayImage = profile
    ? getDisplayImage(profile)
    : session.user.image;
  const displayName = profile?.name ?? session.user.name;

  return (
    <MemberLayout
      title="会員ダッシュボード"
      userName={displayName}
      userImage={displayImage}
    >
      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                ようこそ、{displayName ?? '会員'} さん
              </Typography>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Avatar
                  src={displayImage ?? undefined}
                  alt={displayName ?? 'ユーザー'}
                  sx={{ width: 64, height: 64 }}
                />
                <Typography color="text.secondary">{session.user.email}</Typography>
              </Stack>
              <Typography>
                こちらは会員専用のトップページです。プロフィールの確認・編集はナビゲーションからアクセスできます。
              </Typography>
              <SignOutButton />
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </MemberLayout>
  );
}
