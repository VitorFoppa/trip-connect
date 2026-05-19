from pydantic import BaseModel


class MessageResponse(BaseModel):
    id: int
    content: str
    sender_id: int
    receiver_id: int

    class Config:
        from_attributes = True