"use client";

import React, { useState, useEffect } from "react";
import { Calendar, ChevronDown, Plus } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { gbir, users, GbirRecord, User } from "@/lib/api/client";
import { useAuth } from "@/lib/api/auth-context";

const GbirPage: React.FC = () => {
  const { user } = useAuth();
  const [gbirList, setGbirList] = useState<GbirRecord[]>([]);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    amount: "",
    due_date: "",
  });

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  useEffect(() => {
    Promise.allSettled([gbir.list(), users.me()])
      .then(([gbirResult, profileResult]) => {
        if (gbirResult.status === "fulfilled") {
          setGbirList(gbirResult.value);
        } else {
          setError(gbirResult.reason?.message || "Failed to load Gbir records");
        }
        if (profileResult.status === "fulfilled") {
          setUserProfile(profileResult.value);
        } else {
          console.error("Failed to load user profile:", profileResult.reason);
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load data");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const currentYear = new Date().getFullYear();
  const currentRecord = gbirList.find((r) => r.year === currentYear);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amount = Number(formData.amount);
    if (amount <= 0) {
      setFormError("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const record = await gbir.create({
        year: Number(formData.year),
        amount: amount,
        due_date: formData.due_date,
      });

      // Add to records list
      setGbirList((prev) => [record, ...prev]);
      setFormSuccess("Gbir registered successfully!");

      // Reset form
      setFormData({
        year: currentYear,
        amount: "",
        due_date: "",
      });

      setTimeout(() => setFormSuccess(null), 3000);
    } catch (err: any) {
      if (
        err.message.includes("duplicate") ||
        err.message.includes("already")
      ) {
        setFormError(`You already have a Gbir entry for ${formData.year}`);
      } else {
        setFormError(err.message || "Failed to register Gbir");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayInFull = async (recordId: string, remainingAmount: number) => {
    try {
      const updated = await gbir.pay(recordId, remainingAmount);
      setGbirList((prev) => prev.map((r) => (r.id === recordId ? updated : r)));
      setFormSuccess("Gbir paid! Thank you for your contribution! 🙏");
      setTimeout(() => setFormSuccess(null), 3000);
    } catch (err: any) {
      console.error("Payment failed:", err.message);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "year" || name === "amount" ? parseInt(value) || value : value,
    }));
  };

  const years = Array.from(
    { length: currentYear - 2020 + 2 },
    (_, i) => 2020 + i,
  );

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
                Loading Gbir records...
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
                Error loading Gbir records
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
          title="Annual Gbir"
          subtitle="Annual community contribution"
        />

        {/* Church Warning Banner */}
        {!userProfile?.church_id && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <span className="text-yellow-600 text-lg mr-2">⚠️</span>
              <div className="flex-1">
                <p className="text-yellow-800 font-medium">
                  You need a home church to pay Gbir.
                </p>
                <p className="text-yellow-700 text-sm">
                  Please update your profile to set your home church.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = "/profile")}
                className="border-yellow-300 text-yellow-800 hover:bg-yellow-100">
                Go to Profile →
              </Button>
            </div>
          </div>
        )}

        {/* Success Message */}
        {formSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 font-medium">{formSuccess}</p>
          </div>
        )}

        {/* Current Year Card */}
        {currentRecord ? (
          <div className="bg-white rounded-lg shadow-warm-lg border border-[var(--color-border)] p-8 mb-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--color-primary)] text-white mb-4">
                <Calendar className="w-5 h-5 mr-2" />
                <span className="font-display text-lg font-semibold">
                  Current Year
                </span>
              </div>
              <h2 className="font-display text-3xl font-bold text-[var(--color-text)] mb-2">
                Gbir {currentRecord.year}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="font-body text-sm text-[var(--color-text-muted)] mb-1">
                  Church
                </div>
                <div className="font-display text-lg font-semibold text-[var(--color-text)]">
                  {currentRecord.church?.name || "Church"}
                </div>
              </div>
              <div>
                <div className="font-body text-sm text-[var(--color-text-muted)] mb-1">
                  Contribution
                </div>
                <div className="font-mono text-xl font-bold text-[var(--color-text)] mb-1">
                  ETB {currentRecord.amount_paid.toLocaleString()}
                </div>
                <div className="font-mono text-sm text-[var(--color-text-muted)]">
                  of ETB {currentRecord.amount.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="font-body text-sm text-[var(--color-text-muted)] mb-1">
                  Status
                </div>
                <StatusBadge
                  variant={currentRecord.status === "paid" ? "paid" : "pending"}
                  className="text-base px-4 py-2">
                  {currentRecord.status === "paid" ? "Paid ✓" : "Pending"}
                </StatusBadge>
              </div>
            </div>

            {/* Progress Bar */}
            {currentRecord.amount > 0 && (
              <div className="mt-6">
                <div className="w-full bg-[var(--color-surface)] rounded-full h-3">
                  <div
                    className="bg-[var(--color-primary)] h-3 rounded-full"
                    style={{
                      width: `${Math.min((currentRecord.amount_paid / currentRecord.amount) * 100, 100)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-sm text-[var(--color-text-muted)] mt-2">
                  <span>Progress</span>
                  <span>
                    {Math.round(
                      (currentRecord.amount_paid / currentRecord.amount) * 100,
                    )}
                    %
                  </span>
                </div>
              </div>
            )}

            {/* Pay in Full Button */}
            {currentRecord.status !== "paid" && (
              <div className="text-center mt-6">
                <Button
                  onClick={() =>
                    handlePayInFull(
                      currentRecord.id,
                      currentRecord.amount - currentRecord.amount_paid,
                    )
                  }>
                  Pay in Full
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-8 text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-surface)] flex items-center justify-center">
              <Calendar className="w-8 h-8 text-[var(--color-primary)] opacity-50" />
            </div>
            <h3 className="font-display text-lg font-semibold text-[var(--color-text)] mb-2">
              No Gbir registered for {currentYear}
            </h3>
            <p className="text-[var(--color-text-muted)] mb-4">
              Register your annual community contribution for this year.
            </p>
            {userProfile?.church_id && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Register Gbir
              </Button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Register Gbir Form */}
          {userProfile?.church_id && (showForm || !currentRecord) && (
            <div className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-6">
              <h3 className="font-display text-xl font-semibold text-[var(--color-text)] mb-4">
                Register Annual Gbir
              </h3>

              {formError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{formError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-body font-medium text-[var(--color-text)] mb-2">
                    Year
                  </label>
                  <div className="relative">
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pr-10 rounded-lg border border-[var(--color-border)] bg-white font-body appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent">
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] w-4 h-4 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block font-body font-medium text-[var(--color-text)] mb-2">
                    Amount (ETB)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-white font-body focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                    placeholder="Enter contribution amount"
                    required
                  />
                </div>

                <div>
                  <label className="block font-body font-medium text-[var(--color-text)] mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-white font-body focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmitting}>
                    {isSubmitting ? "Registering..." : "Register Gbir"}
                  </Button>
                  {showForm && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowForm(false);
                        setFormError(null);
                      }}
                      className="flex-1"
                      disabled={isSubmitting}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-6">
            <h3 className="font-display text-xl font-semibold text-[var(--color-text)] mb-4">
              Gbir Overview
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-body text-[var(--color-text-muted)]">
                  Total Contributions
                </span>
                <span className="font-mono font-semibold text-[var(--color-text)]">
                  {gbirList.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body text-[var(--color-text-muted)]">
                  Total Amount
                </span>
                <span className="font-mono font-semibold text-[var(--color-text)]">
                  ETB{" "}
                  {gbirList
                    .reduce((sum, g) => sum + g.amount, 0)
                    .toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body text-[var(--color-text-muted)]">
                  Total Paid
                </span>
                <span className="font-mono font-semibold text-[var(--color-success)]">
                  ETB{" "}
                  {gbirList
                    .reduce((sum, g) => sum + g.amount_paid, 0)
                    .toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body text-[var(--color-text-muted)]">
                  Paid Contributions
                </span>
                <span className="font-mono font-semibold text-[var(--color-success)]">
                  {gbirList.filter((g) => g.status === "paid").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body text-[var(--color-text-muted)]">
                  Pending Contributions
                </span>
                <span className="font-mono font-semibold text-[var(--color-warning)]">
                  {gbirList.filter((g) => g.status === "pending").length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="mt-8 bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-6">
          <h3 className="font-display text-xl font-semibold text-[var(--color-text)] mb-6">
            Gbir History
          </h3>

          {gbirList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-surface)]">
                    <th className="text-left py-3 px-4 font-body font-semibold text-[var(--color-text)]">
                      Year
                    </th>
                    <th className="text-left py-3 px-4 font-body font-semibold text-[var(--color-text)]">
                      Church
                    </th>
                    <th className="text-left py-3 px-4 font-body font-semibold text-[var(--color-text)]">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 font-body font-semibold text-[var(--color-text)]">
                      Paid
                    </th>
                    <th className="text-left py-3 px-4 font-body font-semibold text-[var(--color-text)]">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-body font-semibold text-[var(--color-text)]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {gbirList
                    .sort((a, b) => b.year - a.year)
                    .map((record) => (
                      <tr
                        key={record.id}
                        className="border-b border-[var(--color-surface)] last:border-0">
                        <td className="py-4 px-4 font-mono font-semibold">
                          {record.year}
                        </td>
                        <td className="py-4 px-4 font-body">
                          {record.church?.name || "Church"}
                        </td>
                        <td className="py-4 px-4 font-mono font-semibold">
                          ETB {record.amount.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 font-mono font-semibold">
                          ETB {record.amount_paid.toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          <StatusBadge
                            variant={
                              record.status === "paid" ? "paid" : "pending"
                            }>
                            {record.status === "paid" ? "Paid ✓" : "Pending"}
                          </StatusBadge>
                        </td>
                        <td className="py-4 px-4">
                          {record.status === "pending" ? (
                            <Button
                              size="sm"
                              onClick={() =>
                                handlePayInFull(
                                  record.id,
                                  record.amount - record.amount_paid,
                                )
                              }>
                              Pay
                            </Button>
                          ) : (
                            <span className="text-sm text-[var(--color-text-muted)]">
                              Complete
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-[var(--color-text-muted)] opacity-50" />
              <p className="text-[var(--color-text-muted)]">
                No Gbir contributions yet
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GbirPage;
