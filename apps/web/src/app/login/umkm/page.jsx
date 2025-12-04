"use client";

import { useState, useEffect } from "react";
import { Key } from "lucide-react";

export default function UMKMLogin() {
  const [licenseCode, setLicenseCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deviceId, setDeviceId] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      let storedDeviceId = localStorage.getItem("deviceId");
      if (!storedDeviceId) {
        storedDeviceId = `device-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem("deviceId", storedDeviceId);
      }
      setDeviceId(storedDeviceId);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/umkm-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseCode, deviceId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("therraAuth", data.token);
        localStorage.setItem("therraUser", JSON.stringify(data.user));
        window.location.href = "/dashboard/analytics";
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E6E6E6] dark:border-[#333333] p-8 md:p-10">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-b from-[#34D058] to-[#22C55E] rounded-2xl flex items-center justify-center">
              <Key size={28} className="text-white" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center mb-2 text-black dark:text-white font-inter">
            UMKM Login
          </h1>
          <p className="text-center text-[#6E6E6E] dark:text-[#888888] mb-8 font-inter text-sm">
            Enter your license code to access dashboard
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-[#2B2B2B] dark:text-[#CCCCCC] font-inter">
                License Code
              </label>
              <input
                type="text"
                value={licenseCode}
                onChange={(e) => setLicenseCode(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-white dark:bg-[#262626] border border-[#E5E5E5] dark:border-[#404040] text-black dark:text-white placeholder-[#6E6E6E] dark:placeholder-[#888888] transition-all duration-200 focus:outline-none focus:border-black dark:focus:border-white font-inter"
                placeholder="UMKM-XXXX-XXX"
                required
              />
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-sm text-red-600 dark:text-red-400 font-inter">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-b from-[#34D058] to-[#22C55E] text-white font-semibold transition-all duration-150 hover:from-[#2EC750] hover:to-[#1FB34D] active:scale-95 disabled:opacity-50 font-inter"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
