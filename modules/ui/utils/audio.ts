'use client';

/**
 * AERO Acoustic Protocol (Programmatic Audio)
 * Generates clinical, sine-based tones via Web Audio API.
 * ZERO bloat - no audio files required.
 */
class AudioProtocol {
    private ctx: AudioContext | null = null;

    private init() {
        if (!this.ctx && typeof window !== 'undefined') {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }

    private async playTone(freq: number, type: OscillatorType, duration: number, volume: number) {
        this.init();
        if (!this.ctx) return;

        if (this.ctx.state === 'suspended') {
            await this.ctx.resume();
        }

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    /** Success Chime: High-fidelity clinical ping */
    success() {
        this.playTone(880, 'sine', 0.4, 0.1);
    }

    /** Interaction: Subtle click for buttons */
    tap() {
        this.playTone(440, 'sine', 0.05, 0.05);
    }

    /** Warning: Dissonant tone for errors */
    error() {
        this.playTone(110, 'triangle', 0.5, 0.1);
    }

    /** Scan Pulse: Ethereal heartbeat */
    pulse() {
        this.playTone(60, 'sine', 0.8, 0.05);
    }
}

export const audioProtocol = new AudioProtocol();
