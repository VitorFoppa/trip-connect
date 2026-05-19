"use client";

import { useState } from "react";
import { searchPlaces, PlaceResult } from "@/lib/searchPlaces";

type Point = {
  name: string;
  lat: number;
  lng: number;
};

export default function SearchBox({
  onSelect,
}: {
  onSelect: (point: Point) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlaceResult[]>([]);

  async function handleSearch(value: string) {
    setQuery(value);

    if (value.length < 3) {
      setResults([]);
      return;
    }

    const data = await searchPlaces(value);
    setResults(data);
  }

  return (
    <div style={{ marginBottom: "10px" }}>
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Buscar lugar..."
        style={{ width: "100%", padding: "8px" }}
      />

      {results.length > 0 && (
        <ul style={{ background: "#fff", border: "1px solid #ccc" }}>
          {results.map((r, i) => (
            <li
              key={i}
              style={{ padding: "5px", cursor: "pointer" }}
              onClick={() => {
                onSelect({
                  name: r.display_name,
                  lat: parseFloat(r.lat),
                  lng: parseFloat(r.lon),
                });
                setResults([]);
                setQuery("");
              }}
            >
              {r.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}