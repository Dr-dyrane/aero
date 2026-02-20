export const runtime = 'edge';

import { NextResponse } from 'next/server';

/**
 * POST /api/bio/ppg
 * Accepts HRV metrics, returns confidence score.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rmssd, sdnn, meanHR } = body;

    if (typeof rmssd !== 'number' || typeof sdnn !== 'number' || typeof meanHR !== 'number') {
      return NextResponse.json(
        { data: null, error: 'Invalid input: rmssd, sdnn, meanHR required', status: 400 },
        { status: 400 }
      );
    }

    // Compute PPG confidence score (placeholder algorithm)
    const hrvScore = Math.min(1, rmssd / 100);
    const variabilityScore = Math.min(1, sdnn / 80);
    const confidence = Math.max(0, Math.min(1, (hrvScore * 0.5 + variabilityScore * 0.5)));

    return NextResponse.json({
      data: { confidence, sensor: 'ppg', timestamp: new Date().toISOString() },
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
