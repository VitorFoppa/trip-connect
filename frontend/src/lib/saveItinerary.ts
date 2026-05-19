import { Point } from "@/types/point";

export async function saveItinerary(
  tripId: number,
  points: Point[]
) {
  await fetch(`http://localhost:8000/itineraries/${tripId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      trip_id: tripId,
      points: points.map((p, i) => ({
        ...p,
        order: i,
        day: p.day,
      }))
    }),
  });
}