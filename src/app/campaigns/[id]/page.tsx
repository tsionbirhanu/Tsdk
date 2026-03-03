"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Calendar, Users, Share2, Heart } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/ProgressBar";
import StatusBadge from "@/components/StatusBadge";
import { getCampaignById, getRecentDonors } from "@/lib/mock-data";

const CampaignDetailPage: React.FC = () => {
  const params = useParams();
  const campaignId = params.id as string;
  const campaign = getCampaignById(campaignId);
  const recentDonors = getRecentDonors(campaignId);

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "Telebirr" | "CBE Birr" | "Cash"
  >("Telebirr");
  const [donateAnonymously, setDonateAnonymously] = useState(false);

  if (!campaign) {
    return (
      <div className="min-h-screen bg-[var(--color-surface)] flex">
        <Sidebar />
        <main className="flex-1 ml-72 p-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-semibold text-[var(--color-text)] mb-4">
              Campaign not found
            </h1>
            <p className="text-[var(--color-text-muted)]">
              The campaign you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const quickAmounts = [100, 500, 1000, 2500];
  const percentage = (campaign.raisedAmount / campaign.goalAmount) * 100;

  const handleDonate = () => {
    const amount = selectedAmount || parseInt(customAmount) || 0;
    if (amount > 0) {
      // Mock donation process
      alert(`Thank you for your donation of ETB ${amount.toLocaleString()}!`);
    } else {
      alert("Please select or enter a donation amount.");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex">
      <Sidebar />

      <main className="flex-1 ml-72 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Campaign Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Campaign Header */}
              <div className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] overflow-hidden">
                {/* Campaign Image */}
                <div className="relative aspect-video">
                  <div className="w-full h-full bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-2)] flex items-center justify-center">
                    <svg
                      className="w-20 h-20 text-[var(--color-primary)] opacity-20"
                      fill="currentColor"
                      viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-6H5v-2h6V5h2v6h6v2h-6v6z" />
                    </svg>
                  </div>
                  <div className="absolute top-4 right-4">
                    <StatusBadge
                      variant={
                        campaign.status === "active" ? "active" : "closed"
                      }>
                      {campaign.status}
                    </StatusBadge>
                  </div>
                </div>

                {/* Campaign Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--color-surface-2)] text-[var(--color-text-muted)]">
                      {campaign.church}
                    </span>
                  </div>

                  <h1 className="font-display text-3xl font-bold text-[var(--color-text)] mb-4">
                    {campaign.title}
                  </h1>

                  <p className="font-body text-[var(--color-text-muted)] leading-relaxed mb-6">
                    {campaign.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <ProgressBar
                      value={campaign.raisedAmount}
                      max={campaign.goalAmount}
                      size="lg"
                    />
                    <div className="flex justify-between mt-3">
                      <span className="font-mono text-xl font-bold text-[var(--color-text)]">
                        ETB {campaign.raisedAmount.toLocaleString()}
                      </span>
                      <span className="text-[var(--color-text-muted)]">
                        of ETB {campaign.goalAmount.toLocaleString()} goal
                      </span>
                    </div>
                  </div>

                  {/* Campaign Stats */}
                  <div className="flex items-center justify-between text-[var(--color-text-muted)] mb-6">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      <span>{campaign.donorCount} donors</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span>
                        {campaign.daysLeft > 0
                          ? `${campaign.daysLeft} days left`
                          : "Campaign ended"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-semibold text-[var(--color-accent)]">
                        {percentage.toFixed(0)}% complete
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Donors */}
              <div className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-6">
                <h2 className="font-display text-xl font-semibold text-[var(--color-text)] mb-4">
                  Recent Donors
                </h2>
                <div className="space-y-3">
                  {recentDonors.map((donation) => (
                    <div
                      key={donation.id}
                      className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-display font-semibold">
                          {donation.anonymous
                            ? "👤"
                            : donation.userName
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                        </div>
                        <div>
                          <p className="font-body font-medium text-[var(--color-text)]">
                            {donation.anonymous
                              ? "Anonymous Donor"
                              : donation.userName}
                          </p>
                          <p className="text-xs text-[var(--color-text-muted)]">
                            {new Date(donation.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono font-semibold text-[var(--color-text)]">
                        ETB {donation.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Donation Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-warm-lg border border-[var(--color-border)] p-6 sticky top-8">
                <h2 className="font-display text-xl font-semibold text-[var(--color-text)] mb-6">
                  Make a Donation
                </h2>

                {/* Quick Amount Buttons */}
                <div className="mb-6">
                  <label className="block font-body font-medium text-[var(--color-text)] mb-3">
                    Select Amount
                  </label>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {quickAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => {
                          setSelectedAmount(amount);
                          setCustomAmount("");
                        }}
                        className={`
                          px-4 py-3 rounded-lg border font-body font-medium transition-colors
                          ${
                            selectedAmount === amount
                              ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                              : "bg-white text-[var(--color-text)] border-[var(--color-border)] hover:border-[var(--color-accent)]"
                          }
                        `}>
                        ETB {amount}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    placeholder="Custom amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] font-body focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                  />
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <label className="block font-body font-medium text-[var(--color-text)] mb-3">
                    Payment Method
                  </label>
                  <div className="space-y-2">
                    {(["Telebirr", "CBE Birr", "Cash"] as const).map(
                      (method) => (
                        <label
                          key={method}
                          className="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface)] cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method}
                            checked={paymentMethod === method}
                            onChange={(e) =>
                              setPaymentMethod(e.target.value as any)
                            }
                            className="text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                          />
                          <span className="font-body text-[var(--color-text)]">
                            {method}
                          </span>
                        </label>
                      ),
                    )}
                  </div>
                </div>

                {/* Anonymous Donation */}
                <div className="mb-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={donateAnonymously}
                      onChange={(e) => setDonateAnonymously(e.target.checked)}
                      className="rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                    />
                    <span className="font-body text-[var(--color-text)]">
                      Donate anonymously
                    </span>
                  </label>
                </div>

                {/* Donate Button */}
                <Button
                  onClick={handleDonate}
                  className="w-full mb-4"
                  size="lg"
                  disabled={campaign.status !== "active"}>
                  {campaign.status === "active" ? (
                    <>
                      <Heart className="w-4 h-4 mr-2" />
                      Donate Now
                    </>
                  ) : (
                    "Campaign Ended"
                  )}
                </Button>

                {/* Security Note */}
                <p className="text-xs text-[var(--color-text-muted)] text-center">
                  🔒 Secure payment processing. Your donation is safe and goes
                  directly to the cause.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CampaignDetailPage;
