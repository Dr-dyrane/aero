-- ==========================================================================
-- AERO Pillar Migration: 0003_bio
-- Biometric scans: Triple-Check results, confidence scores.
-- ==========================================================================

CREATE TABLE IF NOT EXISTS scans (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score int NOT NULL DEFAULT 0,
  voice_confidence decimal DEFAULT 0,
  ppg_confidence decimal DEFAULT 0,
  face_confidence decimal DEFAULT 0,
  overall_confidence decimal DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own scans"
ON scans FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scans"
ON scans FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trigger: on scan insert, attempt daily reward unlock
CREATE OR REPLACE TRIGGER on_scan_complete
  AFTER INSERT ON scans
  FOR EACH ROW EXECUTE FUNCTION unlock_daily_reward();

-- Index for user scan history
CREATE INDEX IF NOT EXISTS idx_scans_user_id ON scans(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_created_at ON scans(created_at DESC);
