"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";

type Favorite = {
  id: number;
  favorite_user_id: number;
  favorite_user_name: string;
  favorite_user_country?: string;
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<
    Favorite[]
  >([]);

  async function loadFavorites() {
    try {
      const response = await api.get(
        "/favorites/"
      );

      setFavorites(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load favorites");
    }
  }

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            Favorite Travelers
          </h1>

          <Link
            href="/dashboard"
            className="border border-white px-5 py-2 rounded-xl font-bold"
          >
            Back to Dashboard
          </Link>
        </div>

        {favorites.length === 0 ? (
          <div className="border border-gray-800 rounded-2xl p-6">
            <p className="text-gray-400">
              No favorite travelers yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {favorites.map((favorite) => (
              <div
                key={favorite.id}
                className="border border-gray-800 rounded-2xl p-6"
              >
                <h2 className="text-2xl font-bold">
                  {favorite.favorite_user_name}
                </h2>

                <p className="text-gray-400">
                  {favorite.favorite_user_country ||
                    "Country not informed"}
                </p>

                <Link
                  href={`/profile/${favorite.favorite_user_id}`}
                  className="inline-block mt-4 bg-white text-black px-5 py-2 rounded-xl font-bold"
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}