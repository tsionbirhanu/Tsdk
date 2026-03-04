"use client";

import React, { useState, useEffect } from "react";
import { Upload, ChevronDown, Save } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { useAuth } from "@/lib/api/auth-context";
import { users, churches, media } from "@/lib/api/client";
import type { User, Church } from "@/lib/api/client";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [churchList, setChurchList] = useState<Church[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    homeChurch: "",
    language: "en",
    voiceEnabled: false,
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const initData = async () => {
      try {
        const [userData, churchData] = await Promise.all([
          users.me(),
          churches.list()
        ]);
        
        setUserProfile(userData);
        setChurchList(churchData);
        
        // Initialize form data
        setFormData({
          fullName: userData.full_name,
          phone: userData.phone || "",
          email: user?.email || "",
          homeChurch: userData.church_id || "",
          language: userData.preferred_language || "en",
          voiceEnabled: userData.voice_enabled,
        });
      } catch (error) {
        console.error("Failed to load profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      initData();
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    let newValue: string | boolean = value;

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      newValue = target.checked;
    }

    setFormData((prev) => {
      const updated = { ...prev, [name]: newValue };
      setHasChanges(
        userProfile && JSON.stringify(updated) !==
          JSON.stringify({
            fullName: userProfile.full_name,
            phone: userProfile.phone || "",
            email: user?.email || "",
            homeChurch: userProfile.church_id || "",
            language: userProfile.preferred_language || "en",
            voiceEnabled: userProfile.voice_enabled,
          })
      );
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;
    
    setIsSaving(true);
    try {
      const updateData = {
        full_name: formData.fullName,
        phone: formData.phone || null,
        church_id: formData.homeChurch || null,
        preferred_language: formData.language as "en" | "am" | "or",
        voice_enabled: formData.voiceEnabled,
      };
      
      const updatedUser = await users.updateMe(updateData);
      setUserProfile(updatedUser);
      setHasChanges(false);
      
      // Success message could be shown via toast in production
      console.log("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadPhoto = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      setIsUploading(true);
      try {
        const mediaResult = await media.upload(file, "tsedk-profiles");
        
        // Update user profile with new media ID
        const updatedUser = await users.updateMe({
          profile_media_id: mediaResult.id
        });
        
        setUserProfile(updatedUser);
        console.log("Profile photo updated successfully!");
      } catch (error) {
        console.error("Failed to upload photo:", error);
      } finally {
        setIsUploading(false);
      }
    };
    input.click();
  };

  const languages = [
    { code: "en", name: "English" },
    { code: "am", name: "Amharic" },
    { code: "or", name: "Oromo" }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-surface)] flex">
      <Sidebar />

      <main className="flex-1 ml-72 p-8">
        <PageHeader title="My Profile" />

        <div className="max-w-2xl">
          {/* Avatar Section */}
          <div className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-8 mb-8">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-display font-bold text-2xl mb-4">
                  {currentUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[var(--color-accent)] rounded-full flex items-center justify-center cursor-pointer hover:bg-[var(--color-accent)]/90 transition-colors">
                  <Upload className="w-4 h-4 text-[var(--color-primary)]" />
                </div>
              </div>
              <h2 className="font-display text-xl font-semibold text-[var(--color-text)] mb-2">
                {currentUser.name}
              </h2>
              <StatusBadge
                variant={
                  currentUser.role === "admin"
                    ? "admin"
                    : currentUser.role === "treasurer"
                      ? "treasurer"
                      : "member"
                }>
                {currentUser.role}
              </StatusBadge>
              <div className="mt-4">
                <Button variant="outline" onClick={handleUploadPhoto}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
              </div>
            </div>
          </div>

          {/* Personal Info Form */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-6 mb-6">
              <h3 className="font-display text-lg font-semibold text-[var(--color-text)] mb-6">
                Personal Information
              </h3>

              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block font-body font-medium text-[var(--color-text)] mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-white font-body focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block font-body font-medium text-[var(--color-text)] mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-white font-body focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
                    placeholder="+251 9XX XXX XXX"
                  />
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="block font-body font-medium text-[var(--color-text)] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] font-body text-[var(--color-text-muted)] cursor-not-allowed"
                    readOnly
                  />
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    Contact support to change your email address
                  </p>
                </div>

                {/* Language */}
                <div>
                  <label className="block font-body font-medium text-[var(--color-text)] mb-2">
                    Language Preference
                  </label>
                  <div className="relative">
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pr-10 rounded-lg border border-[var(--color-border)] bg-white font-body appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent">
                      {languages.map((language) => (
                        <option key={language} value={language}>
                          {language}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] w-4 h-4 pointer-events-none" />
                  </div>
                </div>

                {/* Voice Enabled Toggle */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--color-surface)]">
                  <div>
                    <label className="font-body font-medium text-[var(--color-text)] block">
                      Voice Notifications
                    </label>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      Enable audio notifications for important updates
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="voiceEnabled"
                      checked={formData.voiceEnabled}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--color-accent)]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-accent)]"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Home Church Section */}
            <div className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-6 mb-6">
              <h3 className="font-display text-lg font-semibold text-[var(--color-text)] mb-6">
                Church Information
              </h3>

              <div>
                <label className="block font-body font-medium text-[var(--color-text)] mb-2">
                  Home Church
                </label>
                <div className="relative">
                  <select
                    name="homeChurch"
                    value={formData.homeChurch}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-10 rounded-lg border border-[var(--color-border)] bg-white font-body appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent">
                    {mockChurches.map((church) => (
                      <option key={church.id} value={church.name}>
                        {church.name} - {church.location}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] w-4 h-4 pointer-events-none" />
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  Your home church affects which campaigns and activities you
                  see
                </p>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-lg shadow-warm border border-[var(--color-border)] p-6 mb-6">
              <h3 className="font-display text-lg font-semibold text-[var(--color-text)] mb-6">
                Account Information
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-body text-[var(--color-text-muted)]">
                    Member since
                  </span>
                  <span className="font-body font-medium text-[var(--color-text)]">
                    {new Date(currentUser.joinedDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-[var(--color-text-muted)]">
                    Account type
                  </span>
                  <StatusBadge
                    variant={
                      currentUser.role === "admin"
                        ? "admin"
                        : currentUser.role === "treasurer"
                          ? "treasurer"
                          : "member"
                    }>
                    {currentUser.role}
                  </StatusBadge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-[var(--color-text-muted)]">
                    User ID
                  </span>
                  <span className="font-mono text-sm text-[var(--color-text-muted)]">
                    #{currentUser.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!hasChanges}>
              <Save className="w-4 h-4 mr-2" />
              {hasChanges ? "Save Changes" : "No Changes to Save"}
            </Button>
          </form>

          {/* Security Note */}
          <div className="mt-6 p-4 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)]">
            <p className="text-sm text-[var(--color-text-muted)]">
              <span className="font-semibold">Security:</span> Your personal
              information is encrypted and securely stored. Only you and
              authorized church administrators can view your profile details.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
