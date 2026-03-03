// Mock data for TSEDK - Ethiopian Orthodox Christian Platform

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  homeChurch: string;
  language: "Amharic" | "English";
  voiceEnabled: boolean;
  role: "member" | "treasurer" | "admin";
  joinedDate: string;
  avatar?: string;
}

export interface Church {
  id: string;
  name: string;
  location: string;
  established: number;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  church: string;
  goalAmount: number;
  raisedAmount: number;
  donorCount: number;
  daysLeft: number;
  status: "active" | "closed" | "upcoming";
  imageUrl: string;
  startDate: string;
  endDate: string;
}

export interface Donation {
  id: string;
  userId: string;
  campaignId: string;
  amount: number;
  anonymous: boolean;
  paymentMethod: "Telebirr" | "CBE Birr" | "Cash";
  status: "confirmed" | "pending";
  date: string;
  userName?: string;
}

export interface AseratEntry {
  id: string;
  userId: string;
  month: number;
  year: number;
  income: number;
  dueAmount: number;
  paidAmount: number;
  status: "paid" | "partial" | "missed";
  paidDate?: string;
}

export interface SeletVow {
  id: string;
  userId: string;
  church: string;
  description: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: "active" | "fulfilled" | "overdue";
  isPublic: boolean;
  createdDate: string;
}

export interface GbirContribution {
  id: string;
  userId: string;
  year: number;
  church: string;
  amount: number;
  status: "paid" | "pending";
  dueDate: string;
  paidDate?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: "payment" | "reminder" | "general";
  read: boolean;
  date: string;
  icon: string;
}

// Mock Churches
export const mockChurches: Church[] = [
  {
    id: "1",
    name: "Kidist Mariam Church",
    location: "Addis Ababa",
    established: 1886,
  },
  {
    id: "2",
    name: "Teklehaymanot Church",
    location: "Bahir Dar",
    established: 1920,
  },
  {
    id: "3",
    name: "St. Michael Church",
    location: "Gondar",
    established: 1635,
  },
  {
    id: "4",
    name: "Holy Trinity Church",
    location: "Addis Ababa",
    established: 1941,
  },
  {
    id: "5",
    name: "St. George Church",
    location: "Lalibela",
    established: 1181,
  },
];

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Tsion Gebremedhin",
    email: "tsion@example.com",
    phone: "+251911234567",
    homeChurch: "Kidist Mariam Church",
    language: "English",
    voiceEnabled: true,
    role: "member",
    joinedDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Dawit Tekle",
    email: "dawit@example.com",
    homeChurch: "Teklehaymanot Church",
    language: "Amharic",
    voiceEnabled: false,
    role: "treasurer",
    joinedDate: "2023-08-20",
  },
  {
    id: "3",
    name: "Miriam Tadesse",
    email: "miriam@example.com",
    phone: "+251922345678",
    homeChurch: "St. Michael Church",
    language: "English",
    voiceEnabled: true,
    role: "admin",
    joinedDate: "2023-05-10",
  },
  {
    id: "4",
    name: "Yosef Desta",
    email: "yosef@example.com",
    homeChurch: "Holy Trinity Church",
    language: "Amharic",
    voiceEnabled: false,
    role: "member",
    joinedDate: "2024-02-28",
  },
];

