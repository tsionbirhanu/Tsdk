"use client";

import React, { useEffect, useState } from "react";
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
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/api/auth-context";
import {
  donations,
  campaigns,
  notifications,
  aserat,
  gbir,
  selet,
} from "@/lib/api/client";
import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import CampaignCard from "@/components/CampaignCard";
import NotificationItem from "@/components/NotificationItem";

interface DashboardData {
  myDonations: any[];
  activeCampaigns: any[];
  notificationsList: any[];
  aseratList: any[];
  gbirList: any[];
  seletList: any[];
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData>({
    myDonations: [],
    activeCampaigns: [],
    notificationsList: [],
    aseratList: [],
    gbirList: [],
    seletList: [],
  });

  // Helper functions
  const formatETB = (amount: number) => "ETB " + amount.toLocaleString();

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return mins + " minutes ago";
    const hours = Math.floor(mins / 60);
    if (hours < 24) return hours + " hours ago";
    const days = Math.floor(hours / 24);
    return days + " days ago";
  };

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Fetch all data in parallel
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [
          donationsResult,
          campaignsResult,
          notificationsResult,
          aseratResult,
          gbirResult,
          seletResult,
        ] = await Promise.allSettled([
          donations.list(),
          campaigns.list(), // Fetch ALL campaigns
          notifications.list(),
          aserat.list(),
          gbir.list(),
          selet.list(),
        ]);

        // Extract values safely
        const myDonations =
          donationsResult.status === "fulfilled" ? donationsResult.value : [];
        const allCampaigns =
          campaignsResult.status === "fulfilled" ? campaignsResult.value : [];
        const activeCampaigns = allCampaigns.filter(
          (c) => c.status === "active",
        );
        const notificationsList =
          notificationsResult.status === "fulfilled"
            ? notificationsResult.value
            : [];
        const aseratList =
          aseratResult.status === "fulfilled" ? aseratResult.value : [];
        const gbirList =
          gbirResult.status === "fulfilled" ? gbirResult.value : [];
        const seletList =
          seletResult.status === "fulfilled" ? seletResult.value : [];

        setData({
          myDonations,
          activeCampaigns,
          notificationsList,
          aseratList,
          gbirList,
          seletList,
        });

        // Check if all requests failed
        const allFailed = [
          donationsResult,
          campaignsResult,
          notificationsResult,
          aseratResult,
          gbirResult,
          seletResult,
        ].every((result) => result.status === "rejected");

        if (allFailed) {
          setError("Failed to load dashboard. Please refresh the page.");
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Calculate summary stats
  const totalGiven = data.myDonations
    .filter((donation) => donation.status === "confirmed")
    .reduce((sum, donation) => sum + donation.amount, 0);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const currentAseratRecord = data.aseratList.find(
    (record) => record.month === currentMonth && record.year === currentYear,
  );
  const aseratStatus = currentAseratRecord
    ? currentAseratRecord.status
    : "Not Started";

  const activeSelet = data.seletList.filter(
    (selet) => selet.status === "active" || selet.status === "partial",
  ).length;

  const currentGbirRecord = data.gbirList.find(
    (record) => record.year === currentYear,
  );
  const gbirStatus = currentGbirRecord
    ? currentGbirRecord.status
    : "Not Registered";

  // Loading skeleton components
  const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-8 h-8 bg-gray-200 rounded"></div>
        <div className="w-16 h-4 bg-gray-200 rounded"></div>
      </div>
      <div className="w-24 h-6 bg-gray-200 rounded mb-2"></div>
      <div className="w-20 h-4 bg-gray-200 rounded"></div>
    </div>
  );

  const SkeletonTable = () => (
    <div className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-6">
      <div className="w-32 h-6 bg-gray-200 rounded mb-6"></div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex justify-between items-center py-3">
            <div>
              <div className="w-32 h-4 bg-gray-200 rounded mb-2"></div>
              <div className="w-20 h-3 bg-gray-200 rounded"></div>
            </div>
            <div className="text-right">
              <div className="w-16 h-4 bg-gray-200 rounded mb-2"></div>
              <div className="w-12 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SkeletonCampaign = () => (
    <div className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-6 animate-pulse">
      <div className="w-full h-32 bg-gray-200 rounded mb-4"></div>
      <div className="w-3/4 h-5 bg-gray-200 rounded mb-2"></div>
      <div className="w-1/2 h-4 bg-gray-200 rounded mb-4"></div>
      <div className="w-full h-2 bg-gray-200 rounded mb-2"></div>
      <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
    </div>
  );

  if (error && !isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-surface)] flex">
        <Sidebar />
        <main className="flex-1 ml-72 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Heart className="w-12 h-12 mx-auto mb-4 text-red-400" />
              <p className="text-xl text-[var(--color-text)]">{error}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex">
      <Sidebar />

      <main className="flex-1 ml-72 p-8">
        <PageHeader
          title={`${getTimeOfDayGreeting()}, ${user?.full_name?.split(" ")[0] || "Friend"} 👋`}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <StatCard
                icon={<Heart className="w-5 h-5" />}
                label="Total Given"
                value={formatETB(totalGiven)}
                trend={{ value: "+12%", type: "up" }}
                accent
              />
              <StatCard
                icon={<Calendar className="w-5 h-5" />}
                label="Aserat Status"
                value={
                  aseratStatus === "Not Started" ? "Not Started" : aseratStatus
                }
                trend={{
                  value: aseratStatus === "paid" ? "On track" : aseratStatus,
                  type: aseratStatus === "paid" ? "up" : "neutral",
                }}
              />
              <StatCard
                icon={<Handshake className="w-5 h-5" />}
                label="Selet Active"
                value={activeSelet.toString()}
                trend={{ value: `${activeSelet} active`, type: "neutral" }}
              />
              <StatCard
                icon={<Coins className="w-5 h-5" />}
                label="Gbir Status"
                value={
                  gbirStatus === "Not Registered"
                    ? "Not Registered"
                    : gbirStatus
                }
                trend={{ value: currentYear.toString(), type: "up" }}
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Donations */}
          {isLoading ? (
            <SkeletonTable />
          ) : (
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
                {data.myDonations.length > 0 ? (
                  data.myDonations.slice(0, 5).map((donation) => {
                    const title =
                      donation.campaign?.title ?? "Unknown Campaign";
                    return (
                      <div
                        key={donation.id}
                        className="flex items-center justify-between py-3 border-b border-[var(--color-surface)] last:border-0">
                        <div className="flex-1">
                          <p className="font-body font-medium text-[var(--color-text)] text-sm">
                            {title}
                          </p>
                          <p className="text-xs text-[var(--color-text-muted)]">
                            {new Date(donation.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-semibold text-[var(--color-text)]">
                            {formatETB(donation.amount)}
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
          )}

          {/* Recent Notifications */}
          {isLoading ? (
            <SkeletonTable />
          ) : (
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
                {data.notificationsList.slice(0, 3).map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-[var(--color-surface)] transition-colors">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notification.is_read ? "bg-gray-300" : "bg-[var(--color-primary)]"}`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-medium text-[var(--color-text)] text-sm truncate">
                        {notification.title}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">
                        {notification.message.length > 80
                          ? notification.message.substring(0, 80) + "..."
                          : notification.message}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-2">
                        {timeAgo(notification.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
                {data.notificationsList.length === 0 && (
                  <div className="text-center py-8 text-[var(--color-text-muted)]">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No notifications</p>
                  </div>
                )}
              </div>
            </div>
          )}
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
            {isLoading ? (
              <>
                <SkeletonCampaign />
                <SkeletonCampaign />
                <SkeletonCampaign />
              </>
            ) : data.activeCampaigns.length > 0 ? (
              data.activeCampaigns.slice(0, 3).map((campaign) => {
                const percentage =
                  campaign.goal_amount > 0
                    ? (campaign.current_amount / campaign.goal_amount) * 100
                    : 0;
                const cappedPercentage = Math.min(percentage, 100);
                const displayPercentage =
                  percentage === 0
                    ? "0%"
                    : percentage < 1
                      ? "< 1%"
                      : percentage.toFixed(1) + "%";

                return (
                  <div
                    key={campaign.id}
                    className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] overflow-hidden">
                    <div className="p-6">
                      <h3 className="font-display text-lg font-semibold text-[var(--color-text)] mb-2">
                        {campaign.title}
                      </h3>
                      <p className="text-sm text-[var(--color-text-muted)] mb-4">
                        {campaign.church?.name || "Unknown Church"}
                      </p>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-[var(--color-text-muted)] mb-2">
                          <span>{displayPercentage} raised</span>
                          <span>
                            {formatETB(campaign.current_amount)} of{" "}
                            {formatETB(campaign.goal_amount)}
                          </span>
                        </div>
                        <div className="w-full bg-[var(--color-surface)] rounded-full h-2">
                          <div
                            className="bg-[var(--color-primary)] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${cappedPercentage}%` }}></div>
                        </div>
                      </div>

                      <Link href={`/campaigns/${campaign.id}`}>
                        <button className="w-full bg-[var(--color-primary)] text-white py-2 px-4 rounded-lg font-body font-medium hover:bg-[var(--color-primary)]/90 transition-colors">
                          Donate
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12 text-[var(--color-text-muted)]">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-xl font-display">No active campaigns</p>
                <p>New campaigns will appear here when they're launched.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
