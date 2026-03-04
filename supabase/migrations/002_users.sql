-- Migration 002: Users table
-- Extends Supabase auth.users with app-specific profile data

CREATE TABLE IF NOT EXISTS users (
  id                UUID          PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name         TEXT          NOT NULL,
  phone             TEXT,
  role              TEXT          NOT NULL DEFAULT 'member'
                                  CHECK (role IN ('admin', 'treasurer', 'member', 'guest')),
  preferred_language TEXT         NOT NULL DEFAULT 'am'
                                  CHECK (preferred_language IN ('am', 'or', 'en')),
  voice_enabled     BOOLEAN       NOT NULL DEFAULT false,
  profile_media_id  UUID          REFERENCES media(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own row
CREATE POLICY "users_select_own"
  ON users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Admins and treasurers can read all users
CREATE POLICY "users_select_admin"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'treasurer')
    )
  );

-- Users can update only their own row
CREATE POLICY "users_update_own"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Auto-create user profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, preferred_language)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'am')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();