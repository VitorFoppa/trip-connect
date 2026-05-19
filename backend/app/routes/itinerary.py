from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.itinerary import Itinerary
from app.models.itinerary_point import ItineraryPoint
from app.schemas.itinerary import ItineraryCreate

router = APIRouter(prefix="/itineraries", tags=["Itinerary"])

@router.post("/")
def create_itinerary(data: ItineraryCreate, db: Session = Depends(get_db)):
    itinerary = Itinerary(trip_id=data.trip_id)
    db.add(itinerary)
    db.commit()
    db.refresh(itinerary)

    for p in data.points:
        point = ItineraryPoint(
            itinerary_id=itinerary.id,
            name=p.name,
            lat=p.lat,
            lng=p.lng,
            order=p.order,
        )
        db.add(point)

    db.commit()

    return {"id": itinerary.id}

@router.get("/{trip_id}")
def get_itinerary(trip_id: int, db: Session = Depends(get_db)):
    itinerary = db.query(Itinerary).filter_by(trip_id=trip_id).first()

    if not itinerary:
        return None

    points = db.query(ItineraryPoint)\
        .filter_by(itinerary_id=itinerary.id)\
        .order_by(ItineraryPoint.order)\
        .all()

    return {
    "id": itinerary.id,
    "points": [
        {
            "name": p.name,
            "lat": p.lat,
            "lng": p.lng,
            "order": p.order,
            "day": p.day
        }
        for p in points
    ]
}

@router.put("/{trip_id}")
def update_itinerary(trip_id: int, data: ItineraryCreate, db: Session = Depends(get_db)):
    itinerary = db.query(Itinerary).filter_by(trip_id=trip_id).first()

    if not itinerary:
        itinerary = Itinerary(trip_id=trip_id)
        db.add(itinerary)
        db.commit()
        db.refresh(itinerary)
    else:
        db.query(ItineraryPoint)\
            .filter_by(itinerary_id=itinerary.id)\
            .delete()

    for p in data.points:
        point = ItineraryPoint(
            itinerary_id=itinerary.id,
            name=p.name,
            lat=p.lat,
            lng=p.lng,
            order=p.order,
            day=p.day, 
        )
        db.add(point)

    db.commit()

    return {"message": "Itinerary updated"}