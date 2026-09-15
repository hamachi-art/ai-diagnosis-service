import { Button, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { DiagnosisForm } from '@/app/components/DiagnosisForm';
import { MemberLayout } from '@/app/components/MemberLayout';
import { getDisplayImage, getUserProfile } from '@/lib/user';

export default async function DiagnosisPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const profile = await getUserProfile(session.user.id);
  const displayImage = profile ? getDisplayImage(profile) : session.user.image;
  const displayName = profile?.name ?? session.user.name;

  return (
    <MemberLayout title="AIキャリア診断" userName={displayName} userImage={displayImage}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            5問でキャリア診断
          </Typography>
          <Button component={Link} href="/diagnosis/history" variant="outlined">
            診断履歴
          </Button>
        </Stack>
        <Typography color="text.secondary">
          職業適性・スキル・興味関心・価値観・働き方の5問に答えると、AIが短期・中期・長期のキャリアロードマップを提案します。
        </Typography>
        <DiagnosisForm />
      </Stack>
    </MemberLayout>
  );
}
