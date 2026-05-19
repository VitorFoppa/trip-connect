import { Point } from "@/types/point";

export async function getItinerary(tripId: number): Promise<{ points: Point[] }> {
  const res = await fetch(`http://localhost:8000/itineraries/${tripId}`);
  return res.json();
}