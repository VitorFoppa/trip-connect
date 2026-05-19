"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  name: string;
  email: string;
  country?: string;
  bio?: string;
  is_admin?: boolean;
  profile_image?: string;
};

type Trip = {
  id: number;
  title: string;
  destination: string;
  country: string;
  start_date?: string;
  end_date?: string;
  status: string;
  is_owner: boolean;
  invite_status?: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<number | null>(null);

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  async function loadData() {
    try {
      const userResponse = await api.get("/users/me");
      setUser(userResponse.data);

      const tripsResponse = await api.get(
        "/trips/my-trips"
      );
      setTrips(tripsResponse.data);
    } catch (error) {
      console.error(error);
      alert("Authentication required");
      router.push("/login");
    }
  }

  async function handleDeleteTrip(tripId: number) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this trip?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/trips/${tripId}`);

      alert("Trip deleted successfully!");

      setTrips((prev) =>
        prev.filter((trip) => trip.id !== tripId)
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete trip");
    }
  }

  async function handleCancelTrip(tripId: number) {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this trip?"
    );

    if (!confirmCancel) return;

    setLoadingId(tripId);

    try {
      await api.put(
        `/trips/${tripId}/status?new_status=cancelled`
      );

      alert("Trip cancelled successfully");

      loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to cancel trip");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleLeaveTrip(tripId: number) {
    const confirmLeave = window.confirm(
      "Are you sure you want to leave this trip?"
    );

    if (!confirmLeave) return;

    try {
      await api.post(`/trips/${tripId}/leave`);

      alert("You left the trip");

      setTrips((prev) =>
        prev.filter((trip) => trip.id !== tripId)
      );
    } catch (error) {
      console.error(error);
      alert("Failed to leave trip");
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    loadData();
  }, []);

  if (!user) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-5xl font-bold mb-8">
        Dashboard
      </h1>

      <div className="mb-8 flex flex-wrap gap-4">
        <Link
          href="/trips/new"
          className="bg-white text-black px-6 py-3 rounded-xl font-bold"
        >
          Create New Trip
        </Link>

        <Link
          href="/profile/edit"
          className="border border-white px-6 py-3 rounded-xl font-bold"
        >
          Edit Profile
        </Link>

        <Link
          href="/dashboard/applications"
          className="border border-white px-6 py-3 rounded-xl font-bold"
        >
          Applications Received
        </Link>

        <Link
          href="/reviews"
          className="border border-white px-6 py-3 rounded-xl font-bold"
        >
          Leave Review
        </Link>

        <Link
          href="/chat"
          className="border border-white px-6 py-3 rounded-xl font-bold"
        >
          Live Chat
        </Link>

        <Link
          href="/search"
          className="border border-white px-6 py-3 rounded-xl font-bold"
        >
          Find Travelers
        </Link>

        <Link
          href="/favorites"
          className="border border-white px-6 py-3 rounded-xl font-bold"
        >
          Favorites
        </Link>

        <Link
          href="/notifications"
          className="border border-white px-6 py-3 rounded-xl font-bold"
        >
          Notifications
        </Link>

        <Link
          href="/dashboard/invitations"
          className="border border-white px-6 py-3 rounded-xl font-bold"
        >
          My Invitations
        </Link>

        {user.is_admin && (
          <Link
            href="/admin"
            className="border border-yellow-400 px-6 py-3 rounded-xl font-bold"
          >
            Admin Panel
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="border border-red-500 px-6 py-3 rounded-xl font-bold"
        >
          Logout
        </button>
      </div>

      <div className="border border-gray-800 rounded-2xl p-8 mb-10">

        {user.profile_image && (
            <img
              src={user.profile_image}
              alt={user.name}
              className="w-32 h-32 rounded-full object-cover mb-4 border border-gray-700"
            />
          )}
        <h2 className="text-3xl font-semibold mb-4">
          {user.name}
        </h2>

        <p className="text-gray-400 mb-2">
          {user.email}
        </p>

        <p className="mb-2">
          Country: {user.country || "Not informed"}
        </p>

        <p>
          Bio: {user.bio || "No bio yet"}
        </p>
      </div>

      <h2 className="text-3xl font-bold mb-6">
        My Trips
      </h2>

      {trips.length === 0 ? (
        <div className="border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400">
            You have not created any trips yet.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="border border-gray-800 rounded-2xl p-6"
            >
              <Link
                href={`/trips/${trip.id}`}
                className="block"
              >
                <h3 className="text-2xl font-semibold mb-2">
                  {trip.title}
                </h3>

                <p className="text-gray-400">
                  {trip.destination}, {trip.country}
                </p>

                <p className="mt-3">
                  Start: {trip.start_date || "Not informed"}
                </p>

                <p>
                  End: {trip.end_date || "Not informed"}
                </p>

                <p className="mt-3 font-bold">
                  Status: {trip.status}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Click to view details
                </p>
              </Link>

              <div className="flex gap-3 mt-4">
                {trip.is_owner ? (
                  <>
                    {trip.status !== "cancelled" && (
                      <button
                        onClick={() => handleCancelTrip(trip.id)}
                        disabled={loadingId === trip.id}
                        className="border border-red-500 px-4 py-2 rounded-xl font-bold"
                      >
                        {loadingId === trip.id ? "Cancelling..." : "Cancel Trip"}
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteTrip(trip.id)}
                      className="border border-red-700 px-4 py-2 rounded-xl font-bold"
                    >
                      Delete Trip
                    </button>
                  </>
                ) : trip.invite_status === "approved" &&
                  trip.status !== "cancelled" ? (
                  <button
                    onClick={() => handleLeaveTrip(trip.id)}
                    className="border border-yellow-500 px-4 py-2 rounded-xl font-bold"
                  >
                    Leave Trip
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}