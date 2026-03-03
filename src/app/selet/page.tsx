"use client";

import React, { useState } from "react";
import { Calendar, ChevronDown, Plus, X } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/ProgressBar";
import StatusBadge from "@/components/StatusBadge";
import {
  getCurrentUser,
  getUserSeletVows,
  mockChurches,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const SeletPage: React.FC = () => {
  const currentUser = getCurrentUser();
  const seletVows = getUserSeletVows(currentUser.id);
  const [showNewVowDialog, setShowNewVowDialog] = useState(false);
  const [formData, setFormData] = useState({
    church: "",
    description: "",
    amount: "",
    dueDate: "",
    isPublic: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.church &&
      formData.description &&
      formData.amount &&
      formData.dueDate
    ) {
      alert(
        `New vow created successfully! Amount: ETB ${parseInt(formData.amount).toLocaleString()}`,
      );
      setShowNewVowDialog(false);
      setFormData({
        church: "",
        description: "",
        amount: "",
        dueDate: "",
        isPublic: true,
      });
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
        return "fulfilled";
      case "active":
        return "active";
      case "overdue":
        return "overdue";
      default:
        return "pending";
    }
  };

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

        {/* Vow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {seletVows.map((vow) => {
            const percentage = (vow.paidAmount / vow.amount) * 100;
            const isOverdue =
              new Date(vow.dueDate) < new Date() && vow.status !== "fulfilled";

            return (
              <div
                key={vow.id}
                className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-6 hover-lift">
                {/* Church Badge */}
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--color-surface-2)] text-[var(--color-text-muted)]">
                    {vow.church}
                  </span>
                </div>

                {/* Vow Description */}
                <h3 className="font-display text-lg font-semibold text-[var(--color-text)] mb-3">
                  {vow.description}
                </h3>

                {/* Progress Bar */}
                <div className="mb-4">
                  <ProgressBar
                    value={vow.paidAmount}
                    max={vow.amount}
                    size="md"
                  />
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="font-mono font-semibold text-[var(--color-text)]">
                      ETB {vow.paidAmount.toLocaleString()}
                    </span>
                    <span className="text-[var(--color-text-muted)]">
                      of ETB {vow.amount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Due Date */}
                <div className="flex items-center gap-2 mb-4 text-sm text-[var(--color-text-muted)]">
                  <Calendar className="w-4 h-4" />
                  <span>Due: {new Date(vow.dueDate).toLocaleDateString()}</span>
                </div>

                {/* Status and Action */}
                <div className="flex items-center justify-between">
                  <StatusBadge variant={getStatusVariant(vow.status)}>
                    {vow.status.charAt(0).toUpperCase() + vow.status.slice(1)}
                    {vow.status === "fulfilled" && " ✓"}
                  </StatusBadge>
                  {vow.status === "active" && (
                    <Button size="sm">Pay Now</Button>
                  )}
                  {isOverdue && (
                    <Button size="sm" variant="destructive">
                      Overdue - Pay Now
                    </Button>
                  )}
                </div>

                {/* Privacy Indicator */}
                <div className="mt-3 text-xs text-[var(--color-text-muted)]">
                  {vow.isPublic ? "🌍 Public vow" : "🔒 Private vow"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {seletVows.length === 0 && (
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
              No spiritual vows yet
            </h3>
            <p className="font-body text-[var(--color-text-muted)] mb-4">
              Create your first spiritual vow to start your commitment journey.
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
                    onClick={() => setShowNewVowDialog(false)}
                    className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Church Select */}
                  <div>
                    <label className="block font-body font-medium text-[var(--color-text)] mb-2">
                      Church *
                    </label>
                    <div className="relative">
                      <select
                        name="church"
                        value={formData.church}
                        onChange={handleChange}
                        className="w-full px-4 py-3 pr-10 rounded-lg border border-[var(--color-border)] bg-white font-body appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                        required>
                        <option value="">Select a church</option>
                        {mockChurches.map((church) => (
                          <option key={church.id} value={church.name}>
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
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-white font-body focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Public/Private Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--color-surface)]">
                    <div>
                      <label className="font-body font-medium text-[var(--color-text)] block">
                        Make this vow public
                      </label>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        Others can see your commitment
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isPublic"
                        checked={formData.isPublic}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--color-accent)]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-accent)]"></div>
                    </label>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1">
                      Create Vow
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowNewVowDialog(false)}
                      className="flex-1">
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
