from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.favorite import Favorite
from app.models.user import User
from app.models.notification import Notification
from app.utils.auth import get_current_user

router = APIRouter(
    prefix="/favorites",
    tags=["Favorites"]
)

@router.post("/{user_id}")
def add_favorite(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if user_id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot favorite yourself"
        )

    existing = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.favorite_user_id == user_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="User already favorited"
        )

    new_favorite = Favorite(
        user_id=current_user.id,
        favorite_user_id=user_id
    )

    db.add(new_favorite)
    db.commit()
    db.refresh(new_favorite)

    new_notification = Notification(
        user_id=user_id,
        message=f"{current_user.name} added you to favorites"
)

    db.add(new_notification)
    db.commit()

    return {
        "message": "User added to favorites"
    }


@router.get("/")
def list_favorites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    favorites = db.query(Favorite).filter(
        Favorite.user_id == current_user.id
    ).all()

    result = []

    for favorite in favorites:
        favorite_user = db.query(User).filter(
            User.id == favorite.favorite_user_id
        ).first()

        if favorite_user:
            result.append({
                "id": favorite.id,
                "favorite_user_id": favorite_user.id,
                "favorite_user_name": favorite_user.name,
                "favorite_user_country": favorite_user.country
            })

    return result