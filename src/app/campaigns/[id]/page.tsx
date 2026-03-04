"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Calendar, Users, Share2, Heart } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/ProgressBar";
import StatusBadge from "@/components/StatusBadge";
import {
  campaigns,
  churches,
  donations,
  Campaign,
  Church,
} from "@/lib/api/client";
import { useAuth } from "@/lib/api/auth-context";

const CampaignDetailPage: React.FC = () => {
  const params = useParams();
  const campaignId = params.id as string;
  const { user } = useAuth();

  type RecentDonor = {
    id: string;
    userName: string;
    amount: number;
    date: string;
    anonymous: boolean;
  };

  // State declarations
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [churchList, setChurchList] = useState<Church[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Donation form state
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "telebirr" | "cbe_birr" | "cash" | "other"
  >("telebirr");
  const [donateAnonymously, setDonateAnonymously] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donationError, setDonationError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [recentDonors, setRecentDonors] = useState<RecentDonor[]>([]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    Promise.allSettled([
      campaigns.get(campaignId),
      churches.list(),
      donations.list(),
    ])
      .then(([campaignResult, churchesResult, donationsResult]) => {
        if (campaignResult.status === "fulfilled") {
          setCampaign(campaignResult.value);
        } else {
          setError(campaignResult.reason?.message || "Failed to load campaign");
        }
        if (churchesResult.status === "fulfilled") {
          setChurchList(churchesResult.value);
        } else {
          setError(churchesResult.reason?.message || "Failed to load churches");
        }
        if (donationsResult.status === "fulfilled") {
          // Filter to only show current user's donations for this campaign
          const myDonationsForCampaign = donationsResult.value
            .filter((donation) => donation.campaign_id === campaignId)
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
            )
            .slice(0, 8)
            .map((donation) => ({
              id: donation.id,
              userName: donation.is_anonymous
                ? "Anonymous Donor"
                : user?.full_name || "Donor",
              amount: donation.amount,
              date: donation.created_at,
              anonymous: donation.is_anonymous,
            }));
          setRecentDonors(myDonationsForCampaign);
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load data");
      })
      .finally(() => setIsLoading(false));
  }, [campaignId, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-surface)] flex">
        <Sidebar />
        <main className="flex-1 ml-72 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)] mx-auto mb-4" />
            <h1 className="font-display text-xl font-semibold text-[var(--color-text)] mb-2">
              Loading campaign...
            </h1>
          </div>
        </main>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-surface)] flex">
        <Sidebar />
        <main className="flex-1 ml-72 p-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-semibold text-[var(--color-text)] mb-4">
              Error
            </h1>
            <p className="text-[var(--color-text-muted)]">{error}</p>
          </div>
        </main>
      </div>
    );
  }
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
  const raisedAmount = campaign.current_amount ?? 0;
  const goalAmount = campaign.goal_amount ?? 0;
  const churchLabel = campaign.church?.name || "Church";
  const donorCount = campaign.donation_count ?? 0;
  const daysLeft = campaign.end_date
    ? Math.max(
        0,
        Math.ceil(
          (new Date(campaign.end_date).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : 0;
  const percentage = goalAmount > 0 ? (raisedAmount / goalAmount) * 100 : 0;

  const handleDonate = async () => {
    const donateAmount = selectedAmount || parseInt(customAmount) || 0;
    if (donateAmount <= 0) {
      setDonationError("Please enter a donation amount");
      return;
    }
    setIsSubmitting(true);
    setDonationError(null);
    try {
      await donations.create({
        campaign_id: campaignId,
        amount: donateAmount,
        payment_method: paymentMethod,
        is_anonymous: donateAnonymously,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      // Refresh campaign data
      const updatedCampaign = await campaigns.get(campaignId);
      setCampaign(updatedCampaign);
      setSelectedAmount(null);
      setCustomAmount("");
      setPaymentMethod("telebirr");
      setDonateAnonymously(false);
    } catch (err: any) {
      setDonationError(err.message || "Failed to submit donation");
    } finally {
      setIsSubmitting(false);
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
                      {churchLabel}
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
                      value={raisedAmount}
                      max={goalAmount}
                      size="lg"
                    />
                    <div className="flex justify-between mt-3">
                      <span className="font-mono text-xl font-bold text-[var(--color-text)]">
                        ETB {raisedAmount.toLocaleString()}
                      </span>
                      <span className="text-[var(--color-text-muted)]">
                        of ETB {goalAmount.toLocaleString()} goal
                      </span>
                    </div>
                  </div>

                  {/* Campaign Stats */}
                  <div className="flex items-center justify-between text-[var(--color-text-muted)] mb-6">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      <span>
                        {donorCount} donor{donorCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span>
                        {daysLeft > 0
                          ? `${daysLeft} days left`
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
                  {recentDonors.length > 0 ? (
                    recentDonors.map((donation) => (
                      <div
                        key={donation.id}
                        className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-display font-semibold">
                            {donation.anonymous
                              ? "👤"
                              : donation.userName
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")
                                  .toUpperCase()}
                          </div>
                          <div>
                            <p className="font-body font-medium text-[var(--color-text)]">
                              {donation.userName}
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
                    ))
                  ) : (
                    <p className="text-[var(--color-text-muted)] text-center py-8">
                      No donations yet. Be the first to donate!
                    </p>
                  )}
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
                    {(
                      [
                        { value: "telebirr", label: "Telebirr" },
                        { value: "cbe_birr", label: "CBE Birr" },
                        { value: "cash", label: "Cash" },
                      ] as const
                    ).map((method) => (
                      <label
                        key={method.value}
                        className="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface)] cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={paymentMethod === method.value}
                          onChange={(e) =>
                            setPaymentMethod(
                              e.target.value as typeof paymentMethod,
                            )
                          }
                          className="text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                        />
                        <span className="font-body text-[var(--color-text)]">
                          {method.label}
                        </span>
                      </label>
                    ))}
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
                  disabled={campaign.status !== "active" || isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2" />
                      Submitting...
                    </span>
                  ) : campaign.status === "active" ? (
                    <>
                      <Heart className="w-4 h-4 mr-2" />
                      Donate Now
                    </>
                  ) : (
                    "Campaign Ended"
                  )}
                </Button>
                {donationError && (
                  <p className="text-sm text-red-500 text-center mb-2">
                    {donationError}
                  </p>
                )}
                {success && (
                  <p className="text-sm text-green-600 text-center mb-2">
                    {donateAnonymously
                      ? `Thank you for your anonymous donation of ETB ${selectedAmount || parseInt(customAmount) || 0}!`
                      : `Thank you ${user?.full_name || ""} for your donation of ETB ${selectedAmount || parseInt(customAmount) || 0}!`}
                  </p>
                )}

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
