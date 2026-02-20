/**
 * AERO Bio-Engine Service
 * Handles sensor data normalization and secure API communication.
 */

export interface TelemetryPacket {
    voice: number; // Normalized jitter/shimmer
    ppg: number;   // Normalized HRV/Oxygen saturation
    face: number;  // Normalized facial perfusion blood flow
}

/**
 * Normalizes raw sensor data streams into the 0.0 - 1.0 range.
 * This is the "Privacy Filter" - raw audio/video never leaves this function.
 */
export function normalizeTelemetry(raw: any): TelemetryPacket {
    // Logic: In a real app, this would involve FFT for voice and 
    // pixel-intensity analysis for PPG.
    // For the demo/sovereign prototype, we use high-fidelity simulation.
    return {
        voice: Math.min(Math.max(raw.voice || 0.5, 0), 1),
        ppg: Math.min(Math.max(raw.ppg || 0.5, 0), 1),
        face: Math.min(Math.max(raw.face || 0.5, 0), 1),
    };
}

/**
 * Local simulation of the database algorithm for Demo Mode.
 */
export function calculateAeroScoreLocal(telemetry: TelemetryPacket): { score: number; isWakeUpCall: boolean } {
    // Clinical Weight (Simulation)
    const clinicalWeight = 8.5; // High dependency simulation

    // Average calculation (Simplified for demo)
    const biometricAvg = (telemetry.voice + telemetry.ppg + telemetry.face) / 3;

    // Aero Formula: ((CW * BV) / 10.0) * 100
    const score = Math.round(((clinicalWeight * biometricAvg) / 10.0) * 100);

    return {
        score: Math.min(Math.max(score, 0), 100),
        isWakeUpCall: score <= 20
    };
}

/**
 * Communicates with the secure Edge Function to calculate the Aero Score.
 * Falls back to local logic if demoMode is enabled.
 */
export async function fetchAeroScore(userId: string, telemetry: TelemetryPacket, demoMode: boolean = false) {
    if (demoMode) {
        return calculateAeroScoreLocal(telemetry);
    }

    const response = await fetch('/api/bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, sensorData: telemetry }),
    });

    if (!response.ok) {
        throw new Error('Bio-Algorithm calculation failed');
    }

    return response.json();
}
