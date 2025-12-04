"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  MessageSquare,
  Sparkles,
  LogOut,
  X,
  Bot,
} from "lucide-react";

export default function DashboardSidebar({ onClose }) {
  const [activePath, setActivePath] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setActivePath(window.location.pathname);
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("therraAuth");
      localStorage.removeItem("therraUser");
      window.location.href = "/login/umkm";
    }
  };

  const handleNavigation = (path) => {
    if (typeof window !== "undefined") {
      window.location.href = path;
    }
  };

  const menuItems = [
    { name: "Analytics", icon: LayoutDashboard, path: "/dashboard/analytics" },
    { name: "Products", icon: Package, path: "/dashboard/products" },
    { name: "Orders", icon: ShoppingBag, path: "/dashboard/orders" },
    { name: "Therra AI", icon: Sparkles, path: "/dashboard/therra" },
    { name: "Connect AI", icon: Bot, path: "/dashboard/connect-ai" },
    { name: "Bot Logs", icon: MessageSquare, path: "/dashboard/bot-logs" },
  ];

  return (
    <div className="w-60 bg-[#F3F3F3] dark:bg-[#1A1A1A] flex-shrink-0 flex flex-col h-full">
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-b from-[#34D058] to-[#22C55E] rounded-xl flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-black dark:text-white font-inter">
              Therra
            </h2>
            <p className="text-xs text-[#6E6E6E] dark:text-[#888888] font-inter">
              UMKM Platform
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-lg transition-colors"
        >
          <X size={20} className="text-black/70 dark:text-white/70" />
        </button>
      </div>

      <nav className="flex-1 px-4 pt-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePath === item.path;

            return (
              <button
                key={item.name}
                onClick={() => {
                  handleNavigation(item.path);
                  if (
                    onClose &&
                    typeof window !== "undefined" &&
                    window.innerWidth < 1024
                  ) {
                    onClose();
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-white dark:bg-[#262626] border border-[#E4E4E4] dark:border-[#404040] text-black dark:text-white"
                    : "text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 active:bg-white/70 dark:active:bg-white/15 active:scale-[0.98]"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium text-sm font-inter">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 active:scale-95"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm font-inter">Logout</span>
        </button>
      </div>
    </div>
  );
}
