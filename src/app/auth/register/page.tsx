"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/api/auth-context";
import { auth, churches, ApiError, Church } from "@/lib/api/client";

type Lang = "am" | "en" | "or" | "";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [homeChurch, setHomeChurch] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState<Lang>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [churchList, setChurchList] = useState<Church[]>([]);
  const [loadingChurches, setLoadingChurches] = useState(true);
  const [success, setSuccess] = useState(false);

  // Load churches on component mount
  useEffect(() => {
    const loadChurches = async () => {
      try {
        const list = await churches.list();
        setChurchList(list);
      } catch (error) {
        console.error("Failed to load churches:", error);
      } finally {
        setLoadingChurches(false);
      }
    };
    loadChurches();
  }, []);

  const fieldErrors = useMemo(() => {
    if (!touched) return {} as Record<string, string>;
    const errs: Record<string, string> = {};

    if (!fullName.trim()) errs.fullName = "Full name is required";
    if (!email.trim()) errs.email = "Email is required";
    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim()))
      errs.email = "Enter a valid email";

    if (!preferredLanguage) errs.preferredLanguage = "Select a language";

    if (!password.trim()) errs.password = "Password is required";
    if (password && password.length < 8)
      errs.password = "Password must be at least 8 characters";

    if (!agree) errs.agree = "Please agree to the Terms & Condition.";

    return errs;
  }, [touched, fullName, email, password, preferredLanguage, agree]);

  const canSubmit = useMemo(() => {
    return (
      fullName.trim() &&
      preferredLanguage &&
      email.trim() &&
      password.trim() &&
      agree &&
      !loading &&
      Object.keys(fieldErrors).length === 0
    );
  }, [
    fullName,
    preferredLanguage,
    email,
    password,
    agree,
    loading,
    fieldErrors,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setError("");
    if (Object.keys(fieldErrors).length > 0) return;

    setLoading(true);
    try {
      await auth.register({
        email,
        password,
        full_name: fullName,
        phone: phone || undefined,
        preferred_language: preferredLanguage,
        church_id: homeChurch || undefined,
      });

      // Show success message and redirect to login
      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden px-4 py-10">
      <Image
        src="/images/image1.jpg"
        alt="Background"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#d4b896]/45 via-[#c9a87a]/35 to-[#a07040]/45" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[420px] rounded-[24px] pt-16 pb-10 px-10 shadow-[0_18px_60px_rgba(0,0,0,0.3)]"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(245,232,215,0.20) 40%, rgba(230,210,185,0.22) 70%, rgba(220,200,175,0.24) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}>
        {/* Avatar */}
        <motion.div
          className="absolute -top-11 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}>
          <div className="w-[78px] h-[78px] rounded-full bg-gradient-to-b from-[#c9a478] to-[#8b6840] flex items-center justify-center shadow-lg border-[3px] border-white/40">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-white/90"
              viewBox="0 0 24 24"
              fill="currentColor">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v1.2c0 .66.54 1.2 1.2 1.2h16.8c.66 0 1.2-.54 1.2-1.2v-1.2c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
        </motion.div>

        {/* Title */}
        <h2 className="text-center text-3xl font-bold text-[#5a3a1a] mb-2 tracking-wide">
          {success ? "Account Created!" : "Create your account"}
        </h2>
        <p className="text-center text-base text-[#6b4a2a] mb-6">
          {success
            ? "Registration successful. Redirecting to login..."
            : "Join the TSEDQ community"}
        </p>

        {success ? (
          <div className="text-center space-y-4">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              Your account has been created successfully! You will be redirected
              to the login page in a moment.
            </div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5a3a1a] mx-auto"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <LabeledWhiteInput
              label="Full Name"
              value={fullName}
              onChange={setFullName}
              placeholder="Your full name"
              disabled={loading}
              error={fieldErrors.fullName}
            />

            <LabeledWhiteInput
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              disabled={loading}
              error={fieldErrors.email}
            />

            <LabeledWhiteInput
              label="Phone (Optional)"
              value={phone}
              onChange={setPhone}
              placeholder="09xxxxxxxx"
              disabled={loading}
            />

            {/* Home Church Dropdown */}
            <div className="space-y-1.5">
              <label className="block text-base font-semibold text-[#3b2411]">
                Home Church (Optional)
              </label>
              <select
                value={homeChurch}
                onChange={(e) => setHomeChurch(e.target.value)}
                disabled={loadingChurches || loading}
                className="w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-[#2f1c0d]
                        shadow-[0_6px_18px_rgba(0,0,0,0.12)]
                        border border-black/10 outline-none focus:ring-0
                        disabled:opacity-50 disabled:cursor-not-allowed">
                <option value="">
                  {loadingChurches
                    ? "Loading churches..."
                    : "Select church (optional)"}
                </option>
                {churchList.map((church) => (
                  <option key={church.id} value={church.id}>
                    {church.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-[#3b2411]">
                Language preference
              </label>

              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value as Lang)}
                disabled={loading}
                className={`w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-[#2f1c0d]
                          shadow-[0_6px_18px_rgba(0,0,0,0.12)]
                          border outline-none focus:ring-0
                          disabled:opacity-50 disabled:cursor-not-allowed
                          ${fieldErrors.preferredLanguage ? "border-red-400" : "border-black/10"}`}>
                <option value="" disabled>
                  Select language
                </option>
                <option value="am">Amharic (አማርኛ)</option>
                <option value="en">English</option>
                <option value="or">Oromiffa (Afaan Oromo)</option>
              </select>

              {fieldErrors.preferredLanguage && (
                <p className="text-[12px] text-red-700">
                  {fieldErrors.preferredLanguage}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-[#3b2411]">
                Password
              </label>

              <div
                className={`flex items-center gap-2 rounded-xl bg-white px-4 py-3
                          shadow-[0_6px_18px_rgba(0,0,0,0.12)] border
                          ${fieldErrors.password ? "border-red-400" : "border-black/10"}`}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  placeholder="••••••••"
                  className="flex-1 bg-white text-[#2f1c0d] text-sm font-medium outline-none border-0 focus:ring-0 placeholder:text-[#7a5a3a]/60 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-[#4a2e14]/70 hover:text-[#4a2e14] focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>

              {fieldErrors.password && (
                <p className="text-[12px] text-red-700">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="pt-1">
              <div className="flex items-center gap-2.5">
                <input
                  id="agree"
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  disabled={loading}
                  className="h-[18px] w-[18px] rounded border-[#d9c6a8] accent-[#5a3a1a] disabled:opacity-50"
                />
                <label
                  htmlFor="agree"
                  className="text-sm font-semibold text-[#3b2411]">
                  I agree with the{" "}
                  <Link
                    href="#"
                    className="text-[#4a2a0a] font-extrabold underline underline-offset-2 hover:text-[#2a1600]">
                    Terms &amp; Condition
                  </Link>
                </label>
              </div>
              {fieldErrors.agree && (
                <p className="mt-1 text-[12px] text-red-700 font-semibold">
                  {fieldErrors.agree}
                </p>
              )}
            </div>

            {error && (
              <p className="text-[13px] text-red-700 pt-1 font-medium">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-[#5a3a1a] border border-[#8b7252]
                       bg-white/30 hover:bg-white/50 active:bg-white/60 transition shadow-sm
                       disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Creating..." : "Create Account"}
            </button>

            <p className="text-center text-sm font-semibold text-[#3b2411]">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-extrabold text-[#4a2a0a] underline underline-offset-2 hover:text-[#2a1600]">
                Login
              </Link>
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
}

function LabeledWhiteInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-base font-semibold text-[#3b2411]">
        {label}
      </label>
      <div
        className={`rounded-xl bg-white px-4 py-3 shadow-[0_6px_18px_rgba(0,0,0,0.12)] border ${
          error ? "border-red-400" : "border-black/10"
        }`}>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full bg-white text-[#2f1c0d] text-sm font-medium outline-none border-0 focus:ring-0 placeholder:text-[#7a5a3a]/60 disabled:opacity-50"
        />
      </div>
      {error && <p className="text-[12px] text-red-700">{error}</p>}
    </div>
  );
}

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12>" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3.11-11-8a10.94 10.94 0 0 1 3.06-4.94" />
      <path d="M14.12 14.12A3 3 0 0 1 9.88 9.88" />
      <path d="M1 1l22 22" />
    </svg>
  );
}
