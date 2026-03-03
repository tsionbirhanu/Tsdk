"use client";

import React, { useState } from "react";
import { CheckCheck } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import NotificationItem from "@/components/NotificationItem";
import { getCurrentUser, getUserNotifications } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const NotificationsPage: React.FC = () => {
  const currentUser = getCurrentUser();
  const allNotifications = getUserNotifications(currentUser.id);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "unread" | "payments" | "reminders"
  >("all");

  const filteredNotifications = allNotifications.filter((notification) => {
    switch (activeFilter) {
      case "unread":
        return !notification.read;
      case "payments":
        return notification.type === "payment";
      case "reminders":
        return notification.type === "reminder";
      default:
        return true;
    }
  });

  const unreadCount = allNotifications.filter((n) => !n.read).length;

  const handleMarkAllAsRead = () => {
    alert("All notifications marked as read!");
  };

  const filterTabs = [
    { key: "all", label: "All", count: allNotifications.length },
    { key: "unread", label: "Unread", count: unreadCount },
    {
      key: "payments",
      label: "Payments",
      count: allNotifications.filter((n) => n.type === "payment").length,
    },
    {
      key: "reminders",
      label: "Reminders",
      count: allNotifications.filter((n) => n.type === "reminder").length,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex">
      <Sidebar />

      <main className="flex-1 ml-72 p-8">
        <PageHeader
          title="Notifications"
          action={
            unreadCount > 0 ? (
              <button
                onClick={handleMarkAllAsRead}
                className="text-[var(--color-primary)] hover:underline font-body font-medium flex items-center gap-2">
                <CheckCheck className="w-4 h-4" />
                Mark all as read
              </button>
            ) : null
          }
        />

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-1 mb-8">
          <div className="flex">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key as any)}
                className={cn(
                  "flex-1 px-4 py-3 rounded-lg text-sm font-body font-medium transition-colors",
                  activeFilter === tab.key
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)]",
                )}>
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-surface)] flex items-center justify-center">
                <div className="text-[var(--color-primary)] opacity-50">
                  {activeFilter === "unread" ? (
                    <CheckCheck className="w-8 h-8" />
                  ) : activeFilter === "payments" ? (
                    <span className="text-2xl">💰</span>
                  ) : activeFilter === "reminders" ? (
                    <span className="text-2xl">📅</span>
                  ) : (
                    <span className="text-2xl">🔔</span>
                  )}
                </div>
              </div>
              <h3 className="font-display text-lg font-semibold text-[var(--color-text)] mb-2">
                {activeFilter === "unread" && "All caught up!"}
                {activeFilter === "payments" && "No payment notifications"}
                {activeFilter === "reminders" && "No reminders"}
                {activeFilter === "all" && "No notifications"}
              </h3>
              <p className="font-body text-[var(--color-text-muted)]">
                {activeFilter === "unread" &&
                  "You have no unread notifications."}
                {activeFilter === "payments" &&
                  "You have no payment-related notifications."}
                {activeFilter === "reminders" &&
                  "You have no reminder notifications."}
                {activeFilter === "all" && "You have no notifications yet."}
              </p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {allNotifications.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-6">
            <h3 className="font-display text-lg font-semibold text-[var(--color-text)] mb-4">
              Notification Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="font-mono text-2xl font-bold text-[var(--color-text)]">
                  {allNotifications.length}
                </div>
                <div className="text-sm text-[var(--color-text-muted)]">
                  Total
                </div>
              </div>
              <div className="text-center">
                <div className="font-mono text-2xl font-bold text-[var(--color-warning)]">
                  {unreadCount}
                </div>
                <div className="text-sm text-[var(--color-text-muted)]">
                  Unread
                </div>
              </div>
              <div className="text-center">
                <div className="font-mono text-2xl font-bold text-[var(--color-success)]">
                  {allNotifications.filter((n) => n.type === "payment").length}
                </div>
                <div className="text-sm text-[var(--color-text-muted)]">
                  Payments
                </div>
              </div>
              <div className="text-center">
                <div className="font-mono text-2xl font-bold text-[var(--color-accent)]">
                  {allNotifications.filter((n) => n.type === "reminder").length}
                </div>
                <div className="text-sm text-[var(--color-text-muted)]">
                  Reminders
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default NotificationsPage;
