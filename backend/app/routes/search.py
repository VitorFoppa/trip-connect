from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models.user import User
from app.utils.auth import get_current_user

router = APIRouter(
    prefix="/search",
    tags=["Search"]
)


@router.get("/users")
def search_users(
    query: str = "",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    users = db.query(User).filter(
        or_(
            User.name.ilike(f"%{query}%"),
            User.country.ilike(f"%{query}%")
        )
    ).all()

    result = []

    for user in users:
        if user.id != current_user.id:
            result.append({
                "id": user.id,
                "name": user.name,
                "country": user.country,
                "bio": user.bio,
                "profile_picture": user.profile_image,
            })

    return result