"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import SearchBox from "@/components/SearchBox";
import ItineraryList from "@/components/ItineraryList";

import { getRoute } from "@/lib/getRoute";
import { saveItinerary } from "@/lib/saveItinerary";
import { getItinerary } from "@/lib/getItinerary";
import { getTrip } from "@/lib/getTrip";

import { useParams } from "next/navigation";

import { Point } from "@/types/point";
import { getDays } from "@/utils/date";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
});

export default function ItineraryPage() {
  const [points, setPoints] = useState<Point[]>([]);
  const [route, setRoute] = useState<[number, number][] | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [days, setDays] = useState<number[]>([]);

  const params = useParams();
  const tripId = Number(params.id);

  const filteredPoints = points.filter(
    (p) => selectedDay !== null && p.day === selectedDay
  );

  useEffect(() => {
    if (!tripId) return;

    async function loadTrip() {
      const trip = await getTrip(tripId);

      if (!trip?.start_date || !trip?.end_date) return;

      const totalDays = getDays(trip.start_date, trip.end_date);

      const daysArray = Array.from(
        { length: totalDays },
        (_, i) => i + 1
      );

      setDays(daysArray);

      if (daysArray.length > 0) {
        setSelectedDay(daysArray[0]);
      }
    }

    loadTrip();
  }, [tripId]);

  async function handleSave() {
    if (!tripId || points.length === 0) return;

    setSaving(true);
    setSaved(false);

    try {
      await saveItinerary(tripId, points);

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar roteiro");
    } finally {
      setSaving(false);
    }
  }

  function addPoint(point: {
    name: string;
    lat: number;
    lng: number;
  }) {
    if (selectedDay === null) return;

    setPoints((prev) => [
      ...prev,
      {
        ...point,
        day: selectedDay,
      },
    ]);
  }

  useEffect(() => {
    if (!tripId) return;

    async function load() {
      const data = await getItinerary(tripId);

      if (data?.points) {
        setPoints(
          data.points.map((p: any) => ({
            ...p,
            day: p.day ?? 1,
          }))
        );
      }
    }

    load();
  }, [tripId]);

  useEffect(() => {
    if (
      days.length > 0 &&
      selectedDay !== null &&
      selectedDay > days.length
    ) {
      setSelectedDay(days[0]);
    }
  }, [days, selectedDay]);

  useEffect(() => {
    if (selectedDay === null) return;

    async function loadRoute() {
      const dayPoints = points.filter(
        (p) => p.day === selectedDay
      );

      if (dayPoints.length < 2) {
        setRoute(null);
        return;
      }

      const r = await getRoute(dayPoints);
      setRoute(r);
    }

    loadRoute();
  }, [points, selectedDay]);

  useEffect(() => {
    if (selectedDay !== null) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [selectedDay]);

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        padding: "20px",
      }}
    >
      <div style={{ width: "300px" }}>
        
        <Link
          href={`/trips/${tripId}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "15px",
            textDecoration: "none",
            color: "#0070f3",
            fontWeight: "bold",
          }}
        >
          <ArrowLeft size={18} />
          Voltar para viagem
        </Link>

        <h2>
          {selectedDay
            ? `Roteiro - Dia ${selectedDay}`
            : "Carregando..."}
        </h2>

        <button
          onClick={handleSave}
          disabled={saving || points.length === 0}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            background: saving
              ? "#999"
              : saved
              ? "green"
              : "#0070f3",
            color: "#fff",
            border: "none",
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving
            ? "Salvando..."
            : saved
            ? "✓ Salvo!"
            : "Salvar roteiro"}
        </button>

        <div
          style={{
            display: "flex",
            gap: "5px",
            marginBottom: "10px",
            flexWrap: "wrap",
          }}
        >
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              style={{
                padding: "5px 10px",
                background:
                  selectedDay === day
                    ? "#0070f3"
                    : "#eee",
                color:
                  selectedDay === day
                    ? "#fff"
                    : "#333",
                border: "none",
                cursor: "pointer",
                borderRadius: "6px",
              }}
            >
              Dia {day}
            </button>
          ))}
        </div>

        <SearchBox onSelect={addPoint} />

        {filteredPoints.length === 0 && (
          <p style={{ color: "#666" }}>
            Nenhum ponto neste dia
          </p>
        )}

        <ItineraryList
          points={filteredPoints}
          setPoints={(newPoints) => {
            const others = points.filter(
              (p) => p.day !== selectedDay
            );

            setPoints([
              ...others,
              ...newPoints,
            ]);
          }}
        />
      </div>

      <div style={{ flex: 1 }}>
        <MapView
          points={filteredPoints}
          route={route}
        />
      </div>
    </div>
  );
}