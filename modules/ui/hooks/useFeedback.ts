'use client';

import { audioProtocol } from '../utils/audio';
import { hapticFeedback } from '../utils/haptics';

/**
 * useFeedback
 * Orchestrates synchronized audio and haptic feedback.
 */
export function useFeedback() {
    return {
        playSuccess: () => {
            audioProtocol.success();
            hapticFeedback.medium();
        },
        playTap: () => {
            audioProtocol.tap();
            hapticFeedback.light();
        },
        playError: () => {
            audioProtocol.error();
            hapticFeedback.heavy();
        },
        playPulse: () => {
            audioProtocol.pulse();
            hapticFeedback.light();
        }
    };
}
