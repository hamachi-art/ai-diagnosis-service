import { ObjectId } from 'mongodb';

import clientPromise from '@/lib/mongodb';

function isMockMode(): boolean {
  return process.env.AUTH_MOCK_MODE === 'true';
}

declare global {
  // eslint-disable-next-line no-var
  var _mockUserProfiles: Map<string, UserProfile> | undefined;
}

export type UserProfile = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  emailVerified: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

function getMockStore(): Map<string, UserProfile> {
  if (!global._mockUserProfiles) {
    global._mockUserProfiles = new Map();
  }
  return global._mockUserProfiles;
}

function mapUserDocument(doc: Record<string, unknown>): UserProfile {
  return {
    id: String(doc._id),
    name: (doc.name as string | null | undefined) ?? null,
    email: (doc.email as string | null | undefined) ?? null,
    image: (doc.image as string | null | undefined) ?? null,
    emailVerified: (doc.emailVerified as Date | null | undefined) ?? null,
    createdAt: (doc.createdAt as Date | null | undefined) ?? null,
    updatedAt: (doc.updatedAt as Date | null | undefined) ?? null
  };
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (isMockMode()) {
    return getMockStore().get(userId) ?? null;
  }

  try {
    const client = await clientPromise;
    const doc = await client
      .db()
      .collection('users')
      .findOne({ _id: new ObjectId(userId) });

    if (!doc) {
      return null;
    }

    return mapUserDocument(doc as Record<string, unknown>);
  } catch {
    // Local UI確認のため、DB接続失敗などは「データなし」として扱う
    return null;
  }
}

export async function updateUserProfile(
  userId: string,
  data: { name: string }
): Promise<UserProfile | null> {
  const now = new Date();

  if (isMockMode()) {
    const store = getMockStore();
    const prev = store.get(userId);

    const next: UserProfile = {
      id: userId,
      name: data.name,
      email: prev?.email ?? null,
      image: prev?.image ?? null,
      emailVerified: prev?.emailVerified ?? null,
      createdAt: prev?.createdAt ?? now,
      updatedAt: now
    };

    store.set(userId, next);
    return next;
  }

  try {
    const client = await clientPromise;

    const result = await client
      .db()
      .collection('users')
      .findOneAndUpdate(
        { _id: new ObjectId(userId) },
        {
          $set: {
            name: data.name,
            updatedAt: now
          },
          $setOnInsert: {
            createdAt: now
          }
        },
        { returnDocument: 'after' }
      );

    if (!result) {
      return null;
    }

    return mapUserDocument(result as Record<string, unknown>);
  } catch {
    return null;
  }
}

export async function ensureUserTimestamps(userId: string): Promise<void> {
  if (isMockMode()) {
    return;
  }

  try {
    const client = await clientPromise;
    const now = new Date();

    await client
      .db()
      .collection('users')
      .updateOne(
        { _id: new ObjectId(userId), createdAt: { $exists: false } },
        { $set: { createdAt: now, updatedAt: now } }
      );
  } catch {
    // Local UI確認中は失敗しても致命エラーにしない
  }
}

export function seedMockUserProfile(input: {
  id: string;
  name: string | null | undefined;
  email: string | null | undefined;
  image: string | null | undefined;
}): void {
  if (!isMockMode()) return;

  const store = getMockStore();
  const now = new Date();

  const prev = store.get(input.id);
  store.set(input.id, {
    id: input.id,
    name: input.name ?? prev?.name ?? null,
    email: input.email ?? prev?.email ?? null,
    image: input.image ?? prev?.image ?? null,
    emailVerified: prev?.emailVerified ?? null,
    createdAt: prev?.createdAt ?? now,
    updatedAt: now
  });
}
