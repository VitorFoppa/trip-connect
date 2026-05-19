from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from datetime import date

from app.database import get_db
from app.models.trip import Trip
from app.models.user import User
from app.models.application import Application
from app.models.review import Review
from app.models.trip_invite import TripInvite
from app.schemas.trip import TripCreate, TripResponse
from app.utils.auth import get_current_user

router = APIRouter(
    prefix="/trips",
    tags=["Trips"]
)

def build_trip_response(trip, current_user, db):
    is_owner = trip.owner_id == current_user.id

    application = db.query(Application).filter(
        Application.trip_id == trip.id,
        Application.user_id == current_user.id
    ).first()

    invite = db.query(TripInvite).filter(
        TripInvite.trip_id == trip.id,
        TripInvite.invited_user_id == current_user.id
    ).first()

    if is_owner:
        invite_status = "owner"
    elif application:
        invite_status = application.status
    elif invite:
        invite_status = invite.status
    else:
        invite_status = None

    return {
        "id": trip.id,
        "title": trip.title,
        "destination": trip.destination,
        "country": trip.country,
        "description": trip.description,
        "budget": trip.budget,
        "duration_days": trip.duration_days,
        "vacancies": trip.vacancies,
        "owner_id": trip.owner_id,
        "start_date": trip.start_date,
        "end_date": trip.end_date,
        "status": trip.status,
        "is_private": trip.is_private,
        "is_owner": is_owner,
        "invite_status": invite_status
    }


def update_trip_status(trip, db):
    today = date.today()

    approved_participants = db.query(Application).filter(
        Application.trip_id == trip.id,
        Application.status == "approved"
    ).count()

    if trip.status == "cancelled":
        return trip

    if trip.end_date and trip.end_date < today:
        trip.status = "completed"
    elif approved_participants >= trip.vacancies:
        trip.status = "full"
    else:
        trip.status = "open"

    db.commit()
    db.refresh(trip)
    return trip


@router.get("/my-invitations")
def get_invitations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    invites = db.query(TripInvite).filter(
        TripInvite.invited_user_id == current_user.id
    ).all()

    if not invites:
        return []

    result = []

    for invite in invites:
        trip = db.query(Trip).filter(
            Trip.id == invite.trip_id
        ).first()

        if not trip:
            continue

        result.append({
            "id": trip.id,
            "invite_id": invite.id,
            "title": trip.title,
            "destination": trip.destination,
            "country": trip.country,
            "status": trip.status,
            "start_date": trip.start_date,
            "end_date": trip.end_date,
            "is_private": trip.is_private,
            "invite_status": invite.status,
        })

    return result


@router.get("/my-trips", response_model=list[TripResponse])
def get_my_trips(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trips = db.query(Trip).outerjoin(Application).filter(
        or_(
            Trip.owner_id == current_user.id,
            (Application.user_id == current_user.id) & (Application.status == "approved")
        )
    ).distinct().all()

    response = []

    for trip in trips:
        update_trip_status(trip, db)
        response.append(build_trip_response(trip, current_user, db))

    return response


@router.get("/", response_model=list[TripResponse])
def list_trips(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trips = db.query(Trip).outerjoin(Application).filter(
        or_(
            Trip.is_private == False,
            Trip.owner_id == current_user.id,
            (Application.user_id == current_user.id) & (Application.status == "approved")
        )
    ).distinct().all()

    response = []

    for trip in trips:
        update_trip_status(trip, db)
        response.append(build_trip_response(trip, current_user, db))

    return response


@router.get("/{trip_id}")
def get_trip_details(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()

    if not trip:
        raise HTTPException(404, "Trip not found")

    is_participant = db.query(Application).filter(
        Application.trip_id == trip_id,
        Application.user_id == current_user.id,
        Application.status == "approved"
    ).first()

    if trip.is_private and trip.owner_id != current_user.id and not is_participant:
        raise HTTPException(403, "You don't have access to this private trip")

    applications = db.query(Application).filter(
        Application.trip_id == trip.id,
        Application.status == "approved"
    ).all()

    participants = []

    for app in applications:
        user = db.query(User).filter(User.id == app.user_id).first()
        if user:
            participants.append({
                "id": user.id,
                "name": user.name,
                "country": user.country
            })

    return {
        "id": trip.id,
        "title": trip.title,
        "destination": trip.destination,
        "country": trip.country,
        "description": trip.description,
        "budget": trip.budget,
        "duration_days": trip.duration_days,
        "vacancies": trip.vacancies,
        "owner_id": trip.owner_id,
        "is_private": trip.is_private,
        "participants": participants,
        "start_date": trip.start_date,
        "end_date": trip.end_date,
        "status": trip.status
    }


@router.delete("/{trip_id}")
def delete_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()

    if not trip:
        raise HTTPException(404, "Trip not found")

    if trip.owner_id != current_user.id:
        raise HTTPException(403, "You can only delete your own trips")

    db.query(Application).filter(Application.trip_id == trip.id).delete()
    db.query(Review).filter(Review.trip_id == trip.id).delete()
    db.query(TripInvite).filter(TripInvite.trip_id == trip.id).delete()

    db.delete(trip)
    db.commit()

    return {"message": "Trip deleted successfully"}


@router.post("/", response_model=TripResponse)
def create_trip(
    trip: TripCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not trip.start_date or not trip.end_date:
        raise HTTPException(400, "Start date and end date are required")

    if trip.start_date < date.today():
        raise HTTPException(400, "Start date cannot be in the past")

    if trip.end_date < trip.start_date:
        raise HTTPException(400, "End date cannot be before start date")

    if not trip.vacancies or trip.vacancies <= 0:
        raise HTTPException(400, "Vacancies must be greater than 0")

    if not trip.title.strip():
        raise HTTPException(400, "Title is required")

    duration_days = (trip.end_date - trip.start_date).days + 1

    new_trip = Trip(
        title=trip.title,
        destination=trip.destination,
        country=trip.country,
        description=trip.description,
        budget=trip.budget,
        duration_days=duration_days,
        vacancies=trip.vacancies,
        owner_id=current_user.id,
        start_date=trip.start_date,
        end_date=trip.end_date,
        status="open",
        is_private=trip.is_private,
    )

    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)

    return build_trip_response(new_trip, current_user, db)