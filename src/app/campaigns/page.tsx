"use client";

import React, { useState } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import CampaignCard from "@/components/CampaignCard";
import { mockCampaigns, mockChurches } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const CampaignsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "closed">(
    "all",
  );
  const [selectedChurch, setSelectedChurch] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCampaigns = mockCampaigns.filter((campaign) => {
    const matchesStatus =
      activeFilter === "all" || campaign.status === activeFilter;
    const matchesChurch = !selectedChurch || campaign.church === selectedChurch;
    const matchesSearch =
      !searchQuery ||
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.church.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesChurch && matchesSearch;
  });

  const filterTabs = [
    { key: "all", label: "All", count: mockCampaigns.length },
    {
      key: "active",
      label: "Active",
      count: mockCampaigns.filter((c) => c.status === "active").length,
    },
    {
      key: "closed",
      label: "Closed",
      count: mockCampaigns.filter((c) => c.status === "closed").length,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex">
      <Sidebar />

      <main className="flex-1 ml-72 p-8">
        <PageHeader
          title="Campaigns"
          subtitle="Support causes that matter to your community"
        />

        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Status Filter Tabs */}
            <div className="flex bg-[var(--color-surface)] rounded-lg p-1">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key as any)}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-body font-medium transition-colors",
                    activeFilter === tab.key
                      ? "bg-white text-[var(--color-primary)] shadow-sm"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
                  )}>
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Church Filter */}
            <div className="relative">
              <select
                value={selectedChurch}
                onChange={(e) => setSelectedChurch(e.target.value)}
                className="px-4 py-2 pr-10 rounded-lg border border-[var(--color-border)] bg-white font-body text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent">
                <option value="">All Churches</option>
                {mockChurches.map((church) => (
                  <option key={church.id} value={church.name}>
                    {church.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] w-4 h-4 pointer-events-none" />
            </div>

            {/* Search */}
            <div className="relative flex-1 lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] w-4 h-4" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--color-border)] bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="font-body text-[var(--color-text-muted)]">
            Showing {filteredCampaigns.length} campaign
            {filteredCampaigns.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Campaigns Grid */}
        {filteredCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        ) : (
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
              No campaigns found
            </h3>
            <p className="font-body text-[var(--color-text-muted)] mb-4">
              Try adjusting your filters or search terms.
            </p>
            <button
              onClick={() => {
                setActiveFilter("all");
                setSelectedChurch("");
                setSearchQuery("");
              }}
              className="text-[var(--color-primary)] hover:underline font-body font-medium">
              Clear all filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default CampaignsPage;
