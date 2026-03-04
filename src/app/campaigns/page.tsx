"use client";

import React, { useEffect, useState } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import CampaignCard from "@/components/CampaignCard";
import { cn } from "@/lib/utils";
import { campaigns, churches, Campaign, Church } from "@/lib/api/client";

const CampaignsPage: React.FC = () => {
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([]);
  const [churchesList, setChurchesList] = useState<Church[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "closed" | "paused"
  >("all");
  const [churchFilter, setChurchFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    Promise.allSettled([campaigns.list(), churches.list()])
      .then(([campaignsResult, churchesResult]) => {
        if (campaignsResult.status === "fulfilled") {
          setAllCampaigns(campaignsResult.value);
        } else {
          setError(
            campaignsResult.reason?.message || "Failed to load campaigns",
          );
        }
        if (churchesResult.status === "fulfilled") {
          setChurchesList(churchesResult.value);
        } else {
          setError(churchesResult.reason?.message || "Failed to load churches");
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load data");
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Filter logic
  const filteredCampaigns = allCampaigns
    .filter((c) => statusFilter === "all" || c.status === statusFilter)
    .filter((c) => churchFilter === "all" || c.church_id === churchFilter)
    .filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));

  const filterTabs = [
    { key: "all", label: "All", count: allCampaigns.length },
    {
      key: "active",
      label: "Active",
      count: allCampaigns.filter((c) => c.status === "active").length,
    },
    {
      key: "closed",
      label: "Closed",
      count: allCampaigns.filter((c) => c.status === "closed").length,
    },
    {
      key: "paused",
      label: "Paused",
      count: allCampaigns.filter((c) => c.status === "paused").length,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-surface)] flex">
        <Sidebar />
        <main className="flex-1 ml-72 p-8">
          <PageHeader
            title="Campaigns"
            subtitle="Support causes that matter to your community"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-6 animate-pulse h-64"
              />
            ))}
          </div>
        </main>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-surface)] flex">
        <Sidebar />
        <main className="flex-1 ml-72 p-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-semibold text-[var(--color-text)] mb-4">
              Error
            </h1>
            <p className="text-[var(--color-text-muted)]">{error}</p>
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
                  onClick={() => setStatusFilter(tab.key as any)}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-body font-medium transition-colors",
                    statusFilter === tab.key
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
                value={churchFilter}
                onChange={(e) => setChurchFilter(e.target.value)}
                className="px-4 py-2 pr-10 rounded-lg border border-[var(--color-border)] bg-white font-body text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent">
                <option value="all">All Churches</option>
                {churchesList.map((church) => (
                  <option key={church.id} value={church.id}>
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                setStatusFilter("all");
                setChurchFilter("all");
                setSearch("");
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
