import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import {
  deleteDiagnosis,
  getDiagnosisById,
  updateDiagnosis,
  validateAnswers,
  validateRoadmap,
  type CareerRoadmap,
  type DiagnosisAnswers
} from '@/lib/diagnosis';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const diagnosis = await getDiagnosisById(id, session.user.id);

  if (!diagnosis) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(diagnosis);
}

export async function PUT(request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;

  let body: {
    answers?: unknown;
    careerRoadmap?: unknown;
    result?: unknown;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const updateData: {
    answers?: DiagnosisAnswers;
    careerRoadmap?: CareerRoadmap;
  } = {};

  if (body.answers !== undefined) {
    const validated = validateAnswers(body.answers);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }
    updateData.answers = validated.answers;
  }

  const roadmapInput = body.careerRoadmap ?? body.result;
  if (roadmapInput !== undefined) {
    const validated = validateRoadmap(roadmapInput);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }
    updateData.careerRoadmap = validated.roadmap;
  }

  if (!updateData.answers && !updateData.careerRoadmap) {
    return NextResponse.json(
      { error: 'answers or careerRoadmap is required' },
      { status: 400 }
    );
  }

  const diagnosis = await updateDiagnosis(id, session.user.id, updateData);

  if (!diagnosis) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(diagnosis);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const deleted = await deleteDiagnosis(id, session.user.id);

  if (!deleted) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
