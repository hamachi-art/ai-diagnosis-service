import { Alert, Button, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { DiagnosisResultView } from '@/app/components/DiagnosisResultView';
import { MemberLayout } from '@/app/components/MemberLayout';
import { getDiagnosisById, listDiagnosesByUser } from '@/lib/diagnosis';
import { getDisplayImage, getUserProfile } from '@/lib/user';

type DiagnosisResultPageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function DiagnosisResultPage({
  searchParams
}: DiagnosisResultPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const { id: queryId } = await searchParams;
  const profile = await getUserProfile(session.user.id);
  const displayImage = profile ? getDisplayImage(profile) : session.user.image;
  const displayName = profile?.name ?? session.user.name;

  let diagnosis = queryId
    ? await getDiagnosisById(queryId, session.user.id)
    : null;

  if (!diagnosis) {
    const list = await listDiagnosesByUser(session.user.id);
    diagnosis = list[0] ?? null;
  }

  return (
    <MemberLayout title="診断結果" userName={displayName} userImage={displayImage}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          診断結果
        </Typography>

        {diagnosis ? (
          <DiagnosisResultView
            id={diagnosis.id}
            answers={diagnosis.answers}
            careerRoadmap={diagnosis.careerRoadmap}
            createdAt={diagnosis.createdAt}
          />
        ) : (
          <Stack spacing={2}>
            <Alert severity="info">表示できる診断結果がありません。</Alert>
            <Button component={Link} href="/diagnosis" variant="contained">
              診断をはじめる
            </Button>
          </Stack>
        )}
      </Stack>
    </MemberLayout>
  );
}
