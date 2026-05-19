"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Application = {
  id: number;
  message: string;
  status: string;
  user_id: number;
  trip_id: number;
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const router = useRouter();

  const tripId = 1; // depois você troca por useParams

  async function loadApplications() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await api.get(
        `/applications/trip/${tripId}`
      );

      setApplications(response.data ?? []);
    } catch (error: any) {
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
      setApplications([]);
    }
  }

  async function handleApprove(applicationId: number) {
    try {
      const token = localStorage.getItem("token");

      if (!token) return router.push("/login");

      await api.put(
        `/applications/${applicationId}/approve`
      );

      await loadApplications();
    } catch (error: any) {
      console.log("Approve error:", error.response?.data);
      alert("Failed to approve");
    }
  }

  async function handleReject(applicationId: number) {
    try {
      const token = localStorage.getItem("token");

      if (!token) return router.push("/login");

      await api.put(
        `/applications/${applicationId}/reject`
      );

      await loadApplications();
    } catch (error: any) {
      console.log("Reject error:", error.response?.data);
      alert("Failed to reject");
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            Applications Received
          </h1>

          <Link
            href="/dashboard"
            className="border border-white px-5 py-2 rounded-xl font-bold"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* EMPTY STATE */}
        {applications.length === 0 ? (
          <div className="border border-gray-800 rounded-2xl p-6">
            <p className="text-gray-400">
              No applications received yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <div
                key={application.id}
                className="border border-gray-800 rounded-2xl p-6"
              >
                <h2 className="text-2xl font-bold mb-2">
                  Application #{application.id}
                </h2>

                <p className="text-gray-400 mb-2">
                  Message: {application.message}
                </p>

                <p className="mb-4">
                  Status: {application.status}
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleApprove(application.id)}
                    className="bg-white text-black px-5 py-2 rounded-xl font-bold"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleReject(application.id)}
                    className="border border-red-500 px-5 py-2 rounded-xl font-bold"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}