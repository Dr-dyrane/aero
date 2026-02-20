export const runtime = 'edge';

import { NextResponse } from 'next/server';

/**
 * POST /api/score
 * Combines clinical + biometric inputs -> AeroScore (0-100).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clinicalScore, biometricConfidence } = body;

    if (typeof clinicalScore !== 'number' || typeof biometricConfidence !== 'number') {
      return NextResponse.json(
        { data: null, error: 'Invalid input: clinicalScore, biometricConfidence required', status: 400 },
        { status: 400 }
      );
    }

    const clinicalNormalized = Math.max(0, Math.min(10, clinicalScore));
    const biometricNormalized = Math.max(0, Math.min(1, biometricConfidence));

    const clinicalComponent = (clinicalNormalized / 10) * 60;
    const biometricComponent = biometricNormalized * 40;
    const score = Math.round(clinicalComponent + biometricComponent);

    return NextResponse.json({
      data: {
        score: Math.max(0, Math.min(100, score)),
        components: {
          clinical: Math.round(clinicalComponent),
          biometric: Math.round(biometricComponent),
        },
        computedAt: new Date().toISOString(),
      },
      error: null,
      status: 200,
    });
  } catch {
    return NextResponse.json(
      { data: null, error: 'Internal server error', status: 500 },
      { status: 500 }
    );
  }
}
