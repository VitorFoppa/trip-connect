from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.trip import Trip
from app.models.review import Review
from app.models.application import Application
from app.utils.auth import get_current_user

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.get("/dashboard")
def admin_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # futuramente podemos validar admin real aqui

    total_users = db.query(User).count()
    total_trips = db.query(Trip).count()
    total_reviews = db.query(Review).count()
    total_applications = db.query(Application).count()

    return {
        "total_users": total_users,
        "total_trips": total_trips,
        "total_reviews": total_reviews,
        "total_applications": total_applications
    }