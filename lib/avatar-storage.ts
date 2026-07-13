import { GridFSBucket, ObjectId } from 'mongodb';

import { ALLOWED_AVATAR_TYPES, MAX_AVATAR_SIZE } from '@/lib/avatar-constants';
import clientPromise from '@/lib/mongodb';

const BUCKET_NAME = 'avatars';

export { ALLOWED_AVATAR_TYPES, MAX_AVATAR_SIZE };

function isMockMode(): boolean {
  return process.env.AUTH_MOCK_MODE === 'true';
}

function avatarFilename(userId: string): string {
  return `avatar-${userId}`;
}

declare global {
  // eslint-disable-next-line no-var
  var _mockAvatars: Map<string, { buffer: Buffer; contentType: string }> | undefined;
}

function getMockAvatarStore(): Map<string, { buffer: Buffer; contentType: string }> {
  if (!global._mockAvatars) {
    global._mockAvatars = new Map();
  }
  return global._mockAvatars;
}

async function getBucket(): Promise<GridFSBucket> {
  const client = await clientPromise;
  return new GridFSBucket(client.db(), { bucketName: BUCKET_NAME });
}

export function getAvatarUrl(userId: string): string {
  return `/api/user/avatar/${userId}`;
}

export async function saveAvatar(
  userId: string,
  buffer: Buffer,
  contentType: string
): Promise<void> {
  if (isMockMode()) {
    getMockAvatarStore().set(userId, { buffer, contentType });
    return;
  }

  const bucket = await getBucket();
  const filename = avatarFilename(userId);

  const existing = await bucket.find({ filename }).toArray();
  for (const file of existing) {
    await bucket.delete(file._id);
  }

  const uploadStream = bucket.openUploadStream(filename, {
    contentType,
    metadata: { userId }
  });

  await new Promise<void>((resolve, reject) => {
    uploadStream.on('finish', resolve);
    uploadStream.on('error', reject);
    uploadStream.end(buffer);
  });
}

export async function getAvatar(
  userId: string
): Promise<{ stream: ReadableStream<Uint8Array>; contentType: string } | null> {
  if (isMockMode()) {
    const entry = getMockAvatarStore().get(userId);
    if (!entry) return null;

    return {
      stream: new ReadableStream({
        start(controller) {
          controller.enqueue(new Uint8Array(entry.buffer));
          controller.close();
        }
      }),
      contentType: entry.contentType
    };
  }

  const bucket = await getBucket();
  const files = await bucket.find({ filename: avatarFilename(userId) }).toArray();
  const file = files[0];

  if (!file) return null;

  const nodeStream = bucket.openDownloadStream(file._id as ObjectId);
  const contentType =
    (file.contentType as string | undefined) ??
    (file.metadata as { contentType?: string } | undefined)?.contentType ??
    'application/octet-stream';

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      nodeStream.on('data', (chunk: Buffer) => controller.enqueue(new Uint8Array(chunk)));
      nodeStream.on('end', () => controller.close());
      nodeStream.on('error', (err) => controller.error(err));
    },
    cancel() {
      nodeStream.destroy();
    }
  });

  return { stream, contentType };
}

export async function deleteAvatar(userId: string): Promise<void> {
  if (isMockMode()) {
    getMockAvatarStore().delete(userId);
    return;
  }

  const bucket = await getBucket();
  const files = await bucket.find({ filename: avatarFilename(userId) }).toArray();

  for (const file of files) {
    await bucket.delete(file._id);
  }
}
