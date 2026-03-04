-- Migration 007: Selet and Gbir tables
-- Selet: spiritual monetary vows with deadlines
-- Gbir: annual community contribution per user

-- ─────────────────────────────────────────
-- SELET TABLE
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS selet (
  id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  description  TEXT          NOT NULL,
  amount       NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  amount_paid  NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (amount_paid >= 0),
  due_date     DATE          NOT NULL,
  status       TEXT          NOT NULL DEFAULT 'active'
                             CHECK (status IN ('active', 'partial', 'fulfilled', 'overdue')),
  is_public    BOOLEAN       NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE selet ENABLE ROW LEVEL SECURITY;

-- Members can see their own selet
CREATE POLICY "selet_select_own"
  ON selet FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Public selet visible to all authenticated users
CREATE POLICY "selet_select_public"
  ON selet FOR SELECT
  TO authenticated
  USING (is_public = true);

-- Admins and treasurers can see all selet
CREATE POLICY "selet_select_admin"
  ON selet FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'treasurer')
    )
  );

-- Members can only insert their own selet
CREATE POLICY "selet_insert_own"
  ON selet FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Members can only update their own selet
CREATE POLICY "selet_update_own"
  ON selet FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Trigger: auto-update selet status when amount_paid changes
CREATE OR REPLACE FUNCTION handle_selet_payment()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.amount_paid <= 0 THEN
    NEW.status := 'active';
  ELSIF NEW.amount_paid >= NEW.amount THEN
    NEW.status := 'fulfilled';
  ELSE
    NEW.status := 'partial';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_selet_payment_update
  BEFORE UPDATE OF amount_paid ON selet
  FOR EACH ROW
  EXECUTE FUNCTION handle_selet_payment();

-- ─────────────────────────────────────────
-- GBIR TABLE
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS gbir (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  church_id   UUID          NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  year        INTEGER       NOT NULL CHECK (year >= 2020),
  amount      NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  amount_paid NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (amount_paid >= 0),
  due_date    DATE          NOT NULL,
  status      TEXT          NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending', 'paid', 'missed')),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),

  -- One gbir record per user per year per church
  UNIQUE (user_id, church_id, year)
);

-- Enable RLS
ALTER TABLE gbir ENABLE ROW LEVEL SECURITY;

-- Members can see their own gbir records
CREATE POLICY "gbir_select_own"
  ON gbir FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins and treasurers can see all gbir records
CREATE POLICY "gbir_select_admin"
  ON gbir FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'treasurer')
    )
  );

-- Members can insert their own gbir
CREATE POLICY "gbir_insert_own"
  ON gbir FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Members can update their own gbir
CREATE POLICY "gbir_update_own"
  ON gbir FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Trigger: auto-update gbir status when amount_paid changes
CREATE OR REPLACE FUNCTION handle_gbir_payment()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.amount_paid >= NEW.amount THEN
    NEW.status := 'paid';
  ELSE
    NEW.status := 'pending';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_gbir_payment_update
  BEFORE UPDATE OF amount_paid ON gbir
  FOR EACH ROW
  EXECUTE FUNCTION handle_gbir_payment();