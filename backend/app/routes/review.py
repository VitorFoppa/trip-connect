from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.review import Review
from app.models.user import User
from app.models.trip import Trip

from app.schemas.review import (
    ReviewCreate,
    ReviewResponse
)

from app.utils.auth import get_current_user

router = APIRouter(
    prefix="/reviews",
    tags=["Reviews"]
)


@router.post("/", response_model=ReviewResponse)
def create_review(
    review: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(
        Trip.id == review.trip_id
    ).first()

    if not trip:
        raise HTTPException(
            status_code=404,
            detail="Trip not found"
        )

    if current_user.id == review.reviewed_user_id:
        raise HTTPException(
            status_code=400,
            detail="You cannot review yourself"
        )

    new_review = Review(
        rating=review.rating,
        comment=review.comment,
        reviewer_id=current_user.id,
        reviewed_user_id=review.reviewed_user_id,
        trip_id=review.trip_id
    )

    db.add(new_review)
    db.commit()
    db.refresh(new_review)

    return new_review