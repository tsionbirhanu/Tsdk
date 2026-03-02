"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [homeChurch, setHomeChurch] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState<"am" | "en" | "">(
    ""
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [touched, setTouched] = useState(false);

  const fieldErrors = useMemo(() => {
    if (!touched) return {};
    const errs: Record<string, string> = {};

    if (!fullName.trim()) errs.fullName = "Full name is required";
    if (!email.trim()) errs.email = "Email is required";
    if (!password.trim()) errs.password = "Password is required";
    if (!preferredLanguage) errs.preferredLanguage = "Select a language";
    if (!agree) errs.agree = "Please agree to the Terms & Condition.";

    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim()))
      errs.email = "Enter a valid email";

    if (password && password.length < 8)
      errs.password = "Password must be at least 8 characters";

    return errs;
  }, [touched, fullName, email, phone, password, preferredLanguage, agree]);

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
    phone,
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
          phone,
          home_church: homeChurch,
          preferred_language: preferredLanguage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Registration failed");
        setLoading(false);
        return;
      }

      if (data?.data?.session) {
        const session = data.data.session;
        localStorage.setItem("access_token", session.access_token || "");
        if (session.refresh_token)
          localStorage.setItem("refresh_token", session.refresh_token);
        if (session.user)
          localStorage.setItem("user", JSON.stringify(session.user));
      }

      setLoading(false);
      router.push("/");
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden px-4 py-10">
      {/* Background Image */}
      <Image
        src="/auth-background.png"
        alt="Background"
        fill
        priority
        className="object-cover"
      />

      {/* Warm overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#d4b896]/45 via-[#c9a87a]/35 to-[#a07040]/45" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[420px] rounded-[22px] shadow-[0_22px_70px_rgba(0,0,0,0.35)] px-7 py-8"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(245,232,215,0.20) 40%, rgba(230,210,185,0.22) 70%, rgba(220,200,175,0.24) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Header */}
        <motion.div
          className="flex flex-col items-center mb-7"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <div className="w-[70px] h-[70px] rounded-full bg-gradient-to-b from-[#c9a478] to-[#8b6840] flex items-center justify-center shadow-[0_12px_25px_rgba(0,0,0,0.25)] border-[3px] border-white/40 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-white/90"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v1.2c0 .66.54 1.2 1.2 1.2h16.8c.66 0 1.2-.54 1.2-1.2v-1.2c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>

          <h1 className="text-[26px] sm:text-[28px] font-extrabold text-[#5a3a1a] text-center tracking-wide">
            Create your account
          </h1>
          <p className="text-sm font-semibold text-[#6b4a2a] mt-1">
            Join the TSEDQ community
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <InputRow
            icon={null}
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            type="text"
            error={fieldErrors.fullName}
          />

          <InputRow
            icon={null}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            error={fieldErrors.email}
          />

          <InputRow
            icon={null}
            placeholder="Phone (Optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
          />

          <InputRow
            icon={null}
            placeholder="Home Church"
            value={homeChurch}
            onChange={(e) => setHomeChurch(e.target.value)}
            type="text"
          />

          {/* Preferred language custom dropdown */}
          <LanguageDropdown
            icon={null}
            value={preferredLanguage}
            onChange={(val) => setPreferredLanguage(val as "am" | "en")}
            error={fieldErrors.preferredLanguage}
            options={[
              { value: "am", label: "Amharic (አማርኛ)" },
              { value: "en", label: "English" },
            ]}
            placeholder="Language preference"
          />

          {/* Password */}
          <div>
            <fieldset
              className={`rounded-md px-4 py-2.5 shadow-[0_4px_10px_rgba(74,46,20,0.22)]
                          border ${
                            fieldErrors.password ? "border-red-400" : "border-[#2b190b]"
                          }`}
            >
              <legend className="px-2 text-sm text-[#3b2411] font-semibold select-none">
                Password
              </legend>

              <div className="flex items-center gap-2">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="flex-1 bg-transparent text-[#2f1c0d] text-sm font-medium
                             outline-none border-0 focus:outline-none focus:ring-0"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-[#6b4a2a]/70 hover:text-[#3b2411] focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </fieldset>

            {fieldErrors.password && (
              <p className="mt-1 text-[12px] text-red-700">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Terms */}
          <div>
            <div className="flex items-center gap-2.5 pt-1">
              <input
                id="agree"
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="h-[18px] w-[18px] rounded border-[#d9c6a8] accent-[#5a3a1a]"
              />
              <label
                htmlFor="agree"
                className="text-[15px] font-bold text-[#3b2411] drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
              >
                I agree with the{" "}
                <Link
                  href="#"
                  className="text-[#4a2a0a] font-extrabold underline underline-offset-2 hover:text-[#2a1600]"
                >
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

          {/* Continue */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full h-11 rounded-[10px] border border-[#8b7252] bg-white/30 text-[#5a3a1a] font-semibold text-[14px]
                       shadow-[0_10px_25px_rgba(0,0,0,0.18)]
                       hover:bg-white/55 active:bg-white/65 transition
                       disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          {/* Footer */}
          <p className="text-center text-[16px] text-[#3b2411] pt-3 font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-[#4a2a0a] font-extrabold underline underline-offset-2 hover:text-[#2a1600]"
            >
              Login here
            </Link>
          </p>
          <div className="pt-2 text-center">
            <Link
              href="/"
              className="text-sm text-[#3b2411] font-semibold hover:text-[#2a1600]"
            >
              ↩ Back to Home
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/** Text input row */
function InputRow({
  icon,
  placeholder,
  value,
  onChange,
  type,
  error,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  error?: string;
}) {
  return (
    <div>
      <fieldset
        className={`rounded-md px-4 py-2.5 shadow-[0_4px_10px_rgba(74,46,20,0.22)]
                    border ${error ? "border-red-400" : "border-[#2b190b]"}`}
      >
        <legend className="px-2 text-sm text-[#3b2411] font-semibold select-none flex items-center gap-1">
          <span className="inline-flex items-center justify-center text-[#5a3a1a]">
            {icon}
          </span>
          <span>{placeholder}</span>
        </legend>

        <div className="flex items-center gap-2">
          <input
            type={type}
            value={value}
            onChange={onChange}
            className="flex-1 bg-transparent text-[#2f1c0d] text-sm font-medium
                       outline-none border-0 focus:outline-none focus:ring-0"
          />
        </div>
      </fieldset>

      {error && <p className="mt-1 text-[12px] text-red-700">{error}</p>}
    </div>
  );
}

/** Custom dropdown styled like InputRow with placeholder (no icon) */
function LanguageDropdown({
  icon,
  value,
  onChange,
  options,
  error,
  placeholder,
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <div ref={dropdownRef}>
      <fieldset
        className={`rounded-md px-4 py-2.5 shadow-[0_4px_10px_rgba(74,46,20,0.22)]
                    border ${error ? "border-red-400" : "border-[#2b190b]"}`}
      >
        <legend className="px-2 text-sm text-[#3b2411] font-semibold select-none">
          {placeholder}
        </legend>

        <div className="relative">
          <div
            onClick={() => setIsOpen((prev) => !prev)}
            className={`w-full h-11 rounded-[10px] border bg-transparent px-3 text-sm font-medium
                       shadow-[0_6px_18px_rgba(0,0,0,0.10)] cursor-pointer
                       flex items-center
                       focus:outline-none
                       ${error ? "border-red-400" : "border-[#d9c6a8]"}
                       ${selectedLabel ? "text-[#3b2411]" : "text-[#3b2411]/50"}`}
          >
            {selectedLabel || "Select language"}
          </div>

          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#5a3a1a]/60">
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>

          {isOpen && (
            <ul
              className="absolute z-50 w-full mt-1 rounded-[10px] border border-[#d9c6a8] bg-[#f9f5ed]
                          shadow-[0_10px_30px_rgba(0,0,0,0.18)] overflow-hidden"
            >
              {options.map((option) => (
                <li
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-3 text-sm font-medium cursor-pointer transition-colors
                             ${
                               value === option.value
                                 ? "bg-[#5a3a1a]/10 text-[#3b2411] font-semibold"
                                 : "text-[#3b2411] hover:bg-[#5a3a1a]/5"
                             }`}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </fieldset>

      {error && <p className="mt-1 text-[12px] text-red-700">{error}</p>}
    </div>
  );
}

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
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
  );
}

function EyeOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
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
      <path d="M12 4c5 0 9.27 3.11 11 8-.37.96-.85 1.87-1.44 2.69" />
    </svg>
  );
}

