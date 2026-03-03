"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Copy,
  RefreshCw,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { mockCampaigns, mockAICaptions } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const AdminAICaptionsPage: React.FC = () => {
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<
    "Telegram" | "TikTok" | "Facebook"
  >("Telegram");
  const [selectedLanguage, setSelectedLanguage] = useState<
    "Amharic" | "English"
  >("English");
  const [selectedTone, setSelectedTone] = useState<
    "Formal" | "Emotional" | "Urgent"
  >("Emotional");
  const [generatedCaption, setGeneratedCaption] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const platforms = ["Telegram", "TikTok", "Facebook"] as const;
  const languages = ["Amharic", "English"] as const;
  const tones = ["Formal", "Emotional", "Urgent"] as const;

  // Mock caption history
  const captionHistory = [
    {
      campaign: "St. Mary Church Restoration",
      platform: "Telegram",
      language: "Amharic",
      tone: "Formal",
      date: "2024-03-01",
    },
    {
      campaign: "Community Water Well Project",
      platform: "Facebook",
      language: "English",
      tone: "Emotional",
      date: "2024-02-28",
    },
    {
      campaign: "Children's Education Support",
      platform: "TikTok",
      language: "English",
      tone: "Urgent",
      date: "2024-02-25",
    },
  ];

  const handleGenerate = async () => {
    if (!selectedCampaign) {
      alert("Please select a campaign first");
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation delay
    setTimeout(() => {
      // Get mock caption based on platform and language
      let caption = "";
      if (selectedPlatform === "Telegram" && selectedLanguage === "Amharic") {
        caption = mockAICaptions.telegram_amharic_formal;
      } else if (
        selectedPlatform === "Telegram" &&
        selectedLanguage === "English"
      ) {
        caption = mockAICaptions.telegram_english_emotional;
      } else if (
        selectedPlatform === "Facebook" &&
        selectedLanguage === "Amharic"
      ) {
        caption = mockAICaptions.facebook_amharic_urgent;
      } else if (
        selectedPlatform === "TikTok" &&
        selectedLanguage === "English"
      ) {
        caption = mockAICaptions.tiktok_english_emotional;
      } else {
        caption = mockAICaptions.telegram_english_emotional;
      }

      setGeneratedCaption(caption);
      setIsGenerating(false);
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCaption);
    alert("Caption copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex">
      <Sidebar isAdmin />

      <main className="flex-1 ml-72 p-8">
        <PageHeader
          title="AI Caption Generator"
          subtitle="Generate social media captions for campaigns"
        />

        {/* Generator Form */}
        <div className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[var(--color-accent)]" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--color-text)]">
                AI Caption Generator
              </h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                Create engaging social media content for your campaigns
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Controls */}
            <div className="space-y-6">
              {/* Campaign Selection */}
              <div>
                <label className="block font-body font-medium text-[var(--color-text)] mb-3">
                  Select Campaign
                </label>
                <div className="relative">
                  <select
                    value={selectedCampaign}
                    onChange={(e) => setSelectedCampaign(e.target.value)}
                    className="w-full px-4 py-3 pr-10 rounded-lg border border-[var(--color-border)] bg-white font-body appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent">
                    <option value="">Choose a campaign...</option>
                    {mockCampaigns
                      .filter((c) => c.status === "active")
                      .map((campaign) => (
                        <option key={campaign.id} value={campaign.id}>
                          {campaign.title}
                        </option>
                      ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] w-4 h-4 pointer-events-none" />
                </div>
              </div>

              {/* Platform Selection */}
              <div>
                <label className="block font-body font-medium text-[var(--color-text)] mb-3">
                  Platform
                </label>
                <div className="flex bg-[var(--color-surface)] rounded-lg p-1">
                  {platforms.map((platform) => (
                    <button
                      key={platform}
                      onClick={() => setSelectedPlatform(platform)}
                      className={cn(
                        "flex-1 py-2 px-4 rounded-md text-sm font-body font-medium transition-colors",
                        selectedPlatform === platform
                          ? "bg-white text-[var(--color-primary)] shadow-sm"
                          : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
                      )}>
                      {platform}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <label className="block font-body font-medium text-[var(--color-text)] mb-3">
                  Language
                </label>
                <div className="flex bg-[var(--color-surface)] rounded-lg p-1">
                  {languages.map((language) => (
                    <button
                      key={language}
                      onClick={() => setSelectedLanguage(language)}
                      className={cn(
                        "flex-1 py-2 px-4 rounded-md text-sm font-body font-medium transition-colors",
                        selectedLanguage === language
                          ? "bg-white text-[var(--color-primary)] shadow-sm"
                          : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
                      )}>
                      {language}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone Selection */}
              <div>
                <label className="block font-body font-medium text-[var(--color-text)] mb-3">
                  Tone
                </label>
                <div className="flex bg-[var(--color-surface)] rounded-lg p-1">
                  {tones.map((tone) => (
                    <button
                      key={tone}
                      onClick={() => setSelectedTone(tone)}
                      className={cn(
                        "flex-1 py-2 px-4 rounded-md text-sm font-body font-medium transition-colors",
                        selectedTone === tone
                          ? "bg-white text-[var(--color-primary)] shadow-sm"
                          : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]",
                      )}>
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !selectedCampaign}
                className="w-full"
                size="lg">
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Caption
                  </>
                )}
              </Button>
            </div>

            {/* Generated Output */}
            <div>
              <label className="block font-body font-medium text-[var(--color-text)] mb-3">
                Generated Caption
              </label>
              <div
                className={cn(
                  "min-h-[200px] p-4 rounded-lg border transition-all duration-200",
                  generatedCaption
                    ? "border-[var(--color-accent)] bg-[var(--color-surface)]"
                    : "border-[var(--color-border)] bg-white",
                  isGenerating &&
                    "border-[var(--color-accent)] bg-gradient-to-r from-[var(--color-surface)] via-white to-[var(--color-surface)] bg-[length:200%_100%] animate-pulse",
                )}>
                {isGenerating ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <RefreshCw className="w-8 h-8 mx-auto mb-2 text-[var(--color-accent)] animate-spin" />
                      <p className="text-sm text-[var(--color-text-muted)]">
                        AI is generating your caption...
                      </p>
                    </div>
                  </div>
                ) : generatedCaption ? (
                  <div>
                    <div className="font-body text-[var(--color-text)] whitespace-pre-wrap mb-4">
                      {generatedCaption}
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" onClick={handleCopy}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleGenerate}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-center">
                    <div>
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 text-[var(--color-text-muted)] opacity-50" />
                      <p className="text-sm text-[var(--color-text-muted)]">
                        Your generated caption will appear here
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Caption History */}
        <div className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-6">
          <h3 className="font-display text-xl font-semibold text-[var(--color-text)] mb-6">
            Caption History
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-surface)]">
                  <th className="text-left py-3 px-4 font-body font-semibold text-[var(--color-text)]">
                    Campaign
                  </th>
                  <th className="text-left py-3 px-4 font-body font-semibold text-[var(--color-text)]">
                    Platform
                  </th>
                  <th className="text-left py-3 px-4 font-body font-semibold text-[var(--color-text)]">
                    Language
                  </th>
                  <th className="text-left py-3 px-4 font-body font-semibold text-[var(--color-text)]">
                    Tone
                  </th>
                  <th className="text-left py-3 px-4 font-body font-semibold text-[var(--color-text)]">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-body font-semibold text-[var(--color-text)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {captionHistory.map((entry, index) => (
                  <tr
                    key={index}
                    className="border-b border-[var(--color-surface)] last:border-0">
                    <td className="py-4 px-4 font-body">{entry.campaign}</td>
                    <td className="py-4 px-4 font-body">{entry.platform}</td>
                    <td className="py-4 px-4 font-body">{entry.language}</td>
                    <td className="py-4 px-4 font-body">{entry.tone}</td>
                    <td className="py-4 px-4 font-body text-[var(--color-text-muted)]">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
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

export default AdminAICaptionsPage;
