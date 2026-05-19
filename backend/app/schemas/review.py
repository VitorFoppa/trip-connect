from pydantic import BaseModel
from typing import Optional


class ReviewCreate(BaseModel):
    rating: int
    comment: Optional[str] = None
    reviewed_user_id: int
    trip_id: int


class ReviewResponse(BaseModel):
    id: int
    rating: int
    comment: Optional[str]
    reviewer_id: int
    reviewed_user_id: int
    trip_id: int

    class Config:
        from_attributes = True