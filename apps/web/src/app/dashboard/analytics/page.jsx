"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Plus,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");

  const { data: analyticsData, refetch } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const response = await fetch("/api/analytics");
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    },
    refetchInterval: 3000,
  });

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/analytics/add-expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(expenseAmount),
          description: expenseDescription,
        }),
      });

      if (!response.ok) throw new Error("Failed to add expense");

      setExpenseAmount("");
      setExpenseDescription("");
      setShowExpenseForm(false);
      refetch();
    } catch (error) {
      console.error("Add expense error:", error);
    }
  };

  const summary = analyticsData?.summary || {};
  const chartData = analyticsData?.dailyData || [];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
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
          title="Analytics"
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6E6E6] dark:border-[#333333] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                  <TrendingUp
                    size={20}
                    className="text-green-600 dark:text-green-400"
                  />
                </div>
                <span className="text-sm font-medium text-[#6E6E6E] dark:text-[#888888] font-inter">
                  Total Income
                </span>
              </div>
              <div className="text-2xl font-bold text-black dark:text-white font-sora">
                {formatCurrency(summary.total_income || 0)}
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6E6E6] dark:border-[#333333] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                  <TrendingDown
                    size={20}
                    className="text-red-600 dark:text-red-400"
                  />
                </div>
                <span className="text-sm font-medium text-[#6E6E6E] dark:text-[#888888] font-inter">
                  Total Expense
                </span>
              </div>
              <div className="text-2xl font-bold text-black dark:text-white font-sora">
                {formatCurrency(summary.total_expense || 0)}
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6E6E6] dark:border-[#333333] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                  <DollarSign
                    size={20}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
                <span className="text-sm font-medium text-[#6E6E6E] dark:text-[#888888] font-inter">
                  Net Profit
                </span>
              </div>
              <div className="text-2xl font-bold text-black dark:text-white font-sora">
                {formatCurrency(summary.net_profit || 0)}
              </div>
            </div>

            <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6E6E6] dark:border-[#333333] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                  <ShoppingCart
                    size={20}
                    className="text-purple-600 dark:text-purple-400"
                  />
                </div>
                <span className="text-sm font-medium text-[#6E6E6E] dark:text-[#888888] font-inter">
                  Total Orders
                </span>
              </div>
              <div className="text-2xl font-bold text-black dark:text-white font-sora">
                {summary.total_orders || 0}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6E6E6] dark:border-[#333333] p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black dark:text-white font-inter">
                Revenue Chart
              </h2>
              <button
                onClick={() => setShowExpenseForm(!showExpenseForm)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-[#34D058] to-[#22C55E] text-white rounded-xl hover:from-[#2EC750] hover:to-[#1FB34D] transition-all duration-150 active:scale-95"
              >
                <Plus size={16} />
                <span className="text-sm font-medium font-inter">
                  Add Expense
                </span>
              </button>
            </div>

            {showExpenseForm && (
              <form
                onSubmit={handleAddExpense}
                className="mb-6 p-4 bg-[#F9F9F9] dark:bg-[#262626] rounded-xl"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#2B2B2B] dark:text-[#CCCCCC] font-inter">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      className="w-full h-10 px-4 rounded-lg bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#404040] text-black dark:text-white font-inter"
                      placeholder="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#2B2B2B] dark:text-[#CCCCCC] font-inter">
                      Description
                    </label>
                    <input
                      type="text"
                      value={expenseDescription}
                      onChange={(e) => setExpenseDescription(e.target.value)}
                      className="w-full h-10 px-4 rounded-lg bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#404040] text-black dark:text-white font-inter"
                      placeholder="Expense description"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-b from-[#34D058] to-[#22C55E] text-white rounded-lg hover:from-[#2EC750] hover:to-[#1FB34D] transition-all duration-150 active:scale-95 font-inter text-sm"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowExpenseForm(false)}
                    className="px-4 py-2 bg-white dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#404040] text-black dark:text-white rounded-lg hover:bg-[#F9F9F9] dark:hover:bg-[#2A2A2A] transition-all duration-150 active:scale-95 font-inter text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6E6E6" />
                <XAxis dataKey="date" stroke="#6E6E6E" />
                <YAxis stroke="#6E6E6E" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#22C55E"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#FF4B4B"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
