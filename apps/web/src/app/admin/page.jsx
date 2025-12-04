"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Shield,
  Key,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Monitor,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function AdminPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingLicense, setEditingLicense] = useState(null);
  const [formData, setFormData] = useState({
    businessName: "",
    expiresAt: "",
    maxDevices: "1",
  });

  const queryClient = useQueryClient();

  const { data: licensesData } = useQuery({
    queryKey: ["licenses"],
    queryFn: async () => {
      const response = await fetch("/api/licenses");
      if (!response.ok) throw new Error("Failed to fetch licenses");
      return response.json();
    },
    refetchInterval: 3000,
  });

  const createLicenseMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch("/api/licenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create license");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["licenses"] });
      setFormData({ businessName: "", expiresAt: "", maxDevices: "1" });
      setShowCreateForm(false);
    },
  });

  const updateLicenseMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch("/api/licenses/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update license");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["licenses"] });
      setEditingLicense(null);
    },
  });

  const deleteLicenseMutation = useMutation({
    mutationFn: async (licenseId) => {
      const response = await fetch("/api/licenses/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseId }),
      });
      if (!response.ok) throw new Error("Failed to delete license");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["licenses"] });
    },
  });

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("therraAuth");
      localStorage.removeItem("therraUser");
      window.location.href = "/login/admin";
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    createLicenseMutation.mutate({
      businessName: formData.businessName,
      expiresAt: formData.expiresAt || null,
      maxDevices: parseInt(formData.maxDevices),
    });
  };

  const handleToggleActive = (license) => {
    updateLicenseMutation.mutate({
      licenseId: license.id,
      isActive: !license.is_active,
    });
  };

  const handleDelete = (licenseId) => {
    if (confirm("Are you sure you want to delete this license?")) {
      deleteLicenseMutation.mutate(licenseId);
    }
  };

  const licenses = licensesData?.licenses || [];
  const stats = licensesData?.stats || { total: 0, active: 0, inactive: 0 };

  const isExpired = (expiresAt) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const formatDate = (date) => {
    if (!date) return "Never";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getLicenseStatus = (license) => {
    if (!license.is_active) return "inactive";
    if (isExpired(license.expires_at)) return "expired";
    return "active";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800";
      case "expired":
        return "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800";
      case "inactive":
        return "bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800";
      default:
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800";
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-b from-[#252525] to-[#0F0F0F] dark:from-[#FFFFFF] dark:to-[#E0E0E0] rounded-2xl flex items-center justify-center">
              <Shield size={28} className="text-white dark:text-black" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white font-inter">
                Dev Dashboard
              </h1>
              <p className="text-sm text-[#6E6E6E] dark:text-[#888888] font-inter">
                License Management System
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#404040] text-black dark:text-white rounded-xl hover:bg-[#F9F9F9] dark:hover:bg-[#2A2A2A] transition-all duration-150 active:scale-95 font-inter text-sm"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6E6E6] dark:border-[#333333] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <Key size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-[#6E6E6E] dark:text-[#888888] font-inter">
                Total Licenses
              </span>
            </div>
            <div className="text-3xl font-bold text-black dark:text-white font-sora">
              {stats.total}
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6E6E6] dark:border-[#333333] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <CheckCircle
                  size={24}
                  className="text-green-600 dark:text-green-400"
                />
              </div>
              <span className="text-sm font-medium text-[#6E6E6E] dark:text-[#888888] font-inter">
                Active Licenses
              </span>
            </div>
            <div className="text-3xl font-bold text-black dark:text-white font-sora">
              {stats.active}
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6E6E6] dark:border-[#333333] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                <XCircle size={24} className="text-red-600 dark:text-red-400" />
              </div>
              <span className="text-sm font-medium text-[#6E6E6E] dark:text-[#888888] font-inter">
                Inactive/Expired
              </span>
            </div>
            <div className="text-3xl font-bold text-black dark:text-white font-sora">
              {stats.inactive}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6E6E6] dark:border-[#333333] p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-black dark:text-white font-inter">
              License Management
            </h2>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-[#34D058] to-[#22C55E] text-white rounded-xl hover:from-[#2EC750] hover:to-[#1FB34D] transition-all duration-150 active:scale-95"
            >
              <Plus size={16} />
              <span className="text-sm font-medium font-inter">
                Create License
              </span>
            </button>
          </div>

          {showCreateForm && (
            <form
              onSubmit={handleCreateSubmit}
              className="mb-6 p-4 bg-[#F9F9F9] dark:bg-[#262626] rounded-xl"
            >
              <h3 className="text-lg font-bold text-black dark:text-white mb-4 font-inter">
                New License
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#2B2B2B] dark:text-[#CCCCCC] font-inter">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) =>
                      setFormData({ ...formData, businessName: e.target.value })
                    }
                    className="w-full h-10 px-4 rounded-lg bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#404040] text-black dark:text-white font-inter"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#2B2B2B] dark:text-[#CCCCCC] font-inter">
                    Expires At (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) =>
                      setFormData({ ...formData, expiresAt: e.target.value })
                    }
                    className="w-full h-10 px-4 rounded-lg bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#404040] text-black dark:text-white font-inter"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#2B2B2B] dark:text-[#CCCCCC] font-inter">
                    Max Devices
                  </label>
                  <input
                    type="number"
                    value={formData.maxDevices}
                    onChange={(e) =>
                      setFormData({ ...formData, maxDevices: e.target.value })
                    }
                    className="w-full h-10 px-4 rounded-lg bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#404040] text-black dark:text-white font-inter"
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  disabled={createLicenseMutation.isPending}
                  className="px-4 py-2 bg-gradient-to-b from-[#34D058] to-[#22C55E] text-white rounded-lg hover:from-[#2EC750] hover:to-[#1FB34D] transition-all duration-150 active:scale-95 disabled:opacity-50 font-inter text-sm"
                >
                  {createLicenseMutation.isPending ? "Creating..." : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 bg-white dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#404040] text-black dark:text-white rounded-lg hover:bg-[#F9F9F9] dark:hover:bg-[#2A2A2A] transition-all duration-150 active:scale-95 font-inter text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {licenses.map((license) => {
              const status = getLicenseStatus(license);
              const deviceCount = license.device_id
                ? license.device_id.split(",").length
                : 0;

              return (
                <div
                  key={license.id}
                  className="p-4 bg-[#F9F9F9] dark:bg-[#262626] rounded-xl border border-[#E6E6E6] dark:border-[#333333]"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-black dark:text-white font-inter">
                          {license.business_name}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-lg border text-xs font-medium font-inter ${getStatusColor(status)}`}
                        >
                          {status.toUpperCase()}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Key
                            size={14}
                            className="text-[#6E6E6E] dark:text-[#888888]"
                          />
                          <span className="text-[#6E6E6E] dark:text-[#888888] font-inter">
                            {license.license_code}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar
                            size={14}
                            className="text-[#6E6E6E] dark:text-[#888888]"
                          />
                          <span className="text-[#6E6E6E] dark:text-[#888888] font-inter">
                            Expires: {formatDate(license.expires_at)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Monitor
                            size={14}
                            className="text-[#6E6E6E] dark:text-[#888888]"
                          />
                          <span className="text-[#6E6E6E] dark:text-[#888888] font-inter">
                            Devices: {deviceCount}/{license.max_devices}
                          </span>
                        </div>
                        <div className="text-xs text-[#6E6E6E] dark:text-[#888888] font-inter">
                          Created: {formatDate(license.created_at)}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleActive(license)}
                        className={`px-3 py-2 rounded-lg border text-sm font-medium font-inter transition-all duration-150 active:scale-95 ${
                          license.is_active
                            ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
                            : "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800"
                        }`}
                      >
                        {license.is_active ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleDelete(license.id)}
                        className="p-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-all duration-150 active:scale-95"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {licenses.length === 0 && (
              <div className="text-center py-12">
                <Key
                  size={48}
                  className="mx-auto mb-4 text-[#6E6E6E] dark:text-[#888888]"
                />
                <p className="text-[#6E6E6E] dark:text-[#888888] font-inter">
                  No licenses yet. Create your first license to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
