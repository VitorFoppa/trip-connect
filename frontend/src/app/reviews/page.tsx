"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ReviewsPage() {
  const router = useRouter();

  const [reviewedUserId, setReviewedUserId] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  async function handleCreateReview() {
    try {
      await api.post("/reviews/", {
        reviewed_user_id: Number(reviewedUserId),
        rating: Number(rating),
        comment,
      });

      alert("Review submitted successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Failed to submit review");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            Leave Review
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
            type="number"
            className="w-full p-4 mb-4 bg-zinc-900 rounded-xl"
            placeholder="User ID to review"
            value={reviewedUserId}
            onChange={(e) =>
              setReviewedUserId(e.target.value)
            }
          />

          <input
            type="number"
            min="1"
            max="5"
            className="w-full p-4 mb-4 bg-zinc-900 rounded-xl"
            placeholder="Rating (1 to 5)"
            value={rating}
            onChange={(e) =>
              setRating(e.target.value)
            }
          />

          <textarea
            className="w-full p-4 mb-6 bg-zinc-900 rounded-xl"
            rows={5}
            placeholder="Write your review"
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
          />

          <button
            onClick={handleCreateReview}
            className="w-full bg-white text-black font-bold p-4 rounded-xl"
          >
            Submit Review
          </button>
        </div>
      </div>
    </main>
  );
}