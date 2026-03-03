"use client";

import React, { useState } from "react";
import {
  Plus,
  TrendingUp,
  ChevronDown,
  Calendar as CalendarIcon,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { getCurrentUser, getUserAseratEntries } from "@/lib/mock-data";

const AseratPage: React.FC = () => {
  const currentUser = getCurrentUser();
  const aseratEntries = getUserAseratEntries(currentUser.id);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    income: "",
  });

  const currentMonthEntry = aseratEntries.find(
    (entry) =>
      entry.month === new Date().getMonth() + 1 &&
      entry.year === new Date().getFullYear(),
  );

  const dueAmount = formData.income
    ? Math.round(parseInt(formData.income) * 0.1)
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.income) {
      alert(
        `Income entry saved! Due amount: ETB ${dueAmount.toLocaleString()}`,
      );
      setShowForm(false);
      setFormData({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        income: "",
      });
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "paid";
      case "partial":
        return "partial";
      case "missed":
        return "missed";
      default:
        return "pending";
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Mock chart data for the trend
  const chartData = aseratEntries.slice(-6).map((entry) => ({
    month: monthNames[entry.month - 1],
    paid: entry.paidAmount,
  }));

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex">
      <Sidebar />

      <main className="flex-1 ml-72 p-8">
        <PageHeader
          title="Aserat Bekurat"
          subtitle="Track and pay your monthly tithe"
          action={
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Income Entry
            </Button>
          }
        />

        {/* Current Month Summary */}
        <div className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="font-display text-2xl font-semibold text-[var(--color-text)] mb-2">
              {monthNames[new Date().getMonth()]} {new Date().getFullYear()}
            </h2>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--color-surface-2)]">
              <CalendarIcon className="w-4 h-4 mr-2 text-[var(--color-text-muted)]" />
              <span className="text-sm font-body text-[var(--color-text-muted)]">
                Current Month
              </span>
            </div>
          </div>

          {currentMonthEntry ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="font-mono text-2xl font-bold text-[var(--color-text)] mb-1">
                  ETB {currentMonthEntry.income.toLocaleString()}
                </div>
                <div className="text-sm text-[var(--color-text-muted)]">
                  Income Reported
                </div>
              </div>
              <div>
                <div className="font-mono text-2xl font-bold text-[var(--color-accent)] mb-1">
                  ETB {currentMonthEntry.dueAmount.toLocaleString()}
                </div>
                <div className="text-sm text-[var(--color-text-muted)]">
                  Due (10%)
                </div>
              </div>
              <div>
                <div className="font-mono text-2xl font-bold text-[var(--color-primary)] mb-1">
                  ETB {currentMonthEntry.paidAmount.toLocaleString()}
                </div>
                <div className="text-sm text-[var(--color-text-muted)]">
                  Amount Paid
                </div>
              </div>
              <div>
                <StatusBadge
                  variant={getStatusVariant(currentMonthEntry.status)}
                  className="text-base px-4 py-2">
                  {currentMonthEntry.status.charAt(0).toUpperCase() +
                    currentMonthEntry.status.slice(1)}
                </StatusBadge>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-surface)] flex items-center justify-center">
                <CalendarIcon className="w-8 h-8 text-[var(--color-primary)] opacity-50" />
              </div>
              <h3 className="font-display text-lg font-semibold text-[var(--color-text)] mb-2">
                No income reported for this month
              </h3>
              <p className="text-[var(--color-text-muted)] mb-4">
                Add your monthly income to calculate your tithe.
              </p>
              <Button onClick={() => setShowForm(true)}>
                Add Income Entry
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Income Form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-6">
              <h3 className="font-display text-xl font-semibold text-[var(--color-text)] mb-4">
                Add Income Entry
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-body font-medium text-[var(--color-text)] mb-2">
                      Month
                    </label>
                    <div className="relative">
                      <select
                        value={formData.month}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            month: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-4 py-3 pr-10 rounded-lg border border-[var(--color-border)] bg-white font-body appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent">
                        {monthNames.map((month, index) => (
                          <option key={index} value={index + 1}>
                            {month}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] w-4 h-4 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block font-body font-medium text-[var(--color-text)] mb-2">
                      Year
                    </label>
                    <div className="relative">
                      <select
                        value={formData.year}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            year: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-4 py-3 pr-10 rounded-lg border border-[var(--color-border)] bg-white font-body appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent">
                        {[2024, 2023, 2022, 2021].map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] w-4 h-4 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-body font-medium text-[var(--color-text)] mb-2">
                    Monthly Income (ETB)
                  </label>
                  <input
                    type="number"
                    value={formData.income}
                    onChange={(e) =>
                      setFormData({ ...formData, income: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-white font-body focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                    placeholder="Enter your monthly income"
                    required
                  />
                  {dueAmount > 0 && (
                    <p className="mt-2 text-sm text-[var(--color-accent)] font-medium">
                      10% due: ETB {dueAmount.toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    Save Entry
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Giving Trend Chart (Placeholder) */}
          <div className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-semibold text-[var(--color-text)]">
                Giving Trend
              </h3>
              <TrendingUp className="w-5 h-5 text-[var(--color-accent)]" />
            </div>
            <div className="h-48 flex items-center justify-center border-2 border-dashed border-[var(--color-border)] rounded-lg">
              <div className="text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-[var(--color-text-muted)] opacity-50" />
                <p className="text-sm text-[var(--color-text-muted)]">
                  Chart showing last 6 months trend
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="mt-8 bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-6">
          <h3 className="font-display text-xl font-semibold text-[var(--color-text)] mb-6">
            Payment History
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-surface)]">
                  <th className="text-left py-3 px-4 font-body font-semibold text-[var(--color-text)]">
                    Month
                  </th>
                  <th className="text-left py-3 px-4 font-body font-semibold text-[var(--color-text)]">
                    Income
                  </th>
                  <th className="text-left py-3 px-4 font-body font-semibold text-[var(--color-text)]">
                    Due
                  </th>
                  <th className="text-left py-3 px-4 font-body font-semibold text-[var(--color-text)]">
                    Paid
                  </th>
                  <th className="text-left py-3 px-4 font-body font-semibold text-[var(--color-text)]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {aseratEntries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-[var(--color-surface)] last:border-0">
                    <td className="py-4 px-4 font-body">
                      {monthNames[entry.month - 1]} {entry.year}
                    </td>
                    <td className="py-4 px-4 font-mono font-semibold">
                      ETB {entry.income.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 font-mono font-semibold text-[var(--color-accent)]">
                      ETB {entry.dueAmount.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 font-mono font-semibold">
                      ETB {entry.paidAmount.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge variant={getStatusVariant(entry.status)}>
                        {entry.status.charAt(0).toUpperCase() +
                          entry.status.slice(1)}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AseratPage;
