"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import InviteUserModal from "@/components/InviteUserModal";

type Participant = {
  id: number;
  name: string;
  country?: string;
};

type TripDetails = {
  id: number;
  title: string;
  destination: string;
  country: string;
  description?: string;
  budget?: string;
  duration_days?: number;
  vacancies?: number;
  owner_id: number;
  is_private: boolean;
  participants: Participant[];
};

export default function TripDetailsPage() {
  const params = useParams();

  const [trip, setTrip] = useState<TripDetails | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [openInvite, setOpenInvite] = useState(false);

  async function loadTrip() {
    try {
      const response = await api.get(`/trips/${params.id}`);
      setTrip(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load trip details");
    }
  }

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    if (userId) {
      setCurrentUserId(Number(userId));
    }

    loadTrip();
  }, []);

  if (!trip) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Trip Details</h1>

        <Link
          href="/dashboard"
          className="border border-white px-5 py-2 rounded-xl font-bold"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="border border-gray-800 rounded-2xl p-8 mb-10">
        <h2 className="text-3xl font-bold mb-4">{trip.title}</h2>

        <div className="flex gap-4 items-center">
          <Link
            href={`/trips/${trip.id}/chat`}
            className="inline-block bg-white text-black px-5 py-2 rounded-xl font-bold"
          >
            Trip Chat
          </Link>

          <Link href={`/trips/${trip.id}/itinerary`}>
            <button className="bg-green-600 text-white px-4 py-2 rounded">
              Ver Roteiro
            </button>
          </Link>

          {currentUserId !== null &&
            Number(trip.owner_id) === Number(currentUserId) &&
            trip.is_private && (
              <>
                <button
                  onClick={() => setOpenInvite(true)}
                  className="border border-white px-5 py-2 rounded-xl font-bold"
                >
                  Invite User
                </button>
              </>
            )}
        </div>

        <p className="mt-4 mb-2">Destination: {trip.destination}</p>
        <p className="mb-2">Country: {trip.country}</p>
        <p className="mb-2">Budget: {trip.budget}</p>
        <p className="mb-2">Duration: {trip.duration_days} days</p>
        <p className="mb-2">Vacancies: {trip.vacancies}</p>

        <p className="mt-4">Description: {trip.description}</p>
      </div>

      <h2 className="text-3xl font-bold mb-6">Participants</h2>

      {trip.participants.length === 0 ? (
        <p className="text-gray-400">No participants yet.</p>
      ) : (
        <div className="space-y-4">
          {trip.participants.map((participant) => (
            <div
              key={participant.id}
              className="border border-gray-800 rounded-2xl p-6"
            >
              <h3 className="text-2xl font-bold">{participant.name}</h3>
              <p className="text-gray-400">{participant.country}</p>
            </div>
          ))}
        </div>
      )}

      {openInvite && (
        <InviteUserModal
          tripId={trip.id}
          onClose={() => setOpenInvite(false)}
        />
      )}
    </main>
  );
}