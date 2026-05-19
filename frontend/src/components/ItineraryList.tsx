"use client";

import { Point } from "@/types/point";

import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

function SortableItem({
  id,
  point,
  onRemove,
}: {
  id: string;
  point: Point;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "10px",
    border: "1px solid #ccc",
    marginBottom: "5px",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <span {...attributes} {...listeners} style={{ cursor: "grab" }}>
        {point.name}
      </span>

      <button
        onClick={onRemove}
        style={{
          background: "red",
          color: "#fff",
          border: "none",
          padding: "4px 8px",
          cursor: "pointer",
        }}
      >
        ✕
      </button>
    </div>
  );
}

export default function ItineraryList({
  points,
  setPoints,
}: {
  points: Point[];
  setPoints: (points: Point[]) => void;
}) {
  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = points.findIndex((_, i) => i.toString() === active.id);
      const newIndex = points.findIndex((_, i) => i.toString() === over.id);

      setPoints(arrayMove(points, oldIndex, newIndex));
    }
  }

  function removePoint(index: number) {
    const updated = points.filter((_, i) => i !== index);
    setPoints(updated);
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={points.map((_, i) => i.toString())}
        strategy={verticalListSortingStrategy}
      >
        {points.map((p, i) => (
          <SortableItem
            key={i}
            id={i.toString()}
            point={p}
            onRemove={() => removePoint(i)}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}