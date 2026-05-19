"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";

type Notification = {
  id: number;
  message: string;
  is_read: boolean;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  async function loadNotifications() {
    try {
      const response = await api.get(
        "/notifications/"
      );

      setNotifications(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load notifications");
    }
  }

  async function markAsRead(notificationId: number) {
    try {
      await api.put(
        `/notifications/${notificationId}/read`
      );

      loadNotifications();
    } catch (error) {
      console.error(error);
      alert("Failed to update notification");
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            Notifications
          </h1>

          <Link
            href="/dashboard"
            className="border border-white px-5 py-2 rounded-xl font-bold"
          >
            Back to Dashboard
          </Link>
        </div>

        {notifications.length === 0 ? (
          <div className="border border-gray-800 rounded-2xl p-6">
            <p className="text-gray-400">
              No notifications yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="border border-gray-800 rounded-2xl p-6"
              >
                <p className="text-lg mb-4">
                  {notification.message}
                </p>

                <p className="text-gray-400 mb-4">
                  Status:{" "}
                  {notification.is_read
                    ? "Read"
                    : "Unread"}
                </p>

                {!notification.is_read && (
                  <button
                    onClick={() =>
                      markAsRead(notification.id)
                    }
                    className="bg-white text-black px-5 py-2 rounded-xl font-bold"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}