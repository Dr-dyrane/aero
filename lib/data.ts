import type { AeroUser, Vault, TripleCheckResult, Merit, MeritLevel } from './types';

/* ==========================================================================
   AERO Demo Data
   Used when DEMO_MODE is enabled in the store.
   Provides full app access without API keys or Supabase connection.
   ========================================================================== */

export const DEMO_USER: AeroUser = {
  id: 'demo-user-001',
  email: 'demo@aero.health',
  name: 'Aero Demo',
  avatar_url: null,
  role: 'user',
  has_baseline: true,
  created_at: '2026-02-01T00:00:00Z',
};

export const DEMO_VAULT: Vault = {
  user_id: 'demo-user-001',
  locked_balance: 75.00,
  spendable_balance: 25.00,
  aero_score: 87,
};

export const DEMO_AERO_SCORE = 87;

export const DEMO_STREAK = 5;

export const DEMO_TRIPLE_CHECK: TripleCheckResult = {
  voice: {
    sensor: 'voice',
    confidence: 0.94,
    timestamp: '2026-02-19T08:30:00Z',
  },
  ppg: {
    sensor: 'ppg',
    confidence: 0.88,
    timestamp: '2026-02-19T08:31:00Z',
  },
  face: {
    sensor: 'face',
    confidence: 0.91,
    timestamp: '2026-02-19T08:32:00Z',
  },
  overallConfidence: 0.91,
  completedAt: '2026-02-19T08:32:30Z',
};

export const DEMO_MERITS: Merit[] = [
  {
    id: 'merit-001',
    user_id: 'demo-user-001',
    level: 'bronze' as MeritLevel,
    unlocked_at: '2026-02-04T00:00:00Z',
    benefits: ['Vault Badge', 'Community Access'],
  },
  {
    id: 'merit-002',
    user_id: 'demo-user-001',
    level: 'silver' as MeritLevel,
    unlocked_at: '2026-02-11T00:00:00Z',
    benefits: ['Priority Support', 'Weekly Report'],
  },
];

export const DEMO_SCAN_HISTORY = [
  { date: '2026-02-19', score: 87, confidence: 0.91, status: 'clean' as const },
  { date: '2026-02-18', score: 85, confidence: 0.89, status: 'clean' as const },
  { date: '2026-02-17', score: 82, confidence: 0.87, status: 'clean' as const },
  { date: '2026-02-16', score: 80, confidence: 0.85, status: 'clean' as const },
  { date: '2026-02-15', score: 78, confidence: 0.84, status: 'clean' as const },
];

export const DEMO_VAULT_TRANSACTIONS = [
  { id: 'tx-001', date: '2026-02-19', amount: 5.00, type: 'unlock' as const, description: 'Daily clean reward' },
  { id: 'tx-002', date: '2026-02-18', amount: 5.00, type: 'unlock' as const, description: 'Daily clean reward' },
  { id: 'tx-003', date: '2026-02-17', amount: 5.00, type: 'unlock' as const, description: 'Daily clean reward' },
  { id: 'tx-004', date: '2026-02-16', amount: 5.00, type: 'unlock' as const, description: 'Daily clean reward' },
  { id: 'tx-005', date: '2026-02-15', amount: 5.00, type: 'unlock' as const, description: 'Daily clean reward' },
  { id: 'tx-006', date: '2026-02-01', amount: 100.00, type: 'deposit' as const, description: 'Initial endowment' },
];

export const MERIT_LEVELS = [
  { level: 'bronze' as MeritLevel, name: 'Bronze', threshold: 3, color: '#CD7F32' },
  { level: 'silver' as MeritLevel, name: 'Silver', threshold: 7, color: '#C0C0C0' },
  { level: 'gold' as MeritLevel, name: 'Gold', threshold: 14, color: '#D4AF37' },
  { level: 'platinum' as MeritLevel, name: 'Platinum', threshold: 30, color: '#E5E4E2' },
];
