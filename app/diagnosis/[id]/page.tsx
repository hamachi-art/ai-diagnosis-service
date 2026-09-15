import { Button, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { auth } from '@/auth';
import { DiagnosisResultView } from '@/app/components/DiagnosisResultView';
import { MemberLayout } from '@/app/components/MemberLayout';
import { getDiagnosisById } from '@/lib/diagnosis';
import { getDisplayImage, getUserProfile } from '@/lib/user';

type DiagnosisDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DiagnosisDetailPage({
  params
}: DiagnosisDetailPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const { id } = await params;
  const diagnosis = await getDiagnosisById(id, session.user.id);

  if (!diagnosis) {
    notFound();
  }

  const profile = await getUserProfile(session.user.id);
  const displayImage = profile ? getDisplayImage(profile) : session.user.image;
  const displayName = profile?.name ?? session.user.name;

  return (
    <MemberLayout title="診断詳細" userName={displayName} userImage={displayImage}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            診断結果詳細
          </Typography>
          <Button component={Link} href="/diagnosis/history" variant="outlined">
            履歴に戻る
          </Button>
        </Stack>
        <DiagnosisResultView
          id={diagnosis.id}
          answers={diagnosis.answers}
          careerRoadmap={diagnosis.careerRoadmap}
          createdAt={diagnosis.createdAt}
        />
      </Stack>
    </MemberLayout>
  );
}
