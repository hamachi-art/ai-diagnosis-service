import { ObjectId } from 'mongodb';

import clientPromise from '@/lib/mongodb';
import type { UserProfile } from '@/lib/user-types';

export type { UserProfile } from '@/lib/user-types';
export { getDisplayImage } from '@/lib/user-types';

function isMockMode(): boolean {
  return process.env.AUTH_MOCK_MODE === 'true';
}

declare global {
  // eslint-disable-next-line no-var
  var _mockUserProfiles: Map<string, UserProfile> | undefined;
}

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
    customImage: (doc.customImage as string | null | undefined) ?? null,
    emailVerified: (doc.emailVerified as Date | null | undefined) ?? null,
    createdAt: (doc.createdAt as Date | null | undefined) ?? null,
    updatedAt: (doc.updatedAt as Date | null | undefined) ?? null
  };
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (isMockMode()) {
    return getMockStore().get(userId) ?? null;
  }

  if (!ObjectId.isValid(userId)) {
    return null;
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
    // DB接続失敗などは「データなし」として扱う（ログイン自体は継続）
    return null;
  }
}

export async function updateUserProfile(
  userId: string,
  data: { name?: string; customImage?: string | null }
): Promise<UserProfile | null> {
  const now = new Date();

  if (isMockMode()) {
    const store = getMockStore();
    const prev = store.get(userId);

    const next: UserProfile = {
      id: userId,
      name: data.name ?? prev?.name ?? null,
      email: prev?.email ?? null,
      image: prev?.image ?? null,
      customImage: data.customImage !== undefined ? data.customImage : (prev?.customImage ?? null),
      emailVerified: prev?.emailVerified ?? null,
      createdAt: prev?.createdAt ?? now,
      updatedAt: now
    };

    store.set(userId, next);
    return next;
  }

  if (!ObjectId.isValid(userId)) {
    return null;
  }

  const $set: Record<string, unknown> = { updatedAt: now };
  if (data.name !== undefined) $set.name = data.name;
  if (data.customImage !== undefined) $set.customImage = data.customImage;

  try {
    const client = await clientPromise;

    const result = await client
      .db()
      .collection('users')
      .findOneAndUpdate(
        { _id: new ObjectId(userId) },
        {
          $set,
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

export async function updateUserAvatar(
  userId: string,
  customImage: string
): Promise<UserProfile | null> {
  return updateUserProfile(userId, { customImage });
}

export async function ensureUserTimestamps(userId: string): Promise<void> {
  if (isMockMode()) {
    return;
  }

  if (!ObjectId.isValid(userId)) {
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
    // DB接続失敗などは致命エラーにしない（ログイン自体は継続）
  }
}

/**
 * Google ログイン時に users コレクションへ upsert し、MongoDB の userId を返す。
 * MongoDB に繋がらない場合は null（呼び出し側でフォールバック ID を使う）。
 */
export async function upsertOAuthUser(input: {
  email: string;
  name?: string | null;
  image?: string | null;
  providerAccountId: string;
}): Promise<string | null> {
  if (isMockMode()) {
    const id = `mock-${input.email}`;
    seedMockUserProfile({
      id,
      name: input.name,
      email: input.email,
      image: input.image
    });
    return id;
  }

  try {
    const client = await clientPromise;
    const users = client.db().collection('users');
    const now = new Date();

    const existing = await users.findOne({ email: input.email });
    if (existing) {
      await users.updateOne(
        { _id: existing._id },
        {
          $set: {
            name: input.name ?? existing.name ?? null,
            image: input.image ?? existing.image ?? null,
            updatedAt: now
          },
          $setOnInsert: { createdAt: now }
        }
      );
      return String(existing._id);
    }

    const insertResult = await users.insertOne({
      name: input.name ?? null,
      email: input.email,
      image: input.image ?? null,
      emailVerified: now,
      createdAt: now,
      updatedAt: now
    });

    return String(insertResult.insertedId);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[user] upsertOAuthUser failed (login continues):', message);
    return null;
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
    customImage: prev?.customImage ?? null,
    emailVerified: prev?.emailVerified ?? null,
    createdAt: prev?.createdAt ?? now,
    updatedAt: now
  });
}
