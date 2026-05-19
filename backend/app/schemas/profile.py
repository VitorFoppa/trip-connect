from pydantic import BaseModel
from typing import Optional

from app.schemas.trip import TripResponse


class PublicProfileResponse(BaseModel):
    id: int
    name: str
    email: str
    country: Optional[str]
    bio: Optional[str]
    profile_picture: str | None = None

    average_rating: float
    total_reviews: int

    trips_created: list[TripResponse]

    class Config:
        from_attributes = True