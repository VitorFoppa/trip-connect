"use client";

import { useState } from "react";
import api from "@/lib/api";

type Props = {
  tripId: number;
  onClose: () => void;
};

type User = {
  id: number;
  name: string;
  country?: string;
};

export default function InviteUserModal({ tripId, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  async function handleSearch() {
    try {
      const res = await api.get(`/search/users?query=${query}`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Search failed");
    }
  }

  async function handleInvite(userId: number) {
    try {
      await api.post(`/trips/${tripId}/invite/${userId}`);
      alert("User invited!");
    } catch (err) {
      console.error(err);
      alert("Failed to invite");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-zinc-900 p-6 rounded-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          Invite User
        </h2>

        {/* INPUT + BOTÃO */}
        <div className="flex gap-2 mb-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search user..."
            className="flex-1 p-3 bg-black rounded-xl"
          />

          <button
            onClick={handleSearch}
            className="bg-white text-black px-4 rounded-xl font-bold"
          >
            Search
          </button>
        </div>

        {/* RESULTADOS */}
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex justify-between items-center border border-gray-700 p-3 rounded-xl"
            >
              <div>
                <p className="font-bold">{user.name}</p>
                <p className="text-sm text-gray-400">
                  {user.country}
                </p>
              </div>

              <button
                onClick={() => handleInvite(user.id)}
                className="border border-white px-3 py-1 rounded-lg"
              >
                Invite
              </button>
            </div>
          ))}
        </div>

        {/* FECHAR */}
        <button
          onClick={onClose}
          className="mt-4 w-full border border-red-500 p-2 rounded-xl"
        >
          Close
        </button>
      </div>
    </div>
  );
}