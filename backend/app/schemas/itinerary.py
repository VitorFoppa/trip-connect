from pydantic import BaseModel
from typing import List

class Point(BaseModel):
    name: str
    lat: float
    lng: float
    order: int
    day: int

class ItineraryCreate(BaseModel):
    trip_id: int
    points: List[Point]

class ItineraryResponse(ItineraryCreate):
    id: int

    class Config:
        from_attributes = True