from pydantic import BaseModel
from typing import Optional
from datetime import date


class TripCreate(BaseModel):
    title: str
    destination: str
    country: str
    description: Optional[str] = None
    budget: Optional[str] = None
    duration_days: Optional[int] = None
    vacancies: Optional[int] = None
    start_date: date | None = None
    end_date: date | None = None
    is_private: bool = False


class TripResponse(BaseModel):
    id: int
    title: str
    destination: str
    country: str
    description: Optional[str]
    budget: Optional[str]
    duration_days: Optional[int]
    vacancies: Optional[int]
    owner_id: int
    start_date: date | None = None
    end_date: date | None = None
    status: str
    is_private: bool
    is_owner: bool
    invite_status: Optional[str] = None

    class Config:
        from_attributes = True