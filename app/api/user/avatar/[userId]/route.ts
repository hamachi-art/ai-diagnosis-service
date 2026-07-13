import { NextResponse } from 'next/server';

import { getAvatar } from '@/lib/avatar-storage';
import { getUserProfile } from '@/lib/user';

type RouteContext = {
  params: Promise<{ userId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { userId } = await context.params;

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  const profile = await getUserProfile(userId);

  if (!profile?.customImage) {
    return NextResponse.json({ error: 'Avatar not found' }, { status: 404 });
  }

  const avatar = await getAvatar(userId);

  if (!avatar) {
    return NextResponse.json({ error: 'Avatar not found' }, { status: 404 });
  }

  return new NextResponse(avatar.stream, {
    headers: {
      'Content-Type': avatar.contentType,
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
    }
  });
}
