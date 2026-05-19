"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");

  async function handleRegister() {
    try {
      await api.post("/users/", {
        name,
        email,
        password,
        country,
        bio
      });

      alert("Account created successfully!");

      router.push("/login");
    } catch (error) {
      console.error(error);
      alert("Failed to create account");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-md border border-gray-800 rounded-2xl p-8">
        <h1 className="text-4xl font-bold mb-6">
          Create Account
        </h1>

        <input
          className="w-full p-4 mb-4 bg-zinc-900 rounded-xl"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full p-4 mb-4 bg-zinc-900 rounded-xl"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-4 mb-4 bg-zinc-900 rounded-xl"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          className="w-full p-4 mb-4 bg-zinc-900 rounded-xl"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />

        <textarea
          className="w-full p-4 mb-6 bg-zinc-900 rounded-xl"
          placeholder="Short bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-white text-black font-bold p-4 rounded-xl"
        >
          Create Account
        </button>

        <div className="mt-6 text-center">
        <p className="text-gray-400">
          Already have an account?
        </p>

        <Link
          href="/login"
          className="text-white font-bold underline"
        >
          Sign In
        </Link>
      </div>
      </div>
    </main>
  );
}