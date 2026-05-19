from sqlalchemy import Column, Integer, Float, String, ForeignKey
from app.database import Base

class ItineraryPoint(Base):
    __tablename__ = "itinerary_points"

    id = Column(Integer, primary_key=True, index=True)
    itinerary_id = Column(Integer, ForeignKey("itineraries.id"))

    name = Column(String)
    lat = Column(Float)
    lng = Column(Float)
    order = Column(Integer)
    day = Column(Integer, default=1)