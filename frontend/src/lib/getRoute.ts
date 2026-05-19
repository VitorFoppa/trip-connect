import { Point } from "@/types/point";

export async function getRoute(points: Point[]) {
  if (!points || points.length < 2) return null;

  const coords = points
    .filter((p) => p.lat && p.lng)
    .map((p) => [p.lng, p.lat]);

  try {
    const res = await fetch(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      {
        method: "POST",
        headers: {
          Authorization: process.env.NEXT_PUBLIC_ORS_KEY || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coordinates: coords,
        }),
      }
    );

    if (!res.ok) {
      console.warn("ORS HTTP Error:", res.status);
      return null;
    }

    const data = await res.json();

    console.log("ORS RESPONSE:", data);
    console.log("POINTS:", points);
    console.log("COORDS:", coords);

    if (!data?.features?.length) {
      console.warn("Nenhuma rota encontrada para esses pontos");
      return null;
    }

    const route = data.features[0]?.geometry?.coordinates;

    if (!route) return null;

    return route.map((c: number[]) => [c[1], c[0]]);
  } catch (err) {
    console.error("Erro ao buscar rota:", err);
    return null;
  }
}