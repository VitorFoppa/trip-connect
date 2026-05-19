"use client";

import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

type Point = {
  lat: number;
  lng: number;
};

export default function MapView({
  points,
  route,
}: {
  points: Point[];
  route: [number, number][] | null;
}) {
  const center: LatLngExpression = [-23.55, -46.63];

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {points.map((p: Point, i: number) => (
        <Marker key={i} position={[p.lat, p.lng]} />
      ))}

      {route && <Polyline positions={route} />}
    </MapContainer>
  );
}