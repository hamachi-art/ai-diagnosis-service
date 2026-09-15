import { Stack, Typography } from '@mui/material';
import { notFound, redirect } from 'next/navigation';

import { auth } from '@/auth';
import { DiagnosisEditForm } from '@/app/components/DiagnosisEditForm';
import { MemberLayout } from '@/app/components/MemberLayout';
import { getDiagnosisById } from '@/lib/diagnosis';
import { getDisplayImage, getUserProfile } from '@/lib/user';

type DiagnosisEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DiagnosisEditPage({ params }: DiagnosisEditPageProps) {
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
    <MemberLayout title="診断編集" userName={displayName} userImage={displayImage}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          診断結果の編集
        </Typography>
        <DiagnosisEditForm
          id={diagnosis.id}
          initialAnswers={diagnosis.answers}
          initialRoadmap={diagnosis.careerRoadmap}
        />
      </Stack>
    </MemberLayout>
  );
}
