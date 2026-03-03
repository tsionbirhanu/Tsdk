"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function DashboardPage() {
  const supabase = createClientComponentClient();
  const [fullName, setFullName] = useState("");
  const [memberSince, setMemberSince] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          // Try fetching from profiles table first
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, created_at")
            .eq("id", user.id)
            .single();

          if (profile?.full_name) {
            setFullName(profile.full_name);
          } else {
            // Fallback to user metadata
            const meta = user.user_metadata;
            const name =
              meta?.full_name ||
              meta?.name ||
              `${meta?.first_name || ""} ${meta?.last_name || ""}`.trim() ||
              user.email ||
              "Member";
            setFullName(name);
          }

          // Set member since date
          const createdAt = profile?.created_at || user.created_at;
          if (createdAt) {
            const date = new Date(createdAt);
            // Convert to Ethiopian calendar year (approximate: Gregorian - 7 or 8)
            const ethYear = date.getMonth() >= 8
              ? date.getFullYear() - 7
              : date.getFullYear() - 8;
            setMemberSince(`${ethYear} ዓ.ም.`);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [supabase]);

  return (
    <div className="flex-1 bg-[#1a1a1a] min-h-screen text-white">
      {/* Top Header Bar */}
      <header className="flex items-center justify-between px-6 py-4 bg-[#2a2a2a]">
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center bg-[#3a3a3a] rounded-full overflow-hidden text-sm">
            <button className="px-3 py-1 bg-yellow-600 text-white rounded-full font-medium">
              EN
            </button>
            <button className="px-3 py-1 text-gray-300 hover:text-white">
              አማ
            </button>
            <button className="px-3 py-1 text-gray-300 hover:text-white">
              OM
            </button>
          </div>
          {/* Notification Bell */}
          <button className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6 text-gray-300 hover:text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V4a1 1 0 10-2 0v1.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold">
              2
            </span>
          </button>
        </div>
      </header>

      {/* Hero / Welcome Banner */}
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src="/dashboard-hero.jpg"
          alt="Church background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a]/90 to-transparent" />
        <div className="relative z-10 flex flex-col justify-end h-full px-6 pb-6">
          <p className="text-yellow-500 text-sm font-medium">God Bless You</p>
          {loading ? (
            <div className="mt-1 space-y-2">
              <div className="h-7 w-48 bg-gray-600 rounded animate-pulse" />
              <div className="h-4 w-36 bg-gray-700 rounded animate-pulse" />
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mt-1">{fullName}</h2>
              {memberSince && (
                <p className="text-gray-400 text-sm mt-1">
                  Member since {memberSince}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="p-6">
        {/* Add your dashboard content here */}
      </div>
    </div>
  );
}