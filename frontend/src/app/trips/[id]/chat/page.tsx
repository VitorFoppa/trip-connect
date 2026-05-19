"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

type User = {
  id: number;
  name: string;
};

export default function TripChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const socketRef = useRef<WebSocket | null>(null);

  async function loadUser() {
    try {
      const response = await api.get("/users/me");
      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadUser();

    const ws = new WebSocket(
      `ws://127.0.0.1:8000/ws/trips/${resolvedParams.id}/chat`
    );

    socketRef.current = ws;

    ws.onmessage = (event) => {
      setMessages((prev) => [
        ...prev,
        event.data,
      ]);
    };

    ws.onopen = () => {
      console.log("Connected to trip chat");
    };

    ws.onclose = () => {
      console.log("Disconnected from trip chat");
    };

    return () => {
      ws.close();
    };
  }, []);

  function sendMessage() {
    if (
      message.trim() &&
      socketRef.current?.readyState === WebSocket.OPEN &&
      user
    ) {
      socketRef.current.send(
        `${user.name}|${message}`
      );

      setMessage("");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            Trip Chat
          </h1>

          <Link
            href={`/trips/${resolvedParams.id}`}
            className="border border-white px-5 py-2 rounded-xl font-bold"
          >
            Back to Trip
          </Link>
        </div>

        <div className="border border-gray-800 rounded-2xl p-6 mb-6 min-h-[400px]">
          {messages.length === 0 ? (
            <p className="text-gray-400">
              No messages yet.
            </p>
          ) : (
            <div className="space-y-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className="bg-zinc-900 p-4 rounded-xl"
                >
                  {msg}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <input
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            placeholder="Type your message..."
            className="flex-1 p-4 bg-zinc-900 rounded-xl"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button
            onClick={sendMessage}
            className="bg-white text-black px-6 rounded-xl font-bold"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}