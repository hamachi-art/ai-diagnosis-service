import { MongoClient, type MongoClientOptions } from 'mongodb';

function isMockMode(): boolean {
  return process.env.AUTH_MOCK_MODE === 'true';
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const options: MongoClientOptions = {
  // Windows 等で SRV(DNS) 解決が IPv6 優先になり失敗するケースを回避
  family: 4,
  serverSelectionTimeoutMS: 10_000,
  connectTimeoutMS: 10_000
};

function getUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    if (isMockMode()) {
      return '';
    }
    throw new Error('MONGODB_URI is not set');
  }
  return uri;
}

function createClientPromise(): Promise<MongoClient> {
  const client = new MongoClient(getUri(), options);

  return client.connect().catch((err: unknown) => {
    // 失敗した Promise をキャッシュしない（次回リクエストで再試行）
    if (process.env.NODE_ENV === 'development') {
      global._mongoClientPromise = undefined;
    } else {
      cachedPromise = undefined;
    }

    const message = err instanceof Error ? err.message : String(err);
    console.error('[mongodb] connection failed:', message);
    throw err instanceof Error ? err : new Error(message);
  });
}

let cachedPromise: Promise<MongoClient> | undefined;

/**
 * MongoDB クライアントを遅延接続で取得する。
 * モジュール読み込み時点では接続しない（未処理 rejection によるプロセス落ちを防ぐ）。
 */
function getClientPromise(): Promise<MongoClient> {
  if (isMockMode()) {
    return Promise.resolve(null as unknown as MongoClient);
  }

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      const promise = createClientPromise();
      // unhandledRejection を防ぐ（await 側では引き続き reject される）
      promise.catch(() => undefined);
      global._mongoClientPromise = promise;
    }
    return global._mongoClientPromise;
  }

  if (!cachedPromise) {
    const promise = createClientPromise();
    promise.catch(() => undefined);
    cachedPromise = promise;
  }
  return cachedPromise;
}

/** await / .then 両対応の遅延接続 Promise */
const clientPromise = {
  then<TResult1 = MongoClient, TResult2 = never>(
    onfulfilled?: ((value: MongoClient) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ) {
    return getClientPromise().then(onfulfilled, onrejected);
  },
  catch<TResult = never>(
    onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null
  ) {
    return getClientPromise().catch(onrejected);
  },
  finally(onfinally?: (() => void) | null) {
    return getClientPromise().finally(onfinally ?? undefined);
  }
} as Promise<MongoClient>;

export default clientPromise;
