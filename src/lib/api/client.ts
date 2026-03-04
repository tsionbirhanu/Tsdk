// Central API client for TSEDK frontend
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// TypeScript interfaces
interface User {
  id: string;
  full_name: string;
  phone: string | null;
  role: "admin" | "treasurer" | "member" | "guest";
  preferred_language: "am" | "or" | "en";
  voice_enabled: boolean;
  church_id: string | null;
  profile_media_id: string | null;
  created_at: string;
}

interface Church {
  id: string;
  name: string;
  location: string | null;
  contact_info: Record<string, string> | null;
  created_at: string;
}

interface Campaign {
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
  church?: { name: string };
  donation_count?: number;
  donation_sum?: number;
  percentage_reached?: number;
}

interface Donation {
  id: string;
  user_id: string;
  campaign_id: string;
  amount: number;
  payment_method: string;
  status: string;
  transaction_ref: string | null;
  is_anonymous: boolean;
  created_at: string;
}

interface AseratRecord {
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

interface Selet {
  id: string;
  user_id: string;
  church_id: string;
  description: string;
  amount: number;
  amount_paid: number;
  due_date: string;
  status: "active" | "partial" | "fulfilled" | "overdue";
  is_public: boolean;
  created_at: string;
  church?: { name: string };
}

interface GbirRecord {
  id: string;
  user_id: string;
  church_id: string;
  year: number;
  amount: number;
  amount_paid: number;
  due_date: string;
  status: "pending" | "paid" | "missed";
  created_at: string;
  church?: { name: string };
}

interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  channel: string;
  is_read: boolean;
  scheduled_at: string | null;
  sent_at: string | null;
  created_at: string;
}

interface Media {
  id: string;
  file_url: string;
  file_type: string;
  storage_path: string;
  mime_type: string;
  size_bytes: number;
  uploaded_by: string;
  created_at: string;
}

interface Member extends User {
  church?: { id: string; name: string; location: string };
}

interface DashboardData {
  summary: {
    total_donations: number;
    total_aserat_collected: number;
    total_selet_fulfilled: number;
    total_gbir_collected: number;
    grand_total: number;
    total_donors: number;
    total_campaigns: number;
  };
  campaigns: Campaign[];
  aserat_breakdown: Record<string, number>;
  selet_breakdown: Record<string, number>;
  gbir_breakdown: Record<string, number>;
  recent_donations: Array<{
    id: string;
    amount: number;
    payment_method: string;
    created_at: string;
    full_name: string;
    campaign_title: string;
  }>;
}

interface DonationsReport {
  summary: {
    total_amount: number;
    total_count: number;
    average_amount: number;
    date_range: { start_date: string | null; end_date: string | null };
  };
  donations: Donation[];
}

interface AseratReport {
  summary: {
    year: number;
    total_due: number;
    total_collected: number;
    collection_rate: number;
    status_counts: Record<string, number>;
  };
  records: AseratRecord[];
}

interface GbirReport {
  summary: {
    year: number;
    total_expected: number;
    total_collected: number;
    compliance_rate: number;
    counts: Record<string, number>;
  };
  records: GbirRecord[];
}

interface AICaption {
  id: string;
  campaign_id: string;
  language: string;
  platform: string;
  tone: string;
  generated_text: string;
  created_by: string;
  created_at: string;
}

interface PublicStats {
  total_raised: number;
  total_campaigns: number;
  total_churches: number;
  total_members: number;
  active_campaigns: number;
}

// Custom error class
export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
  ) {
    super(message);
  }
}

// Token management
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("tsedk_token");
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("tsedk_token", token);
}

export function removeToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("tsedk_token");
}

// Base fetch function
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit & { skipAuth?: boolean },
): Promise<T> {
  const { skipAuth = false, ...requestOptions } = options || {};

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(requestOptions.headers as Record<string, string>),
  };

  if (!skipAuth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...requestOptions,
    headers,
  });

  if (!response.ok) {
    let errorMessage = "An error occurred";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }
    throw new ApiError(errorMessage, response.status);
  }

  const json = await response.json();
  return json.data;
}

