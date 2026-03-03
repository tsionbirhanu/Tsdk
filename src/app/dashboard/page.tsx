"use client";

import React from "react";
import Link from "next/link";
import {
  Heart,
  Calendar,
  Handshake,
  Coins,
  TrendingUp,
  Clock,
  Users,
  CheckCircle2,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import CampaignCard from "@/components/CampaignCard";
import NotificationItem from "@/components/NotificationItem";
import {
  getCurrentUser,
  getDashboardStats,
  getUserDonations,
  getUserNotifications,
  mockCampaigns,
  getCampaignById,
} from "@/lib/mock-data";

const DashboardPage: React.FC = () => {
  const currentUser = getCurrentUser();
  const stats = getDashboardStats(currentUser.id);
  const userDonations = getUserDonations(currentUser.id).slice(0, 5);
  const userNotifications = getUserNotifications(currentUser.id).slice(0, 3);
  const activeCampaigns = mockCampaigns
    .filter((c) => c.status === "active")
    .slice(0, 3);

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex">
      <Sidebar />

      <main className="flex-1 ml-72 p-8">
        <PageHeader
          title={`${getTimeOfDayGreeting()}, ${currentUser.name.split(" ")[0]} 👋`}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Heart className="w-5 h-5" />}
            label="Total Given"
            value={`ETB ${stats.totalGiven.toLocaleString()}`}
            trend={{ value: "+12%", type: "up" }}
            accent
          />
          <StatCard
            icon={<Calendar className="w-5 h-5" />}
            label="Aserat Paid"
            value={`ETB ${stats.aseratPaid.toLocaleString()}`}
            trend={{ value: "On track", type: "neutral" }}
          />
          <StatCard
            icon={<Handshake className="w-5 h-5" />}
            label="Active Vows"
            value={stats.activeVows}
            trend={{ value: "2 active", type: "neutral" }}
          />
          <StatCard
            icon={<Coins className="w-5 h-5" />}
            label="Gbir Status"
            value={stats.gbirStatus}
            trend={{ value: "2024", type: "up" }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Donations */}
          <div className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold text-[var(--color-text)]">
                Recent Donations
              </h2>
              <Link
                href="/donations"
                className="text-sm text-[var(--color-primary)] hover:underline font-body">
                View all
              </Link>
            </div>

            <div className="space-y-4">
              {userDonations.length > 0 ? (
                userDonations.map((donation) => {
                  const campaign = getCampaignById(donation.campaignId);
                  return (
                    <div
                      key={donation.id}
                      className="flex items-center justify-between py-3 border-b border-[var(--color-surface)] last:border-0">
                      <div className="flex-1">
                        <p className="font-body font-medium text-[var(--color-text)] text-sm">
                          {campaign?.title || "Unknown Campaign"}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {new Date(donation.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-semibold text-[var(--color-text)]">
                          ETB {donation.amount.toLocaleString()}
                        </p>
                        <StatusBadge
                          variant={
                            donation.status === "confirmed"
                              ? "confirmed"
                              : "pending"
                          }>
                          {donation.status}
                        </StatusBadge>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-[var(--color-text-muted)]">
                  <Heart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No donations yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold text-[var(--color-text)]">
                Notifications
              </h2>
              <Link
                href="/notifications"
                className="text-sm text-[var(--color-primary)] hover:underline font-body">
                View all
              </Link>
            </div>

            <div className="space-y-4">
              {userNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  className="border-0 p-0 bg-transparent"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-semibold text-[var(--color-text)]">
              Active Campaigns
            </h2>
            <Link href="/campaigns">
              <button className="text-[var(--color-primary)] hover:underline font-body font-medium">
                View all campaigns →
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} compact />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
