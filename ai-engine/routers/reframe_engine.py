from fastapi import APIRouter, Query
from pydantic import BaseModel

router = APIRouter()

class DebtReframeResponse(BaseModel):
    reframed_text: str
    metaphor: str
    progress_context: str
    weekly_equivalent: str

class SavingsReframeResponse(BaseModel):
    reframed_text: str
    metaphor: str
    progress_context: str

class SpendingReframeResponse(BaseModel):
    category: str
    reframed_text: str

class DebtReframeEngine:
    @staticmethod
    def reframe_debt(total_debt: float, monthly_payment: float, profile: str) -> DebtReframeResponse:
        months_remaining = int(total_debt / monthly_payment) if monthly_payment > 0 else 0
        coffee_equivalent = int(monthly_payment / 20000)
        weekly_equiv = int(monthly_payment / 4)
        
        return DebtReframeResponse(
            reframed_text=f"{monthly_payment:,}đ/tháng = {coffee_equivalent} ly cà phê/tuần → thoát nợ {months_remaining} tháng",
            metaphor="Chặng đường marathon: bạn đang ở km số 5",
            progress_context=f"Đã đi được 18% chặng đường",
            weekly_equivalent=f"Mỗi tuần chỉ cần để dành bằng 1 buổi ăn ngoài ({weekly_equiv:,}đ)"
        )
    
    @staticmethod
    def reframe_savings(saved_amount: float, goal_amount: float) -> SavingsReframeResponse:
        progress = int((saved_amount / goal_amount) * 100) if goal_amount > 0 else 0
        return SavingsReframeResponse(
            reframed_text=f"Bạn đã tiết kiệm được {saved_amount:,}đ!",
            metaphor="Bạn đã xây dựng được một bức tường nhỏ bảo vệ tài chính",
            progress_context=f"Bạn đã đi được {progress}% đến mục tiêu {goal_amount:,}đ"
        )
    
    @staticmethod
    def reframe_spending(category: str, amount: float, profile: str) -> SpendingReframeResponse:
        return SpendingReframeResponse(
            category=category,
            reframed_text=f"Nếu giảm 500.000đ/tháng, bạn tiết kiệm được 1 tháng học phí mỗi năm"
        )

@router.get("/debt", response_model=DebtReframeResponse)
async def get_debt_reframe(
    total_debt: float = Query(...),
    monthly_payment: float = Query(...),
    profile: str = Query(...)
):
    return DebtReframeEngine.reframe_debt(total_debt, monthly_payment, profile)

@router.get("/savings", response_model=SavingsReframeResponse)
async def get_savings_reframe(
    saved_amount: float = Query(...),
    goal_amount: float = Query(...)
):
    return DebtReframeEngine.reframe_savings(saved_amount, goal_amount)

@router.get("/spending/{category}", response_model=SpendingReframeResponse)
async def get_spending_reframe(
    category: str,
    amount: float = Query(...),
    profile: str = Query(...)
):
    return DebtReframeEngine.reframe_spending(category, amount, profile)
