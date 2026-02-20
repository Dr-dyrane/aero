export const runtime = 'edge';

import { NextResponse } from 'next/server';

/**
 * POST /api/scan/complete
 * Writes scan result, triggers unlock_daily_reward() via Supabase.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, score, voiceConfidence, ppgConfidence, faceConfidence } = body;

    if (!userId || typeof score !== 'number') {
      return NextResponse.json(
        { data: null, error: 'Invalid input: userId, score required', status: 400 },
        { status: 400 }
      );
    }

    // In production: write to Supabase scans table
    // The insert triggers unlock_daily_reward() if score > 80
    const scanResult = {
      user_id: userId,
      score,
      voice_confidence: voiceConfidence ?? 0,
      ppg_confidence: ppgConfidence ?? 0,
      face_confidence: faceConfidence ?? 0,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({
      data: scanResult,
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