// Auth API
export const auth = {
  async register(body: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    preferred_language?: string;
    church_id?: string;
  }) {
    return apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
      skipAuth: true,
    });
  },

  async login(body: {
    email: string;
    password: string;
  }): Promise<{ user: User; session: any; access_token: string }> {
    return apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
      skipAuth: true,
    });
  },

  async logout() {
    return apiFetch("/api/auth/logout", {
      method: "POST",
    });
  },

  async forgotPassword(body: { email: string }) {
    return apiFetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(body),
      skipAuth: true,
    });
  },

  async resetPassword(body: { token: string; password: string }) {
    return apiFetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(body),
      skipAuth: true,
    });
  },

  async changePassword(body: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }) {
    return apiFetch("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
};

// Users API
export const users = {
  async me(): Promise<User> {
    return apiFetch("/api/users/me");
  },

  async updateMe(body: Partial<User>): Promise<User> {
    return apiFetch("/api/users/me", {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },
};

// Churches API
export const churches = {
  async list(): Promise<Church[]> {
    return apiFetch("/api/churches");
  },

  async get(id: string): Promise<Church> {
    return apiFetch(`/api/churches/${id}`);
  },

  async create(body: Partial<Church>): Promise<Church> {
    return apiFetch("/api/churches", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async update(id: string, body: Partial<Church>): Promise<Church> {
    return apiFetch(`/api/churches/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  async delete(id: string): Promise<void> {
    return apiFetch(`/api/churches/${id}`, {
      method: "DELETE",
    });
  },
};

// Campaigns API
export const campaigns = {
  async list(params?: {
    church_id?: string;
    status?: string;
  }): Promise<Campaign[]> {
    const query = params
      ? "?" + new URLSearchParams(params as Record<string, string>).toString()
      : "";
    return apiFetch(`/api/campaigns${query}`);
  },

  async get(id: string): Promise<Campaign> {
    return apiFetch(`/api/campaigns/${id}`);
  },

  async create(body: {
    church_id: string;
    title: string;
    description?: string;
    goal_amount: number;
    start_date?: string;
    end_date?: string;
  }): Promise<Campaign> {
    return apiFetch("/api/campaigns", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async update(id: string, body: Partial<Campaign>): Promise<Campaign> {
    return apiFetch(`/api/campaigns/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  async delete(id: string): Promise<void> {
    return apiFetch(`/api/campaigns/${id}`, {
      method: "DELETE",
    });
  },
};

// Donations API
export const donations = {
  async list(): Promise<Donation[]> {
    return apiFetch("/api/donations");
  },

  async get(id: string): Promise<Donation> {
    return apiFetch(`/api/donations/${id}`);
  },

  async create(body: {
    campaign_id: string;
    amount: number;
    payment_method: string;
    is_anonymous?: boolean;
    transaction_ref?: string;
  }): Promise<Donation> {
    return apiFetch("/api/donations", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
};

// Aserat API
export const aserat = {
  async list(): Promise<AseratRecord[]> {
    return apiFetch("/api/aserat");
  },

  async get(id: string): Promise<AseratRecord> {
    return apiFetch(`/api/aserat/${id}`);
  },

  async create(body: {
    month: number;
    year: number;
    income_amount: number;
  }): Promise<AseratRecord> {
    return apiFetch("/api/aserat", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async pay(id: string, amount_paid: number): Promise<AseratRecord> {
    return apiFetch(`/api/aserat/${id}/pay`, {
      method: "POST",
      body: JSON.stringify({ amount_paid }),
    });
  },
};

// Selet API
export const selet = {
  async list(): Promise<Selet[]> {
    return apiFetch("/api/selet");
  },

  async get(id: string): Promise<Selet> {
    return apiFetch(`/api/selet/${id}`);
  },

  async listPublic(): Promise<Selet[]> {
    return apiFetch("/api/selet?public=true", { skipAuth: true });
  },

  async create(body: {
    church_id: string;
    description: string;
    amount: number;
    due_date: string;
    is_public?: boolean;
  }): Promise<Selet> {
    return apiFetch("/api/selet", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async pay(id: string, amount_paid: number): Promise<Selet> {
    return apiFetch(`/api/selet/${id}/pay`, {
      method: "POST",
      body: JSON.stringify({ amount_paid }),
    });
  },
};

// Gbir API
export const gbir = {
  async list(): Promise<GbirRecord[]> {
    return apiFetch("/api/gbir");
  },

  async get(id: string): Promise<GbirRecord> {
    return apiFetch(`/api/gbir/${id}`);
  },

  async create(body: {
    year: number;
    amount: number;
    due_date: string;
  }): Promise<GbirRecord> {
    return apiFetch("/api/gbir", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async pay(id: string, amount_paid: number): Promise<GbirRecord> {
    return apiFetch(`/api/gbir/${id}/pay`, {
      method: "POST",
      body: JSON.stringify({ amount_paid }),
    });
  },
};

// Notifications API
export const notifications = {
  async list(): Promise<Notification[]> {
    return apiFetch("/api/notifications");
  },

  async markRead(id: string): Promise<Notification> {
    return apiFetch(`/api/notifications/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ is_read: true }),
    });
  },
};

// Media API
export const media = {
  async upload(file: File, bucket = "tsedk-media"): Promise<Media> {
    const token = getToken();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", bucket);

    const response = await fetch(BASE_URL + "/api/media/upload", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        // Do NOT set Content-Type for FormData
        // browser sets it automatically with boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json();
      throw new ApiError(err.error, response.status);
    }

    const json = await response.json();
    return json.data;
  },

  async delete(id: string): Promise<void> {
    return apiFetch(`/api/media/${id}`, {
      method: "DELETE",
    });
  },
};

// Admin API
export const admin = {
  async dashboard(): Promise<DashboardData> {
    return apiFetch("/api/admin/dashboard");
  },

  async members(params?: {
    role?: string;
    church_id?: string;
    search?: string;
  }): Promise<Member[]> {
    const query = params
      ? "?" + new URLSearchParams(params as Record<string, string>).toString()
      : "";
    return apiFetch(`/api/admin/members${query}`);
  },

  async updateMemberRole(body: {
    user_id: string;
    role: string;
  }): Promise<User> {
    return apiFetch("/api/admin/members", {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  async donationsReport(params?: {
    start_date?: string;
    end_date?: string;
    campaign_id?: string;
    church_id?: string;
  }): Promise<DonationsReport> {
    const query = params
      ? "?" + new URLSearchParams(params as Record<string, string>).toString()
      : "";
    return apiFetch(`/api/admin/reports/donations${query}`);
  },

  async aseratReport(params?: {
    year?: number;
    status?: string;
    church_id?: string;
  }): Promise<AseratReport> {
    const queryParams: Record<string, string> = {};
    if (params?.year) queryParams.year = params.year.toString();
    if (params?.status) queryParams.status = params.status;
    if (params?.church_id) queryParams.church_id = params.church_id;

    const query = Object.keys(queryParams).length
      ? "?" + new URLSearchParams(queryParams).toString()
      : "";
    return apiFetch(`/api/admin/reports/aserat${query}`);
  },

  async gbirReport(params?: {
    year?: number;
    church_id?: string;
    status?: string;
  }): Promise<GbirReport> {
    const queryParams: Record<string, string> = {};
    if (params?.year) queryParams.year = params.year.toString();
    if (params?.status) queryParams.status = params.status;
    if (params?.church_id) queryParams.church_id = params.church_id;

    const query = Object.keys(queryParams).length
      ? "?" + new URLSearchParams(queryParams).toString()
      : "";
    return apiFetch(`/api/admin/reports/gbir${query}`);
  },
};

// AI API
export const ai = {
  async generateCaption(body: {
    campaign_id: string;
    platform: string;
    language: string;
    tone: string;
  }): Promise<AICaption> {
    return apiFetch("/api/ai/captions", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async chat(body: {
    message: string;
    language?: string;
    history?: Array<{
      role: "user" | "model";
      parts: Array<{ text: string }>;
    }>;
  }): Promise<{ reply: string; language: string }> {
    return apiFetch("/api/ai/assistant", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
};

// Public API
export const publicApi = {
  async stats(): Promise<PublicStats> {
    return apiFetch("/api/public/stats", { skipAuth: true });
  },

  async campaigns(params?: {
    limit?: number;
    status?: string;
  }): Promise<Campaign[]> {
    const queryParams: Record<string, string> = {};
    if (params?.limit) queryParams.limit = params.limit.toString();
    if (params?.status) queryParams.status = params.status;

    const query = Object.keys(queryParams).length
      ? "?" + new URLSearchParams(queryParams).toString()
      : "";
    return apiFetch(`/api/public/campaigns${query}`, { skipAuth: true });
  },
};

// Export types
export type {
  User,
  Church,
  Campaign,
  Donation,
  AseratRecord,
  Selet,
  GbirRecord,
  Notification,
  Media,
  Member,
  DashboardData,
  DonationsReport,
  AseratReport,
  GbirReport,
  AICaption,
  PublicStats,
};
