from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.trip import Trip
from app.models.application import Application
from app.models.user import User
from app.utils.websocket_manager import manager

router = APIRouter(
    tags=["Trip Chat"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.websocket("/ws/trips/{trip_id}/chat")
async def trip_chat(
    websocket: WebSocket,
    trip_id: int
):
    await manager.connect(websocket)

    db: Session = SessionLocal()

    try:
        while True:
            data = await websocket.receive_text()

            if "|" in data:
                sender_name, message = data.split("|", 1)
            else:
                sender_name = "Unknown"
                message = data

            await manager.broadcast(
                f"[Trip {trip_id}] {sender_name}: {message}"
            )

    except WebSocketDisconnect:
        manager.disconnect(websocket)
        db.close()