from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Optional

router = APIRouter()

class AvoidanceSignal(BaseModel):
    detected: bool
    severity: str
    recommended_action: str

class MicroGoal(BaseModel):
    goal_id: str
    description: str
    deadline: str
    difficulty: str

class NudgeScheduler:
    @staticmethod
    def detect_avoidance_behavior(user_id: str, smartux_data: Dict) -> AvoidanceSignal:
        return AvoidanceSignal(
            detected=False,
            severity="low",
            recommended_action="Continue with current approach"
        )
    
    @staticmethod
    def generate_micro_goal(profile: str, current_week: int, financial_context: Dict) -> MicroGoal:
        goals = {
            'avoider': [
                "Hôm nay, chỉ cần mở app và xem số dư 1 lần. Không cần làm gì thêm.",
                "Chỉ cần ghi chú 1 cảm xúc về tài chính hôm nay.",
                "Nhìn vào biểu đồ cảm xúc của bạn trong tuần này."
            ],
            'worrier': [
                "Tuần này, để 50.000đ vào heo đất. Chỉ vậy thôi.",
                "Xem tiến độ thanh toán nợ của bạn, chỉ nhìn phần trăm.",
                "Thử 1 bài tập thở ngắn khi cảm thấy lo lắng."
            ],
            'ostrich': [
                "Check-in với DebtSense 3 ngày liên tiếp để mở huy hiệu 'Khởi đầu'.",
                "Hoàn thành 1 thử thách nhỏ trong tuần này để nhận điểm thưởng.",
                "Xem bảng xếp hạng và tìm thấy vị trí của bạn."
            ]
        }
        
        import time
        from datetime import datetime, timedelta
        
        return MicroGoal(
            goal_id=f"goal-{int(time.time())}",
            description=goals[profile][current_week % 3],
            deadline=(datetime.now() + timedelta(days=7)).isoformat(),
            difficulty="easy"
        )

@router.post("/detect-avoidance")
async def detect_avoidance(user_id: str, smartux_data: Dict):
    return NudgeScheduler.detect_avoidance_behavior(user_id, smartux_data)

@router.post("/generate-micro-goal")
async def generate_micro_goal(profile: str, current_week: int, financial_context: Dict):
    return NudgeScheduler.generate_micro_goal(profile, current_week, financial_context)
