"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

type Trip = {
  id: number;
  title: string;
  destination: string;
  country: string;
  description?: string;
  budget?: string;
  start_date?: string;
  end_date?: string;
  status: string;
};

export default function Home() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLogged, setIsLogged] = useState(false);

  async function loadTrips() {
    try {
      const response = await api.get("/trips/");
      setTrips(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleApply(tripId: number) {
    try {
      await api.post("/applications/", {
        trip_id: tripId,
        message: "I would love to join this trip!"
      });

      alert("Application sent successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to apply");
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLogged(true);
      loadTrips();
    }
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-5xl font-bold">
            TripConnect
          </h1>

          <p className="text-gray-400">
            Find amazing travel partners around the world.
          </p>
        </div>

        <div className="flex gap-4">
              {!isLogged ? (
              <>
              <Link
                  href="/login"
                  className="bg-white text-black px-6 py-3 rounded-xl font-bold"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="border border-white px-6 py-3 rounded-xl font-bold"
                >
                  Create Account
                </Link>
              </>
            ) : (
            <>
              <Link
                href="/dashboard"
                className="border border-white px-6 py-3 rounded-xl font-bold"
              >
                Dashboard
              </Link>

              <Link
                href="/profile/edit"
                className="bg-white text-black px-6 py-3 rounded-xl font-bold"
              >
                Account
              </Link>

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.reload();
                }}
                className="border border-red-500 text-red-500 px-6 py-3 rounded-xl font-bold"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {!isLogged ? (
        <div className="mt-20 max-w-2xl">
          <h2 className="text-4xl font-bold mb-4">
            Travel with the right people
          </h2>

          <p className="text-gray-400 text-lg">
            Create trips, find travel partners,
            build trust through reviews and
            explore the world together.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="border border-gray-800 rounded-2xl p-6 hover:border-white transition"
            >
              <h2 className="text-2xl font-semibold mb-2">
                {trip.title}
              </h2>

              <p className="text-gray-400">
                {trip.destination}, {trip.country}
              </p>

              <p className="mt-4 text-sm text-gray-300">
                {trip.description}
              </p>

              <p className="mt-4 font-bold">
                Budget: {trip.budget}
              </p>

              <p className="mt-2">
                Start: {trip.start_date || "Not informed"}
              </p>

              <p>
                End: {trip.end_date || "Not informed"}
              </p>

              <p className="mt-2 font-bold">
                Status: {trip.status}
              </p>

              <button
                onClick={() => handleApply(trip.id)}
                className="mt-6 w-full bg-white text-black p-3 rounded-xl font-bold"
              >
                Apply for this Trip
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}