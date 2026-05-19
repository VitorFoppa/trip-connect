export type PlaceResult = {
  display_name: string;
  lat: string;
  lon: string;
};

export async function searchPlaces(query: string): Promise<PlaceResult[]> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
  );

  return res.json();
}