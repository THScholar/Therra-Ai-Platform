"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { ShoppingBag, MessageCircle } from "lucide-react";

export default function OrdersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: ordersData } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await fetch("/api/orders");
      if (!response.ok) throw new Error("Failed to fetch orders");
      return response.json();
    },
    refetchInterval: 3000,
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({ orderId, status }) => {
      const response = await fetch("/api/orders/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      if (!response.ok) throw new Error("Failed to update order");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const orders = ordersData?.orders || [];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
      case "processing":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "completed":
        return "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800";
      default:
        return "bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800";
    }
  };

  const getChannelIcon = (channel) => {
    if (channel === "whatsapp") return "💚";
    if (channel === "telegram") return "✈️";
    return "🌐";
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
          title="Orders"
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-black dark:text-white font-inter">
              Recent Orders
            </h2>
            <p className="text-sm text-[#6E6E6E] dark:text-[#888888] font-inter">
              Updates in real-time
            </p>
          </div>

          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6E6E6] dark:border-[#333333] p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-b from-[#34D058] to-[#22C55E] rounded-xl flex items-center justify-center flex-shrink-0">
                      <ShoppingBag size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-black dark:text-white font-inter">
                          {order.customer_name}
                        </h3>
                        <span className="text-lg">
                          {getChannelIcon(order.channel)}
                        </span>
                      </div>
                      <p className="text-sm text-[#6E6E6E] dark:text-[#888888] font-inter mb-1">
                        {order.product_name} × {order.quantity}
                      </p>
                      <p className="text-xs text-[#6E6E6E] dark:text-[#888888] font-inter">
                        {new Date(order.created_at).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="text-xl font-bold text-black dark:text-white font-sora">
                      {formatCurrency(order.total_amount)}
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderMutation.mutate({
                            orderId: order.id,
                            status: e.target.value,
                          })
                        }
                        className={`px-3 py-1 rounded-lg border text-xs font-medium font-inter ${getStatusColor(order.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {orders.length === 0 && (
              <div className="text-center py-12">
                <ShoppingBag
                  size={48}
                  className="mx-auto mb-4 text-[#6E6E6E] dark:text-[#888888]"
                />
                <p className="text-[#6E6E6E] dark:text-[#888888] font-inter">
                  No orders yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
