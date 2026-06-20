import { MongoClient } from 'mongodb';

const options = {};

function isMockMode(): boolean {
  return process.env.AUTH_MOCK_MODE === 'true';
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    // In mock mode we don't need MongoDB. Avoid crashing on module import.
    if (isMockMode()) {
      return '';
    }
    throw new Error('MONGODB_URI is not set');
  }
  return uri;
}

function createClientPromise(): Promise<MongoClient> {
  const client = new MongoClient(getUri(), options);
  return client.connect();
}

const clientPromise = isMockMode()
  ? Promise.resolve(null as unknown as MongoClient)
  : process.env.NODE_ENV === 'development'
    ? global._mongoClientPromise ?? createClientPromise()
    : createClientPromise();

if (process.env.NODE_ENV === 'development') {
  global._mongoClientPromise = clientPromise;
}

export default clientPromise;
