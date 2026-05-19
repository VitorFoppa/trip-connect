from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)

    rating = Column(Integer, nullable=False)
    comment = Column(String, nullable=True)

    reviewer_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    reviewed_user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    trip_id = Column(
        Integer,
        ForeignKey("trips.id")
    )