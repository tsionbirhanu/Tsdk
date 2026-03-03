-- Migration 005: Donations table
-- Records every donation made by a user to a campaign

CREATE TABLE IF NOT EXISTS donations (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID          NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  campaign_id     UUID          NOT NULL REFERENCES campaigns(id) ON DELETE RESTRICT,
  amount          NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  payment_method  TEXT          NOT NULL CHECK (payment_method IN ('telebirr', 'cbe_birr', 'cash', 'other')),
  status          TEXT          NOT NULL DEFAULT 'pending'
                                CHECK (status IN ('pending', 'confirmed', 'failed')),
  transaction_ref TEXT          UNIQUE,
  is_anonymous    BOOLEAN       NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Members can see their own donations
CREATE POLICY "donations_select_own"
  ON donations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins and treasurers can see all donations
CREATE POLICY "donations_select_admin"
  ON donations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'treasurer')
    )
  );

-- Any authenticated user can insert a donation
CREATE POLICY "donations_insert_authenticated"
  ON donations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Only admins and treasurers can update donation status
CREATE POLICY "donations_update_admin"
  ON donations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'treasurer')
    )
  );

-- Trigger: auto-increment campaign amount when donation is confirmed
CREATE OR REPLACE FUNCTION handle_confirmed_donation()
RETURNS TRIGGER AS $$
BEGIN
  -- Only act when status changes TO confirmed
  IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
    PERFORM increment_campaign_amount(NEW.campaign_id, NEW.amount);
  END IF;

  -- If a confirmed donation is later marked failed, reverse the amount
  IF NEW.status = 'failed' AND OLD.status = 'confirmed' THEN
    PERFORM increment_campaign_amount(NEW.campaign_id, -NEW.amount);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_donation_status_change
  AFTER UPDATE OF status ON donations
  FOR EACH ROW
  EXECUTE FUNCTION handle_confirmed_donation();