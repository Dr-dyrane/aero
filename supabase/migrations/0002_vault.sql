-- ==========================================================================
-- AERO Pillar Migration: 0002_vault
-- Bio-Vault: endowment, balances, daily unlock logic.
-- ==========================================================================

CREATE TABLE IF NOT EXISTS vaults (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  locked_balance decimal NOT NULL DEFAULT 100.00,
  spendable_balance decimal NOT NULL DEFAULT 0.00,
  aero_score int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE vaults ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only view their own vault"
ON vaults FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own vault"
ON vaults FOR UPDATE USING (auth.uid() = user_id);

-- Auto-create vault on profile creation
CREATE OR REPLACE FUNCTION handle_new_vault()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO vaults (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_profile_created_vault
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_new_vault();

-- Unlock daily reward: $5 per verified clean day (score > 80)
-- Stability Reversion: Deduct $5 for critical instability (score <= 20)
CREATE OR REPLACE FUNCTION unlock_daily_reward()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.score > 80 THEN
    UPDATE vaults SET
      spendable_balance = spendable_balance + 5.00,
      locked_balance = GREATEST(locked_balance - 5.00, 0),
      aero_score = NEW.score,
      updated_at = now()
    WHERE user_id = NEW.user_id;
  ELSIF NEW.score <= 20 THEN
    UPDATE vaults SET
      locked_balance = locked_balance + LEAST(spendable_balance, 5.00),
      spendable_balance = GREATEST(spendable_balance - 5.00, 0),
      aero_score = NEW.score,
      updated_at = now()
    WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
