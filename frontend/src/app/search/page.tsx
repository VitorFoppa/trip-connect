"use client";

import { useState } from "react";
import api from "@/lib/api";
import Link from "next/link";

type User = {
  id: number;
  name: string;
  country?: string;
  bio?: string;
  profile_picture?: string;
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  async function handleSearch() {
    try {
      const response = await api.get(
        `/search/users?query=${query}`
      );

      setUsers(response.data);
    } catch (error) {
      console.error(error);
      alert("Search failed");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            Search traveler by name or country
          </h1>

          <Link
            href="/dashboard"
            className="border border-white px-5 py-2 rounded-xl font-bold"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="flex gap-4 mb-8">
          <input
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            placeholder="Search by name or country"
            className="flex-1 p-4 bg-zinc-900 rounded-xl"
          />

          <button
            onClick={handleSearch}
            className="bg-white text-black px-6 rounded-xl font-bold"
          >
            Search
          </button>
        </div>

        <div className="space-y-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="border border-gray-800 rounded-2xl p-6"
            >
              {user.profile_picture && (
                <img
                  src={user.profile_picture}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover mb-4 border border-gray-700"
                />
              )}

              <h2 className="text-2xl font-bold">
                {user.name}
              </h2>

              <p className="text-gray-400">
                {user.country || "Country not informed"}
              </p>

              <p className="mt-3">
                {user.bio || "No bio available"}
              </p>

              <Link
                href={`/profile/${user.id}`}
                className="inline-block mt-4 bg-white text-black px-5 py-2 rounded-xl font-bold"
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}