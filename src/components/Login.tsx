'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Playfair_Display } from 'next/font/google';
import { AUTH_CONFIG } from '@/config';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] });

export default function Login() {
  const router = useRouter();
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
          className="rounded-[2rem] border border-white/40 min-h-[500px] pt-16 pb-14 px-10"
          style={{
            backgroundColor: 'rgba(243, 234, 223, 0.45)',
            backdropFilter: 'blur(15px)',
            boxShadow: '12px 26px 40px rgba(0,0,0,0.35)',
          }}
        >
          <h1 className={`${playfair.className} text-4xl font-bold text-center mb-8 tracking-tight`}>
            Login
          </h1>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="relative group">
              <label htmlFor="email" className="absolute -top-2.5 left-4 text-sm font-bold z-10 transition-colors px-1">
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
              <label htmlFor="password" className="absolute -top-2.5 left-4 text-sm font-bold z-10 transition-colors px-1">
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

            <div className="text-left -mt-2">
              <button type="button" className="text-xs font-bold hover:underline transition-all">
                Forgot password?
              </button>
            </div>

            <div className="flex items-center gap-4 py-1">
              <div className="h-[1px] flex-1 bg-[#5d4037]/20" />
              <span className="text-[11px] uppercase tracking-[0.15em] font-black whitespace-nowrap">or</span>
              <div className="h-[1px] flex-1 bg-[#5d4037]/20" />
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-white/30 hover:bg-white/50 border border-[#5d4037]/20 rounded-full py-3 transition-all group shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm font-bold group-hover:opacity-80">Google</span>
            </button>

            <div className="text-center mt-4">
              <p className="text-sm font-bold">
                Don't have an account?{' '}
                <button
                  type="button"
                  className="hover:underline transition-all"
                  onClick={() => router.push('/signup')}
                >
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
