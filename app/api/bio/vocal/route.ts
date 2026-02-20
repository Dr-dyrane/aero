export const runtime = 'edge';

import { NextResponse } from 'next/server';

/**
 * POST /api/bio/vocal
 * Accepts local jitter metrics, returns confidence score.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jitter, shimmer, hnr } = body;

    // Validate inputs
    if (typeof jitter !== 'number' || typeof shimmer !== 'number' || typeof hnr !== 'number') {
      return NextResponse.json(
        { data: null, error: 'Invalid input: jitter, shimmer, hnr required', status: 400 },
        { status: 400 }
      );
    }

    // Compute vocal confidence score (placeholder algorithm)
    // In production: clinical-grade vocal biomarker analysis
    const confidence = Math.max(0, Math.min(1, 1 - (jitter * 0.3 + shimmer * 0.3 - hnr * 0.01)));

    return NextResponse.json({
      data: { confidence, sensor: 'voice', timestamp: new Date().toISOString() },
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
