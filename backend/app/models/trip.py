from sqlalchemy import Column, Integer, String, Text, ForeignKey, Date, Boolean
from sqlalchemy.orm import relationship
from app.database import Base


class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    country = Column(String, nullable=False)
    description = Column(String, nullable=True)
    budget = Column(String, nullable=True)
    duration_days = Column(Integer, nullable=True)
    vacancies = Column(Integer, nullable=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    status = Column(String, default="open")
    is_private = Column(Boolean, default=False)

    owner_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    owner = relationship("User")