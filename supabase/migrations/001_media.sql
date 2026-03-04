-- Migration 001: Media table
-- Must run first because users.profile_media_id references this table

CREATE TABLE IF NOT EXISTS media (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  file_url      TEXT          NOT NULL,
  file_type     TEXT          NOT NULL CHECK (file_type IN ('image', 'video', 'audio')),
  storage_path  TEXT          NOT NULL,
  mime_type     TEXT,
  size_bytes    BIGINT,
  uploaded_by   UUID          REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view media
CREATE POLICY "media_select_authenticated"
  ON media FOR SELECT
  TO authenticated
  USING (true);

-- Users can only insert their own media
CREATE POLICY "media_insert_own"
  ON media FOR INSERT
  TO authenticated
  WITH CHECK (uploaded_by = auth.uid());

-- Users can only delete their own media
CREATE POLICY "media_delete_own"
  ON media FOR DELETE
  TO authenticated
  USING (uploaded_by = auth.uid());