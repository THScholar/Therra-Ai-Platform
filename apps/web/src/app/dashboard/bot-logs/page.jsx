"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { MessageSquare, User, Bot } from "lucide-react";

export default function BotLogsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [channelFilter, setChannelFilter] = useState("all");

  const { data: logsData } = useQuery({
    queryKey: ["bot-logs", channelFilter],
    queryFn: async () => {
      const url =
        channelFilter === "all"
          ? "/api/bot/save-log"
          : `/api/bot/save-log?channel=${channelFilter}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch logs");
      return response.json();
    },
    refetchInterval: 3000,
  });

  const logs = logsData?.logs || [];

  const getChannelIcon = (channel) => {
    if (channel === "whatsapp") return "💚";
    if (channel === "telegram") return "✈️";
    return "📱";
  };

  return (
    <div className="flex h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 lg:z-auto transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <DashboardSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          onMenuClick={() => setSidebarOpen(true)}
          title="Bot Logs"
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-black dark:text-white font-inter">
                Customer Conversations
              </h2>
              <p className="text-sm text-[#6E6E6E] dark:text-[#888888] font-inter">
                Real-time bot interactions
              </p>
            </div>
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#404040] rounded-xl text-black dark:text-white font-inter"
            >
              <option value="all">All Channels</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="telegram">Telegram</option>
            </select>
          </div>

          <div className="space-y-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6E6E6] dark:border-[#333333] p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">{getChannelIcon(log.channel)}</span>
                  <span className="text-sm font-medium text-[#6E6E6E] dark:text-[#888888] font-inter">
                    {log.channel?.toUpperCase()}
                  </span>
                  <span className="text-xs text-[#6E6E6E] dark:text-[#888888] font-inter">
                    • {new Date(log.created_at).toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <User
                        size={16}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-black dark:text-white font-inter">
                          {log.customer_name || "Customer"}
                        </span>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl rounded-tl-none p-3">
                        <p className="text-sm text-black dark:text-white font-inter">
                          {log.customer_message}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot
                        size={16}
                        className="text-green-600 dark:text-green-400"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-black dark:text-white font-inter">
                          Bot
                        </span>
                        {log.intent && (
                          <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full font-inter">
                            {log.intent}
                          </span>
                        )}
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/10 rounded-2xl rounded-tl-none p-3">
                        <p className="text-sm text-black dark:text-white font-inter">
                          {log.bot_response}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {logs.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare
                  size={48}
                  className="mx-auto mb-4 text-[#6E6E6E] dark:text-[#888888]"
                />
                <p className="text-[#6E6E6E] dark:text-[#888888] font-inter">
                  No bot logs yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
