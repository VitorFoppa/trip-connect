"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin() {
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await api.post(
        "/users/login",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const token = response.data.access_token;

      localStorage.setItem("token", token);

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const userRes = await api.get("/users/me");

      localStorage.setItem("user_id", userRes.data.id);

      router.push("/dashboard");

    } catch (error: any) {
      console.error("Login error:", error?.response?.data || error);
      alert("Login failed");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-md border border-gray-800 rounded-2xl p-8">

        <h1 className="text-4xl font-bold mb-6">
          Login
        </h1>

        {/* EMAIL */}
        <input
          className="w-full p-4 mb-4 bg-zinc-900 rounded-xl"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          className="w-full p-4 mb-6 bg-zinc-900 rounded-xl"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          className="w-full bg-white text-black font-bold p-4 rounded-xl"
        >
          Sign In
        </button>

        {/* LINK */}
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don’t have an account?
          </p>

          <Link
            href="/register"
            className="text-white font-bold underline"
          >
            Create Account
          </Link>
        </div>

      </div>
    </main>
  );
}