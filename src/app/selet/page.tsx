"use client";

import React, { useState, useEffect } from "react";
import { Calendar, ChevronDown, Plus, X } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/ProgressBar";
import StatusBadge from "@/components/StatusBadge";
import { selet, churches, Selet, Church } from "@/lib/api/client";
import { useAuth } from "@/lib/api/auth-context";
import { cn } from "@/lib/utils";

const SeletPage: React.FC = () => {
  const { user } = useAuth();
  const [seletList, setSeletList] = useState<Selet[]>([]);
  const [churchList, setChurchList] = useState<Church[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showNewVowDialog, setShowNewVowDialog] = useState(false);
  const [formData, setFormData] = useState({
    church_id: "",
    description: "",
    amount: "",
    due_date: "",
    is_public: true,
  });

  // Payment state
  const [payingVow, setPayingVow] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [payError, setPayError] = useState<string | null>(null);

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  useEffect(() => {
    Promise.allSettled([selet.list(), churches.list()])
      .then(([seletResult, churchesResult]) => {
        if (seletResult.status === "fulfilled") {
          setSeletList(seletResult.value);
        } else {
          setError(seletResult.reason?.message || "Failed to load vows");
        }
        if (churchesResult.status === "fulfilled") {
          setChurchList(churchesResult.value);
        } else {
          // Churches loading failure is not critical, just log for now
          console.error("Failed to load churches:", churchesResult.reason);
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load data");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.church_id ||
      !formData.description ||
      !formData.amount ||
      !formData.due_date
    ) {
      setFormError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const newVow = await selet.create({
        church_id: formData.church_id,
        description: formData.description,
        amount: Number(formData.amount),
        due_date: formData.due_date,
        is_public: formData.is_public,
      });

      // Add to beginning of list
      setSeletList((prev) => [newVow, ...prev]);

      // Close modal and reset form
      setShowNewVowDialog(false);
      setFormData({
        church_id: "",
        description: "",
        amount: "",
        due_date: "",
        is_public: true,
      });
      setFormSuccess("Your Selet vow has been created!");

      // Clear success message after 3 seconds
      setTimeout(() => setFormSuccess(null), 3000);
    } catch (err: any) {
      setFormError(err.message || "Failed to create vow");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayVow = async (vowId: string, amount: number) => {
    setPayError(null);
    try {
      const updated = await selet.pay(vowId, amount);
      setSeletList((prev) => prev.map((v) => (v.id === vowId ? updated : v)));
      setPayingVow(null);
      setPayAmount("");

      if (updated.status === "fulfilled") {
        setFormSuccess("Selet fulfilled! Blessed! 🙏");
      } else {
        setFormSuccess("Payment recorded!");
      }

      setTimeout(() => setFormSuccess(null), 3000);
    } catch (err: any) {
      setPayError(err.message || "Payment failed");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "fulfilled":
        return "paid";
      case "active":
        return "active";
      case "partial":
        return "partial";
      case "overdue":
        return "missed";
      default:
        return "pending";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "fulfilled":
        return "Fulfilled ✓";
      case "active":
        return "Active";
      case "partial":
        return "Partial";
      case "overdue":
        return "Overdue";
      default:
        return "Pending";
    }
  };

  const getDaysRemaining = (dueDate: string) => {
    const days = Math.ceil(
      (new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    if (days > 0) return `${days} days left`;
    if (days <= 0) return "Overdue";
    return "";
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-surface)] flex">
        <Sidebar />
        <main className="flex-1 ml-72 p-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
              <p className="text-[var(--color-text-muted)]">
                Loading Selet vows...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-surface)] flex">
        <Sidebar />
        <main className="flex-1 ml-72 p-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="text-red-500 text-lg font-semibold mb-2">
                Error loading Selet vows
              </div>
              <p className="text-[var(--color-text-muted)]">{error}</p>
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
          title="Selet"
          subtitle="Your spiritual vows"
          action={
            <Button onClick={() => setShowNewVowDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Vow
            </Button>
          }
        />

        {/* Success Message */}
        {formSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 font-medium">{formSuccess}</p>
          </div>
        )}

        {/* Vow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {seletList.map((vow) => {
            const percentage =
              vow.amount > 0 ? (vow.amount_paid / vow.amount) * 100 : 0;
            const daysRemaining = getDaysRemaining(vow.due_date);
            const isOverdue = vow.status === "overdue";

            return (
              <div
                key={vow.id}
                className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-6 hover-lift">
                {/* Church Badge */}
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--color-surface-2)] text-[var(--color-text-muted)]">
                    {vow.church?.name || "Church"}
                  </span>
                </div>

                {/* Vow Description */}
                <h3 className="font-display text-lg font-semibold text-[var(--color-text)] mb-3">
                  {vow.description}
                </h3>

                {/* Progress Bar */}
                <div className="mb-4">
                  <ProgressBar
                    value={vow.amount_paid}
                    max={vow.amount}
                    size="md"
                  />
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="font-mono font-semibold text-[var(--color-text)]">
                      ETB {vow.amount_paid.toLocaleString()}
                    </span>
                    <span className="text-[var(--color-text-muted)]">
                      of ETB {vow.amount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Due Date */}
                <div className="flex items-center gap-2 mb-4 text-sm text-[var(--color-text-muted)]">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Due:{" "}
                    {new Date(vow.due_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  {!isOverdue && daysRemaining && (
                    <span className="ml-2 text-[var(--color-accent)]">
                      ({daysRemaining})
                    </span>
                  )}
                </div>

                {/* Status and Action */}
                <div className="flex items-center justify-between mb-3">
                  <StatusBadge variant={getStatusVariant(vow.status)}>
                    {getStatusText(vow.status)}
                  </StatusBadge>
                  {vow.status !== "fulfilled" && (
                    <Button
                      size="sm"
                      variant={isOverdue ? "destructive" : "default"}
                      onClick={() =>
                        setPayingVow(payingVow === vow.id ? null : vow.id)
                      }>
                      {payingVow === vow.id
                        ? "Cancel"
                        : isOverdue
                          ? "Overdue - Pay Now"
                          : "Pay Now"}
                    </Button>
                  )}
                </div>

                {/* Inline Payment Form */}
                {payingVow === vow.id && (
                  <div className="mt-4 p-4 bg-[var(--color-surface)] rounded-lg">
                    <div className="flex gap-3 flex-wrap items-end">
                      <div className="flex-1 min-w-32">
                        <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                          Amount (max: ETB{" "}
                          {(vow.amount - vow.amount_paid).toLocaleString()})
                        </label>
                        <input
                          type="number"
                          value={payAmount}
                          onChange={(e) => setPayAmount(e.target.value)}
                          max={vow.amount - vow.amount_paid}
                          placeholder="Amount to pay"
                          className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                        />
                      </div>
                      <Button
                        onClick={() => handlePayVow(vow.id, Number(payAmount))}
                        disabled={!payAmount || Number(payAmount) <= 0}
                        size="sm">
                        Confirm Payment
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setPayingVow(null);
                          setPayAmount("");
                          setPayError(null);
                        }}
                        size="sm">
                        Cancel
                      </Button>
                    </div>
                    {payError && (
                      <p className="text-sm text-red-500 mt-2">{payError}</p>
                    )}
                  </div>
                )}

                {/* Privacy Indicator */}
                <div className="text-xs text-[var(--color-text-muted)]">
                  {vow.is_public ? "🌍 Public vow" : "🔒 Private vow"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {seletList.length === 0 && (
          <div className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-surface)] flex items-center justify-center">
              <div className="text-[var(--color-primary)] opacity-50">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-6H5v-2h6V5h2v6h6v2h-6v6z" />
                </svg>
              </div>
            </div>
            <h3 className="font-display text-lg font-semibold text-[var(--color-text)] mb-2">
              You have no Selet vows yet
            </h3>
            <p className="font-body text-[var(--color-text-muted)] mb-4">
              Click New Vow to make your first spiritual commitment.
            </p>
            <Button onClick={() => setShowNewVowDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Vow
            </Button>
          </div>
        )}

        {/* New Vow Dialog */}
        {showNewVowDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-lg shadow-warm-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-semibold text-[var(--color-text)]">
                    Create New Vow
                  </h2>
                  <button
                    onClick={() => {
                      setShowNewVowDialog(false);
                      setFormError(null);
                    }}
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form Error */}
                {formError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{formError}</p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Church Select */}
                  <div>
                    <label className="block font-body font-medium text-[var(--color-text)] mb-2">
                      Church *
                    </label>
                    <div className="relative">
                      <select
                        name="church_id"
                        value={formData.church_id}
                        onChange={handleChange}
                        className="w-full px-4 py-3 pr-10 rounded-lg border border-[var(--color-border)] bg-white font-body appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                        required>
                        <option value="">Select a church</option>
                        {churchList.map((church) => (
                          <option key={church.id} value={church.id}>
                            {church.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] w-4 h-4 pointer-events-none" />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block font-body font-medium text-[var(--color-text)] mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-white font-body focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent resize-none"
                      placeholder="Describe your spiritual vow..."
                      required
                    />
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block font-body font-medium text-[var(--color-text)] mb-2">
                      Amount (ETB) *
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-white font-body focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                      placeholder="Enter vow amount"
                      required
                    />
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="block font-body font-medium text-[var(--color-text)] mb-2">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      name="due_date"
                      value={formData.due_date}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-white font-body focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Public/Private Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--color-surface)]">
                    <div>
                      <label className="font-body font-medium text-[var(--color-text)] block">
                        Make this vow public to inspire others
                      </label>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        Others can see your commitment
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_public"
                        checked={formData.is_public}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--color-accent)]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-accent)]"></div>
                    </label>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isSubmitting}>
                      {isSubmitting ? "Creating..." : "Create Vow"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowNewVowDialog(false);
                        setFormError(null);
                      }}
                      className="flex-1"
                      disabled={isSubmitting}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SeletPage;
