"use client";

import { useState, useEffect } from "react";
import { Menu, Bell } from "lucide-react";

export default function DashboardHeader({ onMenuClick, title }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("therraUser");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  return (
    <div className="h-16 bg-[#F3F3F3] dark:bg-[#1A1A1A] flex items-center justify-between px-4 md:px-6 border-b border-[#E6E6E6] dark:border-[#333333]">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
        >
          <Menu size={20} className="text-black/70 dark:text-white/70" />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-black dark:text-white font-inter">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button className="w-10 h-10 rounded-full bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#333333] flex items-center justify-center hover:bg-[#F8F8F8] dark:hover:bg-[#262626] transition-all duration-150 active:scale-95">
          <Bell size={18} className="text-[#4B4B4B] dark:text-[#B0B0B0]" />
        </button>
        <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#333333] rounded-full">
          <div className="w-6 h-6 rounded-full bg-gradient-to-b from-[#34D058] to-[#22C55E] flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {user?.businessName?.[0] || "U"}
            </span>
          </div>
          <span className="text-sm font-medium text-black dark:text-white font-inter hidden sm:block">
            {user?.businessName || "UMKM"}
          </span>
        </div>
      </div>
    </div>
  );
}
