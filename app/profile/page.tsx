import { Typography } from '@mui/material';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { MemberLayout } from '@/app/components/MemberLayout';
import { ProfileForm } from '@/app/components/ProfileForm';
import { getUserProfile } from '@/lib/user';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const profile = await getUserProfile(session.user.id);

  if (!profile) {
    return (
      <MemberLayout title="プロフィール" userName={session.user.name} userImage={session.user.image}>
        <Typography>ユーザー情報を取得できませんでした。</Typography>
      </MemberLayout>
    );
  }

  return (
    <MemberLayout
      title="プロフィール"
      userName={profile.name ?? session.user.name}
      userImage={profile.image ?? session.user.image}
    >
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }} gutterBottom>
        プロフィール
      </Typography>
      <ProfileForm initialProfile={profile} />
    </MemberLayout>
  );
}
