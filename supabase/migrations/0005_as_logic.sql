-- ==========================================================================
-- AERO Pillar Migration: 0005_as_logic
-- Implementation of the Aero Score calculation algorithm.
-- ==========================================================================

-- 1. Add Clinical Weight to Profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS fagerstrom_weight float DEFAULT 1.0;

-- 2. Create Biometric Logs for individual sensor telemetry
CREATE TABLE IF NOT EXISTS bio_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sensor_type text NOT NULL CHECK (sensor_type IN ('voice', 'ppg', 'face')),
  sensor_value float NOT NULL, -- Normalized 0.0 to 1.0
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE bio_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bio logs"
ON bio_logs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bio logs"
ON bio_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. The Aero Score Algorithm
-- Combines Clinical Weighted Baseline (CW) with Real-time Biometric Variance (BV)
CREATE OR REPLACE FUNCTION calculate_aero_score(p_user_id uuid)
RETURNS int AS $$
DECLARE
  v_clinical_weight float;
  v_biometric_avg float;
  v_final_score int;
BEGIN
  -- Fetch clinical weights from user profile (Gold standard anchor)
  SELECT fagerstrom_weight INTO v_clinical_weight 
  FROM profiles 
  WHERE id = p_user_id;
  
  -- Fallback if not set
  IF v_clinical_weight IS NULL THEN
    v_clinical_weight := 1.0;
  END IF;

  -- Calculate average of last 9 biometric logs (3 triple-checks equivalent)
  -- This provides a dampened, stable representation of physiological state
  SELECT AVG(sensor_value) INTO v_biometric_avg 
  FROM (
    SELECT sensor_value 
    FROM bio_logs 
    WHERE user_id = p_user_id 
    ORDER BY created_at DESC 
    LIMIT 9
  ) as last_logs;

  -- Fallback if no logs exist
  IF v_biometric_avg IS NULL THEN
    v_biometric_avg := 0.5;
  END IF;

  -- The Aero Formula: ((CW * BV) / 10.0) * 100
  -- We normalize to 0-100 for user visibility
  v_final_score := ROUND(((v_clinical_weight * v_biometric_avg) / 10.0) * 100);
  
  -- Guard rails
  IF v_final_score > 100 THEN v_final_score := 100; END IF;
  IF v_final_score < 0 THEN v_final_score := 0; END IF;

  RETURN v_final_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
