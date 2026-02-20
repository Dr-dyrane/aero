/* ==========================================================================
   AERO Global Types
   ========================================================================== */

// ── Auth ─────────────────────────────────────────────────────────
export type UserRole = 'user' | 'partner' | 'admin';

export interface AeroUser {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  role: UserRole;
  has_baseline: boolean;
  created_at: string;
}

export interface AeroSession {
  user: AeroUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// ── Vault ────────────────────────────────────────────────────────
export interface Vault {
  user_id: string;
  locked_balance: number;
  spendable_balance: number;
  aero_score: number;
}

// ── Bio-Engine ───────────────────────────────────────────────────
export type SensorType = 'voice' | 'ppg' | 'face';

export interface SensorPermissions {
  microphone: PermissionState | 'unknown';
  camera: PermissionState | 'unknown';
}

export interface SensorAvailability {
  voice: boolean;
  ppg: boolean;
  face: boolean;
}

export interface BiometricResult {
  sensor: SensorType;
  confidence: number; // 0-1
  timestamp: string;
}

export interface TripleCheckResult {
  voice: BiometricResult | null;
  ppg: BiometricResult | null;
  face: BiometricResult | null;
  overallConfidence: number;
  completedAt: string | null;
}

// ── Score ────────────────────────────────────────────────────────
export interface AeroScoreInput {
  clinicalScore: number;  // Fagerstrom-like, 0-10
  biometricConfidence: number; // 0-1
}

export interface AeroScoreResult {
  score: number; // 0-100
  components: {
    clinical: number;
    biometric: number;
  };
  computedAt: string;
}

// ── Merits ───────────────────────────────────────────────────────
export type MeritLevel = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Merit {
  id: string;
  user_id: string;
  level: MeritLevel;
  unlocked_at: string;
  benefits: string[];
}

// ── History ──────────────────────────────────────────────────────
export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'unlock' | 'deposit';
  description: string;
}

export interface ScanHistoryItem {
  id: string;
  date: string;
  score: number;
  confidence: number;
  status: 'clean' | 'compromised';
}

// ── API ──────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  status: number;
}
