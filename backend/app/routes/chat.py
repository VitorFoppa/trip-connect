from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.utils.websocket_manager import manager

router = APIRouter(
    tags=["Chat"]
)


@router.websocket("/ws/chat")
async def websocket_chat(
    websocket: WebSocket
):
    await manager.connect(websocket)

    try:
        while True:
            data = await websocket.receive_text()

            if "|" in data:
                sender_name, message = data.split("|", 1)
            else:
                sender_name = "Unknown User"
                message = data

            await manager.broadcast(
                f"{sender_name}: {message}"
            )

    except WebSocketDisconnect:
        manager.disconnect(websocket)