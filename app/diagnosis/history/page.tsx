import { Button, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { DiagnosisHistoryList } from '@/app/components/DiagnosisHistoryList';
import { MemberLayout } from '@/app/components/MemberLayout';
import { listDiagnosesByUser } from '@/lib/diagnosis';
import { getDisplayImage, getUserProfile } from '@/lib/user';

export default async function DiagnosisHistoryPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const profile = await getUserProfile(session.user.id);
  const displayImage = profile ? getDisplayImage(profile) : session.user.image;
  const displayName = profile?.name ?? session.user.name;
  const diagnoses = await listDiagnosesByUser(session.user.id);

  return (
    <MemberLayout title="診断履歴" userName={displayName} userImage={displayImage}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            診断履歴
          </Typography>
          <Button component={Link} href="/diagnosis" variant="contained">
            新しい診断
          </Button>
        </Stack>
        <DiagnosisHistoryList initialDiagnoses={diagnoses} />
      </Stack>
    </MemberLayout>
  );
}
