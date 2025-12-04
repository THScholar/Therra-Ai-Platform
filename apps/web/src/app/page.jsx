"use client";

import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.href = "/login/umkm";
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-b from-[#34D058] to-[#22C55E] rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
            <path
              d="M2 17L12 22L22 17"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-black dark:text-white font-inter">
          Therra UMKM
        </h1>
        <p className="text-sm text-[#6E6E6E] dark:text-[#888888] font-inter mt-2">
          Redirecting...
        </p>
      </div>
    </div>
  );
}
