from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional

from app.database import get_db
from app.models.user import User
from app.models.trip import Trip
from app.models.review import Review
from app.schemas.user import UserCreate, UserResponse, Token
from app.schemas.profile import PublicProfileResponse
from app.utils.security import hash_password, verify_password
from app.utils.auth import create_access_token, get_current_user
from app.utils.cloudinary import upload_profile_image

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


class UpdateProfileRequest(BaseModel):
    country: Optional[str] = None
    bio: Optional[str] = None


@router.post("/", response_model=UserResponse)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        country=user.country,
        bio=user.bio
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    if not verify_password(
        form_data.password,
        db_user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    access_token = create_access_token(
        data={
            "sub": db_user.email
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user


@router.get("/{user_id}/profile", response_model=PublicProfileResponse)
def get_public_profile(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    trips_db = db.query(Trip).filter(
        Trip.owner_id == user.id
    ).all()

    trips = [
        {
            **trip.__dict__,
            "is_owner": current_user.id == trip.owner_id
        }
        for trip in trips_db
    ]

    reviews = db.query(Review).filter(
        Review.reviewed_user_id == user.id
    ).all()

    total_reviews = len(reviews)

    if total_reviews > 0:
        average_rating = sum(
            review.rating for review in reviews
        ) / total_reviews
    else:
        average_rating = 0

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "country": user.country,
        "bio": user.bio,
        "average_rating": round(average_rating, 1),
        "total_reviews": total_reviews,
        "trips_created": trips,
        "profile_picture": user.profile_image
    }

@router.post("/upload-profile-image")
def upload_user_profile_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    image_url = upload_profile_image(file.file)

    current_user.profile_image = image_url

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Profile image uploaded successfully",
        "profile_image": image_url
    }


@router.put("/me")
def update_my_profile(
    data: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_user.country = data.country
    current_user.bio = data.bio

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Profile updated successfully"
    }
