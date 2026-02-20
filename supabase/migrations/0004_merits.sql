-- ==========================================================================
-- AERO Pillar Migration: 0004_merits
-- Merit system: status levels with real-world benefits.
-- ==========================================================================

CREATE TABLE IF NOT EXISTS merits (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  level text NOT NULL DEFAULT 'bronze' CHECK (level IN ('bronze', 'silver', 'gold', 'platinum')),
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  benefits jsonb DEFAULT '[]'::jsonb
);

ALTER TABLE merits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own merits"
ON merits FOR SELECT USING (auth.uid() = user_id);

-- Partners and admins can manage merits
CREATE POLICY "Partners can manage merits"
ON merits FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('partner', 'admin')
  )
);

-- Index for user merit lookups
CREATE INDEX IF NOT EXISTS idx_merits_user_id ON merits(user_id);
