-- Migration 008: Notifications and AI Captions tables

-- ─────────────────────────────────────────
-- NOTIFICATIONS TABLE
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS notifications (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type         TEXT         NOT NULL CHECK (type IN (
                              'aserat_reminder',
                              'selet_reminder',
                              'gbir_reminder',
                              'donation_confirmed',
                              'campaign_created',
                              'campaign_update',
                              'general'
                            )),
  title        TEXT         NOT NULL,
  message      TEXT         NOT NULL,
  channel      TEXT         NOT NULL DEFAULT 'in_app'
                            CHECK (channel IN ('in_app', 'email', 'sms', 'push')),
  is_read      BOOLEAN      NOT NULL DEFAULT false,
  scheduled_at TIMESTAMPTZ,
  sent_at      TIMESTAMPTZ,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Members can only see their own notifications
CREATE POLICY "notifications_select_own"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Members can update their own notifications (mark as read)
CREATE POLICY "notifications_update_own"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Service role can insert notifications (used by cron jobs)
CREATE POLICY "notifications_insert_service"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Index for fast unread notification queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
  ON notifications (user_id, is_read)
  WHERE is_read = false;

-- ─────────────────────────────────────────
-- CAMPAIGN MEDIA TABLE
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS campaign_media (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID         NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  media_id    UUID         NOT NULL REFERENCES media(id) ON DELETE CASCADE,
  is_cover    BOOLEAN      NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),

  -- One cover image per campaign
  UNIQUE NULLS NOT DISTINCT (campaign_id, is_cover)
);

-- Enable RLS
ALTER TABLE campaign_media ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can view campaign media
CREATE POLICY "campaign_media_select_authenticated"
  ON campaign_media FOR SELECT
  TO authenticated
  USING (true);

-- Only admins and treasurers can attach media to campaigns
CREATE POLICY "campaign_media_insert_admin"
  ON campaign_media FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'treasurer')
    )
  );

-- ─────────────────────────────────────────
-- AI CAPTIONS TABLE
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ai_captions (
  id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id    UUID         NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  language       TEXT         NOT NULL CHECK (language IN ('am', 'or', 'en')),
  platform       TEXT         NOT NULL CHECK (platform IN ('telegram', 'tiktok', 'facebook')),
  tone           TEXT         NOT NULL CHECK (tone IN ('formal', 'emotional', 'urgent')),
  generated_text TEXT         NOT NULL,
  created_by     UUID         NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE ai_captions ENABLE ROW LEVEL SECURITY;

-- Admins and treasurers can view captions
CREATE POLICY "ai_captions_select_admin"
  ON ai_captions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'treasurer')
    )
  );

-- Admins and treasurers can generate captions
CREATE POLICY "ai_captions_insert_admin"
  ON ai_captions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'treasurer')
    )
  );