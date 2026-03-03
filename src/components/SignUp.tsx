'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Playfair_Display } from 'next/font/google';
import { AUTH_CONFIG } from '@/config';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] });

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${AUTH_CONFIG.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#F3EADF',
        }}
      >
        <div
          className="absolute inset-0 backdrop-blur-[1px]"
          style={{ backgroundColor: AUTH_CONFIG.overlayColor }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at top center, rgba(255, 244, 230, 0.55) 0%, rgba(213, 167, 129, 0.25) 45%, rgba(90, 56, 34, 0.7) 100%)',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[460px] px-8 text-[#4b2e2e] transform scale-[0.9]">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20">
          <div className="w-24 h-24 rounded-full bg-[#C99972] border-4 border-white/90 flex items-center justify-center shadow-xl">
            <svg
              className="w-12 h-12"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="24" cy="17" r="7" stroke="white" strokeWidth="2.5" />
              <path
                d="M12 36C13.8 29.5 18.4 26 24 26C29.6 26 34.2 29.5 36 36"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <div
          className="rounded-[2rem] border border-white/40 min-h-[520px] pt-16 pb-14 px-10"
          style={{
            backgroundColor: 'rgba(243, 234, 223, 0.45)',
            backdropFilter: 'blur(15px)',
            boxShadow: '12px 26px 40px rgba(0,0,0,0.35)',
          }}
        >
          <h1 className={`${playfair.className} text-4xl font-bold text-center mb-8 tracking-tight`}>
            Sign Up
          </h1>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="relative group">
              <label
                htmlFor="fullName"
                className="absolute -top-2.5 left-4 text-sm font-bold z-10 transition-colors px-1"
              >
                Full Name
              </label>
              <div className="relative flex items-center">
                <input
                  id="fullName"
                  type="text"
                  className="w-full bg-white/20 border border-[#5d4037]/20 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#5d4037]/10 focus:border-[#5d4037]/40 transition-all font-medium"
                  style={{ boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)' }}
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div className="relative group">
              <label
                htmlFor="phone"
                className="absolute -top-2.5 left-4 text-sm font-bold z-10 transition-colors px-1"
              >
                Phone Number
              </label>
              <div className="relative flex items-center">
                <input
                  id="phone"
                  type="tel"
                  className="w-full bg-white/20 border border-[#5d4037]/20 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#5d4037]/10 focus:border-[#5d4037]/40 transition-all font-medium"
                  style={{ boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)' }}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="relative group">
              <label
                htmlFor="email"
                className="absolute -top-2.5 left-4 text-sm font-bold z-10 transition-colors px-1"
              >
                Email
              </label>
              <div className="relative flex items-center">
                <input
                  id="email"
                  type="email"
                  className="w-full bg-white/20 border border-[#5d4037]/20 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#5d4037]/10 focus:border-[#5d4037]/40 transition-all font-medium"
                  style={{ boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)' }}
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="relative group">
              <label
                htmlFor="language"
                className="absolute -top-2.5 left-4 text-sm font-bold z-10 transition-colors px-1"
              >
                Preferred Language
              </label>
              <div className="relative flex items-center">
                <select
                  id="language"
                  className="w-full bg-white/20 border border-[#5d4037]/20 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#5d4037]/10 focus:border-[#5d4037]/40 transition-all font-medium appearance-none"
                  style={{ boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)' }}
                  defaultValue="en"
                >
                  <option value="en">English</option>
                  <option value="am">Amharic</option>
                  <option value="af">Afan oromo</option>
                </select>
              </div>
            </div>

            <div className="relative group">
              <label
                htmlFor="password"
                className="absolute -top-2.5 left-4 text-sm font-bold z-10 transition-colors px-1"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="w-full bg-white/20 border border-[#5d4037]/20 rounded-xl py-3 px-4 pr-12 outline-none focus:ring-2 focus:ring-[#5d4037]/10 focus:border-[#5d4037]/40 transition-all font-medium"
                  style={{ boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)' }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-2 text-[#5d4037]/70 hover:text-[#5d4037] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" strokeWidth={1.5} />
                  ) : (
                    <Eye className="w-5 h-5" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 flex items-center justify-center rounded-full bg-[#C99972] hover:bg-[#b4855f] text-white font-semibold py-3 transition-all shadow-sm hover:shadow-md"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
