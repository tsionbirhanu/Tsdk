"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Login failed");
        setLoading(false);
        return;
      }

      if (data?.data?.session) {
        const session = data.data.session;
        localStorage.setItem("access_token", session.access_token || "");
        if (session.refresh_token) {
          localStorage.setItem("refresh_token", session.refresh_token);
        }
        if (session.user) {
          localStorage.setItem("user", JSON.stringify(session.user));
        }
      }

      setLoading(false);
      router.push("/");
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
        className="relative z-10 w-[88%] max-w-[380px] rounded-[24px] pt-16 pb-10 px-10 shadow-[0_18px_60px_rgba(0,0,0,0.3)]"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(245,232,215,0.20) 40%, rgba(230,210,185,0.22) 70%, rgba(220,200,175,0.24) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Avatar */}
        <motion.div
          className="absolute -top-11 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <div className="w-[78px] h-[78px] rounded-full bg-gradient-to-b from-[#c9a478] to-[#8b6840] flex items-center justify-center shadow-lg border-[3px] border-white/40">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-white/90"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v1.2c0 .66.54 1.2 1.2 1.2h16.8c.66 0 1.2-.54 1.2-1.2v-1.2c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
        </motion.div>

        {/* Title */}
        <h2 className="text-center text-2xl font-bold text-[#5a3a1a] mb-2 tracking-wide">
          Login
        </h2>
        <p className="text-center text-sm text-[#6b4a2a] mb-6">
          Sign in to your TSEDQ account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
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

          {/* Password */}
          <div>
            <fieldset className="rounded-md border border-[#2b190b] px-4 py-2.5 shadow-[0_4px_10px_rgba(74,46,20,0.22)]">
              <legend className="px-2 text-sm text-[#3b2411] font-semibold select-none">
                Password
              </legend>
              <div className="flex items-center gap-2">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="flex-1 bg-transparent text-[#2f1c0d] text-sm font-medium outline-none border-0 focus:outline-none focus:ring-0"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="text-[#4a2e14]/70 hover:text-[#4a2e14] focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3.11-11-8a10.94 10.94 0 0 1 3.06-4.94" />
                      <path d="M14.12 14.12A3 3 0 0 1 9.88 9.88" />
                      <path d="M1 1l22 22" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </fieldset>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-600 -mt-1">
              {error}
            </p>
          )}

          {/* Forgot password */}
          <div className="text-right">
            <Link
              href="/auth/forgot-password"
              className="text-sm font-semibold text-[#4a2e14] hover:text-[#2b190b] italic"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-[#5a3a1a] border border-[#8b7252] bg_white/30 bg-white/30 hover:bg-white/50 active:bg-white/60 transition shadow-sm disabled:opacity-50 mb-4"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Register prompt */}
          <p className="text-center text-sm font-semibold text-[#3b2411]">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="font-extrabold text-[#4a2a0a] underline underline-offset-2 hover:text-[#2a1600]"
            >
              Register
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

