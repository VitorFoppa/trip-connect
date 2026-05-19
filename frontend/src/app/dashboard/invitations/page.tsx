"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import api from "@/lib/api";

type Trip = {
  id: number;
  invite_id?: number;
  title?: string;
  destination?: string;
  country?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  is_private?: boolean;
  invite_status?: string;
};

export default function InvitationsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAuthHeader = () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null;

    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadInvitations = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await api.get("/trips/my-invitations", {
        headers: getAuthHeader(),
      });

      const data = response.data;

      if (!Array.isArray(data)) {
        console.warn("Resposta inválida:", data);
        setTrips([]);
        return;
      }

      const safeData = data.filter(
        (t) => t && typeof t === "object" && t.id
      );

      setTrips(safeData);
    } catch (err) {
      console.error("Error loading invitations:", err);
      setTrips([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvitations();
  }, [loadInvitations]);

  async function handleAction(inviteId: number, action: "accept" | "reject") {
    try {
      await api.put(
        `/trips/invites/${inviteId}/${action}`,
        {},
        {
          headers: getAuthHeader(),
        }
      );

      await loadInvitations();
    } catch (err) {
      console.error(`Error during ${action}:`, err);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">My Invitations</h1>

          <Link
            href="/dashboard"
            className="border border-white px-5 py-2 rounded-xl font-bold"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* LOADING */}
        {isLoading ? (
          <p className="text-gray-400">Loading...</p>
        ) : trips.length === 0 ? (
          /* EMPTY STATE */
          <div className="border border-gray-800 rounded-2xl p-10 text-center">
            <p className="text-gray-400">
              You have no invitations yet.
            </p>
          </div>
        ) : (
          /* LIST */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div
                key={`${trip.id}-${trip.invite_id ?? "x"}`}
                className="border border-gray-800 bg-zinc-900/50 rounded-2xl p-6"
              >
                <h2 className="text-2xl font-bold mb-2">
                  {trip.title || "Untitled"}
                </h2>

                <p className="text-gray-400">
                  {trip.destination || "-"}, {trip.country || "-"}
                </p>

                <div className="mt-4 text-sm text-gray-300 space-y-1">
                  <p>Start: {trip.start_date || "Not informed"}</p>
                  <p>End: {trip.end_date || "Not informed"}</p>
                </div>

                <div className="mt-4">
                  <span className="px-3 py-1 rounded-full bg-zinc-800 text-xs">
                    {trip.status || "unknown"}
                  </span>
                </div>

                {trip.invite_status === "pending" && trip.invite_id ? (
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() =>
                        handleAction(trip.invite_id!, "accept")
                      }
                      className="flex-1 bg-green-600 py-2 rounded-xl"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() =>
                        handleAction(trip.invite_id!, "reject")
                      }
                      className="flex-1 border border-red-500 py-2 rounded-xl"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <p className="mt-6 text-center text-sm text-gray-500">
                    {trip.invite_status
                      ? `Already ${trip.invite_status}`
                      : "No invitation data"}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}