// Mock Campaigns
export const mockCampaigns: Campaign[] = [
  {
    id: "1",
    title: "St. Mary Church Restoration",
    description:
      "Help restore our beloved St. Mary Church to its former glory. The renovation includes structural repairs, roof restoration, and interior decoration to preserve this sacred space for future generations.",
    church: "Kidist Mariam Church",
    goalAmount: 50000,
    raisedAmount: 24500,
    donorCount: 48,
    daysLeft: 12,
    status: "active",
    imageUrl: "/campaign1.jpg",
    startDate: "2024-01-01",
    endDate: "2024-03-15",
  },
  {
    id: "2",
    title: "Community Water Well Project",
    description:
      "Building a clean water well to serve the church community and surrounding villages. This project will provide safe drinking water for over 500 families.",
    church: "Teklehaymanot Church",
    goalAmount: 30000,
    raisedAmount: 18750,
    donorCount: 32,
    daysLeft: 25,
    status: "active",
    imageUrl: "/campaign2.jpg",
    startDate: "2024-02-01",
    endDate: "2024-04-01",
  },
  {
    id: "3",
    title: "Children's Education Support",
    description:
      "Supporting underprivileged children in our community with school supplies, uniforms, and educational materials for the upcoming academic year.",
    church: "St. Michael Church",
    goalAmount: 15000,
    raisedAmount: 15000,
    donorCount: 28,
    daysLeft: 0,
    status: "closed",
    imageUrl: "/campaign3.jpg",
    startDate: "2023-12-01",
    endDate: "2024-02-29",
  },
  {
    id: "4",
    title: "Elder Care Program",
    description:
      "Establishing a care program for elderly members of our community, providing medical support, food assistance, and spiritual guidance.",
    church: "Holy Trinity Church",
    goalAmount: 25000,
    raisedAmount: 8900,
    donorCount: 19,
    daysLeft: 35,
    status: "active",
    imageUrl: "/campaign4.jpg",
    startDate: "2024-02-15",
    endDate: "2024-04-20",
  },
  {
    id: "5",
    title: "Youth Ministry Equipment",
    description:
      "Purchasing musical instruments, audio equipment, and educational materials for our growing youth ministry program.",
    church: "St. George Church",
    goalAmount: 12000,
    raisedAmount: 4200,
    donorCount: 15,
    daysLeft: 45,
    status: "active",
    imageUrl: "/campaign5.jpg",
    startDate: "2024-02-10",
    endDate: "2024-04-25",
  },
  {
    id: "6",
    title: "Festival Preparation Fund",
    description:
      "Preparing for the annual Timkat celebration with traditional decorations, ceremony supplies, and community feast preparations.",
    church: "Kidist Mariam Church",
    goalAmount: 20000,
    raisedAmount: 12500,
    donorCount: 35,
    daysLeft: 8,
    status: "active",
    imageUrl: "/campaign6.jpg",
    startDate: "2024-01-20",
    endDate: "2024-03-10",
  },
];

// Mock Donations
export const mockDonations: Donation[] = [
  {
    id: "1",
    userId: "1",
    campaignId: "1",
    amount: 500,
    anonymous: false,
    paymentMethod: "Telebirr",
    status: "confirmed",
    date: "2024-03-01",
    userName: "Tsion Gebremedhin",
  },
  {
    id: "2",
    userId: "2",
    campaignId: "1",
    amount: 1000,
    anonymous: true,
    paymentMethod: "CBE Birr",
    status: "confirmed",
    date: "2024-02-28",
  },
  {
    id: "3",
    userId: "1",
    campaignId: "2",
    amount: 750,
    anonymous: false,
    paymentMethod: "Cash",
    status: "pending",
    date: "2024-02-25",
    userName: "Tsion Gebremedhin",
  },
  {
    id: "4",
    userId: "4",
    campaignId: "3",
    amount: 300,
    anonymous: false,
    paymentMethod: "Telebirr",
    status: "confirmed",
    date: "2024-02-20",
    userName: "Yosef Desta",
  },
  {
    id: "5",
    userId: "3",
    campaignId: "4",
    amount: 1500,
    anonymous: false,
    paymentMethod: "CBE Birr",
    status: "confirmed",
    date: "2024-02-18",
    userName: "Miriam Tadesse",
  },
];

// Mock Aserat Entries
export const mockAseratEntries: AseratEntry[] = [
  {
    id: "1",
    userId: "1",
    month: 2,
    year: 2024,
    income: 15000,
    dueAmount: 1500,
    paidAmount: 1500,
    status: "paid",
    paidDate: "2024-02-28",
  },
  {
    id: "2",
    userId: "1",
    month: 1,
    year: 2024,
    income: 14500,
    dueAmount: 1450,
    paidAmount: 1450,
    status: "paid",
    paidDate: "2024-01-31",
  },
  {
    id: "3",
    userId: "1",
    month: 12,
    year: 2023,
    income: 16000,
    dueAmount: 1600,
    paidAmount: 800,
    status: "partial",
    paidDate: "2023-12-15",
  },
  {
    id: "4",
    userId: "2",
    month: 2,
    year: 2024,
    income: 12000,
    dueAmount: 1200,
    paidAmount: 0,
    status: "missed",
  },
  {
    id: "5",
    userId: "2",
    month: 1,
    year: 2024,
    income: 11500,
    dueAmount: 1150,
    paidAmount: 1150,
    status: "paid",
    paidDate: "2024-01-20",
  },
];

