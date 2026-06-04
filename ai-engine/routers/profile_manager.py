from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class UserProfile(BaseModel):
    user_id: str
    profile: str
    display_name: str
    total_debt: float
    monthly_payment: float

@router.get("/{user_id}")
async def get_user_profile(user_id: str):
    return UserProfile(
        user_id=user_id,
        profile="avoider",
        display_name="Minh",
        total_debt=30000000,
        monthly_payment=600000
    )
