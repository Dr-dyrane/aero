import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * AERO Bio-Algorithm API
 * Handles biometric data normalization and triggers the secure calculation RPC.
 */
export async function POST(req: NextRequest) {
    // Initialize Supabase inside the handler to prevent build-time failures
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('[Bio-Algorithm] Supabase credentials missing from environment');
        return NextResponse.json({ error: 'System Configuration Error' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { userId, sensorData } = await req.json();

        if (!userId || !sensorData) {
            return NextResponse.json({ error: 'Missing telemetry' }, { status: 400 });
        }

        // 1. Log Raw Telemetry (Privacy Shield: Only normalized values are logged)
        const logs = [
            { user_id: userId, sensor_type: 'voice', sensor_value: sensorData.voice },
            { user_id: userId, sensor_type: 'ppg', sensor_value: sensorData.ppg },
            { user_id: userId, sensor_type: 'face', sensor_value: sensorData.face }
        ];

        const { error: logError } = await supabase.from('bio_logs').insert(logs);
        if (logError) throw logError;

        // 2. Trigger Sovereign Calculation via RPC
        const { data: score, error: calcError } = await supabase.rpc('calculate_aero_score', { p_user_id: userId });
        if (calcError) throw calcError;

        // 3. Return the hard truth
        return NextResponse.json({
            score,
            isWakeUpCall: score <= 20,
            timestamp: new Date().toISOString()
        });

    } catch (err: any) {
        console.error('[Bio-Algorithm Error]:', err.message);
        return NextResponse.json({ error: 'Protocol Failure' }, { status: 500 });
    }
}
