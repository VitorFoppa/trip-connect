from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)

    message = Column(String, nullable=True)

    status = Column(
        String,
        default="pending"
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    trip_id = Column(
        Integer,
        ForeignKey("trips.id")
    )

    user = relationship("User")
    trip = relationship("Trip")