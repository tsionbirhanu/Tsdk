"use client";

import React, { useState } from "react";
import { Calendar, ChevronDown, Plus } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { getCurrentUser, getUserGbirContributions } from "@/lib/mock-data";

const GbirPage: React.FC = () => {
  const currentUser = getCurrentUser();
  const gbirContributions = getUserGbirContributions(currentUser.id);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    amount: "",
    dueDate: "",
  });

  const currentYearContribution = gbirContributions.find(
    (g) => g.year === new Date().getFullYear(),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount && formData.dueDate) {
      alert(
        `Gbir registered successfully! Year: ${formData.year}, Amount: ETB ${parseInt(formData.amount).toLocaleString()}`,
      );
      setShowForm(false);
      setFormData({ year: new Date().getFullYear(), amount: "", dueDate: "" });
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
    { length: 10 },
    (_, i) => new Date().getFullYear() + i,
  );

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex">
      <Sidebar />

      <main className="flex-1 ml-72 p-8">
        <PageHeader
          title="Annual Gbir"
          subtitle="Annual community contribution"
        />

        {/* Current Year Card */}
        {currentYearContribution ? (
          <div className="bg-white rounded-lg shadow-warm-lg border border-[var(--color-border)] p-8 mb-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--color-primary)] text-white mb-4">
                <Calendar className="w-5 h-5 mr-2" />
                <span className="font-display text-lg font-semibold">
                  Current Year
                </span>
              </div>
              <h2 className="font-display text-3xl font-bold text-[var(--color-text)] mb-2">
                {currentYearContribution.year}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="font-body text-sm text-[var(--color-text-muted)] mb-1">
                  Church
                </div>
                <div className="font-display text-lg font-semibold text-[var(--color-text)]">
                  {currentYearContribution.church}
                </div>
              </div>
              <div>
                <div className="font-body text-sm text-[var(--color-text-muted)] mb-1">
                  Amount
                </div>
                <div className="font-mono text-2xl font-bold text-[var(--color-text)]">
                  ETB {currentYearContribution.amount.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="font-body text-sm text-[var(--color-text-muted)] mb-1">
                  Status
                </div>
                <StatusBadge
                  variant={
                    currentYearContribution.status === "paid"
                      ? "paid"
                      : "pending"
                  }
                  className="text-base px-4 py-2">
                  {currentYearContribution.status === "paid"
                    ? "Paid ✓"
                    : "Pending"}
                </StatusBadge>
              </div>
            </div>

            {currentYearContribution.paidDate && (
              <div className="text-center mt-6">
                <p className="text-sm text-[var(--color-text-muted)]">
                  Paid on{" "}
                  {new Date(
                    currentYearContribution.paidDate,
                  ).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-8 text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-surface)] flex items-center justify-center">
              <Calendar className="w-8 h-8 text-[var(--color-primary)] opacity-50" />
            </div>
            <h3 className="font-display text-lg font-semibold text-[var(--color-text)] mb-2">
              No Gbir registered for {new Date().getFullYear()}
            </h3>
            <p className="text-[var(--color-text-muted)] mb-4">
              Register your annual community contribution for this year.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Register Gbir
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Register Gbir Form */}
          {(showForm || !currentYearContribution) && (
            <div className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-6">
              <h3 className="font-display text-xl font-semibold text-[var(--color-text)] mb-4">
                Register Annual Gbir
              </h3>
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
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-white font-body focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    Register Gbir
                  </Button>
                  {showForm && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                      className="flex-1">
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
                  {gbirContributions.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body text-[var(--color-text-muted)]">
                  Total Amount
                </span>
                <span className="font-mono font-semibold text-[var(--color-text)]">
                  ETB{" "}
                  {gbirContributions
                    .reduce((sum, g) => sum + g.amount, 0)
                    .toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body text-[var(--color-text-muted)]">
                  Paid Contributions
                </span>
                <span className="font-mono font-semibold text-[var(--color-success)]">
                  {gbirContributions.filter((g) => g.status === "paid").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body text-[var(--color-text-muted)]">
                  Pending Contributions
                </span>
                <span className="font-mono font-semibold text-[var(--color-warning)]">
                  {
                    gbirContributions.filter((g) => g.status === "pending")
                      .length
                  }
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

          {gbirContributions.length > 0 ? (
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
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-body font-semibold text-[var(--color-text)]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {gbirContributions
                    .sort((a, b) => b.year - a.year)
                    .map((contribution) => (
                      <tr
                        key={contribution.id}
                        className="border-b border-[var(--color-surface)] last:border-0">
                        <td className="py-4 px-4 font-mono font-semibold">
                          {contribution.year}
                        </td>
                        <td className="py-4 px-4 font-body">
                          {contribution.church}
                        </td>
                        <td className="py-4 px-4 font-mono font-semibold">
                          ETB {contribution.amount.toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          <StatusBadge
                            variant={
                              contribution.status === "paid"
                                ? "paid"
                                : "pending"
                            }>
                            {contribution.status === "paid"
                              ? "Paid"
                              : "Pending"}
                          </StatusBadge>
                        </td>
                        <td className="py-4 px-4">
                          {contribution.status === "pending" ? (
                            <Button size="sm">Pay Now</Button>
                          ) : (
                            <span className="text-sm text-[var(--color-text-muted)]">
                              {contribution.paidDate &&
                                `Paid ${new Date(contribution.paidDate).toLocaleDateString()}`}
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
