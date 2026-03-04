"use client";

import React, { useState, useEffect } from "react";
import { CheckCheck } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import { notifications, Notification } from "@/lib/api/client";
import { cn } from "@/lib/utils";

const NotificationsPage: React.FC = () => {
  const [notifList, setNotifList] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "unread" | "payments" | "reminders"
  >("all");

  useEffect(() => {
    notifications.list()
      .then(data => setNotifList(data))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return mins + " min ago";
    const hours = Math.floor(mins / 60);
    if (hours < 24) return hours + " hours ago";
    const days = Math.floor(hours / 24);
    return days + " days ago";
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "donation_confirmed":
        return "💰";
      case "aserat_reminder":
        return "📅";
      case "selet_reminder":
        return "🙏";
      case "gbir_reminder":
        return "🏛️";
      default:
        return "🔔";
    }
  };

  const filteredNotifications = notifList.filter((notification) => {
    if (activeFilter === "unread") return !notification.is_read;
    if (activeFilter === "payments") return
      ["donation_confirmed", "payment", "general"].includes(notification.type);
    if (activeFilter === "reminders") return
      notification.type.includes("reminder");
    return true;
  });

  const unreadCount = notifList.filter(n => !n.is_read).length;

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifList.filter(n => !n.is_read);
      await Promise.all(
        unreadNotifications.map(n => notifications.markRead(n.id))
      );
      setNotifList(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      try {
        await notifications.markRead(notification.id);
        setNotifList(prev => prev.map(n => 
          n.id === notification.id ? { ...n, is_read: true } : n
        ));
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }
  };

  const filterTabs = [
    { key: "all", label: "All", count: notifList.length },
    { key: "unread", label: "Unread", count: unreadCount },
    {
      key: "payments",
      label: "Payments",
      count: notifList.filter((n) => ["donation_confirmed", "payment", "general"].includes(n.type)).length,
    },
    {
      key: "reminders",
      label: "Reminders",
      count: notifList.filter((n) => n.type.includes("reminder")).length,
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-surface)] flex">
        <Sidebar />
        <main className="flex-1 ml-72 p-8">
          <PageHeader title="Notifications" />
          
          {/* Filter Skeleton */}
          <div className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-1 mb-8">
            <div className="flex">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-1 px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Notifications Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                  </div>
                  <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse" />
                </div>
              </div>
            ))}
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
          title={`Notifications (${unreadCount} unread)`}
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
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={cn(
                  "p-4 rounded-lg border transition-colors cursor-pointer",
                  notification.is_read
                    ? "bg-white text-[var(--color-text)] border-[var(--color-border)]"
                    : "bg-[var(--color-surface-2)] text-[var(--color-text)] border-l-4 border-l-[var(--color-accent)] border-r border-t border-b border-[var(--color-border)]",
                  "hover:bg-[var(--color-surface)]"
                )}>
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--color-surface)] flex items-center justify-center">
                    <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className={cn(
                        "font-body text-[var(--color-text)]",
                        !notification.is_read ? "font-semibold" : "font-medium"
                      )}>
                        {notification.title}
                      </h4>
                      <span className="text-xs text-[var(--color-text-muted)] flex-shrink-0 ml-2">
                        {timeAgo(notification.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                      {notification.message}
                    </p>
                  </div>

                  {/* Unread indicator */}
                  {!notification.is_read && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                  )}
                </div>
              </div>
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
        {notifList.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-6">
            <h3 className="font-display text-lg font-semibold text-[var(--color-text)] mb-4">
              Notification Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="font-mono text-2xl font-bold text-[var(--color-text)]">
                  {notifList.length}
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
                  {notifList.filter((n) => ["donation_confirmed", "payment", "general"].includes(n.type)).length}
                </div>
                <div className="text-sm text-[var(--color-text-muted)]">
                  Payments
                </div>
              </div>
              <div className="text-center">
                <div className="font-mono text-2xl font-bold text-[var(--color-accent)]">
                  {notifList.filter((n) => n.type.includes("reminder")).length}
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
