"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Request failed");
        setLoading(false);
        return;
      }

      setMessage("If an account exists for this email, a reset link has been sent.");
      setLoading(false);
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <Image
        src="/auth-background.png"
        alt="Background"
        fill
        priority
        className="object-cover"
      />

      {/* Warm gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#d4b896]/45 via-[#c9a87a]/35 to-[#a07040]/45" />

      {/* Glass card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-[88%] max-w-[380px] rounded-[24px] pt-10 pb-10 px-8 shadow-[0_18px_60px_rgba(0,0,0,0.3)]"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(245,232,215,0.20) 40%, rgba(230,210,185,0.22) 70%, rgba(220,200,175,0.24) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Title */}
        <h2 className="text-center text-xl font-bold text-[#5a3a1a] mb-2 tracking-wide">
          Forgot Password
        </h2>
        <p className="text-center text-sm text-[#6b4a2a] mb-6">
          Enter your email to receive a reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <fieldset className="rounded-md border border-[#2b190b] px-4 py-2.5 shadow-[0_4px_10px_rgba(74,46,20,0.22)]">
              <legend className="px-2 text-sm text-[#3b2411] font-semibold select-none">
                Email
              </legend>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent text-[#2f1c0d] text-sm font-medium outline-none border-0 focus:outline-none focus:ring-0"
              />
            </fieldset>
          </div>

          {error && (
            <p className="text-xs text-red-600 -mt-1">
              {error}
            </p>
          )}
          {message && (
            <p className="text-xs text-green-700 -mt-1">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-[#5a3a1a] border border-[#8b7252] bg-white/30 hover:bg-white/50 active:bg-white/60 transition shadow-sm disabled:opacity-50 mb-2"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>

          <p className="text-center text-sm font-semibold text-[#3b2411]">
            Remembered your password?{" "}
            <Link
              href="/auth/login"
              className="font-extrabold text-[#4a2a0a] underline underline-offset-2 hover:text-[#2a1600]"
            >
              Back to Login
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

