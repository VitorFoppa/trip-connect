from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.models.user import User
from app.models.trip import Trip
from app.models.application import Application
from app.models.review import Review
from app.models.message import Message
from app.models.favorite import Favorite
from app.models.notification import Notification
from app.models.trip_invite import TripInvite
from app.routes import user
from app.routes import trip
from app.routes import application
from app.routes import review
from app.routes import chat
from app.routes import search
from app.routes import favorite
from app.routes import notification
from app.routes import admin
from app.routes import upload
from app.routes import trip_chat
from app.routes import itinerary

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(trip.router)
app.include_router(application.router)
app.include_router(review.router)
app.include_router(chat.router)
app.include_router(search.router)
app.include_router(favorite.router)
app.include_router(notification.router)
app.include_router(admin.router)
app.include_router(upload.router)
app.include_router(trip_chat.router)
app.include_router(itinerary.router)

@app.get("/")
def root():
    return {
        "message": "TripConnect API running successfully"
    }