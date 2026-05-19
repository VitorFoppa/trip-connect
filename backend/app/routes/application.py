from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.application import Application
from app.models.trip import Trip
from app.models.user import User
from app.models.trip_invite import TripInvite
from app.routes.trip import update_trip_status
from app.schemas.application import (ApplicationCreate, ApplicationResponse)

from app.utils.auth import get_current_user

router = APIRouter(
    prefix="/applications",
    tags=["Applications"]
)


@router.post("/", response_model=ApplicationResponse)
def apply_trip(
    application: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(
        Trip.id == application.trip_id
    ).first()

    if not trip:
        raise HTTPException(
            status_code=404,
            detail="Trip not found"
        )

    if trip.is_private:
        invite = db.query(TripInvite).filter(
            TripInvite.trip_id == trip.id,
            TripInvite.invited_user_id == current_user.id
        ).first()

        if not invite:
            raise HTTPException(
                status_code=403,
                detail="You are not invited to this private trip"
            )

    existing_application = db.query(Application).filter(
        Application.user_id == current_user.id,
        Application.trip_id == application.trip_id
    ).first()

    if existing_application:
        raise HTTPException(
            status_code=400,
            detail="You already applied to this trip"
        )

    new_application = Application(
        message=application.message,
        user_id=current_user.id,
        trip_id=application.trip_id
    )

    db.add(new_application)
    db.commit()
    db.refresh(new_application)

    return new_application

@router.get("/trip/{trip_id}", response_model=list[ApplicationResponse])
def list_trip_applications(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    trip = db.query(Trip).filter(
        Trip.id == trip_id
    ).first()

    if not trip:
        raise HTTPException(
            status_code=404,
            detail="Trip not found"
        )

    if trip.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Only the trip owner can view applications"
        )

    applications = db.query(Application).filter(
        Application.trip_id == trip_id
    ).all()

    return applications

@router.put("/{application_id}/approve", response_model=ApplicationResponse)
def approve_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    application = db.query(Application).filter(
        Application.id == application_id
    ).first()

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    trip = db.query(Trip).filter(
        Trip.id == application.trip_id
    ).first()

    if trip.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Only the trip owner can approve participants"
        )

    application.status = "approved"

    trip = db.query(Trip).filter(
        Trip.id == application.trip_id
    ).first()

    update_trip_status(trip, db)

    db.commit()
    db.refresh(application)

    return application

@router.put("/{application_id}/reject", response_model=ApplicationResponse)
def reject_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    application = db.query(Application).filter(
        Application.id == application_id
    ).first()

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    trip = db.query(Trip).filter(
        Trip.id == application.trip_id
    ).first()

    if trip.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Only the trip owner can reject participants"
        )

    application.status = "rejected"

    db.commit()
    db.refresh(application)

    return application