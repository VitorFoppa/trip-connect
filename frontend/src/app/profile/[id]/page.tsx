"use client";

import { use, useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";

type Profile = {
  id: number;
  name: string;
  country?: string;
  bio?: string;
  average_rating?: number;
  total_reviews?: number;
  profile_picture?: string;
};

export default function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [profile, setProfile] = useState<Profile | null>(null);

  async function loadProfile() {
    try {
      const response = await api.get(
        `/users/${resolvedParams.id}/profile`
      );

      setProfile(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load profile");
    }
  }

  async function addFavorite() {
    try {
      await api.post(
        `/favorites/${resolvedParams.id}`
      );

      alert("Traveler added to favorites!");
    } catch (error) {
      console.error(error);
      alert("Failed to favorite");
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  if (!profile) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        <p>Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-3xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            Traveler Profile
          </h1>

          <Link
            href="/dashboard"
            className="border border-white px-5 py-2 rounded-xl font-bold"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="border border-gray-800 rounded-2xl p-8">
          {profile.profile_picture && (
          <img
            src={profile.profile_picture}
            alt={profile.name}
            className="w-32 h-32 rounded-full object-cover mb-4 border border-gray-700"
          />
        )}
          <h2 className="text-4xl font-bold mb-4">
            {profile.name}
          </h2>

          <p className="text-gray-400 mb-2">
            {profile.country || "Country not informed"}
          </p>

          <p className="mb-6">
            {profile.bio || "No bio available"}
          </p>

          <p className="mb-2">
            ⭐ Rating: {profile.average_rating || 0}
          </p>

          <p>
            Reviews: {profile.total_reviews || 0}
          </p>

          <button
            onClick={addFavorite}
            className="mt-6 bg-white text-black px-6 py-3 rounded-xl font-bold"
          >
            Save Traveler
          </button>
        </div>
      </div>
    </main>
  );
}