from sqlalchemy import Column, Integer, ForeignKey, String
from app.database import Base


class TripInvite(Base):
    __tablename__ = "trip_invites"

    id = Column(Integer, primary_key=True, index=True)

    trip_id = Column(
        Integer,
        ForeignKey("trips.id"),
        nullable=False
    )

    invited_user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    invited_by_user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    status = Column(String, default="pending")