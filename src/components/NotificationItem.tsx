import React from "react";
import { cn } from "@/lib/utils";
import { Notification } from "@/lib/mock-data";

interface NotificationItemProps {
  notification: Notification;
  className?: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  className,
}) => {
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div
      className={cn(
        "p-4 rounded-lg border transition-colors",
        notification.read
          ? "bg-white text-[var(--color-text)] border-[var(--color-border)]"
          : "bg-[var(--color-surface-2)] text-[var(--color-text)] border-l-4 border-l-[var(--color-accent)] border-r border-t border-b border-[var(--color-border)]",
        "hover:bg-[var(--color-surface)] cursor-pointer",
        className,
      )}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--color-surface)] flex items-center justify-center">
          <span className="text-lg">{notification.icon}</span>
        </div>

        {/* Content */}
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h4 className="font-medium text-[var(--color-text)] font-body">
              {notification.title}
            </h4>
            <span className="text-xs text-[var(--color-text-muted)] flex-shrink-0 ml-2">
              {getRelativeTime(notification.date)}
            </span>
          </div>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            {notification.description}
          </p>
        </div>

        {/* Unread indicator */}
        {!notification.read && (
          <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] flex-shrink-0 mt-2" />
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
