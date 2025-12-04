"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { Package, Plus, AlertTriangle } from "lucide-react";

export default function ProductsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  const queryClient = useQueryClient();

  const { data: productsData } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
    refetchInterval: 3000,
  });

  const addProductMutation = useMutation({
    mutationFn: async (product) => {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error("Failed to add product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
      });
      setShowAddForm(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addProductMutation.mutate({
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category,
    });
  };

  const products = productsData?.products || [];

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
          title="Products"
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-black dark:text-white font-inter">
              Product List
            </h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-[#34D058] to-[#22C55E] text-white rounded-xl hover:from-[#2EC750] hover:to-[#1FB34D] transition-all duration-150 active:scale-95"
            >
              <Plus size={16} />
              <span className="text-sm font-medium font-inter">
                Add Product
              </span>
            </button>
          </div>

          {showAddForm && (
            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6E6E6] dark:border-[#333333] p-6 mb-6"
            >
              <h3 className="text-lg font-bold text-black dark:text-white mb-4 font-inter">
                New Product
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#2B2B2B] dark:text-[#CCCCCC] font-inter">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full h-10 px-4 rounded-lg bg-white dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#404040] text-black dark:text-white font-inter"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#2B2B2B] dark:text-[#CCCCCC] font-inter">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full h-10 px-4 rounded-lg bg-white dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#404040] text-black dark:text-white font-inter"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#2B2B2B] dark:text-[#CCCCCC] font-inter">
                    Price (IDR)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full h-10 px-4 rounded-lg bg-white dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#404040] text-black dark:text-white font-inter"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#2B2B2B] dark:text-[#CCCCCC] font-inter">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full h-10 px-4 rounded-lg bg-white dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#404040] text-black dark:text-white font-inter"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-[#2B2B2B] dark:text-[#CCCCCC] font-inter">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full h-20 px-4 py-2 rounded-lg bg-white dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#404040] text-black dark:text-white font-inter"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-b from-[#34D058] to-[#22C55E] text-white rounded-lg hover:from-[#2EC750] hover:to-[#1FB34D] transition-all duration-150 active:scale-95 font-inter text-sm"
                >
                  Save Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-white dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#404040] text-black dark:text-white rounded-lg hover:bg-[#F9F9F9] dark:hover:bg-[#2A2A2A] transition-all duration-150 active:scale-95 font-inter text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6E6E6] dark:border-[#333333] p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-gradient-to-b from-[#34D058] to-[#22C55E] rounded-xl flex items-center justify-center">
                    <Package size={24} className="text-white" />
                  </div>
                  {product.stock < 5 && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/20 rounded-lg">
                      <AlertTriangle
                        size={14}
                        className="text-red-600 dark:text-red-400"
                      />
                      <span className="text-xs font-medium text-red-600 dark:text-red-400 font-inter">
                        Low Stock
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-black dark:text-white mb-2 font-inter">
                  {product.name}
                </h3>
                <p className="text-sm text-[#6E6E6E] dark:text-[#888888] mb-3 font-inter line-clamp-2">
                  {product.description || "No description"}
                </p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#6E6E6E] dark:text-[#888888] font-inter">
                    Category
                  </span>
                  <span className="text-xs font-medium text-black dark:text-white font-inter">
                    {product.category || "Uncategorized"}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#6E6E6E] dark:text-[#888888] font-inter">
                    Price
                  </span>
                  <span className="text-sm font-bold text-black dark:text-white font-sora">
                    {formatCurrency(product.price)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#6E6E6E] dark:text-[#888888] font-inter">
                    Stock
                  </span>
                  <span
                    className={`text-sm font-bold font-sora ${product.stock < 5 ? "text-red-600 dark:text-red-400" : "text-black dark:text-white"}`}
                  >
                    {product.stock} units
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
