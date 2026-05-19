from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.utils.auth import get_current_user
from app.utils.cloudinary import upload_profile_image

router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)


@router.post("/upload-profile-image")
def upload_user_profile_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    image_url = upload_profile_image(file.file)

    current_user.profile_image = image_url

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Profile image uploaded successfully",
        "profile_image": image_url
    }