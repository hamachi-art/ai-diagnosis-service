import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { analyzeDiagnosis } from '@/lib/anthropic';
import { createDiagnosis, listDiagnosesByUser, validateAnswers } from '@/lib/diagnosis';

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const diagnoses = await listDiagnosesByUser(session.user.id);
  return NextResponse.json(diagnoses);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { answers?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const validated = validateAnswers(body.answers);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  try {
    const careerRoadmap = await analyzeDiagnosis(validated.answers);
    const diagnosis = await createDiagnosis({
      userId: session.user.id,
      answers: validated.answers,
      careerRoadmap
    });

    return NextResponse.json(diagnosis, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Diagnosis analysis failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