// Mock Selet Vows
export const mockSeletVows: SeletVow[] = [
  {
    id: "1",
    userId: "1",
    church: "Kidist Mariam Church",
    description: "Support for church renovation project",
    amount: 3000,
    paidAmount: 3000,
    dueDate: "2024-03-01",
    status: "fulfilled",
    isPublic: true,
    createdDate: "2023-12-01",
  },
  {
    id: "2",
    userId: "1",
    church: "Kidist Mariam Church",
    description: "Annual spiritual commitment",
    amount: 2500,
    paidAmount: 1200,
    dueDate: "2024-04-15",
    status: "active",
    isPublic: false,
    createdDate: "2024-01-10",
  },
  {
    id: "3",
    userId: "2",
    church: "Teklehaymanot Church",
    description: "Youth ministry support vow",
    amount: 1800,
    paidAmount: 0,
    dueDate: "2024-02-28",
    status: "overdue",
    isPublic: true,
    createdDate: "2023-11-15",
  },
];

// Mock Gbir Contributions
export const mockGbirContributions: GbirContribution[] = [
  {
    id: "1",
    userId: "1",
    year: 2024,
    church: "Kidist Mariam Church",
    amount: 500,
    status: "paid",
    dueDate: "2024-12-31",
    paidDate: "2024-01-15",
  },
  {
    id: "2",
    userId: "2",
    year: 2024,
    church: "Teklehaymanot Church",
    amount: 600,
    status: "pending",
    dueDate: "2024-12-31",
  },
  {
    id: "3",
    userId: "1",
    year: 2023,
    church: "Kidist Mariam Church",
    amount: 450,
    status: "paid",
    dueDate: "2023-12-31",
    paidDate: "2023-11-20",
  },
  {
    id: "4",
    userId: "3",
    year: 2024,
    church: "St. Michael Church",
    amount: 750,
    status: "paid",
    dueDate: "2024-12-31",
    paidDate: "2024-02-01",
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: "1",
    userId: "1",
    title: "Donation Confirmed",
    description:
      "Your donation of ETB 500 to St. Mary Church Restoration has been confirmed.",
    type: "payment",
    read: false,
    date: "2024-03-01",
    icon: "✓",
  },
  {
    id: "2",
    userId: "1",
    title: "Aserat Reminder",
    description: "Your March Aserat payment of ETB 1,500 is due in 5 days.",
    type: "reminder",
    read: false,
    date: "2024-02-25",
    icon: "📅",
  },
  {
    id: "3",
    userId: "1",
    title: "Campaign Update",
    description:
      "St. Mary Church Restoration campaign has reached 49% of its goal!",
    type: "general",
    read: true,
    date: "2024-02-20",
    icon: "🔔",
  },
  {
    id: "4",
    userId: "1",
    title: "Selet Vow Due",
    description: "Your spiritual vow payment is due in 3 days.",
    type: "reminder",
    read: false,
    date: "2024-02-18",
    icon: "📅",
  },
  {
    id: "5",
    userId: "1",
    title: "New Campaign",
    description: "Youth Ministry Equipment campaign has been launched!",
    type: "general",
    read: true,
    date: "2024-02-10",
    icon: "🔔",
  },
  {
    id: "6",
    userId: "1",
    title: "Payment Received",
    description: "Your Gbir contribution of ETB 500 has been processed.",
    type: "payment",
    read: true,
    date: "2024-01-15",
    icon: "✓",
  },
  {
    id: "7",
    userId: "1",
    title: "Welcome to TSEDK",
    description: "Welcome to our platform! Explore campaigns and start giving.",
    type: "general",
    read: true,
    date: "2024-01-15",
    icon: "🔔",
  },
  {
    id: "8",
    userId: "1",
    title: "Profile Updated",
    description: "Your profile information has been successfully updated.",
    type: "general",
    read: true,
    date: "2024-01-10",
    icon: "✓",
  },
];

