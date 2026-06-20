import { Avatar, Card, CardContent, Stack, Typography } from '@mui/material';

import { auth } from '@/auth';
import { MemberLayout } from '@/app/components/MemberLayout';
import { SignOutButton } from '@/app/components/SignOutButton';

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <MemberLayout
      title="会員ダッシュボード"
      userName={user?.name}
      userImage={user?.image}
    >
      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                ようこそ、{user?.name ?? '会員'} さん
              </Typography>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Avatar
                  src={user?.image ?? undefined}
                  alt={user?.name ?? 'ユーザー'}
                  sx={{ width: 64, height: 64 }}
                />
                <Typography color="text.secondary">{user?.email}</Typography>
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
