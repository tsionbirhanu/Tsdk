"use client";

import React, { useState, useEffect } from "react";
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
import { aserat, AseratRecord } from "@/lib/api/client";
import { useAuth } from "@/lib/api/auth-context";

const AseratPage: React.FC = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<AseratRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Payment state
  const [payingRecord, setPayingRecord] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [payError, setPayError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    incomeAmount: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  useEffect(() => {
    aserat
      .list()
      .then((data) => setRecords(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const MONTHS = [
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

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const currentRecord = records.find(
    (r) => r.month === currentMonth && r.year === currentYear,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const incomeAmount = Number(formData.incomeAmount);

    if (incomeAmount <= 0) {
      setFormError("Please enter a valid income amount");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const record = await aserat.create({
        month: Number(formData.month),
        year: Number(formData.year),
        income_amount: incomeAmount,
      });

      // Update records state
      const existingIndex = records.findIndex(
        (r) => r.month === record.month && r.year === record.year,
      );

      if (existingIndex >= 0) {
        setRecords((prev) => [
          ...prev.slice(0, existingIndex),
          record,
          ...prev.slice(existingIndex + 1),
        ]);
      } else {
        setRecords((prev) => [record, ...prev]);
      }

      setFormSuccess("Aserat entry saved!");
      setFormData({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        incomeAmount: "",
      });
    } catch (err: any) {
      setFormError(err.message || "Failed to save entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = async (recordId: string, amount: number) => {
    setPayError(null);
    try {
      const updated = await aserat.pay(recordId, amount);
      setRecords((prev) => prev.map((r) => (r.id === recordId ? updated : r)));
      setPayingRecord(null);
      setPayAmount("");
    } catch (err: any) {
      setPayError(err.message || "Payment failed");
    }
  };

  const dueAmount = formData.incomeAmount
    ? Math.round(Number(formData.incomeAmount) * 0.1)
    : 0;

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

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Paid ✓";
      case "partial":
        return "Partial";
      case "missed":
        return "Missed";
      default:
        return "Pending";
    }
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
                Loading Aserat records...
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
                Error loading Aserat records
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
              {MONTHS[new Date().getMonth()]} {new Date().getFullYear()}
            </h2>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--color-surface-2)]">
              <CalendarIcon className="w-4 h-4 mr-2 text-[var(--color-text-muted)]" />
              <span className="text-sm font-body text-[var(--color-text-muted)]">
                Current Month
              </span>
            </div>
          </div>

          {currentRecord ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-6">
                <div>
                  <div className="font-mono text-2xl font-bold text-[var(--color-accent)] mb-1">
                    ETB {currentRecord.amount_due.toLocaleString()}
                  </div>
                  <div className="text-sm text-[var(--color-text-muted)]">
                    Due (10%)
                  </div>
                </div>
                <div>
                  <div className="font-mono text-2xl font-bold text-[var(--color-primary)] mb-1">
                    ETB {currentRecord.amount_paid.toLocaleString()}
                  </div>
                  <div className="text-sm text-[var(--color-text-muted)]">
                    Amount Paid
                  </div>
                </div>
                <div>
                  <StatusBadge
                    variant={getStatusVariant(currentRecord.status)}
                    className="text-base px-4 py-2">
                    {getStatusText(currentRecord.status)}
                  </StatusBadge>
                </div>
              </div>

              {/* Progress Bar */}
              {currentRecord.amount_due > 0 && (
                <div className="mb-4">
                  <div className="w-full bg-[var(--color-surface)] rounded-full h-3">
                    <div
                      className="bg-[var(--color-primary)] h-3 rounded-full"
                      style={{
                        width: `${Math.min((currentRecord.amount_paid / currentRecord.amount_due) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-[var(--color-text-muted)] mt-2">
                    <span>Progress</span>
                    <span>
                      {Math.round(
                        (currentRecord.amount_paid / currentRecord.amount_due) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                </div>
              )}

              {/* Pay Button */}
              {currentRecord.status !== "paid" && (
                <div className="text-center">
                  <Button
                    onClick={() => setPayingRecord(currentRecord.id)}
                    className="mr-2">
                    Pay Now
                  </Button>
                </div>
              )}

              {/* Inline Payment Form */}
              {payingRecord === currentRecord.id && (
                <div className="mt-4 p-4 bg-[var(--color-surface)] rounded-lg">
                  <div className="flex gap-3 flex-wrap items-end">
                    <div className="flex-1 min-w-40">
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                        Amount to pay (max: ETB{" "}
                        {(
                          currentRecord.amount_due - currentRecord.amount_paid
                        ).toLocaleString()}
                        )
                      </label>
                      <input
                        type="number"
                        value={payAmount}
                        onChange={(e) => setPayAmount(e.target.value)}
                        max={
                          currentRecord.amount_due - currentRecord.amount_paid
                        }
                        placeholder="Amount to pay"
                        className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                      />
                    </div>
                    <Button
                      onClick={() =>
                        handlePayment(currentRecord.id, Number(payAmount))
                      }
                      disabled={!payAmount || Number(payAmount) <= 0}
                      size="sm">
                      Pay
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPayingRecord(null);
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
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-surface)] flex items-center justify-center">
                <CalendarIcon className="w-8 h-8 text-[var(--color-primary)] opacity-50" />
              </div>
              <h3 className="font-display text-lg font-semibold text-[var(--color-text)] mb-2">
                No Aserat entry for this month yet
              </h3>
              <p className="text-[var(--color-text-muted)] mb-4">
                Add one below to track your tithe.
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

              {formSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-600">{formSuccess}</p>
                </div>
              )}

              {formError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{formError}</p>
                </div>
              )}

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
                        {MONTHS.map((month, index) => (
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
                        {Array.from(
                          { length: currentYear - 2020 + 2 },
                          (_, i) => 2020 + i,
                        ).map((year) => (
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
                    value={formData.incomeAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, incomeAmount: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-white font-body focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                    placeholder="Enter your monthly income"
                    required
                  />
                  {dueAmount > 0 && (
                    <p className="mt-2 text-sm text-[var(--color-accent)] font-medium">
                      Your Aserat due: ETB {dueAmount.toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Entry"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setFormError(null);
                      setFormSuccess(null);
                    }}
                    className="flex-1"
                    disabled={isSubmitting}>
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
                    Year
                  </th>
                  <th className="text-left py-3 px-4 font-body font-semibold text-[var(--color-text)]">
                    Due
                  </th>
                  <th className="text-left py-3 px-4 font-body font-semibold text-[var(--color-text)]">
                    Paid
                  </th>
                  <th className="text-left py-3 px-4 font-body font-semibold text-[var(--color-text)]">
                    Remaining
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
                {records
                  .sort((a, b) => {
                    if (a.year !== b.year) return b.year - a.year;
                    return b.month - a.month;
                  })
                  .map((record) => (
                    <>
                      <tr
                        key={record.id}
                        className="border-b border-[var(--color-surface)] last:border-0">
                        <td className="py-4 px-4 font-body">
                          {MONTHS[record.month - 1]}
                        </td>
                        <td className="py-4 px-4 font-body">{record.year}</td>
                        <td className="py-4 px-4 font-mono font-semibold text-[var(--color-accent)]">
                          ETB {record.amount_due.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 font-mono font-semibold">
                          ETB {record.amount_paid.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 font-mono font-semibold">
                          ETB{" "}
                          {(
                            record.amount_due - record.amount_paid
                          ).toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          <StatusBadge
                            variant={getStatusVariant(record.status)}>
                            {getStatusText(record.status)}
                          </StatusBadge>
                        </td>
                        <td className="py-4 px-4">
                          {record.status !== "paid" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                setPayingRecord(
                                  payingRecord === record.id ? null : record.id,
                                )
                              }>
                              {payingRecord === record.id ? "Cancel" : "Pay"}
                            </Button>
                          )}
                        </td>
                      </tr>

                      {/* Inline payment row */}
                      {payingRecord === record.id && (
                        <tr className="bg-[var(--color-surface)]">
                          <td colSpan={7} className="py-4 px-4">
                            <div className="flex gap-3 items-end">
                              <div className="flex-1">
                                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                                  Amount to pay (max: ETB{" "}
                                  {(
                                    record.amount_due - record.amount_paid
                                  ).toLocaleString()}
                                  )
                                </label>
                                <input
                                  type="number"
                                  value={payAmount}
                                  onChange={(e) => setPayAmount(e.target.value)}
                                  max={record.amount_due - record.amount_paid}
                                  placeholder="Amount to pay"
                                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                />
                              </div>
                              <Button
                                onClick={() =>
                                  handlePayment(record.id, Number(payAmount))
                                }
                                disabled={!payAmount || Number(payAmount) <= 0}
                                size="sm">
                                Confirm Payment
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setPayingRecord(null);
                                  setPayAmount("");
                                  setPayError(null);
                                }}
                                size="sm">
                                Cancel
                              </Button>
                            </div>
                            {payError && (
                              <p className="text-sm text-red-500 mt-2">
                                {payError}
                              </p>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  ))}

                {records.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-8 text-center text-[var(--color-text-muted)]">
                      No Aserat records found. Add your first entry above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AseratPage;
