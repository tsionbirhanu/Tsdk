import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Users } from "lucide-react";
import { Button } from "./ui/button";
import ProgressBar from "./ProgressBar";
import StatusBadge from "./StatusBadge";
import { Campaign } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface CampaignCardProps {
  campaign: Campaign;
  className?: string;
  compact?: boolean;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  className,
  compact = false,
}) => {
  const percentage = (campaign.raisedAmount / campaign.goalAmount) * 100;

  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-warm border border-[var(--color-border)] overflow-hidden hover-lift",
        className,
      )}>
      {/* Campaign Image */}
      <div className="relative aspect-video">
        <div className="w-full h-full bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-2)] flex items-center justify-center">
          {/* Cross SVG placeholder */}
          <svg
            className="w-16 h-16 text-[var(--color-primary)] opacity-20"
            fill="currentColor"
            viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-6H5v-2h6V5h2v6h6v2h-6v6z" />
          </svg>
        </div>
        {/* Status badge overlay */}
        <div className="absolute top-3 right-3">
          <StatusBadge
            variant={campaign.status === "active" ? "active" : "closed"}>
            {campaign.status}
          </StatusBadge>
        </div>
      </div>

      {/* Campaign Content */}
      <div className="p-6">
        {/* Church Badge */}
        <div className="mb-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[var(--color-surface-2)] text-[var(--color-text-muted)]">
            {campaign.church}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display text-lg font-semibold text-[var(--color-text)] mb-2 line-clamp-2">
          {campaign.title}
        </h3>

        {/* Description (only in full version) */}
        {!compact && (
          <p className="text-sm text-[var(--color-text-muted)] mb-4 line-clamp-2">
            {campaign.description}
          </p>
        )}

        {/* Progress */}
        <div className="mb-4">
          <ProgressBar
            value={campaign.raisedAmount}
            max={campaign.goalAmount}
            size="md"
          />
          <div className="flex justify-between mt-2 text-sm">
            <span className="font-mono font-semibold text-[var(--color-text)]">
              ETB {campaign.raisedAmount.toLocaleString()}
            </span>
            <span className="text-[var(--color-text-muted)]">
              of ETB {campaign.goalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-6 text-sm text-[var(--color-text-muted)]">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{campaign.donorCount} donors</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>
              {campaign.daysLeft > 0
                ? `${campaign.daysLeft} days left`
                : "Ended"}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/campaigns/${campaign.id}`}>View Details</Link>
          </Button>
          {campaign.status === "active" && (
            <Button size="sm" className="flex-1">
              Donate Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
