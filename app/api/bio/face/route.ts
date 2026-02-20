export const runtime = 'edge';

import { NextResponse } from 'next/server';

/**
 * POST /api/bio/face
 * Accepts perfusion metrics, returns confidence score.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { perfusionIndex, oxygenEstimate } = body;

    if (typeof perfusionIndex !== 'number' || typeof oxygenEstimate !== 'number') {
      return NextResponse.json(
        { data: null, error: 'Invalid input: perfusionIndex, oxygenEstimate required', status: 400 },
        { status: 400 }
      );
    }

    // Compute face/perfusion confidence score (placeholder)
    const confidence = Math.max(0, Math.min(1, (perfusionIndex * 0.4 + oxygenEstimate / 100 * 0.6)));

    return NextResponse.json({
      data: { confidence, sensor: 'face', timestamp: new Date().toISOString() },
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
