-- Migration 004: Campaigns table
-- Fundraising campaigns created by admins under a church

CREATE TABLE IF NOT EXISTS campaigns (
  id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id      UUID          NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  title          TEXT          NOT NULL,
  description    TEXT,
  goal_amount    NUMERIC(12,2) NOT NULL CHECK (goal_amount > 0),
  current_amount NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (current_amount >= 0),
  start_date     DATE,
  end_date       DATE,
  status         TEXT          NOT NULL DEFAULT 'active'
                               CHECK (status IN ('active', 'closed', 'paused')),
  created_by     UUID          NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at     TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can view active campaigns
CREATE POLICY "campaigns_select_authenticated"
  ON campaigns FOR SELECT
  TO authenticated
  USING (true);

-- Only admins and treasurers can create campaigns
CREATE POLICY "campaigns_insert_admin"
  ON campaigns FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'treasurer')
    )
  );

-- Only admins and treasurers can update campaigns
CREATE POLICY "campaigns_update_admin"
  ON campaigns FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'treasurer')
    )
  );

-- Only admins can delete campaigns
CREATE POLICY "campaigns_delete_admin"
  ON campaigns FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- RPC function to safely increment campaign amount after a donation
-- Using a function prevents race conditions from concurrent donations
CREATE OR REPLACE FUNCTION increment_campaign_amount(
  campaign_id_input UUID,
  amount_input      NUMERIC
)
RETURNS VOID AS $$
  UPDATE campaigns
  SET current_amount = current_amount + amount_input
  WHERE id = campaign_id_input
  AND status = 'active';
$$ LANGUAGE sql SECURITY DEFINER;