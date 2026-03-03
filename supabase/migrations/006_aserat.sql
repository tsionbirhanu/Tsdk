-- Migration 006: Aserat Bekurat table
-- Tracks monthly 10% tithe commitments per user

CREATE TABLE IF NOT EXISTS aserat_bekurat (
  id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month        INTEGER       NOT NULL CHECK (month BETWEEN 1 AND 12),
  year         INTEGER       NOT NULL CHECK (year >= 2020),
  amount_due   NUMERIC(12,2) NOT NULL CHECK (amount_due > 0),
  amount_paid  NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (amount_paid >= 0),
  due_date     DATE          NOT NULL,
  status       TEXT          NOT NULL DEFAULT 'pending'
                             CHECK (status IN ('pending', 'partial', 'paid', 'missed')),
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT now(),

  -- One record per user per month per year
  UNIQUE (user_id, month, year)
);

-- Enable RLS
ALTER TABLE aserat_bekurat ENABLE ROW LEVEL SECURITY;

-- Members can only see their own records
CREATE POLICY "aserat_select_own"
  ON aserat_bekurat FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins and treasurers can see all records
CREATE POLICY "aserat_select_admin"
  ON aserat_bekurat FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'treasurer')
    )
  );

-- Members can only insert their own records
CREATE POLICY "aserat_insert_own"
  ON aserat_bekurat FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Members can only update their own records
CREATE POLICY "aserat_update_own"
  ON aserat_bekurat FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Trigger: auto-update status when amount_paid changes
CREATE OR REPLACE FUNCTION handle_aserat_payment()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.amount_paid <= 0 THEN
    NEW.status := 'pending';
  ELSIF NEW.amount_paid >= NEW.amount_due THEN
    NEW.status := 'paid';
  ELSE
    NEW.status := 'partial';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_aserat_payment_update
  BEFORE UPDATE OF amount_paid ON aserat_bekurat
  FOR EACH ROW
  EXECUTE FUNCTION handle_aserat_payment();