-- Migration 003: Churches table
-- Each church/organization is a tenant on the platform

CREATE TABLE IF NOT EXISTS churches (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT         NOT NULL,
  location     TEXT,
  contact_info JSONB,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE churches ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can view churches
CREATE POLICY "churches_select_authenticated"
  ON churches FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can create churches
CREATE POLICY "churches_insert_admin"
  ON churches FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Only admins can update churches
CREATE POLICY "churches_update_admin"
  ON churches FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Church members join table
-- Tracks which users belong to which church
CREATE TABLE IF NOT EXISTS church_members (
  user_id    UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  church_id  UUID         NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  joined_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, church_id)
);

-- Enable RLS
ALTER TABLE church_members ENABLE ROW LEVEL SECURITY;

-- Members can see their own memberships
CREATE POLICY "church_members_select_own"
  ON church_members FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can see all memberships
CREATE POLICY "church_members_select_admin"
  ON church_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'treasurer')
    )
  );

-- Admins can add members
CREATE POLICY "church_members_insert_admin"
  ON church_members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );