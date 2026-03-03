"use client";

import React from "react";
import {
  Heart,
  Users,
  TrendingUp,
  Calendar,
  Coins,
  Handshake,
  Plus,
  MessageSquare,
  Eye,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import {
  getAdminStats,
  mockDonations,
  mockUsers,
  getCampaignById,
} from "@/lib/mock-data";

const AdminOverviewPage: React.FC = () => {
  const adminStats = getAdminStats();
  const recentDonations = mockDonations.slice(0, 8);
  const recentMembers = mockUsers.slice(0, 4);

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex">
      <Sidebar isAdmin />

      <main className="flex-1 ml-72 p-8">
        <PageHeader
          title="Admin Panel"
          subtitle="Overview of your community platform"
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<Heart className="w-5 h-5" />}
            label="Total Raised"
            value={`ETB ${adminStats.totalRaised.toLocaleString()}`}
            trend={{ value: "+15%", type: "up" }}
            accent
          />
          <StatCard
            icon={<Users className="w-5 h-5" />}
            label="Total Donors"
            value={adminStats.totalDonors}
            trend={{ value: "+8", type: "up" }}
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Active Campaigns"
            value={adminStats.activeCampaigns}
            trend={{ value: "3 new", type: "up" }}
          />
          <StatCard
            icon={<Calendar className="w-5 h-5" />}
            label="Aserat Collected"
            value={`ETB ${adminStats.aseratCollected.toLocaleString()}`}
            trend={{ value: "This month", type: "neutral" }}
          />
          <StatCard
            icon={<Handshake className="w-5 h-5" />}
            label="Selet Total"
            value={`ETB ${adminStats.seletTotal.toLocaleString()}`}
            trend={{ value: "2 fulfilled", type: "up" }}
          />
          <StatCard
            icon={<Coins className="w-5 h-5" />}
            label="Gbir Collected"
            value={`ETB ${adminStats.gbirCollected.toLocaleString()}`}
            trend={{ value: "2024", type: "neutral" }}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-6 mb-8">
          <h2 className="font-display text-xl font-semibold text-[var(--color-text)] mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
            <Button variant="outline">
              <MessageSquare className="w-4 h-4 mr-2" />
              Generate AI Caption
            </Button>
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              View All Members
            </Button>
          </div>
        </div>

        {/* Grand Total Banner */}
        <div className="bg-[var(--color-primary)] text-white rounded-lg p-8 text-center mb-8">
          <h2 className="font-display text-3xl font-bold mb-2">
            Total Community Giving
          </h2>
          <p className="font-mono text-5xl font-bold text-[var(--color-accent)]">
            ETB 5,600,000
          </p>
          <p className="font-body text-white/80 mt-2">
            Across all donation types • Generated impact for the community
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold text-[var(--color-text)]">
                Recent Activity
              </h2>
            </div>

            <div className="space-y-4">
              {recentDonations.map((donation) => {
                const campaign = getCampaignById(donation.campaignId);
                const user = mockUsers.find((u) => u.id === donation.userId);
                return (
                  <div
                    key={donation.id}
                    className="flex items-center justify-between py-3 border-b border-[var(--color-surface)] last:border-0">
                    <div className="flex-1">
                      <p className="font-body font-medium text-[var(--color-text)] text-sm">
                        {donation.anonymous ? "Anonymous" : user?.name} donated
                        to {campaign?.title}
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
              })}
            </div>
          </div>

          {/* Recent Members */}
          <div className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold text-[var(--color-text)]">
                Recent Members
              </h2>
            </div>

            <div className="space-y-4">
              {recentMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between py-3 border-b border-[var(--color-surface)] last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-display font-semibold">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="font-body font-medium text-[var(--color-text)]">
                        {member.name}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {member.homeChurch}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusBadge
                      variant={
                        member.role === "admin"
                          ? "admin"
                          : member.role === "treasurer"
                            ? "treasurer"
                            : "member"
                      }>
                      {member.role}
                    </StatusBadge>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">
                      Joined {new Date(member.joinedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminOverviewPage;
