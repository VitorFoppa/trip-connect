from pydantic import BaseModel
from typing import Optional


class ApplicationCreate(BaseModel):
    message: Optional[str] = None
    trip_id: int


class ApplicationResponse(BaseModel):
    id: int
    message: Optional[str]
    status: str
    user_id: int
    trip_id: int

    class Config:
        from_attributes = True