"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

type AdminStats = {
  total_users: number;
  total_trips: number;
  total_reviews: number;
  total_applications: number;
};

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  const router = useRouter();

  async function loadStats() {
    try {
      const response = await api.get(
        "/admin/dashboard"
      );

      setStats(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  if (!stats) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        Loading admin panel...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <button
        onClick={() => router.push("/dashboard")}
        className="mb-6 px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl hover:bg-gray-800 transition"
      >
        ← Voltar
      </button>

      <h1 className="text-4xl font-bold mb-8">
        Admin Panel
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-gray-800 rounded-2xl p-6">
          <h2>Total Users</h2>
          <p className="text-4xl font-bold">
            {stats.total_users}
          </p>
        </div>

        <div className="border border-gray-800 rounded-2xl p-6">
          <h2>Total Trips</h2>
          <p className="text-4xl font-bold">
            {stats.total_trips}
          </p>
        </div>

        <div className="border border-gray-800 rounded-2xl p-6">
          <h2>Total Reviews</h2>
          <p className="text-4xl font-bold">
            {stats.total_reviews}
          </p>
        </div>

        <div className="border border-gray-800 rounded-2xl p-6">
          <h2>Total Applications</h2>
          <p className="text-4xl font-bold">
            {stats.total_applications}
          </p>
        </div>
      </div>
    </main>
  );
}