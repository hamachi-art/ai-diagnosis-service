import { ObjectId } from 'mongodb';

import clientPromise from '@/lib/mongodb';
import type {
  CareerRoadmap,
  Diagnosis,
  DiagnosisAnswers
} from '@/lib/diagnosis-types';

export type { CareerRoadmap, Diagnosis, DiagnosisAnswers } from '@/lib/diagnosis-types';

function isMockMode(): boolean {
  return process.env.AUTH_MOCK_MODE === 'true';
}

declare global {
  // eslint-disable-next-line no-var
  var _mockDiagnoses: Map<string, Diagnosis> | undefined;
}

function getMockStore(): Map<string, Diagnosis> {
  if (!global._mockDiagnoses) {
    global._mockDiagnoses = new Map();
  }
  return global._mockDiagnoses;
}

function mapDiagnosisDocument(doc: Record<string, unknown>): Diagnosis {
  const roadmap = (doc.careerRoadmap ?? doc.result) as CareerRoadmap;
  return {
    id: String(doc._id),
    userId: String(doc.userId),
    answers: doc.answers as DiagnosisAnswers,
    careerRoadmap: roadmap,
    result: roadmap,
    createdAt: doc.createdAt as Date,
    updatedAt: doc.updatedAt as Date
  };
}

function isValidObjectId(id: string): boolean {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
}

export function validateAnswers(
  input: unknown
): { ok: true; answers: DiagnosisAnswers } | { ok: false; error: string } {
  if (!input || typeof input !== 'object') {
    return { ok: false, error: 'answers is required' };
  }

  const raw = input as Record<string, unknown>;
  const keys = [
    'careerAptitude',
    'skills',
    'interests',
    'values',
    'workStyle'
  ] as const;

  const answers: Partial<DiagnosisAnswers> = {};

  for (const key of keys) {
    const value = raw[key];
    if (typeof value !== 'string' || !value.trim()) {
      return { ok: false, error: `${key} is required` };
    }
    answers[key] = value.trim();
  }

  return { ok: true, answers: answers as DiagnosisAnswers };
}

export function validateRoadmap(
  input: unknown
): { ok: true; roadmap: CareerRoadmap } | { ok: false; error: string } {
  if (!input || typeof input !== 'object') {
    return { ok: false, error: 'careerRoadmap is required' };
  }

  const raw = input as Record<string, unknown>;
  const keys = ['summary', 'shortTerm', 'midTerm', 'longTerm'] as const;
  const roadmap: Partial<CareerRoadmap> = {};

  for (const key of keys) {
    const value = raw[key];
    if (typeof value !== 'string' || !value.trim()) {
      return { ok: false, error: `${key} is required` };
    }
    roadmap[key] = value.trim();
  }

  return { ok: true, roadmap: roadmap as CareerRoadmap };
}

export async function createDiagnosis(input: {
  userId: string;
  answers: DiagnosisAnswers;
  careerRoadmap: CareerRoadmap;
}): Promise<Diagnosis> {
  const now = new Date();

  if (isMockMode()) {
    const id = `mock-diag-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const diagnosis: Diagnosis = {
      id,
      userId: input.userId,
      answers: input.answers,
      careerRoadmap: input.careerRoadmap,
      result: input.careerRoadmap,
      createdAt: now,
      updatedAt: now
    };
    getMockStore().set(id, diagnosis);
    return diagnosis;
  }

  const client = await clientPromise;
  const doc = {
    userId: new ObjectId(input.userId),
    answers: input.answers,
    careerRoadmap: input.careerRoadmap,
    result: input.careerRoadmap,
    createdAt: now,
    updatedAt: now
  };

  const result = await client.db().collection('diagnoses').insertOne(doc);

  return mapDiagnosisDocument({
    _id: result.insertedId,
    ...doc,
    userId: input.userId
  });
}

export async function listDiagnosesByUser(userId: string): Promise<Diagnosis[]> {
  if (isMockMode()) {
    return Array.from(getMockStore().values())
      .filter((d) => d.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  try {
    const client = await clientPromise;
    const docs = await client
      .db()
      .collection('diagnoses')
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray();

    return docs.map((doc) =>
      mapDiagnosisDocument({
        ...(doc as Record<string, unknown>),
        userId
      })
    );
  } catch {
    return [];
  }
}

export async function getDiagnosisById(
  id: string,
  userId: string
): Promise<Diagnosis | null> {
  if (isMockMode()) {
    const diagnosis = getMockStore().get(id);
    if (!diagnosis || diagnosis.userId !== userId) {
      return null;
    }
    return diagnosis;
  }

  if (!isValidObjectId(id)) {
    return null;
  }

  try {
    const client = await clientPromise;
    const doc = await client.db().collection('diagnoses').findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(userId)
    });

    if (!doc) {
      return null;
    }

    return mapDiagnosisDocument({
      ...(doc as Record<string, unknown>),
      userId
    });
  } catch {
    return null;
  }
}

export async function updateDiagnosis(
  id: string,
  userId: string,
  data: {
    answers?: DiagnosisAnswers;
    careerRoadmap?: CareerRoadmap;
  }
): Promise<Diagnosis | null> {
  const now = new Date();

  if (isMockMode()) {
    const store = getMockStore();
    const prev = store.get(id);
    if (!prev || prev.userId !== userId) {
      return null;
    }

    const roadmap = data.careerRoadmap ?? prev.careerRoadmap;
    const next: Diagnosis = {
      ...prev,
      answers: data.answers ?? prev.answers,
      careerRoadmap: roadmap,
      result: roadmap,
      updatedAt: now
    };
    store.set(id, next);
    return next;
  }

  if (!isValidObjectId(id)) {
    return null;
  }

  const $set: Record<string, unknown> = { updatedAt: now };
  if (data.answers) $set.answers = data.answers;
  if (data.careerRoadmap) {
    $set.careerRoadmap = data.careerRoadmap;
    $set.result = data.careerRoadmap;
  }

  try {
    const client = await clientPromise;
    const result = await client.db().collection('diagnoses').findOneAndUpdate(
      {
        _id: new ObjectId(id),
        userId: new ObjectId(userId)
      },
      { $set },
      { returnDocument: 'after' }
    );

    if (!result) {
      return null;
    }

    return mapDiagnosisDocument({
      ...(result as Record<string, unknown>),
      userId
    });
  } catch {
    return null;
  }
}

export async function deleteDiagnosis(
  id: string,
  userId: string
): Promise<boolean> {
  if (isMockMode()) {
    const store = getMockStore();
    const prev = store.get(id);
    if (!prev || prev.userId !== userId) {
      return false;
    }
    return store.delete(id);
  }

  if (!isValidObjectId(id)) {
    return false;
  }

  try {
    const client = await clientPromise;
    const result = await client.db().collection('diagnoses').deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(userId)
    });
    return result.deletedCount === 1;
  } catch {
    return false;
  }
}
