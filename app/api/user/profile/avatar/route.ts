import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import {
  ALLOWED_AVATAR_TYPES,
  getAvatarUrl,
  MAX_AVATAR_SIZE,
  saveAvatar
} from '@/lib/avatar-storage';
import { getDisplayImage, getUserProfile, updateUserAvatar } from '@/lib/user';

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('avatar');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'avatar file is required' }, { status: 400 });
  }

  if (!ALLOWED_AVATAR_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: 'JPEG、PNG、WebP、GIF のみアップロードできます' },
      { status: 400 }
    );
  }

  if (file.size > MAX_AVATAR_SIZE) {
    return NextResponse.json(
      { error: 'ファイルサイズは300KB以下にしてください' },
      { status: 400 }
    );
  }

  const userId = session.user.id;
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    await saveAvatar(userId, buffer, file.type);
  } catch {
    return NextResponse.json({ error: '画像の保存に失敗しました' }, { status: 500 });
  }

  const avatarUrl = `${getAvatarUrl(userId)}?t=${Date.now()}`;
  const profile = await updateUserAvatar(userId, avatarUrl);

  if (!profile) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    ...profile,
    displayImage: getDisplayImage(profile)
  });
}
