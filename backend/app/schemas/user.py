from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    country: Optional[str] = None
    bio: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    country: Optional[str]
    bio: Optional[str]
    profile_image: Optional[str]
    is_admin: bool

class Config:
    from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str