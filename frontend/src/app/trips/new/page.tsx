"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewTripPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [vacancies, setVacancies] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [is_private, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);

  const duration =
    startDate && endDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(endDate).getTime() -
              new Date(startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : null;

  const isInvalid =
    startDate && endDate && new Date(endDate) < new Date(startDate);

  async function handleCreateTrip() {
      if (loading) return;

      if (!startDate || !endDate) {
        alert("Please select start and end dates");
        return;
      }

      if (isInvalid) {
        alert("Fix the dates before creating the trip");
        return;
      }

      setLoading(true);

      try {
        await api.post("/trips/", {
          title,
          destination,
          country,
          description,
          budget,
          vacancies: vacancies ? Number(vacancies) : null,
          start_date: startDate,
          end_date: endDate,
          is_private,
        });

        alert("Trip created successfully!");
        router.push("/dashboard");
      } catch (error) {
        console.error(error);
        alert("Failed to create trip");
      } finally {
        setLoading(false);
      }
    }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            Create New Trip
          </h1>

          <Link
            href="/dashboard"
            className="border border-white px-5 py-2 rounded-xl font-bold"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="border border-gray-800 rounded-2xl p-8">
          <input
            className="w-full p-4 mb-4 bg-zinc-900 rounded-xl"
            placeholder="Trip title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="w-full p-4 mb-4 bg-zinc-900 rounded-xl"
            placeholder="Destination"
            value={destination}
            onChange={(e) =>
              setDestination(e.target.value)
            }
          />

          <input
            className="w-full p-4 mb-4 bg-zinc-900 rounded-xl"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />

          <textarea
            className="w-full p-4 mb-4 bg-zinc-900 rounded-xl"
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <input
            className="w-full p-4 mb-4 bg-zinc-900 rounded-xl"
            placeholder="Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />

          <input
            type="number"
            className="w-full p-4 mb-6 bg-zinc-900 rounded-xl"
            placeholder="Available vacancies"
            value={vacancies}
            onChange={(e) =>
              setVacancies(e.target.value)
            }
          />

          <div className="mb-4">
              <label className="block mb-2 font-semibold">
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-4 bg-zinc-900 rounded-xl"
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-semibold">
                End Date
              </label>

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-4 bg-zinc-900 rounded-xl"
              />

              {duration !== null && !isInvalid && (
                <p className="mt-2 text-sm text-gray-400">
                  Duration: {duration} day{duration > 1 ? "s" : ""} / {Math.max(0, duration - 1)} night{duration - 1 !== 1 ? "s" : ""}
                </p>
              )}

              {isInvalid && (
                <p className="mt-2 text-sm text-red-500">
                  End date cannot be before start date
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={is_private}
                onChange={(e) =>
                  setIsPrivate(e.target.checked)
                }
                className="w-5 h-5"
              />

              <label className="text-lg font-medium">
                Private Trip
              </label>
            </div>

          <button
            onClick={handleCreateTrip}
            disabled={loading}
            className="w-full bg-white text-black font-bold p-4 rounded-xl"
          >
            {loading ? "Creating..." : "Create Trip"}
          </button>
        </div>
      </div>
    </main>
  );
}