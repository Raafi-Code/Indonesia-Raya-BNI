"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-5xl transition-all duration-300">
      <nav className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200/50 dark:border-gray-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-[1.8rem] transition-colors duration-300 p-2 flex items-center justify-between">
        
        {/* Left Side - Logo */}
        <div className="flex items-center z-10 pl-2 lg:pl-3 w-auto md:w-1/3">
          {/* Logo Pill */}
          <div className="flex items-center gap-2 sm:gap-3 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full border border-emerald-100 dark:border-emerald-800/30 w-max">
            <img src="/ryurex-logo.png" alt="Ryurex Logo" className="h-5 sm:h-6 w-auto object-contain" />
            <span className="font-bold text-xs sm:text-sm text-emerald-900 dark:text-emerald-100 whitespace-nowrap hidden sm:block">
              Ryurex Corporation
            </span>
          </div>
        </div>

        {/* Center - Texts (Hidden on Mobile to prevent overlapping) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center gap-2 z-10 pointer-events-none w-max">
          <div className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-orange-500"></span>
          </div>
          <span className="text-[11px] sm:text-sm font-bold text-gray-800 dark:text-gray-100 whitespace-nowrap">
            Auto Play Indonesia Raya
          </span>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-2 sm:gap-3 pr-2">
          {/* Contact Button */}
          <Link
            href="https://wa.me/6282252877171"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 sm:p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all hover:scale-105 active:scale-95"
            title="Support via WhatsApp"
          >
            <FaWhatsapp className="w-5 h-5" />
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2.5 sm:p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all hover:scale-105 active:scale-95"
            aria-label="Toggle Theme"
          >
            {mounted && theme === "dark" ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </nav>
    </div>
  );
}
