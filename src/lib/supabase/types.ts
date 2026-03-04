// ─────────────────────────────────────────
// API Response Types
// ─────────────────────────────────────────

export type ApiSuccess<T> = { data: T };
export type ApiError = { error: string };
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─────────────────────────────────────────
// Database Table Types
// ─────────────────────────────────────────

export interface Media {
  id: string;
  file_url: string;
  file_type: "image" | "video" | "audio";
  storage_path: string;
  mime_type: string | null;
  size_bytes: number | null;
  uploaded_by: string | null;
  created_at: string;
}

export interface User {
  id: string;
  full_name: string;
  phone: string | null;
  role: "admin" | "treasurer" | "member" | "guest";
  preferred_language: "am" | "or" | "en";
  voice_enabled: boolean;
  profile_media_id: string | null;
  created_at: string;
}

export interface Church {
  id: string;
  name: string;
  location: string | null;
  contact_info: Record<string, unknown> | null;
  created_at: string;
}

export interface ChurchMember {
  user_id: string;
  church_id: string;
  joined_at: string;
}

export interface Campaign {
  id: string;
  church_id: string;
  title: string;
  description: string | null;
  goal_amount: number;
  current_amount: number;
  start_date: string | null;
  end_date: string | null;
  status: "active" | "closed" | "paused";
  created_by: string;
  created_at: string;
}

export interface Donation {
  id: string;
  user_id: string;
  campaign_id: string;
  amount: number;
  payment_method: "telebirr" | "cbe_birr" | "cash" | "other";
  status: "pending" | "confirmed" | "failed";
  transaction_ref: string | null;
  is_anonymous: boolean;
  created_at: string;
}

export interface AseratBekurat {
  id: string;
  user_id: string;
  month: number;
  year: number;
  amount_due: number;
  amount_paid: number;
  due_date: string;
  status: "pending" | "partial" | "paid" | "missed";
  created_at: string;
}

export interface Selet {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  amount_paid: number;
  due_date: string;
  status: "active" | "partial" | "fulfilled" | "overdue";
  is_public: boolean;
  created_at: string;
}

export interface Gbir {
  id: string;
  user_id: string;
  church_id: string;
  year: number;
  amount: number;
  amount_paid: number;
  due_date: string;
  status: "pending" | "paid" | "missed";
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type:
    | "aserat_reminder"
    | "selet_reminder"
    | "gbir_reminder"
    | "donation_confirmed"
    | "campaign_created"
    | "campaign_update"
    | "general";
  title: string;
  message: string;
  channel: "in_app" | "email" | "sms" | "push";
  is_read: boolean;
  scheduled_at: string | null;
  sent_at: string | null;
  created_at: string;
}

export interface CampaignMedia {
  id: string;
  campaign_id: string;
  media_id: string;
  is_cover: boolean;
  created_at: string;
}

export interface AICaption {
  id: string;
  campaign_id: string;
  language: "am" | "or" | "en";
  platform: "telegram" | "tiktok" | "facebook";
  tone: "formal" | "emotional" | "urgent";
  generated_text: string;
  created_by: string;
  created_at: string;
}

// ─────────────────────────────────────────
// Extended Types (with joins)
// ─────────────────────────────────────────

export interface UserWithMedia extends User {
  profile_media?: Media | null;
}