// Helper functions
export const getCurrentUser = (): User => mockUsers[0]; // Tsion as current user

export const getCampaignById = (id: string): Campaign | undefined =>
  mockCampaigns.find((campaign) => campaign.id === id);

export const getUserDonations = (userId: string): Donation[] =>
  mockDonations.filter((donation) => donation.userId === userId);

export const getUserAseratEntries = (userId: string): AseratEntry[] =>
  mockAseratEntries.filter((entry) => entry.userId === userId);

export const getUserSeletVows = (userId: string): SeletVow[] =>
  mockSeletVows.filter((vow) => vow.userId === userId);

export const getUserGbirContributions = (userId: string): GbirContribution[] =>
  mockGbirContributions.filter(
    (contribution) => contribution.userId === userId,
  );

export const getUserNotifications = (userId: string): Notification[] =>
  mockNotifications.filter((notification) => notification.userId === userId);

export const getRecentDonors = (campaignId: string): Donation[] =>
  mockDonations
    .filter(
      (donation) =>
        donation.campaignId === campaignId && donation.status === "confirmed",
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

// Statistics for dashboard
export const getDashboardStats = (userId: string) => {
  const donations = getUserDonations(userId);
  const aseratEntries = getUserAseratEntries(userId);
  const seletVows = getUserSeletVows(userId);
  const gbirContributions = getUserGbirContributions(userId);

  const totalGiven = donations
    .filter((d) => d.status === "confirmed")
    .reduce((sum, d) => sum + d.amount, 0);

  const aseratPaid = aseratEntries.reduce(
    (sum, entry) => sum + entry.paidAmount,
    0,
  );

  const activeVows = seletVows.filter((vow) => vow.status === "active").length;

  const gbirStatus =
    gbirContributions.find((g) => g.year === 2024)?.status === "paid"
      ? "Paid"
      : "Pending";

  return {
    totalGiven,
    aseratPaid,
    activeVows,
    gbirStatus,
  };
};

// Admin statistics
export const getAdminStats = () => {
  const totalRaised = mockCampaigns.reduce((sum, c) => sum + c.raisedAmount, 0);
  const totalDonors = new Set(mockDonations.map((d) => d.userId)).size;
  const activeCampaigns = mockCampaigns.filter(
    (c) => c.status === "active",
  ).length;
  const aseratCollected = mockAseratEntries.reduce(
    (sum, e) => sum + e.paidAmount,
    0,
  );
  const seletTotal = mockSeletVows.reduce((sum, v) => sum + v.paidAmount, 0);
  const gbirCollected = mockGbirContributions
    .filter((g) => g.status === "paid")
    .reduce((sum, g) => sum + g.amount, 0);

  return {
    totalRaised,
    totalDonors,
    activeCampaigns,
    aseratCollected,
    seletTotal,
    gbirCollected,
  };
};

// AI Caption samples
export const mockAICaptions = {
  telegram_amharic_formal:
    "🙏 ቅድስት ማርያም ቤተክርሰቲያን መልሶ ግንባታ ዘመቻ ላይ እድላችሁን ተቀላቀሉ። ለቀዳሚ ቅዱሳን ቤተክርሰቲያን እንድትዘለቅ እንረዳት። ዛሬ መገልገያ አይተዋቸኹም። #ኢትዮጵያን_ኦርቶዶክስ #ስለማን_አኮራኩርት",
  telegram_english_emotional:
    "💝 Help us restore the sacred home where our ancestors prayed! St. Mary Church needs our love and support. Every birr counts in preserving our Orthodox heritage. Donate today! 🏛️✨ #EthiopianOrthodox #RestoreOurChurch",
  facebook_amharic_urgent:
    "⚠️ ላኩላኩ ጊዜ ተረፈ! ቅድስት ማርያም ቤተክርሰቲያን መልሶ ግንባታ ዘመቻ በ12 ቀናት ውስጥ ይጠናቀቃል። ኢላማችን ለማሳካት ዛሬ ተሳተፉ። 🕊️",
  tiktok_english_emotional:
    "🎬 The church that raised generations needs YOUR help! ⛪ Swipe to see the restoration progress. Drop your donation amount in comments! 👇 #ChurchRestoration #Community #Heritage",
};
